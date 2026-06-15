# yibi.studio Production Deploy

Production deploys use a two-machine flow:

1. Push to `main`.
2. GitHub Actions schedules the self-hosted `abee` runner.
3. `abee` builds `yibi-studio:<git-sha>` and pushes it to the tailnet-only private registry.
4. GitHub Environment `production` waits for manual approval.
5. After approval, `abee` SSHes to `mediatyphoon`.
6. `mediatyphoon` pulls the approved image and runs `docker compose up -d --no-build`.

`mediatyphoon` is a runtime host only. The standard production deploy path must not run `docker build`, `docker compose build`, or `docker compose up --build`.

## Repository Files

- `compose.yml`: local and test compose. It may keep `build:`.
- `compose.prod.yml`: production compose. It uses only `image:` for `yibi-studio`.
- `.github/workflows/production.yml`: build on `abee`, manual approval, deploy to `mediatyphoon`.

Production runtime values live in `.env.production` on `mediatyphoon`. Do not hard-code test proxy values in production compose. Configure values such as `DATABASE_URL`, OAuth secrets, `NEXTAUTH_URL`, and `GOOGLE_OAUTH_PROXY_URL` in `.env.production`.

## GitHub Setup

Repository secrets:

```text
REGISTRY_HOST=abee.tail2ac38c.ts.net:<port>
REGISTRY_PUSH_USER=<ci-push-user>
REGISTRY_PUSH_PASSWORD=<ci-push-password>
DEPLOY_SSH_HOST=mediatyphoon
DEPLOY_SSH_USER=ubuntu
DEPLOY_SSH_KEY=<private-key-for-abee-to-mediatyphoon>
PROD_APP_DIR=/home/ubuntu/yibi.studio
```

Environment:

- Create GitHub Environment `production`.
- Enable required reviewers on `production`.
- Keep the workflow `deploy` job bound to `environment: production`.

The immutable deploy tag is the full git SHA. `main-latest` is pushed only as a convenience tag and should not be used as rollback evidence.

## One-Time abee Setup

Install and register a GitHub self-hosted runner for `1va7/yibi.studio`.

Required labels:

```text
self-hosted
abee
linux
x64
```

Run a Docker Registry on a Tailscale-only address and port, for example:

```bash
docker run -d \
  --name yibi-registry \
  --restart unless-stopped \
  -p 100.100.84.61:5000:5000 \
  -v /opt/yibi-registry/data:/var/lib/registry \
  -v /opt/yibi-registry/auth:/auth \
  -e REGISTRY_AUTH=htpasswd \
  -e REGISTRY_AUTH_HTPASSWD_REALM='yibi registry' \
  -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
  registry:2
```

Create separate htpasswd users for CI push and production pull.

If the registry uses self-signed TLS, install the CA into Docker trust on both `abee` and `mediatyphoon`. If the registry uses tailnet HTTP, configure Docker insecure registry only for the exact `100.100.84.61:<port>` endpoint on both machines.

## One-Time mediatyphoon Setup

Confirm tailnet registry access:

```bash
curl -I http://abee.tail2ac38c.ts.net:<port>/v2/
```

Log in with the production pull user:

```bash
docker login abee.tail2ac38c.ts.net:<port>
```

Place production files in `/home/ubuntu/yibi.studio`:

```text
compose.prod.yml
.env.production
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

## Deploy Verification

Before approval, `mediatyphoon` should not change.

After approval, verify on `mediatyphoon`:

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
printf 'YIBI_STUDIO_IMAGE=abee.tail2ac38c.ts.net:<port>/yibi-studio:<previous-sha>\n' > .env.image
docker compose --env-file .env.image -f compose.prod.yml pull yibi-studio
docker compose --env-file .env.image -f compose.prod.yml up -d --no-build yibi-studio
```

Rollback must use an immutable SHA tag, not `main-latest`.
