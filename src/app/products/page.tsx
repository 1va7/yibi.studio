import Link from "next/link";
import { FEISHU_SCHEDULER_URL } from "@/lib/links";

export const metadata = {
  title: "产品矩阵",
  description:
    "异璧的两类产品：经验蒸馏（主商品，把员工判断变成可调用的 Skill）+ 实验室开源（OpenClaw / OPAL 等已经在生产里被反复用上的工具）。",
};

export default function ProductsPage() {
  return (
    <div className="wrap">
      <section className="page-hero">
        <div className="eyebrow">产品 · PRODUCTS</div>
        <h1>
          一款主商品，
          <br />
          一个实验室。
        </h1>
        <p className="lede">
          经验蒸馏是我们正在主推的产品——把好员工的判断变成组织数字资产。实验室里是我们在交付过程中复用率最高的开源工具，免费给大家用。
        </p>
      </section>

      <section className="section-tight">
        <div className="distill-spotlight" style={{ margin: 0 }}>
          <div className="ds-left">
            <span className="kicker kicker-gold">★ 主商品 / OUR PRODUCT</span>
            <h2 style={{ fontSize: 42, lineHeight: 1.1, margin: "16px 0 14px" }}>
              经验蒸馏
              <br />
              <em>Experience Distillation</em>
            </h2>
            <p className="lede" style={{ marginBottom: 24, maxWidth: 540 }}>
              把好员工的判断变成组织数字资产。
            </p>
            <p className="body-text" style={{ marginBottom: 28, maxWidth: 560 }}>
              头牌运营、广告手、客服话术——这些只留在人脑里的判断逻辑，通过工作数据采集 + 行为序列分析，沉淀成新员工和 Agent 都能调用的 Skill。
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link className="btn btn-primary" href="/products/distill">
                看完整产品 <span className="arr">→</span>
              </Link>
              <a className="btn btn-ghost" href={FEISHU_SCHEDULER_URL} target="_blank" rel="noopener noreferrer">
                申请内测 <span className="arr">→</span>
              </a>
            </div>
          </div>
          <div className="ds-right">
            <div className="ds-step">
              <div className="ds-num">①</div>
              <div>
                <div className="ds-title">工作数据采集</div>
                <div className="ds-desc">浏览器 / 飞书 / Agent 日志</div>
              </div>
            </div>
            <div className="ds-step">
              <div className="ds-num">②</div>
              <div>
                <div className="ds-title">判断逻辑提炼</div>
                <div className="ds-desc">本地脱敏 + 端到端加密上传</div>
              </div>
            </div>
            <div className="ds-step">
              <div className="ds-num">③</div>
              <div>
                <div className="ds-title">蒸馏成 Skill</div>
                <div className="ds-desc">挂在 Agent 工作台里供调用</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="section-head">
          <div className="l">
            <span className="kicker">★ 实验室 · LABS</span>
            <h2 className="h-section">我们开源的东西</h2>
          </div>
          <div className="r">
            <Link
              href="/products/labs"
              style={{
                color: "var(--orange-light)",
                fontFamily: "var(--serif-en)",
                fontStyle: "italic",
                fontSize: 14,
                textTransform: "none",
              }}
            >
              全部 →
            </Link>
          </div>
        </div>
        <p className="body-text" style={{ marginBottom: 32, maxWidth: 760 }}>
          交付过程中复用率最高的工具，我们开源出来。蒸馏的核心算法不开源，其他都免费给大家用——也欢迎贡献。
        </p>
        <div className="cards-3">
          <Link className="card" href="/products/labs/openclaw-pm">
            <div className="card-meta">
              <span className="tag">OPEN SOURCE</span>
              <span>398 ★</span>
            </div>
            <h3>OpenClaw PM</h3>
            <p className="card-desc">让 AI Agent 成为优秀的项目经理。任务管理 / Session 隔离 / 自动恢复。</p>
            <div className="card-foot">
              <span>OPENCLAW</span>
              <span className="arr">→</span>
            </div>
          </Link>
          <Link className="card" href="/products/labs/opal/bridge">
            <div className="card-meta">
              <span className="tag">OPEN SOURCE</span>
              <span>37 ★</span>
            </div>
            <h3>OPAL · Bridge</h3>
            <p className="card-desc">跨 agent 上下文共享：Claude Code ↔ Codex ↔ Hermes，做到一半换工具继续干。</p>
            <div className="card-foot">
              <span>OPAL</span>
              <span className="arr">→</span>
            </div>
          </Link>
          <Link className="card" href="/products/labs/opal/mirror">
            <div className="card-meta">
              <span className="tag">OPEN SOURCE</span>
              <span>NEW</span>
            </div>
            <h3>OPAL · Mirror</h3>
            <p className="card-desc">网页 LLM 历史本地镜像：Claude / ChatGPT / Gemini / DeepSeek / 豆包 / 千问 6 家。</p>
            <div className="card-foot">
              <span>OPAL</span>
              <span className="arr">→</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
