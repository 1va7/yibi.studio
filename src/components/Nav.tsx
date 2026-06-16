"use client";

import { signOut } from "next-auth/react";
import { YibiNavAdapter } from "../../packages/chrome/src/yibi";
import type {
  NavItem,
  NavProps,
  NavUser,
} from "../../packages/chrome/src/nav";

export type { NavItem, NavProps, NavUser };

export default function Nav(props: NavProps) {
  return (
    <YibiNavAdapter
      {...props}
      onSignOut={async (callbackUrl) => {
        await signOut({ callbackUrl });
      }}
    />
  );
}
