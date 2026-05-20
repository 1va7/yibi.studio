import type { InsightRow } from "@/lib/feishu";
import { cleanCoverUrl } from "@/lib/covers";

// ---------- Types ----------

export type InsightGroup = {
  key: string;
  primary: InsightRow;
  variants: InsightRow[];
  hasVideo: boolean;
  coverUrl?: string;
  allTags: string[];
  allTagsForm: string[];
  isPinned: boolean;
  topMetricLikes: number;
  topMetricViews: number;
  topMetricCollects: number;
};

const VIDEO_PLATFORMS = new Set([
  "抖音",
  "视频号",
  "小红书",
  "B 站",
  "B站",
  "Bilibili",
]);

// ---------- Video detection ----------

// A record is a video iff its `type` field explicitly says so.
// "图文" / "文章" / "笔记" are explicitly NOT videos even when they live on a
// video-first platform (XHS publishes both formats under the same brand).
export function isVideoEntry(r: InsightRow) {
  if (!r.type) return false;
  const t = r.type.trim();
  if (/图文|文章|笔记|note|article|graphic/i.test(t)) return false;
  if (/视频|直播|video|short|reel|clip/i.test(t)) return true;
  if (r.platform && VIDEO_PLATFORMS.has(r.platform) && !t) return true;
  return false;
}

// ---------- Title similarity ----------

function normTitle(t?: string): string {
  if (!t) return "";
  return t
    .toLowerCase()
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/#/g, "")
    .replace(/[\p{P}\p{S}\s]+/gu, "")
    .trim();
}

function bigrams(s: string): Set<string> {
  const out = new Set<string>();
  if (s.length < 2) return out;
  for (let i = 0; i < s.length - 1; i++) out.add(s.substring(i, i + 2));
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  a.forEach((x) => {
    if (b.has(x)) inter++;
  });
  return inter / (a.size + b.size - inter);
}

function longestCommonSubstr(a: string, b: string): number {
  const m = a.length,
    n = b.length;
  if (m === 0 || n === 0) return 0;
  let max = 0;
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    let prev = 0;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      if (a[i - 1] === b[j - 1]) {
        dp[j] = prev + 1;
        if (dp[j] > max) max = dp[j];
      } else {
        dp[j] = 0;
      }
      prev = tmp;
    }
  }
  return max;
}

// ---------- Cross-platform topic linking ----------

// Cluster records across platforms by title similarity + date proximity.
// Complete-link greedy: a record joins a cluster only when it's similar to
// ALL existing members. We never merge two records on the same platform.
export function autoLinkTopics<T extends InsightRow>(rows: T[]): T[] {
  const DAY = 24 * 3600 * 1000;
  const TIME_WINDOW = 7 * DAY;

  const normalized = rows.map((r) => normTitle(r.title));
  const bg = normalized.map((s) => bigrams(s));

  const isPairSimilar = (i: number, j: number): boolean => {
    if (rows[i].platform && rows[j].platform && rows[i].platform === rows[j].platform)
      return false;
    const ti = rows[i].date_published || 0;
    const tj = rows[j].date_published || 0;
    if (ti && tj && Math.abs(ti - tj) > TIME_WINDOW) return false;
    const sim = jaccard(bg[i], bg[j]);
    const lcs = longestCommonSubstr(normalized[i], normalized[j]);
    return sim >= 0.35 || (sim >= 0.2 && lcs >= 5);
  };

  const clusters: number[][] = [];
  for (let i = 0; i < rows.length; i++) {
    let placed = false;
    for (const c of clusters) {
      if (c.every((j) => isPairSimilar(i, j))) {
        c.push(i);
        placed = true;
        break;
      }
    }
    if (!placed) clusters.push([i]);
  }

  const idxToKey = new Map<number, string>();
  clusters.forEach((c) => {
    const key = `g-${rows[c[0]].slug}`;
    c.forEach((i) => idxToKey.set(i, key));
  });

  return rows.map((r, i) => {
    const auto = /^(xhs|dy|wx)-/.test(r.topic_group || "");
    if (auto || !r.topic_group) {
      return { ...r, topic_group: idxToKey.get(i)! };
    }
    return r;
  });
}

// ---------- Group construction ----------

export function buildGroups(rows: InsightRow[]): InsightGroup[] {
  const byKey = new Map<string, InsightRow[]>();
  rows.forEach((r) => {
    const key = r.topic_group?.trim() || r.slug;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push(r);
  });

  // Preserve view order: ranking by the earliest record index in `rows`.
  const indexOf = (r: InsightRow) => rows.findIndex((x) => x.slug === r.slug);

  return Array.from(byKey.entries())
    .map(([key, list]) => {
      const sortedByViewOrder = [...list].sort(
        (a, b) => indexOf(a) - indexOf(b),
      );
      const primary =
        sortedByViewOrder.find((x) => x.is_pinned) ||
        sortedByViewOrder.find((x) => x.is_primary) ||
        sortedByViewOrder[0];
      const variants = sortedByViewOrder.filter((x) => x.slug !== primary.slug);
      // hasVideo reflects only the primary record (that's the cover we render).
      const hasVideo = isVideoEntry(primary);
      const coverUrl = cleanCoverUrl(
        primary.cover_url || list.find((x) => x.cover_url)?.cover_url,
      );

      const tagSet = new Set<string>();
      const formSet = new Set<string>();
      list.forEach((r) => {
        (r.tags || []).forEach((t) => tagSet.add(t));
        (r.tags_form || []).forEach((t) => formSet.add(t));
      });

      const topMetricLikes = Math.max(0, ...list.map((r) => r.metric_likes || 0));
      const topMetricViews = Math.max(0, ...list.map((r) => r.metric_views || 0));
      const topMetricCollects = Math.max(0, ...list.map((r) => r.metric_collects || 0));

      return {
        key,
        primary,
        variants,
        hasVideo,
        coverUrl,
        allTags: Array.from(tagSet),
        allTagsForm: Array.from(formSet),
        isPinned: list.some((r) => r.is_pinned),
        topMetricLikes,
        topMetricViews,
        topMetricCollects,
      };
    })
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return indexOf(a.primary) - indexOf(b.primary);
    });
}
