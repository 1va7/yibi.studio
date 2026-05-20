#!/usr/bin/env bash
# Scrape Xiaohongshu user notes via tikhub — paginated, fetches ALL notes.
# Account: VA7 / Vaaaaaa7 (user_id: 5bfd693851783a4917f40d5a)
#
# Pagination model:
#   - The /xiaohongshu/app/get_user_notes endpoint returns ~20 notes per page.
#   - The top-level cursor field is unreliable (often None), but each note
#     carries its own `cursor` token. The cursor of the LAST note in a page
#     is the anchor we pass as `cursor=` on the next request.
#   - Stop when has_more is false OR the returned notes are empty.
#
# Env vars:
#   USER_ID    target user id (default VA7)
#   MAX_PAGES  safety cap (default 50 → up to 1000 notes)
#   SLEEP_MS   delay between pages in ms (default 350)
#
# Output: /tmp/sample_xhs.json — shape matches sync_insights_v2.py:
#   { data: { data: { notes: [...] } } }

set -euo pipefail

TIKHUB_TOKEN="${TIKHUB_TOKEN:-q5UYB/0V+VeRuE2uJpq74zj0Lymuacl+71zvnFqkC9eKl1OgA12JSx+yDQ==}"
AUTH="Authorization: Bearer ${TIKHUB_TOKEN}"
BASE="https://api.tikhub.io"

USER_ID="${USER_ID:-5bfd693851783a4917f40d5a}"
MAX_PAGES="${MAX_PAGES:-50}"
SLEEP_MS="${SLEEP_MS:-350}"

echo "[1/2] User profile ..." >&2
curl -fsS -H "$AUTH" "${BASE}/api/v1/xiaohongshu/web/get_user_info?user_id=${USER_ID}" \
  -o /tmp/sample_xhs_user.json

echo "[2/2] Paginating notes via app/get_user_notes (max ${MAX_PAGES} pages) ..." >&2

PAGE_DIR=$(mktemp -d)
CURSOR=""
PAGE=0

while [[ $PAGE -lt $MAX_PAGES ]]; do
  QS="user_id=${USER_ID}"
  if [[ -n "${CURSOR}" ]]; then QS="${QS}&cursor=${CURSOR}"; fi

  PAGE_FILE="${PAGE_DIR}/page-$(printf '%03d' $PAGE).json"
  if ! curl -fsS -H "$AUTH" "${BASE}/api/v1/xiaohongshu/app/get_user_notes?${QS}" -o "$PAGE_FILE"; then
    echo "  ! curl failed at page ${PAGE}, stopping" >&2
    break
  fi

  READ=$(python3 - "$PAGE_FILE" <<'PY'
import json, sys
d = json.load(open(sys.argv[1]))
inner = d.get('data', {}).get('data', {})
notes = inner.get('notes', []) or []
has_more = inner.get('has_more')
last_cursor = (notes[-1].get('cursor') or '') if notes else ''
print(f"{len(notes)}|{1 if has_more else 0}|{last_cursor}")
PY
)
  N="${READ%%|*}"
  REST="${READ#*|}"
  HAS_MORE="${REST%%|*}"
  NEW_CURSOR="${REST#*|}"

  echo "  page ${PAGE}: notes=${N} has_more=${HAS_MORE} next_cursor=${NEW_CURSOR:0:24}…" >&2

  PAGE=$((PAGE + 1))
  if [[ "$N" -eq 0 || "$HAS_MORE" != "1" || -z "$NEW_CURSOR" || "$NEW_CURSOR" == "$CURSOR" ]]; then
    break
  fi
  CURSOR="$NEW_CURSOR"
  python3 -c "import time; time.sleep(${SLEEP_MS}/1000)"
done

echo "Merging ${PAGE} page(s) → /tmp/sample_xhs.json" >&2
python3 - "$PAGE_DIR" <<'PY'
import glob, json, os, sys
all_notes = []
seen = set()
for f in sorted(glob.glob(os.path.join(sys.argv[1], 'page-*.json'))):
    d = json.load(open(f))
    notes = d.get('data', {}).get('data', {}).get('notes', []) or []
    for n in notes:
        nid = n.get('id')
        if not nid or nid in seen:
            continue
        seen.add(nid)
        all_notes.append(n)
merged = {"data": {"data": {"notes": all_notes, "has_more": False, "cursor": ""}}}
with open('/tmp/sample_xhs.json', 'w') as f:
    json.dump(merged, f, ensure_ascii=False)
print(f"[xhs] merged_notes={len(all_notes)} (unique)")
PY

rm -rf "$PAGE_DIR"
echo "Saved -> /tmp/sample_xhs.json (+/tmp/sample_xhs_user.json)"
