"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CommunityPage() {
  useEffect(() => {
    // Auto-open the floating community panel on this route.
    // Use a microtask + rAF so FloatingCTA has mounted + registered listener.
    const t = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("yibi:community-open"));
    }, 50);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="wrap-narrow">
      <section className="page-hero" style={{ minHeight: "60vh" }}>
        <div className="eyebrow">社群 · COMMUNITY</div>
        <h1>
          社群入口
          <br />
          <em>已打开</em>
        </h1>
        <p className="lede" style={{ marginTop: 24 }}>
          社群入口已自动打开。看不到？{" "}
          <button
            type="button"
            className="link-underline"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("yibi:community-open"))
            }
            style={{
              background: "transparent",
              border: 0,
              padding: 0,
              cursor: "pointer",
              color: "var(--orange)",
              fontFamily: "inherit",
              fontSize: "inherit",
            }}
          >
            再打开一次
          </button>
          。
        </p>
        <p
          className="body-text"
          style={{ marginTop: 32, color: "var(--cream-dim)" }}
        >
          或返回继续阅读：{" "}
          <Link href="/insights" className="link-underline">
            /insights
          </Link>
          {" · "}
          <Link href="/skills" className="link-underline">
            /skills
          </Link>
          {" · "}
          <Link href="/products" className="link-underline">
            /products
          </Link>
        </p>
      </section>
    </div>
  );
}
