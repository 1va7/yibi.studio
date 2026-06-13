/**
 * Feishu Bitable client for yibi.studio
 *
 * Uses an app-level access token (cached in-memory).
 * Server-side only — never imported by client components.
 */

const APP_ID = process.env.FEISHU_APP_ID || "cli_a901f2cd01b8dbd3";
const APP_SECRET =
  process.env.FEISHU_APP_SECRET || "pnCjjX4BYfT53qi4u4vSJbE3ar8yhlCr";

export const BITABLE = {
  app_token: "G1MIbWAKJaUxQjs506GcBPrznGf",
  tables: {
    pages_map: "tblbfaRogFtXQCV8",
    insights: "tblZet5T2EpM638l",
    skills: "tblwLOXxJpYubqQ6",
    analytics: "tblQ5CmnAWlIoQNf",
  },
};

let cachedToken: { token: string; expires: number } | null = null;

async function getTenantAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expires > Date.now()) return cachedToken.token;
  const r = await fetch(
    "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
      cache: "no-store",
    },
  );
  const j = await r.json();
  if (j.code !== 0)
    throw new Error(`feishu token failed: ${j.code} ${j.msg}`);
  cachedToken = { token: j.tenant_access_token, expires: Date.now() + 110 * 60 * 1000 };
  return cachedToken.token;
}

export async function feishuGet<T = unknown>(path: string, params?: Record<string, string | number>) {
  const token = await getTenantAccessToken();
  const qs = params
    ? "?" + Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&")
    : "";
  const r = await fetch(`https://open.feishu.cn${path}${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 30 }, // 30s — gives quick feedback on Bitable edits
  });
  const j = await r.json();
  if (j.code !== 0) {
    console.error(`feishu API ${path} failed: ${j.code} ${j.msg}`);
    return null;
  }
  return j.data as T;
}

// === Pages map ===
export type PageRow = {
  slug: string;
  category?: string;
  title_zh?: string;
  summary_zh?: string;
  doc_id_zh?: string;
  status?: string;
  order?: number;
};

// === Insights ===
export type InsightRow = {
  slug: string;
  topic_group?: string;
  is_primary?: boolean;
  is_pinned?: boolean;
  title?: string;
  title_on_platform?: string;
  summary?: string;
  type?: string;
  platform?: string;
  platform_url?: string;
  cover_url?: string;
  author?: string;
  date_published?: number;
  is_homepage_hero?: boolean;
  is_featured?: boolean;
  read_minutes?: number;
  metric_views?: number;
  metric_likes?: number;
  metric_comments?: number;
  metric_shares?: number;
  metric_collects?: number;
  tags?: string[];
  tags_form?: string[];
  status?: string;
};

function unwrapText(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) {
    return v.map((seg) => (typeof seg === "object" && seg !== null && "text" in seg ? (seg as { text: string }).text : String(seg))).join("");
  }
  if (typeof v === "object" && v !== null && "link" in v) return (v as { link: string }).link;
  return undefined;
}

function unwrapUrl(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (typeof v === "object" && v !== null && "link" in v)
    return (v as { link: string }).link;
  return undefined;
}

type BitableRecord = { record_id: string; fields: Record<string, unknown> };
type BitableListResponse = { items: BitableRecord[]; has_more: boolean; page_token?: string };

async function listAllRecords(
  tableId: string,
  opts: { view_id?: string } = {},
): Promise<BitableRecord[]> {
  const out: BitableRecord[] = [];
  let pageToken: string | undefined = undefined;
  do {
    const params: Record<string, string | number> = { page_size: 100 };
    if (opts.view_id) params.view_id = opts.view_id;
    if (pageToken) params.page_token = pageToken;

    const data: BitableListResponse | null = await feishuGet(
      `/open-apis/bitable/v1/apps/${BITABLE.app_token}/tables/${tableId}/records`,
      params,
    );
    if (!data) break;
    out.push(...data.items);
    pageToken = data.has_more ? data.page_token : undefined;
  } while (pageToken);
  return out;
}

function unwrapTags(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) {
    return v
      .map((seg) => {
        if (typeof seg === "string") return seg;
        if (typeof seg === "object" && seg !== null) {
          const o = seg as { text?: string; name?: string };
          return o.text || o.name || "";
        }
        return "";
      })
      .filter(Boolean);
  }
  if (typeof v === "string") return [v];
  return [];
}

export async function listInsights(): Promise<InsightRow[]> {
  const viewId = process.env.FEISHU_INSIGHTS_VIEW_ID;
  const items = await listAllRecords(BITABLE.tables.insights, { view_id: viewId });
  // When fetched via view_id, the API already applies the view's filter +
  // sort. Don't re-filter or re-sort here — respect the view configuration
  // so the user can adjust the page order from Bitable UI.
  return items.map((it) => {
    const f = it.fields;
    return {
      slug: unwrapText(f.slug) || "",
      topic_group: unwrapText(f.topic_group),
      is_primary: f.is_primary as boolean | undefined,
      is_pinned: f.is_pinned as boolean | undefined,
      title: unwrapText(f.title),
      title_on_platform: unwrapText(f.title_on_platform),
      summary: unwrapText(f.summary),
      type: f.type as string | undefined,
      platform: f.platform as string | undefined,
      platform_url: unwrapUrl(f.platform_url),
      cover_url: unwrapUrl(f.cover_url),
      author: f.author as string | undefined,
      date_published: f.date_published as number | undefined,
      is_homepage_hero: f.is_homepage_hero as boolean | undefined,
      is_featured: f.is_featured as boolean | undefined,
      read_minutes: f.read_minutes as number | undefined,
      metric_views: f.metric_views as number | undefined,
      metric_likes: f.metric_likes as number | undefined,
      metric_comments: f.metric_comments as number | undefined,
      metric_shares: f.metric_shares as number | undefined,
      metric_collects: f.metric_collects as number | undefined,
      tags: unwrapTags(f.tags),
      tags_form: unwrapTags(f.tags_form),
      status: f.status as string | undefined,
    };
  }).filter((r) => r.slug);
}

export type SkillRow = {
  id?: string;
  name?: string;
  category_l1?: string;
  category_l2?: string;
  description?: string;
  safety?: string;
  requires_api?: string;
  platforms?: string[];
  url?: string;
  source_platform?: string;
  source_type?: string;
  recommendation?: string;
  install?: string;
};

export async function listSkills(): Promise<SkillRow[]> {
  const items = await listAllRecords(BITABLE.tables.skills);
  return items
    .map((it) => {
      const f = it.fields;
      return {
        id: unwrapText(f.ID),
        name: unwrapText(f["Skill 名称"]),
        category_l1: f["一级分类"] as string | undefined,
        category_l2: unwrapText(f["二级分类"]),
        description: unwrapText(f["功能描述"]),
        safety: f["安全级别"] as string | undefined,
        requires_api: f["是否需要 API"] as string | undefined,
        platforms: (f["主要平台"] as string[]) || [],
        url: unwrapUrl(f["链接"]),
        source_platform: f["来源平台"] as string | undefined,
        source_type: f["数据来源"] as string | undefined,
        recommendation: unwrapText(f["推荐理由"]),
        install: unwrapText(f["安装说明"]),
      };
    })
    .filter((r) => r.name);
}

export async function listPages(): Promise<PageRow[]> {
  const items = await listAllRecords(BITABLE.tables.pages_map);
  return items
    .map((it) => ({
      slug: unwrapText(it.fields.slug) || "",
      category: it.fields.category as string | undefined,
      title_zh: unwrapText(it.fields.title_zh),
      summary_zh: unwrapText(it.fields.summary_zh),
      doc_id_zh: unwrapText(it.fields.doc_id_zh),
      status: it.fields.status as string | undefined,
      order: it.fields.order as number | undefined,
    }))
    .filter((r) => r.slug);
}
