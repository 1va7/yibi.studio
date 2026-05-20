#!/usr/bin/env python3
"""
Sync content into the yibi.studio CMS Bitable:
  1. Seed pages_map with known routes.
  2. Seed insights from /tmp/sample_douyin.json + /tmp/sample_xhs.json (tikhub data).
  3. Seed skills from src/data/skills.ts mock data.

Run after setup_bitable.py. Idempotent: looks up existing rows by `slug`.
"""
import json
import subprocess
import sys
import os
import urllib.parse
from datetime import datetime, timezone, timedelta

APP_TOKEN = "G1MIbWAKJaUxQjs506GcBPrznGf"
TABLE_PAGES_MAP = "tblbfaRogFtXQCV8"
TABLE_INSIGHTS = "tblZet5T2EpM638l"
TABLE_SKILLS = "tbl3m2jlJ9Sig5zO"

DOUYIN_FILE = "/tmp/sample_douyin.json"
XHS_FILE = "/tmp/sample_xhs.json"


def lark(method, path, data=None, params=None):
    cmd = ["lark-cli", "api", method, path]
    if data is not None:
        cmd.extend(["--data", json.dumps(data, ensure_ascii=False)])
    if params is not None:
        cmd.extend(["--params", json.dumps(params, ensure_ascii=False)])
    r = subprocess.run(cmd, capture_output=True, text=True)
    try:
        result = json.loads(r.stdout)
    except Exception:
        print(r.stdout[:400], r.stderr[:200])
        return None
    if result.get("code") != 0:
        print(f"⚠ {result.get('code')}: {result.get('msg')}")
        return None
    return result.get("data")


def normalize_url_fields(fields, url_keys):
    """Feishu URL fields need {"link": "...", "text": "..."} format."""
    out = {}
    for k, v in fields.items():
        if k in url_keys and isinstance(v, str) and v:
            out[k] = {"link": v, "text": v[:80]}
        else:
            out[k] = v
    return out


def batch_create(table_id, records, url_keys=()):
    """Create up to 100 records in one call."""
    if not records:
        return
    normalized = [normalize_url_fields(r, url_keys) for r in records]
    payload = {"records": [{"fields": r} for r in normalized]}
    r = lark("POST", f"/open-apis/bitable/v1/apps/{APP_TOKEN}/tables/{table_id}/records/batch_create", data=payload)
    if r:
        print(f"  → batched {len(records)} into {table_id}")


def date_ms(s):
    """Convert ISO date or unix-second to Feishu epoch ms."""
    if isinstance(s, int):
        # if it's seconds vs ms
        if s > 1e11:  # already ms
            return int(s)
        return int(s) * 1000
    if isinstance(s, str):
        try:
            dt = datetime.fromisoformat(s)
        except ValueError:
            try:
                dt = datetime.strptime(s, "%Y-%m-%d")
            except ValueError:
                return None
        return int(dt.timestamp() * 1000)
    return None


# ============ 1. PAGES_MAP ============

PAGES = [
    ("about", "static", "关于异璧", "硅谷 AI 技术 + 深圳落地速度", None, 1, "published"),
    ("services", "static", "服务", "5 项可独立采购的服务，也可以打包成解决方案", None, 2, "published"),
    ("services/aigc", "service", "电商 AIGC", "畅销的才是好内容。AIGC 不只该好看，还该好卖。", None, 3, "published"),
    ("solutions", "static", "解决方案", "3 个跑通过的方案", None, 4, "published"),
    ("solutions/amazon-ai", "solution", "跨境电商 AI 运营系统", "3 步交付：环境部署 → 内训 → 陪跑与经验蒸馏", "Fuqudqt0eoGxcIxLSoYcT1GznCg", 1, "published"),
    ("solutions/content-factory", "solution", "社媒内容工厂", "飞书内容工厂模板 + 标准 Agent + 4 小时培训。1 天现场交付", "I739dfBDdoqHvfxsgGecod2bnen", 2, "published"),
    ("solutions/llm-gateway", "solution", "企业级大模型网关", "1 周搭起企业 AI 网关。一个入口接通所有海外大模型账号", "HCdnd0VLkoJiVmxgt1fcfrwynte", 3, "published"),
    ("products", "static", "产品", "一款主商品，一个实验室", None, 5, "published"),
    ("products/distill", "product", "经验蒸馏", "把好员工的判断变成组织数字资产", None, 1, "published"),
    ("products/labs", "labs", "实验室", "我们开源的工具", None, 6, "published"),
    ("products/labs/openclaw-pm", "labs", "OpenClaw PM", "让 AI Agent 成为优秀的项目经理", None, 1, "published"),
    ("products/labs/opal", "labs", "OPAL", "Open Portable Activity Layer 伞项目", None, 2, "published"),
    ("products/labs/opal/bridge", "labs", "OPAL · Bridge", "跨 agent 的 session 翻译与 resume 桥", None, 3, "published"),
    ("products/labs/opal/mirror", "labs", "OPAL · Mirror", "网页 LLM 历史本地镜像", None, 4, "published"),
    ("contact", "static", "预约咨询", "30 分钟售前沟通免费", None, 7, "published"),
    ("community", "static", "实战社群", "500+ 跨境 + AI 创业者", None, 8, "published"),
]


def sync_pages_map():
    print("\n=== Seeding pages_map ===")
    records = []
    for slug, cat, title_zh, summary_zh, doc_id_zh, order, status in PAGES:
        r = {
            "slug": slug,
            "category": cat,
            "title_zh": title_zh,
            "summary_zh": summary_zh,
            "order": order,
            "status": status,
        }
        if doc_id_zh:
            r["doc_id_zh"] = doc_id_zh
        records.append(r)
    # batch in chunks of 50
    for i in range(0, len(records), 50):
        batch_create(TABLE_PAGES_MAP, records[i : i + 50])


# ============ 2. INSIGHTS (real tikhub data) ============

def sync_insights_douyin():
    if not os.path.exists(DOUYIN_FILE):
        print(f"  ⚠ {DOUYIN_FILE} not found — skipping douyin")
        return []
    print("\n=== Insights from Douyin ===")
    d = json.load(open(DOUYIN_FILE))
    aw = d.get("data", {}).get("aweme_list", [])
    records = []
    for v in aw:
        s = v.get("statistics", {})
        desc = (v.get("desc") or "").strip()
        # Use first 60 chars as title
        title = desc[:60] if desc else f"抖音视频 {v.get('aweme_id')}"
        share_info = v.get("share_info", {})
        share_url = share_info.get("share_url") or f"https://www.douyin.com/video/{v.get('aweme_id')}"
        ts = v.get("create_time")
        date_str = datetime.fromtimestamp(ts, tz=timezone(timedelta(hours=8))).strftime("%Y-%m-%d") if ts else None

        slug = f"dy-{v.get('aweme_id')}"
        rec = {
            "slug": slug,
            "topic_group": slug,
            "is_primary": True,
            "title": title,
            "title_on_platform": title,
            "summary": (desc[:200] or "VA7 抖音视频"),
            "type": "视频",
            "platform": "抖音",
            "platform_post_id": str(v.get("aweme_id") or ""),
            "platform_url": share_url,
            "author": "VA7",
            "lang": "zh",
            "is_featured": True,
            "metric_views": int(s.get("play_count") or 0),
            "metric_likes": int(s.get("digg_count") or 0),
            "metric_comments": int(s.get("comment_count") or 0),
            "metric_shares": int(s.get("share_count") or 0),
            "metric_collects": int(s.get("collect_count") or 0),
            "status": "published",
        }
        if date_str:
            rec["date_published"] = date_ms(date_str)
        records.append(rec)
    batch_create(TABLE_INSIGHTS, records, url_keys={"platform_url", "cover_url"})
    return records


def sync_insights_xhs():
    if not os.path.exists(XHS_FILE):
        print(f"  ⚠ {XHS_FILE} not found — skipping xhs")
        return []
    print("\n=== Insights from XHS ===")
    d = json.load(open(XHS_FILE))
    inner = d.get("data", {}).get("data", {}) if isinstance(d.get("data"), dict) else {}
    notes = inner.get("notes", [])
    records = []
    for n in notes:
        nid = n.get("id") or n.get("note_id")
        title = n.get("display_title") or n.get("title") or "VA7 小红书笔记"
        likes = n.get("likes") or n.get("liked_count") or 0
        comments = n.get("comments_count") or n.get("comment_count") or 0
        collected = n.get("collected_count") or 0
        cover = (n.get("cover") or {}).get("url") if isinstance(n.get("cover"), dict) else n.get("cover_url")
        type_field = "视频" if n.get("type") in ("video", 2) else "文章"

        url = f"https://www.xiaohongshu.com/explore/{nid}" if nid else None

        slug = f"xhs-{nid}"
        rec = {
            "slug": slug,
            "topic_group": slug,
            "is_primary": True,
            "title": title,
            "title_on_platform": title,
            "summary": title,  # xhs doesn't return excerpt in list API
            "type": type_field,
            "platform": "小红书",
            "platform_post_id": str(nid or ""),
            "platform_url": url,
            "cover_url": cover if cover else None,
            "author": "VA7",
            "lang": "zh",
            "is_featured": likes > 100,
            "metric_likes": int(likes),
            "metric_comments": int(comments),
            "metric_collects": int(collected),
            "status": "published",
        }
        # remove None values
        rec = {k: v for k, v in rec.items() if v not in (None, "")}
        records.append(rec)
    for i in range(0, len(records), 100):
        batch_create(TABLE_INSIGHTS, records[i : i + 100], url_keys={"platform_url", "cover_url"})
    return records


# ============ 3. SKILLS (mock data) ============

SKILLS_SEED = [
    ("selection-five-look", "五看选品框架", "用五维度（市场/竞品/利润/供应/合规）系统化筛选选品机会", "选品", "skill", "自研", True),
    ("aba-keyword-mining", "ABA 关键词挖掘", "基于亚马逊 Brand Analytics 做 N-gram 关键词树", "关键词", "skill", "自研", True),
    ("rufus-faq-extraction", "Rufus FAQ 抓取", "采集类目下 Rufus 高频问答用于 Listing 埋点", "Listing", "skill", "自研", True),
    ("listing-cosmo-optimization", "COSMO 视觉优化", "围绕亚马逊 COSMO 规则优化主图与 A+ 图", "Listing", "skill", "自研", False),
    ("review-sentiment-mining", "评论情绪挖掘", "竞品 + 自家评论的痛点抽取与频率聚类", "评论与口碑", "skill", "公开 curate", True),
    ("ngram-ad-keyword", "N-gram 广告关键词策略", "AI 驱动的力导向图广告投放结构", "广告", "skill", "自研", False),
    ("weekly-review-agent", "每周复盘 Agent", "自动汇总卖家精灵 + 后台数据出周报", "数据复盘", "agent", "自研", True),
    ("xhs-script-writer", "小红书 IP 口播脚本", "面向跨境老板的小红书 IP 内容生产", "社媒内容", "skill", "自研", False),
    ("douyin-hook-tester", "抖音前 3 秒钩子测试", "批量生成 hook 候选 + 数据回测", "社媒内容", "skill", "公开 curate", False),
    ("amzn-customer-service", "客服话术 Agent", "Amazon 站内信 + Buyer Message 标准应答", "客服", "agent", "公开 curate", False),
    ("inventory-forecast", "库存预测 Skill", "基于销售季节性的备货量推荐", "仓储与履约", "skill", "公开 curate", False),
    ("off-amazon-traffic", "站外引流计划生成", "Reddit / TikTok / IG 流量计划自动出方案", "站外引流", "skill", "自研", False),
    ("compliance-checklist", "合规自查清单", "Listing / 广告 / 数据采集的合规风险预检", "合规与风控", "skill", "公开 curate", False),
]


def sync_skills():
    print("\n=== Seeding skills ===")
    records = []
    for slug, name_zh, one_liner, cat, dt, src, feat in SKILLS_SEED:
        records.append({
            "slug": slug,
            "name_zh": name_zh,
            "one_liner_zh": one_liner,
            "category": cat,
            "delivery_type": dt,
            "source": src,
            "requires_community": True,
            "is_featured": feat,
            "status": "published",
        })
    batch_create(TABLE_SKILLS, records)


def main():
    sync_pages_map()
    sync_insights_douyin()
    sync_insights_xhs()
    sync_skills()
    print("\n✅ All sync done.")
    print(f"   Bitable: https://ycnm1prsz3tg.feishu.cn/base/{APP_TOKEN}")


if __name__ == "__main__":
    main()
