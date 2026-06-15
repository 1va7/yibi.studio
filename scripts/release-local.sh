#!/usr/bin/env bash
set -euo pipefail

REGISTRY_HOST="${REGISTRY_HOST:-abee.tail2ac38c.ts.net:5000}"
IMAGE_NAME="${IMAGE_NAME:-yibi-studio}"
PLATFORM="${PLATFORM:-linux/amd64}"
PROD_HOST="${PROD_HOST:-mediatyphoon}"
PROD_USER="${PROD_USER:-ubuntu}"
PROD_APP_DIR="${PROD_APP_DIR:-/home/ubuntu/yibi.studio}"
DEPLOY=0

usage() {
  cat <<'USAGE'
Usage: scripts/release-local.sh [--tag <tag>] [--deploy]

Builds the production image locally for linux/amd64 and pushes it to the abee
tailnet registry. With --deploy, mediatyphoon pulls and runs the image without
building.

Environment overrides:
  REGISTRY_HOST   default: abee.tail2ac38c.ts.net:5000
  IMAGE_NAME      default: yibi-studio
  PLATFORM        default: linux/amd64
  PROD_HOST       default: mediatyphoon
  PROD_USER       default: ubuntu
  PROD_APP_DIR    default: /home/ubuntu/yibi.studio
USAGE
}

TAG=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --tag)
      TAG="${2:?Missing value for --tag}"
      shift 2
      ;;
    --deploy)
      DEPLOY=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [ -z "$TAG" ]; then
  TAG="$(git rev-parse HEAD)"
fi

IMAGE="${REGISTRY_HOST}/${IMAGE_NAME}:${TAG}"
LATEST_IMAGE="${REGISTRY_HOST}/${IMAGE_NAME}:main-latest"

if [ -n "$(git status --porcelain)" ]; then
  echo "Refusing to release with an uncommitted worktree." >&2
  git status --short >&2
  exit 1
fi

docker buildx build \
  --platform "$PLATFORM" \
  --tag "$IMAGE" \
  --tag "$LATEST_IMAGE" \
  --push \
  .

echo "Pushed $IMAGE"

if [ "$DEPLOY" -eq 1 ]; then
  ssh "${PROD_USER}@${PROD_HOST}" \
    "set -euo pipefail
     cd '${PROD_APP_DIR}'
     printf 'YIBI_STUDIO_IMAGE=%s\n' '${IMAGE}' > .env.image
     docker compose --env-file .env.image -f compose.prod.yml pull yibi-studio
     docker compose --env-file .env.image -f compose.prod.yml up -d --no-build yibi-studio
     docker compose --env-file .env.image -f compose.prod.yml ps yibi-studio"
fi
