import { listSkills, type SkillRow } from "@/lib/feishu";
import { svgQR } from "@/lib/qr";
import SkillsBrowser from "@/components/SkillsBrowser";

export const metadata = {
  title: "Skills · 跨境 Agent 知识库",
  description:
    "200+ 真实跨境电商项目里精选 — 选品、Listing、广告、复盘、客服、内容、合规 11 个职能。直接接入 Claude Code / Codex / OpenClaw / Hermes 等 Agent。",
};
export const revalidate = 600;

const FORM_URL =
  "https://ycnm1prsz3tg.feishu.cn/share/base/form/shrcnCu8CiLYWFiOJJIy9lOTqxd";

export default async function SkillsPage() {
  let skills: SkillRow[] = [];
  try {
    skills = await listSkills();
  } catch (e) {
    console.error("listSkills error", e);
  }

  const total = skills.length;
  const catSet = new Set<string>();
  const platSet = new Set<string>();
  skills.forEach((s) => {
    if (s.category_l1) catSet.add(s.category_l1);
    (s.platforms || []).forEach((p) => platSet.add(p));
  });
  const catCount = catSet.size;
  const platCount = platSet.size;

  const formQrSvg = await svgQR(FORM_URL, 160);

  return (
    <div className="archive-page">
      {/* DATELINE / EDITORIAL HEADER — single horizontal band */}
      <header className="archive-head">
        <div className="ah-line">
          <div className="ah-eyebrow">
            <span className="ah-eb-live" aria-hidden />
            <span>SKILLS · 卷宗</span>
            <span className="ah-eb-sep">/</span>
            <span>YIBI ARCHIVE</span>
          </div>
          <div className="ah-meta">
            <span>EST. 2026</span>
            <span className="ah-eb-sep">·</span>
            <span>
              <strong>{total}</strong> ITEMS
            </span>
            <span className="ah-eb-sep">·</span>
            <span>
              <strong>{catCount}</strong> 职能
            </span>
            <span className="ah-eb-sep">·</span>
            <span>
              <strong>{platCount}</strong> 平台
            </span>
            <span className="ah-eb-sep">·</span>
            <span className="ah-meta-live">LIVE FROM BITABLE</span>
          </div>
        </div>
        <h1 className="ah-title">
          把每个职能 <em>拆成可调用</em> 的 Skill
        </h1>
        <p className="ah-lede">
          从 200+ 真实跨境项目里精选 — 选品、Listing、广告、复盘、客服、内容、合规
          {" "}11 个职能。直接接入 Claude Code · Codex · OpenClaw · Hermes。
        </p>
      </header>

      <SkillsBrowser
        skills={skills}
        formUrl={FORM_URL}
        formQrSvg={formQrSvg}
      />
    </div>
  );
}
