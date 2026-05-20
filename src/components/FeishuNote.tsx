"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Feishu form for "sales lead → 飞书合作伙伴 follow-up"
const CONTACT_MANAGER_URL =
  "https://ycnm1prsz3tg.feishu.cn/share/base/form/shrcnPRTA9IDBPDIAgiuEZNMo5d?from=navigation";

export default function FeishuNote() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  // Position the portal'd popover under the button
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const update = () => {
      const r = btnRef.current!.getBoundingClientRect();
      setPos({
        top: r.bottom + window.scrollY + 12,
        left: r.left + r.width / 2 + window.scrollX,
      });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        popRef.current && !popRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="feishu-note"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-expanded={open}
      >
        没用飞书？
      </button>
      {open && pos && typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popRef}
            className="feishu-popover"
            role="dialog"
            style={{
              top: pos.top,
              left: pos.left,
            }}
          >
            <div className="fp-arrow" />
            <div className="fp-title">异璧是飞书的合作伙伴</div>
            <div className="fp-body">
              没用飞书也没关系——钉钉、Teams、Slack… 也能作为底座。但飞书是目前企业 AI 转型中，最成熟的基础设施——我们可以帮您<strong>免费</strong>：
            </div>
            <ul className="fp-list">
              <li>对接合适的飞书客户成功经理</li>
              <li>拿到比官网直订更优惠的<strong>伙伴价格</strong></li>
              <li>评估用您现有底座接入 Agent 的可行性</li>
            </ul>
            <div className="fp-actions">
              <a
                className="btn btn-primary"
                href={CONTACT_MANAGER_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, padding: "10px 16px" }}
              >
                联系经理 <span className="arr">→</span>
              </a>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
