"use client";

import { useEffect, useMemo, useState } from "react";
import Nav, {
  type NavAuth,
  type NavProps,
  type NavUser,
} from "./nav.js";

export type YibiChromeSessionBadge = {
  key: string;
  label: string;
  value: string;
};

export type YibiChromeSessionResponse = {
  ok: boolean;
  user: NavUser | null;
  badges?: YibiChromeSessionBadge[];
  links: {
    login: string;
    account: string;
    logout?: string;
  };
};

export type YibiNavAdapterProps = Omit<NavProps, "auth"> & {
  baseUrl?: string;
  sessionEndpoint?: string;
  fallbackLoginHref?: string;
  fallbackAccountHref?: string;
  onSignOut?: (callbackUrl: string) => void | Promise<void>;
};

function joinUrl(baseUrl: string, path: string) {
  if (/^https?:\/\//.test(path)) return path;
  if (!baseUrl) return path;
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function appendCallbackUrl(href: string, callbackUrl: string) {
  if (!callbackUrl) return href;
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

export function useYibiNavTelemetry({
  baseUrl = "",
  sessionEndpoint = "/api/chrome/session",
  fallbackLoginHref = "/login",
  fallbackAccountHref = "/account",
  onSignOut,
}: Pick<
  YibiNavAdapterProps,
  | "baseUrl"
  | "sessionEndpoint"
  | "fallbackLoginHref"
  | "fallbackAccountHref"
  | "onSignOut"
>) {
  const [session, setSession] = useState<YibiChromeSessionResponse | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    setCurrentPath(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const response = await fetch(joinUrl(baseUrl, sessionEndpoint), {
          credentials: "include",
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = (await response.json()) as YibiChromeSessionResponse;
        if (!cancelled) setSession(data);
      } catch {
        if (!cancelled) setSession(null);
      }
    }

    loadSession();
    return () => {
      cancelled = true;
    };
  }, [baseUrl, sessionEndpoint]);

  return useMemo<NavAuth>(() => {
    const loginHref = joinUrl(
      baseUrl,
      session?.links.login || fallbackLoginHref,
    );
    return {
      user: session?.user || null,
      loginHref: appendCallbackUrl(loginHref, currentPath),
      accountHref: joinUrl(
        baseUrl,
        session?.links.account || fallbackAccountHref,
      ),
      logoutHref: session?.links.logout
        ? joinUrl(baseUrl, session.links.logout)
        : undefined,
      badges: session?.badges || [],
      onSignOut,
    };
  }, [
    baseUrl,
    currentPath,
    fallbackAccountHref,
    fallbackLoginHref,
    onSignOut,
    session,
  ]);
}

export function YibiNavAdapter({
  baseUrl,
  sessionEndpoint,
  fallbackLoginHref,
  fallbackAccountHref,
  onSignOut,
  ...navProps
}: YibiNavAdapterProps) {
  const auth = useYibiNavTelemetry({
    baseUrl,
    sessionEndpoint,
    fallbackLoginHref,
    fallbackAccountHref,
    onSignOut,
  });

  return <Nav {...navProps} auth={auth} />;
}
