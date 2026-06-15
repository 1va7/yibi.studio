"use client";

import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type NavUser = {
  userId: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  providers: string[];
  roles: string[];
  creditBalance: number;
};

type AccountMenuProps = {
  user: NavUser;
  currentPath: string;
};

export default function AccountMenu({ user, currentPath }: AccountMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const label = user.name || user.email || "账户";
  const callbackUrl = pathname === "/account" ? "/" : currentPath || "/";

  useEffect(() => {
    if (!open) return;

    const onClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
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
        <span>{label}</span>
      </button>
      <div className="account-menu-popover" role="menu">
        <Link href="/account" role="menuitem" onClick={() => setOpen(false)}>
          <UserRound size={15} aria-hidden />
          <span>个人看板</span>
        </Link>
        <button
          type="button"
          role="menuitem"
          onClick={() => signOut({ callbackUrl })}
        >
          <LogOut size={15} aria-hidden />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  );
}
