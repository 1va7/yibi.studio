#!/usr/bin/env bash
set -euo pipefail

user_database_url="${DATABASE_URL:-}"

if [[ -f ".env.production" ]]; then
  set -a
  # shellcheck disable=SC1091
  . ".env.production"
  set +a
fi

if [[ -n "$user_database_url" ]]; then
  export DATABASE_URL="$user_database_url"
else
  export DATABASE_URL="${DEV_DATABASE_URL:-postgresql://yibi:yibi_dev_password@localhost:5432/yibi_studio?schema=public}"
fi

exec next dev "$@"
