# Data pipeline overview

Two halves: **push** (refresh Bitable from upstream platforms) and **pull**
(Next.js pages read Bitable via ISR).

## Push pipeline — Bitable refresh

Master script: `scripts/sync_all.sh`

```
scrape_xhs.sh         → /tmp/sample_xhs.json
scrape_douyin.sh      → /tmp/sample_douyin.json
scrape_wechat.sh ×2   → /tmp/sample_wechat_yibi.json
                         /tmp/sample_wechat_kjdsc.json
        ↓
sync_insights.py      upsert into Bitable insights table (preserves
                      is_pinned / is_homepage_hero / is_featured /
                      tags / tags_form — your manual curation survives)
        ↓
auto_tag_insights.py  fills tags / tags_form on records that don't have
                      them yet (existing tags untouched)
```

### Trigger options

| When | How |
|------|-----|
| Automatic (daily 06:30 local) | macOS launchd via `com.yibi.sync-insights.plist` |
| Manual any time | `bash scripts/sync_all.sh` |
| Just one platform | `bash scripts/scrape_xhs.sh` then `python3 scripts/sync_insights.py` |
| Just retag | `python3 scripts/auto_tag_insights.py --apply` |

### Install the launchd schedule (one-time)

```bash
cp scripts/com.yibi.sync-insights.plist ~/Library/LaunchAgents/
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.yibi.sync-insights.plist
launchctl kickstart -k gui/$(id -u)/com.yibi.sync-insights   # fire once now to test
```

To disable:
```bash
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.yibi.sync-insights.plist
```

Notes:
- Mac must be on (or wake-on-schedule) at 06:30 for the run to fire.
- If the Mac is asleep, launchd queues the run and fires on next wake.
- Logs land in `logs/sync-YYYYMMDD-HHMMSS.log` (last 30 kept).

## Pull pipeline — Next.js ISR

Each page that reads Bitable sets its own `revalidate` window. Next.js
re-fetches in the background when traffic comes in past the window:

| Page | Revalidate | Source |
|------|-----------|--------|
| `/insights` | 600s (10min) | Bitable insights table via `FEISHU_INSIGHTS_VIEW_ID=vew0x1dFJ4` |
| `/skills`   | 600s        | Bitable skills table |
| `/products/labs` | 21600s (6h) | GitHub API for star counts |

So a Bitable change usually shows up on site within ~10 min for /insights
and /skills, ~6h for /labs.

To force-clear ISR cache during dev: restart `next dev`. In production
(Vercel), the cache invalidates automatically on the next request past the
revalidate window.

## What lives where

```
src/lib/feishu.ts        Bitable client + listInsights() / listSkills()
src/lib/github.ts        GitHub star fetcher
src/lib/qr.ts            QR code SVG generator (deterministic, no refresh)
src/data/insights.ts     Mock data fallback (used if Feishu fails)
scripts/scrape_*.sh      Per-platform upstream fetchers
scripts/sync_insights.py Upsert orchestrator (use this — sync_insights_v2.py is the legacy wipe+recreate)
scripts/auto_tag_insights.py  Keyword-based tagging
scripts/setup_bitable*.py     One-time field/view setup (idempotent)
scripts/sync_all.sh           Master orchestrator
scripts/com.yibi.sync-insights.plist  launchd schedule
```

## Bitable view: `site_main`

`view_id=vew0x1dFJ4`. Configured in Bitable UI to apply filter + sort
that decides what gets pushed to the site by default:

- Filter: `status = published` AND `cover_url is not empty`
- Sort: `is_pinned 降序`, then `date_published 降序`

To change what shows on /insights without touching code, edit the view
filter/sort in Bitable. Re-deploys / restarts not needed (just wait for
ISR to refresh, max 10 min).
