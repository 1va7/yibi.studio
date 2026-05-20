#!/usr/bin/env bash
# Scrape a WeChat 公众号's published articles via Tikhub.
#
# Tikhub's `fetch_mp_article_list` endpoint is working again as of 2026-05-20
# (was broken 2026-04 to mid-May). We no longer need the official WeChat API
# (AppSecret / IP whitelist). Engagement metrics come from
# `fetch_mp_article_read_count` using each article's `comment_topic_id`.
#
# Env vars:
#   WX_GHID         The gh_xxx ID of the public account.
#                   If unknown, set WX_SEED_URL instead — any article URL
#                   from that account, and the script will resolve ghid.
#   WX_SEED_URL     Optional. Any article URL — used only when WX_GHID is empty.
#   WX_TAG          Short tag, e.g. "kjdsc" / "yibi". Used in output filename.
#   WX_LABEL        Human label, e.g. "跨境电商策". Defaults to WX_TAG.
#   MAX_PAGES       Pagination cap (default 50, 10 articles/page → 500 max).
#   SKIP_METRICS    Set =1 to skip the per-article read_count call (saves
#                   API credits but you lose likes/reads).
#
# Output:
#   /tmp/sample_wechat_<TAG>.json
#   {
#     tag, label, ghid,
#     articles: [
#       { title, digest, content_url, cover_url, send_time,
#         comment_topic_id, is_original,
#         readnum, likenum, oldlikenum, comment_count, collect_num, share_num }
#     ]
#   }

set -euo pipefail

TIKHUB_TOKEN="${TIKHUB_TOKEN:-q5UYB/0V+VeRuE2uJpq74zj0Lymuacl+71zvnFqkC9eKl1OgA12JSx+yDQ==}"
AUTH="Authorization: Bearer ${TIKHUB_TOKEN}"
BASE="https://api.tikhub.io"

WX_GHID="${WX_GHID:-}"
WX_SEED_URL="${WX_SEED_URL:-}"
WX_TAG="${WX_TAG:?WX_TAG is required, e.g. kjdsc}"
WX_LABEL="${WX_LABEL:-$WX_TAG}"
MAX_PAGES="${MAX_PAGES:-50}"
SKIP_METRICS="${SKIP_METRICS:-0}"

OUTPUT="/tmp/sample_wechat_${WX_TAG}.json"

urlencode() {
  python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1],safe=''))" "$1"
}

# Resolve ghid from a seed article URL if needed
if [[ -z "$WX_GHID" ]]; then
  if [[ -z "$WX_SEED_URL" ]]; then
    echo "ERROR: provide either WX_GHID or WX_SEED_URL" >&2
    exit 1
  fi
  echo "[0/3] Resolving ghid from seed URL ..." >&2
  RESOLVE=$(curl -fsS -H "$AUTH" \
    "${BASE}/api/v1/wechat_mp/web/fetch_mp_article_detail_json?url=$(urlencode "$WX_SEED_URL")")
  WX_GHID=$(echo "$RESOLVE" | python3 -c "import json,sys;d=json.load(sys.stdin);print((d.get('data',{}).get('publish_info') or {}).get('user_id',''))")
  if [[ -z "$WX_GHID" ]]; then
    echo "ERROR: could not resolve ghid from seed URL. Response: $RESOLVE" >&2
    exit 1
  fi
  echo "  resolved ghid = ${WX_GHID}" >&2
fi

echo "[1/3] Listing articles for ${WX_LABEL} (ghid=${WX_GHID}) ..." >&2

PAGE_DIR=$(mktemp -d)
OFFSET=""
PAGE=0

while [[ $PAGE -lt $MAX_PAGES ]]; do
  URL="${BASE}/api/v1/wechat_mp/web/fetch_mp_article_list?ghid=${WX_GHID}"
  if [[ -n "$OFFSET" ]]; then
    URL="${URL}&offset=$(urlencode "$OFFSET")"
  fi

  PAGE_FILE="${PAGE_DIR}/page-$(printf '%03d' $PAGE).json"
  if ! curl -fsS -H "$AUTH" "$URL" -o "$PAGE_FILE"; then
    echo "  ! page ${PAGE} HTTP failed, stopping" >&2
    break
  fi

  READ=$(python3 - "$PAGE_FILE" <<'PY'
import json, sys
d = json.load(open(sys.argv[1]))
data = d.get('data') or {}
lst = data.get('list') or []
off = data.get('offset') or {}
is_end = off.get('IsEnd', 1)
next_off = off.get('Offset') or ''
print(f"{len(lst)}|{is_end}|{next_off}")
PY
)
  N="${READ%%|*}"
  REST="${READ#*|}"
  IS_END="${REST%%|*}"
  NEXT_OFF="${REST#*|}"

  echo "  page ${PAGE}: articles=${N} is_end=${IS_END}" >&2

  PAGE=$((PAGE + 1))
  if [[ "$N" == "0" ]] || [[ "$IS_END" != "0" ]]; then
    break
  fi
  OFFSET="$NEXT_OFF"
  python3 -c "import time;time.sleep(0.4)"
done

echo "[2/3] Merging ${PAGE} page(s) ..." >&2
python3 - "$PAGE_DIR" "$OUTPUT" "$WX_TAG" "$WX_LABEL" "$WX_GHID" <<'PY'
import glob, json, os, sys
src_dir, output, tag, label, ghid = sys.argv[1:6]
seen = set()
articles = []
for f in sorted(glob.glob(os.path.join(src_dir, 'page-*.json'))):
    d = json.load(open(f))
    for a in (d.get('data') or {}).get('list', []) or []:
        url = a.get('ContentUrl') or ''
        # de-dupe by URL
        if url in seen:
            continue
        seen.add(url)
        articles.append({
            'title': a.get('Title'),
            'digest': a.get('Digest'),
            'content_url': url,
            'cover_url': a.get('CoverImgUrl'),
            'cover_url_16_9': a.get('CoverImgUrl_16_9') or a.get('CoverImgUrl_16_9_640'),
            'send_time': a.get('send_time'),
            'comment_topic_id': str(a.get('comment_topic_id') or ''),
            'is_original': a.get('IsOriginal') or 0,
            'item_index': a.get('ItemIndex') or 0,
        })
out = {'tag': tag, 'label': label, 'ghid': ghid, 'articles': articles}
json.dump(out, open(output, 'w'), ensure_ascii=False)
print(f"[wechat:{tag}] {len(articles)} articles merged")
PY

rm -rf "$PAGE_DIR"

if [[ "$SKIP_METRICS" == "1" ]]; then
  echo "[3/3] Skipping read_count enrichment (SKIP_METRICS=1)" >&2
else
  echo "[3/3] Enriching with read/like counts via fetch_mp_article_read_count ..." >&2
  TOTAL=$(python3 -c "import json;d=json.load(open('$OUTPUT'));print(len(d.get('articles',[])))")
  ENRICHED=0
  FAILED=0
  TMP_METRICS=$(mktemp)
  echo "{}" > "$TMP_METRICS"
  # disable -e for this loop so transient API failures don't kill the script
  set +e
  i=0
  while (( i < TOTAL )); do
    READ=$(python3 - "$OUTPUT" "$i" <<'PY'
import json,sys
d=json.load(open(sys.argv[1]))
a=d['articles'][int(sys.argv[2])]
print(f"{a.get('content_url') or ''}|{a.get('comment_topic_id') or ''}")
PY
)
    URL="${READ%|*}"
    CID="${READ#*|}"
    if [[ -n "$URL" ]] && [[ -n "$CID" ]]; then
      URL_ENC=$(urlencode "$URL")
      RESP=$(curl -sS -H "$AUTH" \
        "${BASE}/api/v1/wechat_mp/web/fetch_mp_article_read_count?url=${URL_ENC}&comment_id=${CID}" \
        </dev/null)
      ECODE=$(echo "$RESP" | python3 -c "import json,sys
try: print(json.load(sys.stdin).get('code',0))
except: print(0)")
      if [[ "$ECODE" == "200" ]]; then
        python3 - "$TMP_METRICS" "$i" "$RESP" <<'PY'
import json,sys
store=json.load(open(sys.argv[1]))
idx=sys.argv[2]
payload=json.loads(sys.argv[3])
store[idx]=payload.get('data') or {}
json.dump(store,open(sys.argv[1],'w'))
PY
        ENRICHED=$((ENRICHED + 1))
      else
        FAILED=$((FAILED + 1))
        if (( FAILED <= 3 )); then
          echo "  ! article $((i + 1))/${TOTAL} code=$ECODE  $(echo "$RESP" | head -c 200)" >&2
        fi
      fi
    fi
    if (( (i + 1) % 5 == 0 )); then
      echo "  progress $((i + 1))/${TOTAL}  enriched=${ENRICHED}  failed=${FAILED}" >&2
    fi
    python3 -c "import time;time.sleep(0.6)"
    i=$((i + 1))
  done
  set -e

  python3 - "$OUTPUT" "$TMP_METRICS" <<'PY'
import json,sys
d=json.load(open(sys.argv[1]))
store=json.load(open(sys.argv[2]))
for idx_str,metrics in store.items():
    i=int(idx_str)
    if 0<=i<len(d['articles']):
        a=d['articles'][i]
        a['readnum']=int(metrics.get('readnum') or 0)
        a['likenum']=int(metrics.get('likenum') or 0)
        a['oldlikenum']=int(metrics.get('oldlikenum') or 0)
        a['comment_count']=int(metrics.get('comment_count') or 0)
        a['collect_num']=int(metrics.get('collect_num') or 0)
        a['share_num']=int(metrics.get('share_num') or 0)
json.dump(d,open(sys.argv[1],'w'),ensure_ascii=False)
print(f"[wechat] {len(store)} of {len(d['articles'])} articles enriched")
PY
  rm -f "$TMP_METRICS"
fi

echo "Saved → ${OUTPUT}"
