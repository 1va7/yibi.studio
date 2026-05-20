import Link from "next/link";
import { getRepoStars, formatStars } from "@/lib/github";

export const metadata = {
  title: "OpenClaw PM",
  description:
    "让 AI Agent 成为优秀的项目经理。V2 含任务管理、Session 隔离、GatewayRestart 强制恢复、主动 Interview、并行执行优化、Checkpoint 机制。MIT 开源。",
};
export const revalidate = 21600;

export default async function OpenclawPmPage() {
  const stars = await getRepoStars("1va7/openclaw-pm");
  return (
    <div className="wrap">
      <section className="page-hero">
        <div className="eyebrow">OPENCLAW · OPEN SOURCE · {formatStars(stars)} ★</div>
        <h1>
          OpenClaw PM
          <br />
          <em>让 AI Agent 成为优秀的项目经理</em>
        </h1>
        <p className="lede" style={{ maxWidth: 800 }}>
          OpenClaw 项目经理配置升级工具。给 OpenClaw harness 灌入一套调教，让 Agent 学会任务管理、Session 隔离、自动恢复、并行执行——能持续推进复杂任务，不再因为 session 中断而原地踏步。
        </p>
        <div style={{ marginTop: 28, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "stretch" }}>
          <a className="btn btn-primary" href="https://github.com/1va7/openclaw-pm" target="_blank" rel="noopener noreferrer">
            GitHub <span className="arr">→</span>
          </a>
          <div className="install-block" aria-label="install command">
            <span className="install-chrome">
              <span className="install-dot install-dot-r" />
              <span className="install-dot install-dot-y" />
              <span className="install-dot install-dot-g" />
            </span>
            <span className="install-prompt">$</span>
            <code className="install-cmd">npx @1va7/openclaw-pm</code>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <span className="kicker">V2 核心能力</span>
        <h2 className="h-section" style={{ fontSize: 36, margin: "14px 0 24px" }}>
          它给 Agent 加了什么
        </h2>
        <div className="cards-2">
          {[
            ["复杂任务管理", "强制要求先写计划文件，每完成一步更新；Context 压缩时依赖文件而非记忆；完成后汇报 + 清理"],
            ["Session 隔离规则", "每次回复前检查 inbound_meta，只基于当前 session 的聊天记录，禁止跨 session 假设 context"],
            ["GatewayRestart 强制恢复", "立即汇报重启原因 → 检查恢复文件 → 检查任务状态 → 继续推进，不要静默"],
            ["主动 Interview", "需求模糊时必须先 interview，用选择题而非开放题，最多 2 轮"],
            ["并行执行优化", "独立任务必须并行，多个不相关的 tool call 同时发出，多个独立的 sub-agent 同时 spawn"],
            ["Checkpoint 机制", "复杂任务每完成一个 Phase 就 git commit，崩溃时能从 git 历史恢复"],
          ].map(([t, d]) => (
            <div className="card" key={t}>
              <h3>{t}</h3>
              <p className="card-desc">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-tight">
        <span className="kicker">外部健康检查</span>
        <h2 className="h-section" style={{ fontSize: 36, margin: "14px 0 24px" }}>
          配套脚本
        </h2>
        <p className="body-text" style={{ maxWidth: 800, marginBottom: 18 }}>
          V2 还包含一套外部健康检查脚本——gateway-health-check、check-unanswered、heartbeat-check、check-missed-crons、quick-diagnose、morning-briefing、daily-stats。装到 workspace 里后台跑，Agent 一旦卡住或挂掉，能被自动检测和恢复。
        </p>
      </section>
    </div>
  );
}
