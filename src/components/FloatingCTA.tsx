"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "yibi-cta-collapsed";
const MOBILE_MQ = "(max-width: 640px)";

/**
 * Global event to open the community modal from anywhere (e.g. /community page).
 *   window.dispatchEvent(new CustomEvent("yibi:community-open"));
 */
const OPEN_EVENT = "yibi:community-open";

type Mode = "bar" | "tab" | "modal";

export default function FloatingCTA({ qrSvg }: { qrSvg: string }) {
  const [mode, setMode] = useState<Mode>("bar");
  const [mounted, setMounted] = useState(false);

  // Restore collapsed-tab preference from sessionStorage on mount;
  // on mobile default to "tab" so the wide bar never covers ICP/footer/content.
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const isMobile = window.matchMedia(MOBILE_MQ).matches;
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        setMode("tab");
      } else if (isMobile) {
        setMode("tab");
      }
    }
  }, []);

  // Re-evaluate on viewport changes (e.g. device rotation, resize).
  // Only auto-switch when the user hasn't actively chosen the bar
  // (i.e. they're still in the default state, not in modal).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(MOBILE_MQ);
    const onChange = (e: MediaQueryListEvent) => {
      setMode((current) => {
        if (current === "modal") return current;
        if (e.matches) return "tab";
        // Desktop: only auto-expand to bar if user never explicitly collapsed
        if (sessionStorage.getItem(STORAGE_KEY) === "1") return "tab";
        return "bar";
      });
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Listen for global open events (used by /community page)
  useEffect(() => {
    const handler = () => setMode("modal");
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  // Close modal on ESC
  useEffect(() => {
    if (mode !== "modal") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMode("bar");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  const openModal = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setMode("modal");
  }, []);

  const closeModal = useCallback(() => setMode("bar"), []);

  const collapseToTab = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setMode("tab");
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Trigger: BAR (default floating button) */}
      {mode === "bar" && (
        <button
          type="button"
          className="floating-cta"
          aria-label="加入跨境 Agent 实战社群"
          onClick={openModal}
        >
          <span className="fc-bar">
            <span className="fc-dot" />
            <span className="fc-text">加入跨境 Agent 实战社群</span>
            <span className="fc-arrow">↗</span>
          </span>
          <span
            role="button"
            tabIndex={0}
            className="fc-collapse"
            aria-label="收起到侧边"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              collapseToTab();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                collapseToTab();
              }
            }}
          >
            ›
          </span>
        </button>
      )}

      {/* Trigger: TAB (edge-flush vertical strip) */}
      {mode === "tab" && (
        <button
          type="button"
          className="floating-cta-tab"
          aria-label="展开实战社群入口"
          onClick={openModal}
        >
          <span className="fct-dot" />
          <span className="fct-text">社&nbsp;群</span>
          <span className="fct-arrow">‹</span>
        </button>
      )}

      {/* MODAL: centered editorial card (same visual language as /skills clipping) */}
      {mode === "modal" && (
        <CommunityModal qrSvg={qrSvg} onClose={closeModal} />
      )}
    </>
  );
}

function CommunityModal({
  qrSvg,
  onClose,
}: {
  qrSvg: string;
  onClose: () => void;
}) {
  return (
    <div
      className="commx-stage"
      role="dialog"
      aria-modal="true"
      aria-label="加入跨境 Agent 实战社群"
      onClick={onClose}
    >
      <article
        className="commx-card"
        onClick={(e) => e.stopPropagation()}
        aria-labelledby="commx-title"
      >
        <button
          type="button"
          className="commx-close"
          aria-label="关闭"
          onClick={onClose}
        >
          ×
        </button>

        <header className="commx-head">
          <div className="commx-meta">
            <span className="commx-record">社群 · COMMUNITY</span>
            <span className="commx-dot" aria-hidden />
            <span className="commx-sub">跨境 + AI 实战</span>
          </div>
          <h2 className="commx-title" id="commx-title">
            加入跨境 + AI
            <br />
            <em>实战社群</em>
          </h2>
          <p className="commx-lede">
            500+ 跨境 + AI 创业者已在群里。
          </p>
        </header>

        <section className="commx-section">
          <div className="commx-section-label">
            <span>为什么加入</span>
            <span className="commx-en">WHY JOIN</span>
          </div>
          <ul className="commx-bens">
            <li>198 个跨境 Agent Skill 完整知识库</li>
            <li>Mike 和 VA7 的工作手记 + 实战</li>
            <li>每周新 case + Skill 同步</li>
            <li>群内 1v1 提问 + 跨界协作</li>
          </ul>
        </section>

        <section className="commx-gate">
          <div className="commx-section-label">
            <span>三步入群</span>
            <span className="commx-en">3-STEP ACCESS</span>
          </div>
          <div className="commx-gate-body">
            <p className="commx-gate-text">
              <strong>扫码</strong> → 30 秒填问卷 → 自动收到入群邀请链接。
              <br />
              微信群 / 飞书群任选。
            </p>
            <div className="commx-gate-qr-wrap">
              <div
                className="commx-gate-qr"
                aria-label="飞书问卷二维码"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
              <div className="commx-gate-qr-label">扫码 · SCAN</div>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
