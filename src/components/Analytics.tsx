"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function randId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getOrCreate(key: string, store: Storage) {
  let v = store.getItem(key);
  if (!v) {
    v = randId();
    store.setItem(key, v);
  }
  return v;
}

export default function Analytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const visitor_id = getOrCreate("yibi-vid", localStorage);
    const session_id = getOrCreate("yibi-sid", sessionStorage);

    try {
      const data = {
        event: "pageview",
        path: pathname,
        referrer: document.referrer || "",
        session_id,
        visitor_id,
        screen: `${window.innerWidth}x${window.innerHeight}`,
      };
      const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", blob);
      } else {
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          keepalive: true,
        });
      }
    } catch {
      // ignore
    }
  }, [pathname]);

  return null;
}
