"use client";

import { useState } from "react";

type FaqItem = { q: string; a: React.ReactNode };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  // single-open accordion: only one item expanded at a time
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {items.map((it, i) => {
        const isOpen = openIdx === i;
        return (
          <div
            key={i}
            className={`faq-item ${isOpen ? "is-open" : ""}`}
            data-open={isOpen}
          >
            <button
              type="button"
              className="faq-q"
              aria-expanded={isOpen}
              onClick={() => setOpenIdx(isOpen ? null : i)}
            >
              <span>{it.q}</span>
              <span className="faq-toggle" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && <div className="faq-a">{it.a}</div>}
          </div>
        );
      })}
    </div>
  );
}
