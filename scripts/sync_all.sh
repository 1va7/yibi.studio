#!/usr/bin/env bash
# Orchestrate the full insights data pipeline:
#   1. Scrape XHS / Douyin / WeChat (yibi + kjdsc) via Tikhub
#   2. Upsert to Bitable (preserve user-curated is_pinned/tags/tags_form)
#   3. Auto-tag NEW records (existing tags are preserved)
#
# Manual:   bash scripts/sync_all.sh
# Scheduled (macOS launchd): see scripts/com.yibi.sync-insights.plist
#
# Env vars (optional overrides):
#   TIKHUB_TOKEN          default baked in
#   YIBI_WX_GHID          gh_bdb8cd7f9a51
#   KJDSC_WX_GHID         gh_8735d85bd152
#   SKIP_WECHAT_METRICS   "1" to skip per-article read_count enrichment

set -uo pipefail
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.." || exit 1

# Timestamp every line in the master log for forensics.
LOG_DIR="${SCRIPT_DIR}/../logs"
mkdir -p "$LOG_DIR"
LOG_FILE="${LOG_DIR}/sync-$(date +%Y%m%d-%H%M%S).log"

log() {
  echo "[$(date +'%H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

run() {
  local label="$1"; shift
  log "── $label"
  if "$@" 2>&1 | tee -a "$LOG_FILE"; then
    log "✓ $label"
  else
    log "✗ $label (exit code $?)"
  fi
}

log "═══ sync_all.sh starting ═══"
log "log file: $LOG_FILE"

# --- 1. Scrape three platforms ---
run "scrape xhs"     bash "${SCRIPT_DIR}/scrape_xhs.sh"
run "scrape douyin"  bash "${SCRIPT_DIR}/scrape_douyin.sh"
run "scrape wechat (yibi)" env \
  WX_GHID="${YIBI_WX_GHID:-gh_bdb8cd7f9a51}" \
  WX_TAG=yibi WX_LABEL=异璧辑 \
  bash "${SCRIPT_DIR}/scrape_wechat.sh"
run "scrape wechat (kjdsc)" env \
  WX_GHID="${KJDSC_WX_GHID:-gh_8735d85bd152}" \
  WX_TAG=kjdsc WX_LABEL=跨境电商策 \
  bash "${SCRIPT_DIR}/scrape_wechat.sh"

# --- 2. Upsert to Bitable ---
run "upsert to Bitable" python3 "${SCRIPT_DIR}/sync_insights.py"

# --- 3. Auto-tag new records ---
run "auto-tag new records" python3 "${SCRIPT_DIR}/auto_tag_insights.py" --apply

log "═══ sync_all.sh done ═══"

# Trim old logs (keep last 30)
ls -1t "$LOG_DIR"/sync-*.log 2>/dev/null | tail -n +31 | xargs -r rm -f
