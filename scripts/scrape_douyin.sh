#!/usr/bin/env bash
# Scrape Douyin user posts via tikhub.
# Account: VA7-AI创业版 / Vaaaaaa7  (short URL: https://v.douyin.com/Xts7kZ3qvCI/)
#
# NOTE: Use the `app/v3` endpoint, NOT the `web` endpoint. The web endpoint
# silently drops the most recent video for this account (returns 7 of 8 as of
# 2026-05-20). app/v3 returns all 8.
#
# Output: writes /tmp/sample_douyin.json (raw first page).

set -euo pipefail

TIKHUB_TOKEN="${TIKHUB_TOKEN:-q5UYB/0V+VeRuE2uJpq74zj0Lymuacl+71zvnFqkC9eKl1OgA12JSx+yDQ==}"
AUTH="Authorization: Bearer ${TIKHUB_TOKEN}"
BASE="https://api.tikhub.io"

SHORT_URL="${SHORT_URL:-https://v.douyin.com/Xts7kZ3qvCI/}"
COUNT="${COUNT:-50}"
MAX_CURSOR="${MAX_CURSOR:-0}"

# Hard-coded sec_user_id (resolved 2026-05-16 from the short URL above).
# If you change accounts, comment this out and the resolver below will run.
SEC_USER_ID="${SEC_USER_ID:-MS4wLjABAAAARPbL9HjPX9MHEMLxdeuZQ50A7J0_e8uEYQZvlBQUGf4}"

if [[ -z "${SEC_USER_ID:-}" ]]; then
  echo "[1/2] Resolving short URL -> sec_user_id ..." >&2
  SEC_USER_ID=$(curl -fsS -H "$AUTH" \
    "${BASE}/api/v1/douyin/web/get_sec_user_id?url=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1],safe=''))" "$SHORT_URL")" \
    | python3 -c "import json,sys;print(json.load(sys.stdin)['data'])")
  echo "sec_user_id=${SEC_USER_ID}" >&2
fi

echo "[2/2] Fetching first ${COUNT} videos via app/v3 (cursor=${MAX_CURSOR}) ..." >&2
curl -fsS -H "$AUTH" \
  "${BASE}/api/v1/douyin/app/v3/fetch_user_post_videos?sec_user_id=${SEC_USER_ID}&max_cursor=${MAX_CURSOR}&count=${COUNT}" \
  -o /tmp/sample_douyin.json

python3 - <<'PY'
import json
d = json.load(open('/tmp/sample_douyin.json'))
data = d.get('data', {})
aw = data.get('aweme_list', [])
print(f"[douyin] code={d.get('code')} aweme_count={len(aw)} has_more={data.get('has_more')} max_cursor={data.get('max_cursor')}")
for v in aw[:5]:
    s = v.get('statistics', {})
    print(f"  - {v.get('aweme_id')} | digg={s.get('digg_count')} comment={s.get('comment_count')} share={s.get('share_count')} | {(v.get('desc') or '')[:50]}")
PY
echo "Saved -> /tmp/sample_douyin.json"
