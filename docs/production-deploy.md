# yibi.studio Production Deploy

Production deploys use a local-build, remote-run flow:

1. Build the Docker image on the development machine for `linux/amd64`.
2. Push the image to the abee tailnet registry.
3. `mediatyphoon` pulls the approved image.
4. `mediatyphoon` runs `docker compose up -d --no-build`.

`mediatyphoon` is a runtime host only. The standard production deploy path must not run `docker build`, `docker compose build`, or `docker compose up --build` on production.

## Why Local Build Is Enough

This is a Next.js web container, not a platform-specific Electron package. The deploy artifact is a Linux container image, so it does not need separate macOS, Windows, or Linux application builds.

The important constraint is the production host architecture. The release script builds explicitly for `linux/amd64` so an Apple Silicon development machine can still produce the image expected by `mediatyphoon`.

## Repository Files

- `compose.yml`: local and test compose. It may keep `build:`.
- `compose.prod.yml`: production compose. It uses only `image:` for `yibi-studio`.
- `scripts/release-local.sh`: local build, registry push, optional production deploy.

Production runtime values live in `.env.production` on `mediatyphoon`. Do not hard-code test proxy values in production compose. Configure values such as `DATABASE_URL`, OAuth secrets, `NEXTAUTH_URL`, and `GOOGLE_OAUTH_PROXY_URL` in `.env.production`.

## abee Registry

The registry is hosted on `abee` and is available through Tailscale:

```text
abee.tail2ac38c.ts.net:5000
```

It uses htpasswd basic auth and Tailscale TLS certificates. Log in from the development machine before releasing:

```bash
docker login abee.tail2ac38c.ts.net:5000
```

## mediatyphoon Setup

Place production files in `/home/ubuntu/yibi.studio`:

```text
compose.prod.yml
.env.production
```

Log in with the production pull user:

```bash
docker login abee.tail2ac38c.ts.net:5000
```

`.env.production` must include real production values, including:

```text
DATABASE_URL=<production database URL>
AUTH_SECRET=<production secret>
NEXTAUTH_SECRET=<production secret>
NEXTAUTH_URL=<production URL>
JWT_SECRET=<production secret>
GOOGLE_CLIENT_ID=<production client id>
GOOGLE_CLIENT_SECRET=<production client secret>
GOOGLE_OAUTH_PROXY_URL=<production proxy URL if required>
```

## Build And Push

Commit the release first, then build and push an immutable SHA tag:

```bash
scripts/release-local.sh
```

To build, push, and deploy in one command:

```bash
scripts/release-local.sh --deploy
```

The script also updates `main-latest` for convenience. Rollbacks should use immutable SHA tags, not `main-latest`.

## Manual Deploy

If the image is already pushed, deploy a specific SHA tag:

```bash
ssh ubuntu@mediatyphoon
cd /home/ubuntu/yibi.studio
printf 'YIBI_STUDIO_IMAGE=abee.tail2ac38c.ts.net:5000/yibi-studio:<sha>\n' > .env.image
docker compose --env-file .env.image -f compose.prod.yml pull yibi-studio
docker compose --env-file .env.image -f compose.prod.yml up -d --no-build yibi-studio
```

## Deploy Verification

Verify on `mediatyphoon`:

```bash
cd /home/ubuntu/yibi.studio
docker compose --env-file .env.image -f compose.prod.yml ps
curl -I http://localhost:3000/
curl http://localhost:3000/api/auth/providers
```

Expected:

- `yibi-studio` is running.
- `/` returns an available HTTP response.
- `/api/auth/providers` includes the Google provider when production Google OAuth env vars are configured.

## Rollback

Use the previous known-good git SHA tag:

```bash
cd /home/ubuntu/yibi.studio
printf 'YIBI_STUDIO_IMAGE=abee.tail2ac38c.ts.net:5000/yibi-studio:<previous-sha>\n' > .env.image
docker compose --env-file .env.image -f compose.prod.yml pull yibi-studio
docker compose --env-file .env.image -f compose.prod.yml up -d --no-build yibi-studio
```
