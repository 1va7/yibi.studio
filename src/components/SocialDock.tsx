"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { SOCIAL_ENTRIES, type SocialKey } from "@/lib/social";

/**
 * SocialDock — VA7 / 异璧 social channels surface.
 *
 * Variants:
 *   - "nav"    : legacy compact row (top nav, no longer mounted)
 *   - "footer" : footer left-bottom row, popovers open UPWARD
 *   - "hero"   : vertical stack pinned to the right of a page-hero,
 *                editorial label "FOLLOW" above
 *
 * Behavior:
 *   - Entries WITH qrImage (公众号, 视频号) open a popover with the
 *     real scan image on hover/focus. Click is also handled for touch.
 *   - Entries WITHOUT qrImage (小红书, 抖音) are direct links — clicking
 *     opens the platform in a new tab. Hover still shows a one-line label.
 */

type Variant = "nav" | "footer" | "hero";

export default function SocialDock({
  variant = "nav",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const [active, setActive] = useState<SocialKey | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = useCallback(() => {
    clearClose();
    closeTimer.current = setTimeout(() => setActive(null), 160);
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    const onDocPointer = (e: PointerEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setActive(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDocPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDocPointer);
    };
  }, [active]);

  useEffect(() => () => clearClose(), []);

  const variantClass =
    variant === "hero"
      ? "social-dock is-hero"
      : variant === "footer"
        ? "social-dock is-footer"
        : "social-dock is-nav";

  return (
    <div
      className={`${variantClass} ${className}`.trim()}
      ref={containerRef}
      onMouseLeave={scheduleClose}
      data-variant={variant}
    >
      {variant === "hero" && (
        <span className="sd-hero-label" aria-hidden>
          FOLLOW
        </span>
      )}
      {SOCIAL_ENTRIES.map((it) => {
        const isActive = active === it.key;
        const hasQr = !!it.qrImage;
        const isOpen = isActive && hasQr;

        // Direct link case (no popover): xhs, douyin
        if (!hasQr) {
          return (
            <a
              key={it.key}
              className={`sd-slot sd-link sd-key-${it.key}`}
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${it.label} · ${it.cta}`}
              onMouseEnter={() => {
                clearClose();
                setActive(it.key);
              }}
              onMouseLeave={scheduleClose}
              onFocus={() => {
                clearClose();
                setActive(it.key);
              }}
            >
              <span className="sd-icon">{it.icon}</span>
              {isActive && (
                <span className="sd-tip" role="tooltip">
                  {it.label}
                </span>
              )}
            </a>
          );
        }

        // QR-popover case: wechat-mp, channels
        return (
          <div
            key={it.key}
            className={`sd-slot sd-key-${it.key} ${isOpen ? "is-active" : ""}`}
          >
            <button
              type="button"
              className="sd-icon"
              aria-label={`${it.label} · ${it.cta}`}
              aria-expanded={isOpen}
              onMouseEnter={() => {
                clearClose();
                setActive(it.key);
              }}
              onFocus={() => {
                clearClose();
                setActive(it.key);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActive((prev) => (prev === it.key ? null : it.key));
              }}
            >
              {it.icon}
            </button>

            {isOpen && (
              <div
                className="sd-popover"
                role="dialog"
                aria-label={it.cta}
                onMouseEnter={clearClose}
                onMouseLeave={scheduleClose}
              >
                <div className="sd-pop-head">
                  <span className="sd-pop-en">{it.enLabel}</span>
                  <span className="sd-pop-sep">/</span>
                  <span className="sd-pop-zh">{it.label}</span>
                </div>
                <div className="sd-qr">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.qrImage!}
                    alt={`${it.label} 二维码`}
                    loading="lazy"
                  />
                </div>
                <div className="sd-pop-foot">
                  <span className="sd-pop-cta">{it.cta}</span>
                  <span className="sd-pop-scan">SCAN</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
