/**
 * Central registry for VA7 / 异璧 social channels.
 *
 * One source of truth for: platform URLs, brand icons, QR assets, copy.
 * Used by SocialDock (footer + insights hero) and any future surface
 * that needs to advertise the same accounts.
 *
 * QR assets live in /public/assets/team/ and are also used by
 * InstructorSocials on /courses — keep paths in sync.
 */

import type { ReactElement } from "react";
import { createElement, Fragment } from "react";

export type SocialKey = "wechat" | "xiaohongshu" | "douyin" | "channels";

export type SocialEntry = {
  key: SocialKey;
  /** 中文平台名 */
  label: string;
  /** English small-caps label */
  enLabel: string;
  /** Short one-line CTA copy under the QR / on tooltip */
  cta: string;
  /** Outbound link to the platform profile (used as fallback / direct link) */
  href: string;
  /**
   * QR image path. If provided, we render this PNG/JPG instead of an
   * auto-generated SVG QR. Real brand-issued QRs (esp. wechat-mp and
   * wechat-channels) MUST use this — those platforms refuse to scan
   * arbitrary URLs encoded by qrcode.js.
   */
  qrImage?: string;
  /** Brand-style outline icon. 18×18 viewbox, currentColor. */
  icon: ReactElement;
};

/* ----------------------------------------------------------------
   ICONS — brand-recognizable simplified outlines.
   Sourced from simple-icons (CC0) and trimmed to a single path each.
   All use currentColor so brand color can be applied on hover.
   ---------------------------------------------------------------- */

const svg = (path: ReactElement) =>
  createElement(
    "svg",
    {
      viewBox: "0 0 24 24",
      width: 18,
      height: 18,
      fill: "currentColor",
      "aria-hidden": true,
    },
    path,
  );

// WeChat (公众号) — official speech-bubble logo with two dots, plus
// the smaller secondary bubble. Simplified single-path glyph.
const IconWeChat = svg(
  createElement("path", {
    d: "M8.69 4C4.6 4 1.27 6.79 1.27 10.23c0 1.98 1.1 3.74 2.82 4.89-.15.43-.55 1.49-.62 1.71-.09.27.1.27.21.2.07-.05 1.16-.79 1.74-1.18.49.1 1 .17 1.53.2-.1-.35-.16-.71-.16-1.08 0-3.07 2.97-5.56 6.64-5.56l.34.01C12.99 6.45 11 4 8.69 4M6.1 9.05a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8m4.6 0a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8m12.04 5.66c0-2.91-2.85-5.27-6.36-5.27s-6.36 2.36-6.36 5.27 2.85 5.27 6.36 5.27c.46 0 .91-.04 1.34-.12.5.33 1.45.96 1.51.99.09.06.24.06.17-.17-.06-.18-.4-1.07-.54-1.45 1.46-.98 2.42-2.47 2.42-4.12-1.6-.6-1.6-.6-1.6-.6-1.6-.6m-3.27.85a.74.74 0 1 1 0-1.48.74.74 0 0 1 0 1.48m-3.78 0a.74.74 0 1 1 0-1.48.74.74 0 0 1 0 1.48",
  }),
);

// Xiaohongshu (小红书) — there is no clean CC0 RED glyph in widespread use,
// so we use the recognizable "X 小红书"-style book-mark / red-square wordmark
// approximation: a square with "小" stroke and bookmark notch. This matches
// the existing brand-mark used on /courses.
const IconXiaohongshu = svg(
  createElement(Fragment, null,
    // square card
    createElement("rect", { x: 3, y: 3, width: 18, height: 18, rx: 2, fill: "none", stroke: "currentColor", strokeWidth: 1.6 }),
    // "小" simplified — vertical stroke + two dots
    createElement("path", { d: "M12 8v9M9 10.5c.8 0 1.4-.4 1.8-1M15 10.5c-.8 0-1.4-.4-1.8-1", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", fill: "none" }),
  ),
);

// Douyin (抖音) — official musical-note-with-stem D logo. Simple-icons CC0 path.
const IconDouyin = svg(
  createElement("path", {
    d: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1.84-.07Z",
  }),
);

// WeChat Channels (视频号) — green play-in-circle, simplified.
// The official mark is a play triangle inside a circle / lens shape.
const IconChannels = svg(
  createElement(Fragment, null,
    createElement("circle", { cx: 12, cy: 12, r: 9.2, fill: "none", stroke: "currentColor", strokeWidth: 1.6 }),
    createElement("path", { d: "M10 8.5v7l6-3.5-6-3.5Z", fill: "currentColor" }),
  ),
);

/* ----------------------------------------------------------------
   ENTRIES
   ---------------------------------------------------------------- */
export const SOCIAL_ENTRIES: SocialEntry[] = [
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
    href: "https://channels.weixin.qq.com/", // visitors land here on click; QR is the real path
    qrImage: "/assets/team/qr-wechat-channels.png",
    icon: IconChannels,
  },
];

export const SOCIAL_BY_KEY: Record<SocialKey, SocialEntry> =
  Object.fromEntries(SOCIAL_ENTRIES.map((e) => [e.key, e])) as Record<
    SocialKey,
    SocialEntry
  >;
