import Link from "next/link";
import { FEISHU_SCHEDULER_URL } from "@/lib/links";

export const metadata = {
  title: "落地方案",
  description:
    "三个产品级方案：跨境电商 AI 运营系统、社媒爆款内容工厂、企业级大模型网关。从需求评估到部署陪跑，让 AI 真正在业务里发挥作用。",
};

export default function SolutionsPage() {
  return (
    <div className="wrap">
      <section className="page-hero">
        <div className="eyebrow">解决方案 · SOLUTIONS</div>
        <h1>
          3 个跑通过的方案，
          <br />
          让 AI 不只是聊天框。
        </h1>
        <p className="lede">
          这三件标准化的事我们做出来了：把跨境电商的整套运营、社媒内容的完整产线、和已经买了海外大模型但用不顺的企业网关，分别打成可以按方案购买的产品级交付包。
        </p>
      </section>

      <section className="section-tight">
        <div className="cards-3" style={{ gridTemplateColumns: "1fr" }}>
          <Link className="card" href="/solutions/amazon-ai" style={{ padding: 40 }}>
            <div className="card-meta">
              <span className="tag">№ 01 · AMAZON · CROSS-BORDER</span>
              <span>v1.3</span>
            </div>
            <h3 style={{ fontSize: 36 }}>跨境电商 AI 运营系统</h3>
            <p className="card-desc" style={{ fontSize: 16, marginTop: 12, maxWidth: 800 }}>
              3 步交付：环境部署 → 员工内训 → 陪跑与经验蒸馏。让数据理得清、流程跑得动、经验沉得下。
            </p>
            <div className="card-foot">
              <span style={{ color: "var(--orange)", fontSize: 14, fontWeight: 700 }}>¥29,800 起</span>
              <span className="arr">→</span>
            </div>
          </Link>

          <Link className="card" href="/solutions/content-factory" style={{ padding: 40 }}>
            <div className="card-meta">
              <span className="tag">№ 02 · SOCIAL · CONTENT</span>
              <span>v0.2</span>
            </div>
            <h3 style={{ fontSize: 36 }}>社媒内容工厂</h3>
            <p className="card-desc" style={{ fontSize: 16, marginTop: 12, maxWidth: 800 }}>
              飞书内容工厂模板 + 标准 Agent + 4 小时培训。1 天现场交付。已经做出过日产 30s 视频 500+ 条的产线。
            </p>
            <div className="card-foot">
              <span style={{ color: "var(--orange)", fontSize: 14, fontWeight: 700 }}>¥30,000</span>
              <span className="arr">→</span>
            </div>
          </Link>

          <Link className="card" href="/solutions/llm-gateway" style={{ padding: 40 }}>
            <div className="card-meta">
              <span className="tag">№ 03 · ENTERPRISE · LLM</span>
              <span>v1.0</span>
            </div>
            <h3 style={{ fontSize: 36 }}>企业级大模型网关</h3>
            <p className="card-desc" style={{ fontSize: 16, marginTop: 12, maxWidth: 800 }}>
              1 周搭起企业 AI 网关。一个入口接通所有海外大模型账号，按部门权限管控成本、可见可审计。
            </p>
            <div className="card-foot">
              <span style={{ color: "var(--orange)", fontSize: 14, fontWeight: 700 }}>按规模评估</span>
              <span className="arr">→</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="section-tight">
        <div className="cta-bar" style={{ margin: 0, border: "1px solid var(--line)" }}>
          <span className="kicker">不确定哪个适合？</span>
          <h2 style={{ fontSize: 42, marginTop: 14 }}>
            先聊 <em>30 分钟</em>。
          </h2>
          <p className="lede" style={{ marginTop: 14, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            售前沟通免费。我们会问你团队规模和最痛的流程，告诉你哪个先做。
          </p>
          <div style={{ display: "inline-flex", gap: 16, marginTop: 28 }}>
            <a className="btn btn-primary" href={FEISHU_SCHEDULER_URL} target="_blank" rel="noopener noreferrer">
              预约 <span className="arr">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
