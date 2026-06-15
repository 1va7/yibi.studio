"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";

export type SocialKey = "wechat" | "xiaohongshu" | "douyin" | "channels";

export type SocialEntry = {
  key: SocialKey;
  label: string;
  enLabel: string;
  cta: string;
  href: string;
  qrImage?: string;
  icon: ReactElement;
};

export type SocialDockProps = {
  variant?: "nav" | "footer" | "hero";
  className?: string;
  entries?: SocialEntry[];
};

const svg = (children: ReactElement | ReactElement[]) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="currentColor"
    aria-hidden
  >
    {children}
  </svg>
);

const IconWeChat = svg(
  <path d="M8.69 4C4.6 4 1.27 6.79 1.27 10.23c0 1.98 1.1 3.74 2.82 4.89-.15.43-.55 1.49-.62 1.71-.09.27.1.27.21.2.07-.05 1.16-.79 1.74-1.18.49.1 1 .17 1.53.2-.1-.35-.16-.71-.16-1.08 0-3.07 2.97-5.56 6.64-5.56l.34.01C12.99 6.45 11 4 8.69 4M6.1 9.05a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8m4.6 0a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8m5.68.39c-3.51 0-6.36 2.36-6.36 5.27s2.85 5.27 6.36 5.27c.46 0 .91-.04 1.34-.12.5.33 1.45.96 1.51.99.09.06.24.06.17-.17-.06-.18-.4-1.07-.54-1.45 1.46-.98 2.42-2.47 2.42-4.12 0-2.91-2.85-5.27-6.36-5.27Zm3.09 6.12a.74.74 0 1 1 0-1.48.74.74 0 0 1 0 1.48Zm-3.78 0a.74.74 0 1 1 0-1.48.74.74 0 0 1 0 1.48Z" />,
);

const IconXiaohongshu = svg([
  <rect
    key="card"
    x="3"
    y="3"
    width="18"
    height="18"
    rx="2"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  />,
  <path
    key="mark"
    d="M12 8v9M9 10.5c.8 0 1.4-.4 1.8-1M15 10.5c-.8 0-1.4-.4-1.8-1"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    fill="none"
  />,
]);

const IconDouyin = svg(
  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1.84-.07Z" />,
);

const IconChannels = svg([
  <circle
    key="circle"
    cx="12"
    cy="12"
    r="9.2"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  />,
  <path key="play" d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" />,
]);

export const DEFAULT_SOCIAL_ENTRIES: SocialEntry[] = [
  {
    key: "wechat",
    label: "公众号",
    enLabel: "WeChat MP",
    cta: "扫码关注 · 跨境电商策",
    href: "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzkzMDQzODk1NQ==",
    qrImage: "/assets/team/qr-wechat-mp.jpg",
    icon: IconWeChat,
  },
  {
    key: "xiaohongshu",
    label: "小红书",
    enLabel: "Xiaohongshu",
    cta: "前往 · VA7 小红书",
    href: "https://www.xiaohongshu.com/user/profile/5bfd693851783a4917f40d5a",
    icon: IconXiaohongshu,
  },
  {
    key: "douyin",
    label: "抖音",
    enLabel: "Douyin",
    cta: "前往 · VA7 抖音",
    href: "https://v.douyin.com/Xts7kZ3qvCI/",
    icon: IconDouyin,
  },
  {
    key: "channels",
    label: "视频号",
    enLabel: "WeChat Channels",
    cta: "扫码关注 · VA7-AI 创业版",
    href: "https://channels.weixin.qq.com/",
    qrImage: "/assets/team/qr-wechat-channels.png",
    icon: IconChannels,
  },
];

export default function SocialDock({
  variant = "nav",
  className = "",
  entries = DEFAULT_SOCIAL_ENTRIES,
}: SocialDockProps) {
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
      if (!containerRef.current.contains(e.target as Node)) setActive(null);
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
      {entries.map((entry) => {
        const isActive = active === entry.key;
        const hasQr = !!entry.qrImage;
        const isOpen = isActive && hasQr;

        if (!hasQr) {
          return (
            <a
              key={entry.key}
              className={`sd-slot sd-link sd-key-${entry.key}`}
              href={entry.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${entry.label} · ${entry.cta}`}
              onMouseEnter={() => {
                clearClose();
                setActive(entry.key);
              }}
              onMouseLeave={scheduleClose}
              onFocus={() => {
                clearClose();
                setActive(entry.key);
              }}
            >
              <span className="sd-icon">{entry.icon}</span>
              {isActive && (
                <span className="sd-tip" role="tooltip">
                  {entry.label}
                </span>
              )}
            </a>
          );
        }

        return (
          <div
            key={entry.key}
            className={`sd-slot sd-key-${entry.key} ${isOpen ? "is-active" : ""}`}
          >
            <button
              type="button"
              className="sd-icon"
              aria-label={`${entry.label} · ${entry.cta}`}
              aria-expanded={isOpen}
              onMouseEnter={() => {
                clearClose();
                setActive(entry.key);
              }}
              onFocus={() => {
                clearClose();
                setActive(entry.key);
              }}
              onClick={(event) => {
                event.stopPropagation();
                setActive((prev) => (prev === entry.key ? null : entry.key));
              }}
            >
              {entry.icon}
            </button>

            {isOpen && (
              <div
                className="sd-popover"
                role="dialog"
                aria-label={entry.cta}
                onMouseEnter={clearClose}
                onMouseLeave={scheduleClose}
              >
                <div className="sd-pop-head">
                  <span className="sd-pop-en">{entry.enLabel}</span>
                  <span className="sd-pop-sep">/</span>
                  <span className="sd-pop-zh">{entry.label}</span>
                </div>
                <div className="sd-qr">
                  <img src={entry.qrImage!} alt={`${entry.label} 二维码`} />
                </div>
                <div className="sd-pop-foot">
                  <span className="sd-pop-cta">{entry.cta}</span>
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
