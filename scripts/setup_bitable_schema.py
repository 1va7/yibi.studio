#!/usr/bin/env python3
"""Set up Bitable schema for the insights table:
- Add `is_pinned` checkbox field
- Extend `tags` multi-select with missing business modules
- Add `tags_form` multi-select for content-form taxonomy
- Create `site_main` view with default filter/sort

Idempotent: re-running won't duplicate fields or options.
"""
import json
import urllib.request
import sys

APP = "G1MIbWAKJaUxQjs506GcBPrznGf"
TBL = "tblZet5T2EpM638l"


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


def api(method, path, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(f"https://open.feishu.cn{path}", data=data, method=method, headers=H)
    try:
        return json.loads(urllib.request.urlopen(req).read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  ! {method} {path} → HTTP {e.code}", file=sys.stderr)
        print(f"  ! body: {body[:400]}", file=sys.stderr)
        return None


# ----- 1. Inspect current fields -----
fields_resp = api("GET", f"/open-apis/bitable/v1/apps/{APP}/tables/{TBL}/fields?page_size=100")
fields = {f["field_name"]: f for f in fields_resp["data"]["items"]}
print(f"[1] inspected {len(fields)} fields")


# ----- 2. Add is_pinned (checkbox = type 7) -----
if "is_pinned" in fields:
    print("[2] is_pinned: already exists, skip")
else:
    r = api("POST", f"/open-apis/bitable/v1/apps/{APP}/tables/{TBL}/fields",
            {"field_name": "is_pinned", "type": 7})
    print(f"[2] is_pinned: created, code={r.get('code') if r else 'ERR'}")


# ----- 3. Extend tags with missing business options -----
TAGS_NEW = ["创业", "SOP工具", "团队", "行业观察"]
tags_field = fields["tags"]
existing_names = {o["name"] for o in tags_field["property"]["options"]}
to_add = [n for n in TAGS_NEW if n not in existing_names]
if not to_add:
    print("[3] tags: all business options already present, skip")
else:
    new_options = tags_field["property"]["options"] + [
        {"name": n} for n in to_add
    ]
    r = api("PUT",
            f"/open-apis/bitable/v1/apps/{APP}/tables/{TBL}/fields/{tags_field['field_id']}",
            {
                "field_name": "tags",
                "type": 4,
                "property": {"options": new_options},
            })
    print(f"[3] tags: added {to_add}, code={r.get('code') if r else 'ERR'}")


# ----- 4. Create tags_form multi-select -----
TAGS_FORM = [
    "实操教程", "案例复盘", "思考随笔", "工具分享",
    "数据洞察", "行业新闻", "政策解读",
]
if "tags_form" in fields:
    print("[4] tags_form: already exists, skip")
else:
    r = api("POST", f"/open-apis/bitable/v1/apps/{APP}/tables/{TBL}/fields",
            {
                "field_name": "tags_form",
                "type": 4,
                "property": {"options": [{"name": n} for n in TAGS_FORM]},
            })
    print(f"[4] tags_form: created with {len(TAGS_FORM)} options, code={r.get('code') if r else 'ERR'}")


# ----- 5. Create site_main view -----
views_resp = api("GET", f"/open-apis/bitable/v1/apps/{APP}/tables/{TBL}/views?page_size=100")
views = {v["view_name"]: v for v in views_resp["data"]["items"]}
if "site_main" in views:
    print(f"[5] site_main view: already exists, view_id={views['site_main']['view_id']}")
else:
    r = api("POST", f"/open-apis/bitable/v1/apps/{APP}/tables/{TBL}/views",
            {"view_name": "site_main", "view_type": "grid"})
    if r and r.get("code") == 0:
        view_id = r["data"]["view"]["view_id"]
        print(f"[5] site_main view: created, view_id={view_id}")
    else:
        print(f"[5] site_main view: create failed {r}")

# Re-list to print final view_id for the env file
views_resp = api("GET", f"/open-apis/bitable/v1/apps/{APP}/tables/{TBL}/views?page_size=100")
for v in views_resp["data"]["items"]:
    if v["view_name"] == "site_main":
        print(f"\n[final] FEISHU_INSIGHTS_VIEW_ID={v['view_id']}")
        break

print("\n✅ schema setup done.")
print("Next: in Bitable UI open the `site_main` view and configure filter+sort:")
print("  Filter:   status = published  AND  cover_url is not empty")
print("  Sort:     is_pinned desc, date_published desc")
print("(API can't fully configure these in newer Bitable; UI is fastest.)")
