#!/usr/bin/env python3
"""
Create the 3 tables (pages_map, insights, skills) in the yibi.studio CMS Bitable.
Run once. Idempotent enough — will error if tables already exist.
"""
import json
import sys
import urllib.request

APP_TOKEN = "G1MIbWAKJaUxQjs506GcBPrznGf"
DEFAULT_TABLE = "tblMt4q4medh7odh"  # initial table created with the bitable, we'll rename or replace

# Bitable field types reference:
# 1 = text, 2 = number, 3 = single-select, 4 = multi-select, 5 = date
# 7 = checkbox, 11 = user, 13 = phone, 15 = url, 17 = attachment

def get_token():
    import subprocess
    r = subprocess.run(
        ["lark-cli", "api", "POST", "/open-apis/auth/v3/app_access_token/internal",
         "--data", '{}'],
        capture_output=True, text=True
    )
    # Use lark-cli's own auth
    return None

def api(method, path, data=None, params=None):
    """Call Feishu API via lark-cli for user auth."""
    import subprocess
    cmd = ["lark-cli", "api", method, path]
    if data is not None:
        cmd.extend(["--data", json.dumps(data, ensure_ascii=False)])
    if params is not None:
        cmd.extend(["--params", json.dumps(params, ensure_ascii=False)])
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"ERROR running {' '.join(cmd)}", file=sys.stderr)
        print(r.stderr, file=sys.stderr)
        sys.exit(1)
    try:
        result = json.loads(r.stdout)
    except json.JSONDecodeError:
        print("Bad JSON:", r.stdout[:500])
        sys.exit(1)
    if result.get("code") != 0:
        print(f"API ERROR {result.get('code')}: {result.get('msg')}")
        print(json.dumps(result, ensure_ascii=False, indent=2)[:800])
        return None
    return result.get("data")

def create_table(name, fields):
    """Create a table with the given name and field definitions."""
    payload = {
        "table": {
            "name": name,
            "default_view_name": "全部",
            "fields": fields,
        }
    }
    return api("POST", f"/open-apis/bitable/v1/apps/{APP_TOKEN}/tables", data=payload)


def main():
    # === Table 1: pages_map ===
    pages_map_fields = [
        {"field_name": "slug", "type": 1},
        {"field_name": "category", "type": 3, "property": {"options": [
            {"name": "service"}, {"name": "solution"}, {"name": "product"},
            {"name": "labs"}, {"name": "course"}, {"name": "static"}
        ]}},
        {"field_name": "title_zh", "type": 1},
        {"field_name": "title_en", "type": 1},
        {"field_name": "summary_zh", "type": 1},
        {"field_name": "summary_en", "type": 1},
        {"field_name": "doc_id_zh", "type": 1},
        {"field_name": "doc_id_en", "type": 1},
        {"field_name": "cover", "type": 17},
        {"field_name": "order", "type": 2},
        {"field_name": "status", "type": 3, "property": {"options": [
            {"name": "draft"}, {"name": "published"}, {"name": "archived"}
        ]}},
        {"field_name": "last_synced_at", "type": 5, "property": {"date_formatter": "yyyy-MM-dd HH:mm"}},
    ]
    print("Creating pages_map…")
    r = create_table("pages_map", pages_map_fields)
    if r:
        print(f"  → table_id: {r.get('table_id')}")

    # === Table 2: insights ===
    insights_fields = [
        {"field_name": "slug", "type": 1},
        {"field_name": "topic_group", "type": 1},
        {"field_name": "is_primary", "type": 7},
        {"field_name": "title", "type": 1},
        {"field_name": "title_on_platform", "type": 1},
        {"field_name": "summary", "type": 1},
        {"field_name": "type", "type": 3, "property": {"options": [
            {"name": "文章"}, {"name": "视频"}, {"name": "直播"},
            {"name": "项目复盘"}, {"name": "方法论"}
        ]}},
        {"field_name": "platform", "type": 3, "property": {"options": [
            {"name": "异璧辑"}, {"name": "跨境电商策"}, {"name": "小红书"},
            {"name": "抖音"}, {"name": "视频号"}, {"name": "官网原创"},
            {"name": "YouTube"}, {"name": "TikTok"}, {"name": "X"}
        ]}},
        {"field_name": "platform_post_id", "type": 1},
        {"field_name": "platform_url", "type": 15},
        {"field_name": "cover_url", "type": 15},
        {"field_name": "author", "type": 3, "property": {"options": [
            {"name": "Mike"}, {"name": "VA7"}, {"name": "异璧团队"}
        ]}},
        {"field_name": "date_published", "type": 5, "property": {"date_formatter": "yyyy-MM-dd"}},
        {"field_name": "tags", "type": 4, "property": {"options": [
            {"name": "AI Agent"}, {"name": "经验蒸馏"}, {"name": "方法论"},
            {"name": "Amazon"}, {"name": "Rufus"}, {"name": "Listing"},
            {"name": "OPAL"}, {"name": "OpenClaw"}, {"name": "Hermes"},
            {"name": "FDE 手记"}, {"name": "内容工厂"}, {"name": "AIGC"},
            {"name": "广告"}, {"name": "选品"}
        ]}},
        {"field_name": "related_page_slugs", "type": 1},
        {"field_name": "lang", "type": 3, "property": {"options": [
            {"name": "zh"}, {"name": "en"}
        ]}},
        {"field_name": "is_homepage_hero", "type": 7},
        {"field_name": "is_featured", "type": 7},
        {"field_name": "read_minutes", "type": 2},
        {"field_name": "doc_id", "type": 1},
        {"field_name": "metric_views", "type": 2},
        {"field_name": "metric_likes", "type": 2},
        {"field_name": "metric_comments", "type": 2},
        {"field_name": "metric_shares", "type": 2},
        {"field_name": "metric_collects", "type": 2},
        {"field_name": "metric_synced_at", "type": 5, "property": {"date_formatter": "yyyy-MM-dd HH:mm"}},
        {"field_name": "status", "type": 3, "property": {"options": [
            {"name": "draft"}, {"name": "published"}, {"name": "archived"}
        ]}},
        {"field_name": "notes", "type": 1},
    ]
    print("Creating insights…")
    r = create_table("insights", insights_fields)
    if r:
        print(f"  → table_id: {r.get('table_id')}")

    # === Table 3: skills ===
    skills_fields = [
        {"field_name": "slug", "type": 1},
        {"field_name": "name_zh", "type": 1},
        {"field_name": "name_en", "type": 1},
        {"field_name": "one_liner_zh", "type": 1},
        {"field_name": "one_liner_en", "type": 1},
        {"field_name": "category", "type": 3, "property": {"options": [
            {"name": "选品"}, {"name": "Listing"}, {"name": "广告"},
            {"name": "关键词"}, {"name": "评论与口碑"}, {"name": "客服"},
            {"name": "仓储与履约"}, {"name": "站外引流"}, {"name": "社媒内容"},
            {"name": "数据复盘"}, {"name": "合规与风控"}
        ]}},
        {"field_name": "delivery_type", "type": 3, "property": {"options": [
            {"name": "skill"}, {"name": "agent"}, {"name": "harness"}, {"name": "plugin"}
        ]}},
        {"field_name": "output", "type": 1},
        {"field_name": "estimated_time", "type": 1},
        {"field_name": "source", "type": 3, "property": {"options": [
            {"name": "自研"}, {"name": "公开 curate"}
        ]}},
        {"field_name": "source_url", "type": 15},
        {"field_name": "full_doc_id", "type": 1},
        {"field_name": "requires_community", "type": 7},
        {"field_name": "tags", "type": 4, "property": {"options": [
            {"name": "Amazon"}, {"name": "复盘"}, {"name": "广告"},
            {"name": "选品"}, {"name": "Listing"}, {"name": "内容"}
        ]}},
        {"field_name": "is_featured", "type": 7},
        {"field_name": "updated_at", "type": 5, "property": {"date_formatter": "yyyy-MM-dd HH:mm"}},
        {"field_name": "status", "type": 3, "property": {"options": [
            {"name": "draft"}, {"name": "published"}, {"name": "archived"}
        ]}},
    ]
    print("Creating skills…")
    r = create_table("skills", skills_fields)
    if r:
        print(f"  → table_id: {r.get('table_id')}")

    # Delete the initial empty default table
    print(f"Deleting default empty table {DEFAULT_TABLE}…")
    api("DELETE", f"/open-apis/bitable/v1/apps/{APP_TOKEN}/tables/{DEFAULT_TABLE}")

    # List final tables
    print("\nFinal tables:")
    r = api("GET", f"/open-apis/bitable/v1/apps/{APP_TOKEN}/tables")
    if r:
        for t in r.get("items", []):
            print(f"  {t['name']:20s} → {t['table_id']}")


if __name__ == "__main__":
    main()
