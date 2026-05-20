"use client";

import { useMemo, useState } from "react";
import type { InsightRow } from "@/lib/feishu";

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

type SortKey = "default" | "likes" | "views" | "collects";

const PLATFORM_LABELS: Record<string, string> = {
  公众号: "公号",
};

function shortPlat(p?: string) {
  if (!p) return "—";
  return PLATFORM_LABELS[p] || p;
}

function fmtNum(n?: number): string {
  if (!n) return "";
  if (n >= 10000) return `${(n / 10000).toFixed(1).replace(/\.0$/, "")}w`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

function MetricRow({ row }: { row: InsightRow }) {
  const m: Array<[string, number | undefined]> = [
    ["👁", row.metric_views],
    ["👍", row.metric_likes],
    ["💬", row.metric_comments],
    ["★", row.metric_collects],
  ];
  const visible = m.filter(([, n]) => n && n > 0);
  if (visible.length === 0) return null;
  return (
    <div className="ig-metrics">
      {visible.map(([icon, n]) => (
        <span key={icon} className="ig-metric">
          <em>{icon}</em>
          {fmtNum(n)}
        </span>
      ))}
    </div>
  );
}

function PlatformChips({
  group,
  asLinks = true,
}: {
  group: InsightGroup;
  asLinks?: boolean;
}) {
  const all = [group.primary, ...group.variants].filter(
    (r) => r.platform && r.platform_url,
  );
  if (all.length === 0) return null;
  return (
    <div className="ig-plats">
      {all.map((r, i) => {
        const isPrimary = i === 0;
        const cls = `ig-plat ${isPrimary ? "is-primary" : ""}`;
        const label = shortPlat(r.platform);
        return asLinks ? (
          <a
            key={`${r.slug}-${r.platform}`}
            href={r.platform_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={cls}
            onClick={(e) => e.stopPropagation()}
          >
            {label}
          </a>
        ) : (
          <span key={`${r.slug}-${r.platform}`} className={cls}>
            {label}
          </span>
        );
      })}
    </div>
  );
}

function GroupCard({ group }: { group: InsightGroup }) {
  const r = group.primary;
  return (
    <article className="ig-card">
      <a
        href={r.platform_url || "#"}
        target={r.platform_url ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="ig-card-link"
      >
        {group.coverUrl && (
          <div className={`ig-cover ${group.hasVideo ? "is-video" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={group.coverUrl}
              alt={r.title || ""}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            {group.hasVideo && (
              <span className="ig-play" aria-hidden>
                ▶
              </span>
            )}
            {group.isPinned && (
              <span className="ig-pin" aria-hidden>
                ★ PIN
              </span>
            )}
          </div>
        )}
        <div className="ig-body">
          <div className="ig-meta">
            <span className="ig-type">{r.type || "—"}</span>
            <PlatformChips group={group} asLinks={false} />
          </div>
          <h3 className="ig-title">{r.title || "无标题"}</h3>
          {r.summary && <p className="ig-summary">{r.summary}</p>}
          <MetricRow row={r} />
          {(group.allTags.length > 0 || group.allTagsForm.length > 0) && (
            <div className="ig-tags">
              {group.allTags.slice(0, 3).map((t) => (
                <span key={t} className="ig-tag is-biz">{t}</span>
              ))}
              {group.allTagsForm.slice(0, 2).map((t) => (
                <span key={t} className="ig-tag is-form">{t}</span>
              ))}
            </div>
          )}
        </div>
      </a>
    </article>
  );
}

export default function InsightsExplorer({
  groups,
  allBizTags,
  allFormTags,
}: {
  groups: InsightGroup[];
  allBizTags: string[];
  allFormTags: string[];
}) {
  const [search, setSearch] = useState("");
  const [activePlats, setActivePlats] = useState<string[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("default");

  const allPlats = useMemo(() => {
    const set = new Set<string>();
    groups.forEach((g) => {
      [g.primary, ...g.variants].forEach((r) => {
        if (r.platform) set.add(r.platform);
      });
    });
    return Array.from(set);
  }, [groups]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return groups.filter((g) => {
      if (activePlats.length > 0) {
        const groupPlats = [g.primary, ...g.variants].map((r) => r.platform);
        if (!activePlats.some((p) => groupPlats.includes(p))) return false;
      }
      if (activeTags.length > 0) {
        const allTags = [...g.allTags, ...g.allTagsForm];
        if (!activeTags.some((t) => allTags.includes(t))) return false;
      }
      if (q) {
        const text = [
          g.primary.title,
          g.primary.summary,
          ...g.variants.map((v) => v.title),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [groups, search, activePlats, activeTags]);

  const sorted = useMemo(() => {
    if (sort === "default") return filtered;
    return [...filtered].sort((a, b) => {
      // Pinned always on top regardless of sort
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      switch (sort) {
        case "likes":
          return b.topMetricLikes - a.topMetricLikes;
        case "views":
          return b.topMetricViews - a.topMetricViews;
        case "collects":
          return b.topMetricCollects - a.topMetricCollects;
      }
      return 0;
    });
  }, [filtered, sort]);

  const pinned = sorted.filter((g) => g.isPinned);
  const rest = sorted.filter((g) => !g.isPinned);

  const togglePlat = (p: string) =>
    setActivePlats((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  const toggleTag = (t: string) =>
    setActiveTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  const clearAll = () => {
    setSearch("");
    setActivePlats([]);
    setActiveTags([]);
    setSort("default");
  };

  const hasFilter =
    !!search || activePlats.length > 0 || activeTags.length > 0 || sort !== "default";

  return (
    <>
      <div className="ie-controls">
        {/* Search hidden for now — uncomment when re-enabling
        <div className="ie-search-row">
          <label className="ie-search-label">检索</label>
          <input
            type="search"
            className="ie-search"
            placeholder="按标题、摘要、关键词…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="搜索"
          />
        </div>
        */}

        <div className="ie-chip-row">
          <span className="ie-chip-label">平台</span>
          <button
            className={`ie-chip ${activePlats.length === 0 ? "is-on" : ""}`}
            onClick={() => setActivePlats([])}
          >
            全部
          </button>
          {allPlats.map((p) => (
            <button
              key={p}
              className={`ie-chip ${activePlats.includes(p) ? "is-on" : ""}`}
              onClick={() => togglePlat(p)}
            >
              {shortPlat(p)}
            </button>
          ))}
        </div>

        {allBizTags.length > 0 && (
          <div className="ie-chip-row">
            <span className="ie-chip-label">主题</span>
            {allBizTags.map((t) => (
              <button
                key={t}
                className={`ie-chip is-biz ${activeTags.includes(t) ? "is-on" : ""}`}
                onClick={() => toggleTag(t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {allFormTags.length > 0 && (
          <div className="ie-chip-row">
            <span className="ie-chip-label">形态</span>
            {allFormTags.map((t) => (
              <button
                key={t}
                className={`ie-chip is-form ${activeTags.includes(t) ? "is-on" : ""}`}
                onClick={() => toggleTag(t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <div className="ie-chip-row ie-sort-row">
          <span className="ie-chip-label">排序</span>
          {(
            [
              ["default", "视图默认"],
              ["likes", "最多点赞"],
              ["views", "最多阅读"],
              ["collects", "最多收藏"],
            ] as Array<[SortKey, string]>
          ).map(([k, label]) => (
            <button
              key={k}
              className={`ie-chip ${sort === k ? "is-on" : ""}`}
              onClick={() => setSort(k)}
            >
              {label}
            </button>
          ))}
          {hasFilter && (
            <>
              <span className="ie-spacer" aria-hidden />
              <button className="ie-clear" onClick={clearAll}>
                清除筛选 ×
              </button>
              <span className="ie-status-inline">
                {sorted.length} <em>of {groups.length}</em>
              </span>
            </>
          )}
        </div>
      </div>

      {pinned.length > 0 && sort === "default" && !hasFilter && (
        <section className="ie-section">
          <header className="ie-section-head">
            <span className="ie-section-num">★</span>
            <h2 className="ie-section-name">置顶</h2>
            <span className="ie-section-rule" aria-hidden />
            <span className="ie-section-count">
              {pinned.length} <em>条</em>
            </span>
          </header>
          <div className="ie-grid">
            {pinned.map((g) => (
              <GroupCard key={g.key} group={g} />
            ))}
          </div>
        </section>
      )}

      <section className="ie-section">
        {pinned.length > 0 && sort === "default" && !hasFilter && (
          <header className="ie-section-head">
            <span className="ie-section-num">№</span>
            <h2 className="ie-section-name">归档</h2>
            <span className="ie-section-rule" aria-hidden />
            <span className="ie-section-count">
              {rest.length} <em>条</em>
            </span>
          </header>
        )}
        {sorted.length === 0 ? (
          <div className="ie-empty">
            <div className="ie-empty-mono">∅ NO MATCHES</div>
            <p>没找到符合条件的内容。</p>
            <button className="ie-clear" onClick={clearAll}>
              清除筛选 →
            </button>
          </div>
        ) : (
          <div className="ie-grid">
            {(hasFilter || sort !== "default" ? sorted : rest).map((g) => (
              <GroupCard key={g.key} group={g} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
