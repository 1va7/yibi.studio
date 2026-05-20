"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { id: "consult", n: "01", label: "咨询", en: "Diagnose" },
  { id: "build", n: "02", label: "定制开发", en: "Build" },
  { id: "training", n: "03", label: "培训", en: "Train" },
  { id: "companion", n: "04", label: "陪跑", en: "Run" },
];

export default function ServicesWorkflow() {
  const [active, setActive] = useState<string | null>(null);
  const [stickyShown, setStickyShown] = useState(false);

  useEffect(() => {
    // Track which section is in view
    const sections = STEPS.map((s) => document.getElementById(s.id)).filter(
      Boolean,
    ) as HTMLElement[];
    if (sections.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        // Find the topmost section currently in viewport
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => obs.observe(s));

    // Track when to show sticky sub-nav
    const flow = document.getElementById("workflow-flow");
    if (flow) {
      const flowObs = new IntersectionObserver(
        ([entry]) => setStickyShown(!entry.isIntersecting),
        { threshold: 0 },
      );
      flowObs.observe(flow);
      return () => {
        obs.disconnect();
        flowObs.disconnect();
      };
    }
    return () => obs.disconnect();
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div id="workflow-flow" className="workflow-flow">
        <div className="workflow-eyebrow">从诊断到陪跑 · OUR WORKFLOW</div>
        <div className="workflow-steps">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`workflow-step ${active === s.id ? "is-active" : ""}`}
              onClick={() => handleClick(s.id)}
              aria-label={`跳到${s.label}部分`}
            >
              <div className="wf-circle">
                <span className="wf-num">{s.n}</span>
              </div>
              <div className="wf-meta">
                <div className="wf-en">{s.en}</div>
                <div className="wf-label">{s.label}</div>
              </div>
              {i < STEPS.length - 1 && <span className="wf-connector" aria-hidden />}
            </button>
          ))}
        </div>
      </div>

      <div className={`workflow-sticky ${stickyShown ? "is-shown" : ""}`}>
        <div className="wrap workflow-sticky-inner">
          <div className="wf-sticky-eyebrow">WORKFLOW</div>
          {STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`wf-sticky-item ${active === s.id ? "is-active" : ""}`}
              onClick={() => handleClick(s.id)}
            >
              <span className="wf-sticky-n">{s.n}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
