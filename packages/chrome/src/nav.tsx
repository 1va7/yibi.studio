"use client";

import Link from "next/link.js";
import { LogIn, LogOut, UserRound } from "lucide-react";
import { usePathname } from "next/navigation.js";
import { useEffect, useRef, useState } from "react";
import { FEISHU_SCHEDULER_URL } from "./links.js";

export type NavUser = {
  label: string;
  email?: string | null;
  avatarUrl?: string | null;
};

export type NavItem = {
  href: string;
  label: string;
  group: string;
  dropdown?: { href: string; label: string; tag?: string }[];
};

export type NavAccountBadge = {
  key: string;
  label: string;
  value: string;
};

export type NavAuth = {
  user?: NavUser | null;
  loginHref: string;
  accountHref: string;
  logoutHref?: string;
  accountLabel?: string;
  logoutLabel?: string;
  badges?: NavAccountBadge[];
  onSignOut?: (callbackUrl: string) => void | Promise<void>;
};

export type NavProps = {
  items?: NavItem[];
  schedulerUrl?: string;
  logoUrl?: string;
  auth?: NavAuth | null;
};

const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    href: "/services",
    label: "服务",
    group: "services",
    dropdown: [
      { href: "/solutions/amazon-ai", label: "跨境电商 AI 运营系统", tag: "方案" },
      { href: "/solutions/content-factory", label: "社媒内容工厂", tag: "方案" },
      { href: "/services/aigc", label: "AIGC", tag: "方案" },
      { href: "/solutions/llm-gateway", label: "企业级大模型网关", tag: "方案" },
      { href: "/services", label: "定制服务", tag: "服务" },
      { href: "/courses", label: "公开课程", tag: "课程" },
    ],
  },
  {
    href: "/products",
    label: "产品",
    group: "products",
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

function AccountMenu({
  auth,
  currentPath,
}: {
  auth: NavAuth & { user: NavUser };
  currentPath: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const label = auth.user.label || auth.user.email || "账户";
  const accountLabel = auth.accountLabel || "个人看板";
  const logoutLabel = auth.logoutLabel || "退出登录";
  const callbackUrl = pathname === auth.accountHref ? "/" : currentPath || "/";

  useEffect(() => {
    if (!open) return;

    const onClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const signOut = async () => {
    if (auth.onSignOut) {
      await auth.onSignOut(callbackUrl);
      return;
    }
    if (auth.logoutHref) {
      window.location.href = auth.logoutHref.includes("?")
        ? `${auth.logoutHref}&callbackUrl=${encodeURIComponent(callbackUrl)}`
        : `${auth.logoutHref}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      return;
    }
  };

  return (
    <div className={`account-menu ${open ? "is-open" : ""}`} ref={menuRef}>
      <button
        type="button"
        className="nav-login nav-account"
        aria-label="账户菜单"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <UserRound size={16} aria-hidden />
        <span className="nav-account-label">{label}</span>
        {auth.badges?.map((badge) => (
          <span
            key={badge.key}
            className="nav-credit-badge"
            aria-label={`${badge.label} ${badge.value}`}
          >
            {badge.value} {badge.label}
          </span>
        ))}
      </button>
      <div className="account-menu-popover" role="menu">
        <Link href={auth.accountHref} role="menuitem" onClick={() => setOpen(false)}>
          <UserRound size={15} aria-hidden />
          <span>{accountLabel}</span>
        </Link>
        {(auth.onSignOut || auth.logoutHref) && (
          <button type="button" role="menuitem" onClick={signOut}>
            <LogOut size={15} aria-hidden />
            <span>{logoutLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function Nav({
  items = DEFAULT_NAV_ITEMS,
  schedulerUrl = FEISHU_SCHEDULER_URL,
  logoUrl = "/assets/logo.png",
  auth,
}: NavProps) {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState(pathname);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setCurrentPath(window.location.pathname + window.location.search);
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setMobileGroup(null);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        drawerRef.current &&
        !drawerRef.current.contains(target) &&
        burgerRef.current &&
        !burgerRef.current.contains(target)
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
          <span
            className="mark"
            style={{ "--yibi-logo-url": `url(${logoUrl})` } as React.CSSProperties}
          />
          <span className="word">异璧</span>
        </Link>
        <nav className="nav-links">
          {items.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/") ||
              (item.dropdown?.some(
                (sub) =>
                  pathname === sub.href ||
                  pathname.startsWith(sub.href + "/"),
              ) ??
                false);
            const hasDropdown = item.dropdown && item.dropdown.length > 0;
            return (
              <div
                key={item.href}
                className={`nav-item ${hasDropdown ? "has-dropdown" : ""} ${openGroup === item.group ? "is-open" : ""}`}
                onMouseEnter={() => hasDropdown && setOpenGroup(item.group)}
                onMouseLeave={() => hasDropdown && setOpenGroup(null)}
              >
                <Link href={item.href} className={active ? "is-active" : ""}>
                  {item.label}
                  {hasDropdown && (
                    <span className="dd-caret" aria-hidden>
                      ▾
                    </span>
                  )}
                </Link>
                {hasDropdown && (
                  <div className="nav-dropdown">
                    {item.dropdown!.map((sub) => (
                      <Link key={sub.href} href={sub.href}>
                        {sub.tag && <span className="dd-tag">{sub.tag}</span>}
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
          {auth?.user ? (
            <AccountMenu
              auth={auth as NavAuth & { user: NavUser }}
              currentPath={currentPath}
            />
          ) : (
            <Link className="nav-login" href={auth?.loginHref || "/login"} aria-label="登录">
              <LogIn size={16} aria-hidden />
              <span>登录</span>
            </Link>
          )}
          <a
            className="cta-mini"
            href={schedulerUrl}
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
            onClick={() => setMobileOpen((value) => !value)}
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
          {items.map((item) => {
            const hasDropdown = item.dropdown && item.dropdown.length > 0;
            const expanded = mobileGroup === item.group;
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/") ||
              (item.dropdown?.some(
                (sub) =>
                  pathname === sub.href ||
                  pathname.startsWith(sub.href + "/"),
              ) ??
                false);
            return (
              <li key={item.href} className="nav-drawer-item">
                <div className="nav-drawer-row">
                  <Link
                    href={item.href}
                    className={`nav-drawer-link ${active ? "is-active" : ""}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {hasDropdown && (
                    <button
                      type="button"
                      className={`nav-drawer-toggle ${expanded ? "is-open" : ""}`}
                      aria-label={expanded ? "收起子菜单" : "展开子菜单"}
                      aria-expanded={expanded}
                      onClick={() =>
                        setMobileGroup(expanded ? null : item.group)
                      }
                    >
                      <span aria-hidden>▾</span>
                    </button>
                  )}
                </div>
                {hasDropdown && expanded && (
                  <ul className="nav-drawer-sublist">
                    {item.dropdown!.map((sub) => (
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
