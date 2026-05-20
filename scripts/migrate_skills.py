#!/usr/bin/env python3
"""
1. Drop our existing skills table.
2. Recreate it with user's schema (from MRXcbHFOxabmWmssbayctB41nKe.tbltru6rFEoPIVrs).
3. Copy all 219 records over (with light field normalization).
"""
import urllib.request, json

CMS_APP = 'G1MIbWAKJaUxQjs506GcBPrznGf'
OUR_SKILLS_TBL = 'tbl3m2jlJ9Sig5zO'

SRC_APP = 'MRXcbHFOxabmWmssbayctB41nKe'
SRC_TBL = 'tbltru6rFEoPIVrs'


def get_token():
    data = json.dumps({'app_id': 'cli_a901f2cd01b8dbd3', 'app_secret': 'pnCjjX4BYfT53qi4u4vSJbE3ar8yhlCr'}).encode()
    req = urllib.request.Request('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', data=data, method='POST', headers={'Content-Type': 'application/json'})
    return json.loads(urllib.request.urlopen(req).read())['tenant_access_token']


T = get_token()
H_JSON = {'Authorization': f'Bearer {T}', 'Content-Type': 'application/json'}
H_GET = {'Authorization': f'Bearer {T}'}


def req(method, url, body=None):
    if body is not None:
        data = json.dumps(body).encode()
        r = urllib.request.Request(url, data=data, method=method, headers=H_JSON)
    else:
        r = urllib.request.Request(url, method=method, headers=H_GET)
    try:
        return json.loads(urllib.request.urlopen(r).read())
    except urllib.error.HTTPError as e:
        return {'error': e.read().decode()}


# 1. Drop old skills table
print('--- Dropping old skills table ---')
r = req('DELETE', f'https://open.feishu.cn/open-apis/bitable/v1/apps/{CMS_APP}/tables/{OUR_SKILLS_TBL}')
print('  ', r.get('msg', r))

# 2. Read source schema (fields)
print('\n--- Reading source schema ---')
r = req('GET', f'https://open.feishu.cn/open-apis/bitable/v1/apps/{SRC_APP}/tables/{SRC_TBL}/fields?page_size=100')
src_fields = r.get('data', {}).get('items', [])
print(f'  {len(src_fields)} fields')

# 3. Build destination schema — skip the auto-number ID field (recreated automatically)
dest_fields = []
for f in src_fields:
    name = f.get('field_name')
    typ = f.get('type')
    prop = f.get('property') or {}
    if typ == 1005:  # AutoNumber — skip
        continue
    # Single-select / Multi-select: include options
    if typ in (3, 4):
        opts = prop.get('options') or []
        dest_fields.append({'field_name': name, 'type': typ, 'property': {'options': [{'name': o.get('name')} for o in opts]}})
    elif typ == 5:  # date
        dest_fields.append({'field_name': name, 'type': typ, 'property': {'date_formatter': 'yyyy/MM/dd'}})
    else:
        dest_fields.append({'field_name': name, 'type': typ})

# 4. Create new skills table
print('\n--- Creating new skills table ---')
r = req('POST', f'https://open.feishu.cn/open-apis/bitable/v1/apps/{CMS_APP}/tables',
        {'table': {'name': 'skills', 'default_view_name': '全部', 'fields': dest_fields}})
new_tbl = r.get('data', {}).get('table_id')
print(f'  new table_id: {new_tbl}')
if not new_tbl:
    print('  ERROR:', r)
    raise SystemExit

# 5. Read ALL records from source
print('\n--- Reading source records ---')
all_recs = []
page_token = None
while True:
    qs = '?page_size=100'
    if page_token:
        qs += f'&page_token={page_token}'
    r = req('GET', f'https://open.feishu.cn/open-apis/bitable/v1/apps/{SRC_APP}/tables/{SRC_TBL}/records{qs}')
    items = r.get('data', {}).get('items', [])
    all_recs.extend(items)
    if not r.get('data', {}).get('has_more'):
        break
    page_token = r.get('data', {}).get('page_token')
print(f'  fetched {len(all_recs)} records')


def normalize(fields):
    """Convert source field values to formats accepted by destination."""
    out = {}
    for k, v in fields.items():
        if k == 'ID':  # skip auto-number
            continue
        if v is None:
            continue
        # text fields come as [{'text': '...', 'type': 'text'}] arrays
        if isinstance(v, list) and v and isinstance(v[0], dict) and 'text' in v[0] and 'type' in v[0]:
            text = ''.join(seg.get('text', '') for seg in v)
            out[k] = text
        elif isinstance(v, dict) and 'link' in v:
            # url field
            out[k] = {'link': v['link'], 'text': v.get('text', v['link'])[:80]}
        else:
            out[k] = v
    return out


# 6. Batch insert into new table
print('\n--- Inserting into new skills table ---')
inserted = 0
for i in range(0, len(all_recs), 100):
    chunk = all_recs[i:i + 100]
    payload = {'records': [{'fields': normalize(r['fields'])} for r in chunk]}
    rr = req('POST', f'https://open.feishu.cn/open-apis/bitable/v1/apps/{CMS_APP}/tables/{new_tbl}/records/batch_create', payload)
    if rr.get('code') != 0:
        print(f'  batch err: {rr.get("msg") or rr}')
        print(json.dumps(payload['records'][0], ensure_ascii=False, indent=2)[:600])
        break
    inserted += len(chunk)
    print(f'  inserted batch {i // 100 + 1} (cumul {inserted})')

print(f'\n✅ Migrated {inserted}/{len(all_recs)} skills.')
print(f'   New skills table: {new_tbl}')
print(f'   View in browser: https://ycnm1prsz3tg.feishu.cn/base/{CMS_APP}?table={new_tbl}')
