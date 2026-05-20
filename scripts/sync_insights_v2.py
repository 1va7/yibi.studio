#!/usr/bin/env python3
"""
v2 sync — saves cover image, video URL, duration, full_text properly.
Run after setup_bitable.py.
"""
import json
import os
import urllib.request
from datetime import datetime, timezone, timedelta

APP = "G1MIbWAKJaUxQjs506GcBPrznGf"
TBL_INSIGHTS = "tblZet5T2EpM638l"


def get_token():
    data = json.dumps({
        "app_id": "cli_a901f2cd01b8dbd3",
        "app_secret": "pnCjjX4BYfT53qi4u4vSJbE3ar8yhlCr",
    }).encode()
    req = urllib.request.Request(
        "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
        data=data, method="POST", headers={"Content-Type": "application/json"},
    )
    return json.loads(urllib.request.urlopen(req).read())["tenant_access_token"]


T = get_token()
H = {"Authorization": f"Bearer {T}", "Content-Type": "application/json"}


def post(path, payload):
    req = urllib.request.Request(
        f"https://open.feishu.cn{path}",
        data=json.dumps(payload).encode(), method="POST", headers=H,
    )
    return json.loads(urllib.request.urlopen(req).read())


def get(path, params=None):
    qs = "?" + "&".join(f"{k}={v}" for k, v in (params or {}).items()) if params else ""
    req = urllib.request.Request(f"https://open.feishu.cn{path}{qs}", headers=H)
    return json.loads(urllib.request.urlopen(req).read())


def list_all(table_id):
    out = []
    page_token = None
    while True:
        params = {"page_size": 100}
        if page_token:
            params["page_token"] = page_token
        d = get(f"/open-apis/bitable/v1/apps/{APP}/tables/{table_id}/records", params=params)
        items = d.get("data", {}).get("items", [])
        out.extend(items)
        if not d.get("data", {}).get("has_more"):
            break
        page_token = d.get("data", {}).get("page_token")
    return out


def date_ms(s):
    if isinstance(s, str):
        try:
            return int(datetime.strptime(s, "%Y-%m-%d").timestamp() * 1000)
        except Exception:
            return None
    return None


def url_field(v):
    if not v:
        return None
    return {"link": v, "text": v[:80]}


def make_douyin_records():
    if not os.path.exists("/tmp/sample_douyin.json"):
        return []
    d = json.load(open("/tmp/sample_douyin.json"))
    aw = d.get("data", {}).get("aweme_list", [])
    out = []
    for v in aw:
        s = v.get("statistics", {})
        video = v.get("video", {})
        desc = (v.get("desc") or "").strip()
        title = desc.split("\n")[0][:60] if desc else f"抖音视频 {v.get('aweme_id')}"
        ts = v.get("create_time")
        date_str = datetime.fromtimestamp(ts, tz=timezone(timedelta(hours=8))).strftime("%Y-%m-%d") if ts else None

        cover_list = video.get("cover", {}).get("url_list", []) or video.get("origin_cover", {}).get("url_list", [])
        play_list = video.get("play_addr", {}).get("url_list", [])
        duration_ms = video.get("duration") or v.get("duration") or 0

        slug = f"dy-{v.get('aweme_id')}"
        share_url = (v.get("share_info") or {}).get("share_url") or f"https://www.douyin.com/video/{v.get('aweme_id')}"

        rec = {
            "slug": slug,
            "topic_group": slug,
            "is_primary": True,
            "title": title,
            "title_on_platform": title,
            "summary": desc[:200],
            "full_text": desc,
            "type": "视频",
            "platform": "抖音",
            "platform_post_id": str(v.get("aweme_id") or ""),
            "platform_url": url_field(share_url),
            "cover_url": url_field(cover_list[0] if cover_list else None),
            "video_url": url_field(play_list[0] if play_list else None),
            "duration_seconds": int(duration_ms / 1000) if duration_ms else 0,
            "author": "VA7",
            "lang": "zh",
            "is_featured": True,
            "metric_likes": int(s.get("digg_count") or 0),
            "metric_comments": int(s.get("comment_count") or 0),
            "metric_shares": int(s.get("share_count") or 0),
            "metric_collects": int(s.get("collect_count") or 0),
            "metric_views": int(s.get("play_count") or 0),  # always 0 from douyin, but keep field
            "status": "published",
        }
        if date_str:
            rec["date_published"] = date_ms(date_str)
        rec = {k: v for k, v in rec.items() if v not in (None, "", 0) or k in ("metric_likes", "metric_comments", "metric_shares", "metric_collects", "duration_seconds")}
        out.append(rec)
    return out


def make_xhs_records():
    if not os.path.exists("/tmp/sample_xhs.json"):
        return []
    d = json.load(open("/tmp/sample_xhs.json"))
    notes = d.get("data", {}).get("data", {}).get("notes", [])
    out = []
    for n in notes:
        nid = n.get("id")
        title = n.get("display_title") or n.get("title") or "VA7 小红书笔记"
        desc = n.get("desc") or ""
        type_field = "视频" if n.get("type") == "video" else "文章"

        images = n.get("images_list") or []
        first_img = None
        all_imgs = []
        for img in images:
            url = img.get("url_size_large") or img.get("url_size_default") or img.get("url")
            if url:
                if not first_img:
                    first_img = url
                all_imgs.append(url)

        video_url_obj = None
        video_info = n.get("video_info_v2") or n.get("video_info")
        if video_info and isinstance(video_info, dict):
            media = video_info.get("media") or {}
            stream = media.get("stream") or {}
            # try common pre-keys
            for key in ["h264", "h265", "av1"]:
                arr = stream.get(key) or []
                if arr and isinstance(arr, list) and arr:
                    video_url_obj = arr[0].get("master_url") or arr[0].get("url")
                    if video_url_obj:
                        break

        ts = n.get("create_time")
        date_str = None
        if ts:
            try:
                ts_int = int(ts)
                if ts_int > 1e11:
                    ts_int //= 1000
                date_str = datetime.fromtimestamp(ts_int, tz=timezone(timedelta(hours=8))).strftime("%Y-%m-%d")
            except Exception:
                pass

        slug = f"xhs-{nid}"
        url = f"https://www.xiaohongshu.com/explore/{nid}" if nid else None

        rec = {
            "slug": slug,
            "topic_group": slug,
            "is_primary": True,
            "title": title,
            "title_on_platform": title,
            "summary": (desc or title)[:200],
            "full_text": desc,
            "type": type_field,
            "platform": "小红书",
            "platform_post_id": str(nid or ""),
            "platform_url": url_field(url),
            "cover_url": url_field(first_img),
            "video_url": url_field(video_url_obj),
            "image_urls": ",".join(all_imgs[:9]) if all_imgs else None,
            "author": "VA7",
            "lang": "zh",
            "is_featured": (n.get("likes") or 0) > 100,
            "metric_likes": int(n.get("likes") or 0),
            "metric_comments": int(n.get("comments_count") or 0),
            "metric_collects": int(n.get("collected_count") or 0),
            "metric_shares": int(n.get("share_count") or 0),
            "metric_views": int(n.get("view_count") or 0),
            "status": "published",
        }
        if date_str:
            rec["date_published"] = date_ms(date_str)
        rec = {k: v for k, v in rec.items() if v not in (None, "")}
        out.append(rec)
    return out


def make_wechat_records():
    """Read /tmp/sample_wechat_*.json files (one per account) produced by
    scrape_wechat.sh and flatten them into insight records. Schema produced
    by the new (Tikhub-based) scrape_wechat.sh:
        { tag, label, ghid, articles: [
            { title, digest, content_url, cover_url, send_time,
              comment_topic_id, is_original,
              readnum, likenum, oldlikenum, comment_count,
              collect_num, share_num }
        ]}
    Engagement is enriched per-article via fetch_mp_article_read_count, but
    older articles (no comment_topic_id) won't have metrics; those land as 0.
    """
    import glob
    out = []
    for path in sorted(glob.glob("/tmp/sample_wechat_*.json")):
        try:
            d = json.load(open(path))
        except Exception:
            continue
        tag = d.get("tag") or os.path.basename(path).replace("sample_wechat_", "").replace(".json", "")
        label = d.get("label") or tag
        ghid = d.get("ghid") or ""
        articles = d.get("articles", []) or []
        for a in articles:
            url = a.get("content_url") or ""
            if not url:
                continue
            title = a.get("title") or ""
            digest = a.get("digest") or ""
            cover = a.get("cover_url_16_9") or a.get("cover_url") or ""
            send_time = a.get("send_time")
            date_str = None
            if send_time:
                try:
                    date_str = datetime.fromtimestamp(
                        int(send_time), tz=timezone(timedelta(hours=8))
                    ).strftime("%Y-%m-%d")
                except Exception:
                    pass

            # Stable slug from the URL's mid/idx/sn — survives re-scrapes.
            import re
            m_mid = re.search(r"[?&]mid=(\d+)", url)
            m_idx = re.search(r"[?&]idx=(\d+)", url)
            mid = m_mid.group(1) if m_mid else ""
            idx = m_idx.group(1) if m_idx else "1"
            slug = f"wx-{tag}-{mid}-{idx}" if mid else f"wx-{tag}-{a.get('comment_topic_id') or send_time}"

            likes = max(int(a.get("likenum") or 0), int(a.get("oldlikenum") or 0))
            rec = {
                "slug": slug,
                "topic_group": slug,
                "is_primary": True,
                "title": title,
                "title_on_platform": title,
                "summary": digest[:200],
                "type": "文章",
                "platform": "公众号",
                "platform_post_id": a.get("comment_topic_id") or "",
                "platform_url": url_field(url),
                "cover_url": url_field(cover) if cover else None,
                "author": label,
                "lang": "zh",
                "is_featured": int(a.get("readnum") or 0) >= 1000,
                "metric_likes": likes,
                "metric_views": int(a.get("readnum") or 0),
                "metric_comments": int(a.get("comment_count") or 0),
                "metric_collects": int(a.get("collect_num") or 0),
                "metric_shares": int(a.get("share_num") or 0),
                "status": "published",
            }
            if date_str:
                rec["date_published"] = date_ms(date_str)
            rec = {k: v for k, v in rec.items() if v not in (None, "")
                   or k in ("metric_likes", "metric_views", "metric_comments", "metric_collects", "metric_shares")}
            out.append(rec)
    return out


def main():
    # 1. Clear existing insights
    print("Clearing existing insights …")
    existing = list_all(TBL_INSIGHTS)
    ids = [r["record_id"] for r in existing]
    if ids:
        for i in range(0, len(ids), 100):
            post(
                f"/open-apis/bitable/v1/apps/{APP}/tables/{TBL_INSIGHTS}/records/batch_delete",
                {"records": ids[i : i + 100]},
            )
        print(f"  cleared {len(ids)} rows")

    # 2. Re-insert
    dy = make_douyin_records()
    xhs = make_xhs_records()
    wx = make_wechat_records()
    print(f"Douyin records: {len(dy)}")
    print(f"XHS records: {len(xhs)}")
    print(f"WeChat records: {len(wx)}")
    all_recs = dy + xhs + wx
    for i in range(0, len(all_recs), 100):
        chunk = all_recs[i : i + 100]
        r = post(
            f"/open-apis/bitable/v1/apps/{APP}/tables/{TBL_INSIGHTS}/records/batch_create",
            {"records": [{"fields": rec} for rec in chunk]},
        )
        if r.get("code") != 0:
            print(f"  ! batch err: {r.get('msg')}")
            # show one failing field set
            print(json.dumps(chunk[0], ensure_ascii=False, indent=2)[:800])
            return
    print(f"\n✅ Inserted {len(all_recs)} insights with video/image fields.")


if __name__ == "__main__":
    main()
