"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import type { SkillRow } from "@/lib/feishu";

const UNLOCK_KEY = "yibi-skills-unlocked";

function natComparePrefix(a: string, b: string) {
  const na = parseInt(a.match(/^(\d+)/)?.[1] || "999");
  const nb = parseInt(b.match(/^(\d+)/)?.[1] || "999");
  if (na !== nb) return na - nb;
  return a.localeCompare(b);
}

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function cleanCatName(c: string) {
  return c.replace(/^\d+\.\s*/, "");
}

export default function SkillsBrowser({
  skills,
  formUrl,
  formQrSvg,
}: {
  skills: SkillRow[];
  formUrl: string;
  formQrSvg: string;
}) {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [activePlat, setActivePlat] = useState<string | null>(null);
  const [selected, setSelected] = useState<SkillRow | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  // load unlock flag
  useEffect(() => {
    if (typeof window === "undefined") return;
    setUnlocked(localStorage.getItem(UNLOCK_KEY) === "1");
  }, []);

  // body class + ESC handling
  useEffect(() => {
    if (!selected) {
      document.body.classList.remove("skill-modal-open");
      return;
    }
    document.body.classList.add("skill-modal-open");
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", h);
    return () => {
      window.removeEventListener("keydown", h);
      document.body.classList.remove("skill-modal-open");
    };
  }, [selected]);

  // keyboard shortcut: "/" focuses search
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "/" && !selected && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [selected]);

  const allCats = useMemo(() => {
    const set = new Set<string>();
    skills.forEach((s) => s.category_l1 && set.add(s.category_l1));
    return Array.from(set).sort(natComparePrefix);
  }, [skills]);

  const catCounts = useMemo(() => {
    const m: Record<string, number> = {};
    skills.forEach((s) => {
      if (!s.category_l1) return;
      m[s.category_l1] = (m[s.category_l1] || 0) + 1;
    });
    return m;
  }, [skills]);

  const allPlats = useMemo(() => {
    const m = new Map<string, number>();
    skills.forEach((s) =>
      (s.platforms || []).forEach((p) => m.set(p, (m.get(p) || 0) + 1)),
    );
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [skills]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return skills.filter((s) => {
      if (activeCat && s.category_l1 !== activeCat) return false;
      if (activePlat && !(s.platforms || []).includes(activePlat)) return false;
      if (q) {
        const hay = `${s.name || ""} ${s.description || ""} ${s.recommendation || ""} ${s.category_l1 || ""} ${s.category_l2 || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [skills, search, activeCat, activePlat]);

  const grouped = useMemo(() => {
    const m: Record<string, SkillRow[]> = {};
    filtered.forEach((s) => {
      const c = s.category_l1 || "其他";
      if (!m[c]) m[c] = [];
      m[c].push(s);
    });
    return Object.keys(m)
      .sort(natComparePrefix)
      .map((cat) => ({ cat, items: m[cat] }));
  }, [filtered]);

  const hasFilter = !!(activeCat || activePlat || search);

  function clearAll() {
    setSearch("");
    setActiveCat(null);
    setActivePlat(null);
  }

  function markUnlocked() {
    if (typeof window === "undefined") return;
    localStorage.setItem(UNLOCK_KEY, "1");
    setUnlocked(true);
  }

  // Determine record number for clipping
  const selectedNum = useMemo(() => {
    if (!selected) return null;
    const i = skills.findIndex((s) => (s.id || s.name) === (selected.id || selected.name));
    return i >= 0 ? i + 1 : null;
  }, [selected, skills]);

  return (
    <>
      <div className="archive-grid">
        {/* LEFT INDEX RAIL */}
        <aside className="archive-rail">
          <div className="ar-search-wrap">
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="按名称、平台、关键词…"
              className="ar-search"
              aria-label="搜索 skills"
            />
            <span className="ar-search-hint" aria-hidden>
              {search ? "" : "/"}
            </span>
          </div>

          <nav className="ar-section">
            <div className="ar-label">
              <span>职能</span>
              <span className="ar-label-en">BY DISCIPLINE</span>
            </div>
            <ul className="ar-cat-list">
              <li>
                <button
                  className={`ar-cat ${!activeCat ? "is-on" : ""}`}
                  onClick={() => setActiveCat(null)}
                >
                  <span className="arc-num">—</span>
                  <span className="arc-name">全部</span>
                  <span className="arc-count">{skills.length}</span>
                </button>
              </li>
              {allCats.map((c, i) => {
                const isOn = activeCat === c;
                return (
                  <li key={c}>
                    <button
                      className={`ar-cat ${isOn ? "is-on" : ""}`}
                      onClick={() => setActiveCat(isOn ? null : c)}
                    >
                      <span className="arc-num">{pad2(i + 1)}</span>
                      <span className="arc-name">{cleanCatName(c)}</span>
                      <span className="arc-count">{catCounts[c] || 0}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <nav className="ar-section">
            <div className="ar-label">
              <span>平台</span>
              <span className="ar-label-en">BY PLATFORM</span>
            </div>
            <div className="ar-plat-list">
              <button
                className={`ar-plat ${!activePlat ? "is-on" : ""}`}
                onClick={() => setActivePlat(null)}
              >
                ALL
              </button>
              {allPlats.map(([p, n]) => (
                <button
                  key={p}
                  className={`ar-plat ${activePlat === p ? "is-on" : ""}`}
                  onClick={() => setActivePlat(activePlat === p ? null : p)}
                  title={`${p} · ${n}`}
                >
                  <span>{p}</span>
                  <em>{n}</em>
                </button>
              ))}
            </div>
          </nav>

          {hasFilter && (
            <div className="ar-status">
              <span className="ar-status-label">FILTERED</span>
              <span className="ar-status-count">
                {filtered.length} <em>of {skills.length}</em>
              </span>
              <button className="ar-status-clear" onClick={clearAll}>
                清除筛选 ×
              </button>
            </div>
          )}
        </aside>

        {/* CONTENT STACK */}
        <main className="archive-stack">
          {filtered.length === 0 ? (
            <div className="archive-empty">
              <div className="ae-mono">∅ NO MATCHES</div>
              <p>没找到对应的 Skill。</p>
              <button className="ar-status-clear" onClick={clearAll}>
                清除筛选 →
              </button>
            </div>
          ) : (
            grouped.map(({ cat, items }) => {
              const catIdx = allCats.indexOf(cat);
              return (
                <section key={cat} className="archive-cat">
                  <header className="ach-head">
                    <span className="ach-num">{pad2(catIdx + 1)}</span>
                    <h2 className="ach-name">{cleanCatName(cat)}</h2>
                    <span className="ach-rule" aria-hidden />
                    <span className="ach-count">
                      {items.length} <em>项</em>
                    </span>
                  </header>
                  <div className="archive-cards">
                    {items.map((s, idx) => {
                      const globalIdx = skills.findIndex((x) => (x.id || x.name) === (s.id || s.name));
                      const num = globalIdx >= 0 ? pad2((globalIdx % 100) + 1) : pad2(idx + 1);
                      return (
                        <button
                          key={s.id || s.name}
                          className="archive-card"
                          onClick={() => setSelected(s)}
                        >
                          <div className="acd-mark">
                            <span className="acd-num">№ {num}</span>
                            {s.safety && (
                              <span className={`acd-safety s${s.safety.toLowerCase()}`}>
                                {s.safety}
                              </span>
                            )}
                          </div>
                          <h3 className="acd-title">{s.name}</h3>
                          <p className="acd-desc">{s.description || "—"}</p>
                          <div className="acd-foot">
                            <div className="acd-plats">
                              {(s.platforms || []).slice(0, 3).map((p) => (
                                <span key={p}>{p}</span>
                              ))}
                            </div>
                            {s.requires_api === "需要" && (
                              <span className="acd-api">+API</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })
          )}
        </main>
      </div>

      {/* CLIPPING — modal */}
      {selected && (
        <div className="clip-stage" role="dialog" onClick={() => setSelected(null)}>
          <article
            className="clip-card"
            onClick={(e) => e.stopPropagation()}
            aria-labelledby="clip-title"
          >
            <button
              className="clip-close"
              onClick={() => setSelected(null)}
              aria-label="关闭"
            >
              ×
            </button>

            <header className="clip-head">
              <div className="clip-meta">
                <span className="clip-record">
                  RECORD № {selectedNum ? pad2(selectedNum) : "—"} / {skills.length}
                </span>
                <span className="clip-dot" aria-hidden />
                <span className="clip-cat">
                  {cleanCatName(selected.category_l1 || "Skill")}
                  {selected.category_l2 && (
                    <span className="clip-sub"> · {selected.category_l2}</span>
                  )}
                </span>
              </div>
              <h2 className="clip-title" id="clip-title">
                {selected.name}
              </h2>
              <div className="clip-attrs">
                {(selected.platforms || []).map((p) => (
                  <span key={p} className="clip-attr">{p}</span>
                ))}
                {selected.safety && (
                  <span className={`clip-attr clip-safety s${selected.safety.toLowerCase()}`}>
                    安全等级 {selected.safety}
                  </span>
                )}
                {selected.requires_api && (
                  <span className="clip-attr">
                    {selected.requires_api === "需要" ? "需要 API" : "无需 API"}
                  </span>
                )}
              </div>
            </header>

            <div className="clip-body">
              <section className="clip-section">
                <div className="clip-section-label">
                  <span>概要</span>
                  <span className="cs-en">BRIEF</span>
                </div>
                <p>{selected.description || "—"}</p>
              </section>

              <section className="clip-section">
                <div className="clip-section-label">
                  <span>适用</span>
                  <span className="cs-en">CONTEXT</span>
                </div>
                <p>
                  {selected.platforms && selected.platforms.length > 0 && (
                    <>面向 <strong>{selected.platforms.join(" / ")}</strong>。</>
                  )}
                  {selected.category_l1 && (
                    <> 落在 <strong>{cleanCatName(selected.category_l1)}</strong>
                      {selected.category_l2 && <> · {selected.category_l2}</>}
                      &nbsp;场景。
                    </>
                  )}
                </p>
              </section>

              {selected.recommendation && (
                <section className="clip-section">
                  <div className="clip-section-label">
                    <span>推荐</span>
                    <span className="cs-en">NOTE</span>
                  </div>
                  <p>{selected.recommendation}</p>
                </section>
              )}

              <section className="clip-section clip-gate">
                <div className="clip-section-label">
                  <span>{unlocked ? "访问" : "访问受限"}</span>
                  <span className="cs-en">{unlocked ? "ACCESS" : "RESERVED"}</span>
                </div>

                {unlocked ? (
                  <div className="clip-unlocked">
                    {selected.url ? (
                      <a
                        href={selected.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="clip-cta"
                      >
                        打开 Skill 详情 / 下载 <span className="clip-cta-arr">→</span>
                      </a>
                    ) : (
                      <p className="clip-no-url">暂无直接链接，请加入社群联系工作人员。</p>
                    )}
                    {selected.install && (
                      <div className="clip-install">
                        <span className="ci-label">INSTALL</span>
                        <span>{selected.install}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="clip-gate-body">
                    <p className="clip-gate-text">
                      下载链接仅向<strong>已加入社群</strong>的读者开放。30 秒填完问卷，即可解锁全部 {skills.length} 条记录。
                    </p>
                    <div className="clip-gate-actions">
                      <a
                        href={formUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="clip-cta"
                        onClick={markUnlocked}
                      >
                        打开问卷 <span className="clip-cta-arr">→</span>
                      </a>
                      <div className="clip-gate-qr-wrap">
                        <div
                          className="clip-gate-qr"
                          dangerouslySetInnerHTML={{ __html: formQrSvg }}
                        />
                        <span className="clip-gate-qr-label">SCAN</span>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </article>
        </div>
      )}
    </>
  );
}
