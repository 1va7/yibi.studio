"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FEISHU_SCHEDULER_URL } from "@/lib/links";

const NAV_ITEMS: {
  href: string;
  label: string;
  group: string;
  dropdown?: { href: string; label: string; tag?: string }[];
}[] = [
  {
    href: "/services",
    label: "服务",
    group: "services",
    dropdown: [
      { href: "/solutions/amazon-ai", label: "跨境电商 AI 运营系统", tag: "方案" },
      { href: "/solutions/content-factory", label: "社媒内容工厂", tag: "方案" },
      { href: "/services/aigc", label: "电商 AIGC 套图", tag: "方案" },
      { href: "/solutions/llm-gateway", label: "企业级大模型网关", tag: "方案" },
      { href: "/services", label: "定制服务", tag: "服务" },
      { href: "/courses", label: "公开课程", tag: "课程" },
    ],
  },
  { href: "/products", label: "产品", group: "products",
    dropdown: [
      { href: "/products/distill", label: "经验蒸馏" },
      { href: "/skills", label: "开源 Skills 库" },
      { href: "/products/labs/opal/bridge", label: "OPAL Bridge" },
      { href: "/products/labs/openclaw-pm", label: "OpenClaw PM" },
      { href: "/products/labs", label: "其他开源产品" },
    ],
  },
  { href: "/insights", label: "洞察", group: "insights" },
  { href: "/about", label: "关于", group: "about" },
];

export default function Nav() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileGroup(null);
  }, [pathname]);

  // ESC + click-outside + body scroll lock when drawer open
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        drawerRef.current &&
        !drawerRef.current.contains(t) &&
        burgerRef.current &&
        !burgerRef.current.contains(t)
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-brand">
          <span className="mark" />
          <span className="word">异璧</span>
        </Link>
        <nav className="nav-links">
          {NAV_ITEMS.map((it) => {
            const active =
              pathname === it.href ||
              pathname.startsWith(it.href + "/") ||
              (it.dropdown?.some(
                (sub) =>
                  pathname === sub.href ||
                  pathname.startsWith(sub.href + "/"),
              ) ??
                false);
            const hasDropdown = it.dropdown && it.dropdown.length > 0;
            return (
              <div
                key={it.href}
                className={`nav-item ${hasDropdown ? "has-dropdown" : ""} ${openGroup === it.group ? "is-open" : ""}`}
                onMouseEnter={() => hasDropdown && setOpenGroup(it.group)}
                onMouseLeave={() => hasDropdown && setOpenGroup(null)}
              >
                <Link
                  href={it.href}
                  className={active ? "is-active" : ""}
                >
                  {it.label}
                  {hasDropdown && <span className="dd-caret" aria-hidden>▾</span>}
                </Link>
                {hasDropdown && (
                  <div className="nav-dropdown">
                    {it.dropdown!.map((sub) => (
                      <Link key={sub.href} href={sub.href}>
                        <span className="dd-label">{sub.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="nav-right">
          <a
            className="cta-mini"
            href={FEISHU_SCHEDULER_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            预约咨询
          </a>
          <button
            ref={burgerRef}
            type="button"
            className={`nav-burger ${mobileOpen ? "is-open" : ""}`}
            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="nav-burger-bar" />
            <span className="nav-burger-bar" />
            <span className="nav-burger-bar" />
          </button>
        </div>
      </div>

      <div
        id="mobile-drawer"
        ref={drawerRef}
        className={`nav-drawer ${mobileOpen ? "is-open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <ul className="nav-drawer-list">
          {NAV_ITEMS.map((it) => {
            const hasDropdown = it.dropdown && it.dropdown.length > 0;
            const expanded = mobileGroup === it.group;
            const active =
              pathname === it.href ||
              pathname.startsWith(it.href + "/") ||
              (it.dropdown?.some(
                (sub) =>
                  pathname === sub.href ||
                  pathname.startsWith(sub.href + "/"),
              ) ??
                false);
            return (
              <li key={it.href} className="nav-drawer-item">
                <div className="nav-drawer-row">
                  <Link
                    href={it.href}
                    className={`nav-drawer-link ${active ? "is-active" : ""}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {it.label}
                  </Link>
                  {hasDropdown && (
                    <button
                      type="button"
                      className={`nav-drawer-toggle ${expanded ? "is-open" : ""}`}
                      aria-label={expanded ? "收起子菜单" : "展开子菜单"}
                      aria-expanded={expanded}
                      onClick={() =>
                        setMobileGroup(expanded ? null : it.group)
                      }
                    >
                      <span aria-hidden>▾</span>
                    </button>
                  )}
                </div>
                {hasDropdown && expanded && (
                  <ul className="nav-drawer-sublist">
                    {it.dropdown!.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          className="nav-drawer-sublink"
                          onClick={() => setMobileOpen(false)}
                        >
                          {sub.tag && (
                            <span className="nav-drawer-tag">{sub.tag}</span>
                          )}
                          <span>{sub.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
