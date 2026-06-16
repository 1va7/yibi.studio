"use client";

import { signOut } from "next-auth/react";
import ChromeNav, {
  type NavItem,
  type NavProps,
  type NavUser,
} from "../../packages/chrome/src/nav";

export type { NavItem, NavProps, NavUser };

export default function Nav(props: NavProps) {
  return (
    <ChromeNav
      {...props}
      onSignOut={async (callbackUrl) => {
        await signOut({ callbackUrl });
      }}
    />
  );
}
