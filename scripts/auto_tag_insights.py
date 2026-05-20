#!/usr/bin/env python3
"""Auto-tag insights records using keyword rules.

Two tag dimensions:
- tags          (business modules) — leverages existing multi-select
- tags_form     (content form)     — added by setup_bitable_schema.py

Usage:
  python3 scripts/auto_tag_insights.py            # dry-run: print proposed tags
  python3 scripts/auto_tag_insights.py --apply    # write to Bitable

Keyword matching is case-insensitive on the combined title + summary text.
A record can receive multiple tags per dimension. Records that already have
manually-set tags are NOT overwritten in --apply mode (only empty fields are
filled, so user curation survives reruns).
"""
import json
import sys
import urllib.request

APP = "G1MIbWAKJaUxQjs506GcBPrznGf"
TBL = "tblZet5T2EpM638l"

# Keyword rules: tag_name → list of substrings (lowercased). Match if ANY hit.
TAGS_BUSINESS_RULES = {
    "OpenClaw":     ["openclaw", "open claw", "龙虾"],
    "Hermes":       ["hermes", "爱马仕"],
    "OPAL":         ["opal", "bridge", "mirror"],
    "Rufus":        ["rufus"],
    "AI Agent":     ["agent", "ai代理", "智能体", "数字员工", "harness"],
    "Listing":      ["listing", "标题", "详情页", "a+ 内容", "a+内容", "pdp", "卡位"],
    "广告":         ["广告", "ppc", "sp广告", "sb广告", "sd广告", "acos", "roas",
                     "竞价", "曝光份额", "sqp", "amc"],
    "选品":         ["选品", "商机探测", "需求", "类目", "竞品分析", "选款"],
    "Amazon":       ["亚马逊", "amazon", "卖家", "fba", "亚马逊后台"],
    "经验蒸馏":     ["经验蒸馏", "蒸馏"],
    "FDE 手记":     ["fde", "field engineer"],
    "内容工厂":     ["内容工厂", "短视频", "图文"],
    "AIGC":         ["aigc", "midjourney", "gpt image", "nano banana", "stable diffusion"],
    "创业":         ["创业", "founder", "bootstrap", "融资", "天使", "黑客松", "web3", "crypto"],
    "SOP工具":      ["sop", "工作流", "工具", "工具包", "工具分享", "模板", "教程", "实操"],
    "团队":         ["团队", "招人", "招聘", "实习生", "员工", "管理", "人才"],
    "行业观察":     ["行业", "动向", "变化", "趋势", "新规", "公布", "重磅", "数据洞察"],
    "方法论":       ["方法论", "认知", "底层逻辑"],
}

TAGS_FORM_RULES = {
    "实操教程":     ["实操", "教程", "步骤", "操作", "教你", "如何", "怎么做", "手把手"],
    "案例复盘":     ["复盘", "案例", "实战", "经验", "踩过的坑", "失败", "成功", "我们如何"],
    "思考随笔":     ["思考", "反思", "为什么", "我觉得", "感悟", "随笔", "心得", "我的"],
    "工具分享":     ["工具", "sop", "模板", "脚本", "插件", "工具包", "免费", "福利", "领取"],
    "数据洞察":     ["数据", "报告", "分析", "解读", "解析", "调研", "统计", "图表"],
    "行业新闻":     ["公告", "新规", "公布", "上线", "推出", "突发", "重磅", "消息", "动态",
                     "新增", "新增功能", "亚马逊宣布"],
    "政策解读":     ["政策", "合规", "规则", "条款", "处罚", "封号", "申诉", "违规", "受限"],
}


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
        print(f"  ! {method} {path} → HTTP {e.code}: {body[:200]}", file=sys.stderr)
        return None


def list_all_records():
    out = []
    page_token = None
    while True:
        params = {"page_size": 100}
        if page_token:
            params["page_token"] = page_token
        qs = "&".join(f"{k}={v}" for k, v in params.items())
        r = api("GET", f"/open-apis/bitable/v1/apps/{APP}/tables/{TBL}/records?{qs}")
        data = r["data"]
        out.extend(data["items"])
        if not data.get("has_more"):
            break
        page_token = data.get("page_token")
    return out


def extract_text(rec, key):
    v = rec["fields"].get(key)
    if v is None:
        return ""
    if isinstance(v, str):
        return v
    if isinstance(v, list):
        parts = []
        for seg in v:
            if isinstance(seg, dict) and "text" in seg:
                parts.append(seg["text"])
            else:
                parts.append(str(seg))
        return "".join(parts)
    return str(v)


def existing_tag_names(rec, field):
    v = rec["fields"].get(field)
    if not v:
        return []
    if isinstance(v, list):
        return [x if isinstance(x, str) else x.get("text") or x.get("name") for x in v]
    return [v]


def assign(text, rules):
    text_l = text.lower()
    matched = []
    for tag, keywords in rules.items():
        for kw in keywords:
            if kw.lower() in text_l:
                matched.append(tag)
                break
    return matched


def main():
    apply = "--apply" in sys.argv
    print(f"mode: {'APPLY' if apply else 'DRY-RUN (use --apply to write)'}")

    records = list_all_records()
    print(f"loaded {len(records)} records\n")

    updates = []
    stats_biz = {}
    stats_form = {}
    untagged_biz = 0
    untagged_form = 0
    sample_lines = []

    for rec in records:
        title = extract_text(rec, "title")
        summary = extract_text(rec, "summary")
        text = f"{title} {summary}"

        proposed_biz = assign(text, TAGS_BUSINESS_RULES)
        proposed_form = assign(text, TAGS_FORM_RULES)

        for t in proposed_biz:
            stats_biz[t] = stats_biz.get(t, 0) + 1
        for t in proposed_form:
            stats_form[t] = stats_form.get(t, 0) + 1
        if not proposed_biz:
            untagged_biz += 1
        if not proposed_form:
            untagged_form += 1

        # Preserve user-curated tags: only fill if empty
        existing_biz = existing_tag_names(rec, "tags")
        existing_form = existing_tag_names(rec, "tags_form")

        final_biz = existing_biz if existing_biz else proposed_biz
        final_form = existing_form if existing_form else proposed_form

        if (final_biz != existing_biz) or (final_form != existing_form):
            updates.append({
                "record_id": rec["record_id"],
                "fields": {
                    "tags": final_biz,
                    "tags_form": final_form,
                },
                "title": title,
                "proposed_biz": proposed_biz,
                "proposed_form": proposed_form,
            })

        if len(sample_lines) < 20:
            sample_lines.append(
                f"  {title[:50]:<55}  biz={proposed_biz or '∅'}  form={proposed_form or '∅'}"
            )

    print("=== SAMPLE (first 20) ===")
    for line in sample_lines:
        print(line)
    print()
    print(f"=== tags (business) distribution ===")
    for t, n in sorted(stats_biz.items(), key=lambda x: -x[1]):
        print(f"  {t:<15} {n}")
    print(f"  (untagged: {untagged_biz})")
    print()
    print(f"=== tags_form distribution ===")
    for t, n in sorted(stats_form.items(), key=lambda x: -x[1]):
        print(f"  {t:<15} {n}")
    print(f"  (untagged: {untagged_form})")
    print()
    print(f"=== {len(updates)} records would be updated ===")

    if not apply:
        print("\n(dry-run) — re-run with --apply to write.")
        return

    # Apply in batches of 100
    for i in range(0, len(updates), 100):
        batch = updates[i:i + 100]
        r = api("POST",
                f"/open-apis/bitable/v1/apps/{APP}/tables/{TBL}/records/batch_update",
                {"records": [{"record_id": u["record_id"], "fields": u["fields"]} for u in batch]})
        if r and r.get("code") == 0:
            print(f"  ✓ batch {i // 100 + 1}: updated {len(batch)} records")
        else:
            print(f"  ! batch {i // 100 + 1}: failed")
            print(f"  first record: {json.dumps(batch[0], ensure_ascii=False)[:400]}")
            break
    print(f"\n✅ applied {len(updates)} updates.")


if __name__ == "__main__":
    main()
