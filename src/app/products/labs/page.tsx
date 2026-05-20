import Link from "next/link";
import { getRepoStarInfo, formatStars, formatFetchedAt } from "@/lib/github";

export const metadata = {
  title: "实验室 · Labs",
  description:
    "交付里磨出来的工具，开源给所有人。OpenClaw（Agent 项目经理）/ OPAL（跨 agent 协议）/ Skills 库（200+ 业务 Skill）—— 经验蒸馏核心算法不开源，其他都免费。",
};
export const revalidate = 21600;

export default async function LabsPage() {
  const [openclawInfo, bridgeInfo] = await Promise.all([
    getRepoStarInfo("1va7/openclaw-pm"),
    getRepoStarInfo("1va7/opal-bridge"),
  ]);
  return (
    <div className="wrap">
      <section className="page-hero">
        <div className="eyebrow">实验室 · PRODUCT LABS</div>
        <h1>
          交付里磨出来的工具,
          <br />
          开源给<em>所有人。</em>
        </h1>
        <p className="lede">
          每个项目结束之后，我们都会回头看：哪些能力是反复用上的？把这些抽出来开源——OpenClaw 和 OPAL 两条线。经验蒸馏的核心算法不开源，其他都免费。
        </p>
      </section>

      <section className="section-tight">
        <div className="section-head">
          <div className="l">
            <span className="kicker">OpenClaw 线</span>
            <h2 className="h-section">Agent Harness 配置增强</h2>
          </div>
          <div className="r">01 · OPENCLAW</div>
        </div>
        <div className="cards-2">
          <Link className="card" href="/products/labs/openclaw-pm">
            <div className="card-meta">
              <span className="tag">OPENCLAW · PM</span>
              <span className="star-pill" title={openclawInfo.ok ? `${openclawInfo.stars} stars · ${formatFetchedAt(openclawInfo.fetchedAt)}` : "GitHub API 暂不可用"}>
                {formatStars(openclawInfo.stars)} ★
              </span>
            </div>
            <h3>OpenClaw PM</h3>
            <p className="card-desc">
              让 AI Agent 成为优秀的项目经理。V2 含任务管理、Session 隔离、GatewayRestart 强制恢复、主动 Interview、并行执行优化、Checkpoint 机制。
            </p>
            <div className="card-foot">
              <span>github.com/1va7/openclaw-pm</span>
              <span className="arr">→</span>
            </div>
            <div className="star-stamp">{openclawInfo.ok ? formatFetchedAt(openclawInfo.fetchedAt) : "GitHub API 暂不可用"}</div>
          </Link>
        </div>
      </section>

      <section className="section-tight">
        <div className="section-head">
          <div className="l">
            <span className="kicker kicker-gold">OPAL 线</span>
            <h2 className="h-section">
              <em>Open Portable Activity Layer</em>
            </h2>
          </div>
          <div className="r">02 · OPAL · 伞项目</div>
        </div>
        <p className="body-text" style={{ marginBottom: 32, maxWidth: 760 }}>
          OPAL 是一个协议 + spec + 伞项目，把不同 agent harness 之间的活动数据规范化。当前两个子项目：Bridge 解决跨 agent 的 session resume，Mirror 解决网页 LLM 的本地归档。后续 Capture / 像素级蒸馏会陆续接入。
        </p>
        <div className="cards-2">
          <Link className="card" href="/products/labs/opal/bridge">
            <div className="card-meta">
              <span className="tag">OPAL · BRIDGE</span>
              <span className="star-pill" title={bridgeInfo.ok ? `${bridgeInfo.stars} stars · ${formatFetchedAt(bridgeInfo.fetchedAt)}` : "GitHub API 暂不可用"}>
                {formatStars(bridgeInfo.stars)} ★
              </span>
            </div>
            <h3>OPAL · Bridge</h3>
            <p className="card-desc">
              跨 agent session 翻译。Claude Code ↔ Codex live `--resume` 验证过，支持 title 同步、双向 hook、MCP server、apply_patch 双向映射。
            </p>
            <div className="card-foot">
              <span>github.com/1va7/opal-bridge</span>
              <span className="arr">→</span>
            </div>
            <div className="star-stamp">{bridgeInfo.ok ? formatFetchedAt(bridgeInfo.fetchedAt) : "GitHub API 暂不可用"}</div>
          </Link>
          <Link className="card" href="/products/labs/opal/mirror">
            <div className="card-meta">
              <span className="tag">OPAL · MIRROR</span>
              <span className="star-pill star-pill-new">NEW</span>
            </div>
            <h3>OPAL · Mirror</h3>
            <p className="card-desc">
              把 Claude / ChatGPT / Gemini / DeepSeek / 豆包 / 千问 6 家网页端历史对话同步到本地 JSON。不依赖第三方服务、不导出 cookie，通过 CDP 让登录态自己拉。
            </p>
            <div className="card-foot">
              <span>github.com/1va7/opal-mirror</span>
              <span className="arr">→</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
