import Link from "next/link";
import { getRepoStarInfo, formatStars } from "@/lib/github";

export const metadata = {
  title: "OPAL · Open Portable Activity Layer",
  description:
    "把不同 agent harness 之间的活动数据规范化。包含 Bridge（跨 agent session resume）+ Mirror（网页端 LLM 本地归档）等子项目。",
};
export const revalidate = 21600;

export default async function OpalPage() {
  const [bridgeInfo, mirrorInfo] = await Promise.all([
    getRepoStarInfo("1va7/opal-bridge"),
    getRepoStarInfo("1va7/opal-mirror"),
  ]);
  return (
    <div className="wrap">
      <section className="page-hero">
        <div className="eyebrow">OPAL · 协议 + SPEC + 伞项目</div>
        <h1>
          <em>OPAL</em>
          <br />
          Open Portable Activity Layer
        </h1>
        <p className="lede" style={{ maxWidth: 800 }}>
          一个跨 agent 的活动数据层标准。把不同 harness（Claude Code / Codex / Hermes / 自研 agent）的 session、记忆、工作日志规范成统一的 canonical 格式，让数据可以在工具之间流转、可以被外部分析、可以接入蒸馏。
        </p>
      </section>

      <section className="section-tight">
        <span className="kicker kicker-gold">为什么要做这个</span>
        <h2 className="h-section" style={{ fontSize: 36, margin: "14px 0 24px" }}>
          每个 Agent 都是自己的孤岛
        </h2>
        <p className="body-text" style={{ maxWidth: 820 }}>
          每家 agent harness 都把 session 存成自己的 jsonl 格式，tool schema 也互不兼容。导致一个项目在某一个 agent 里做到一半，无法在另一个 agent 里 --resume 接着干，只能把人工摘要重新粘进去。
        </p>
        <p className="body-text" style={{ maxWidth: 820, marginTop: 16 }}>
          OPAL 走的是中间一层 canonical session 格式：每个 agent 配一对 adapter——ingest 把它的 session 翻成 canonical，render 把 canonical 翻回该 agent 可加载的 session 文件。
        </p>
      </section>

      <section className="section-tight">
        <div className="section-head">
          <div className="l">
            <span className="kicker">子项目</span>
            <h2 className="h-section">当前包含的两个</h2>
          </div>
          <div className="r">OPAL · CURRENT</div>
        </div>
        <div className="cards-2">
          <Link className="card" href="/products/labs/opal/bridge">
            <div className="card-meta">
              <span className="tag">BRIDGE</span>
              <span className="star-pill" title={bridgeInfo.ok ? `${bridgeInfo.stars} stars` : "GitHub API 暂不可用"}>
                {formatStars(bridgeInfo.stars)} ★
              </span>
            </div>
            <h3>OPAL · Bridge</h3>
            <p className="card-desc">
              跨 agent 的 session 翻译与 resume。Claude Code ↔ Codex live `--resume` 都验证过，支持 title 双向同步、apply_patch 双向映射、compact_boundary 双向翻译、MCP server。
            </p>
            <div className="card-foot">
              <span>session bridge</span>
              <span className="arr">→</span>
            </div>
          </Link>
          <Link className="card" href="/products/labs/opal/mirror">
            <div className="card-meta">
              <span className="tag">MIRROR</span>
              <span className="star-pill" title={mirrorInfo.ok ? `${mirrorInfo.stars} stars` : "GitHub API 暂不可用"}>
                {formatStars(mirrorInfo.stars)} ★
              </span>
            </div>
            <h3>OPAL · Mirror</h3>
            <p className="card-desc">
              网页 LLM 历史本地镜像。Claude / ChatGPT / Gemini / DeepSeek / 豆包 / 千问 6 家。通过 CDP 让登录态自己拉，不依赖第三方服务、不导出 cookie。
            </p>
            <div className="card-foot">
              <span>web chat archive</span>
              <span className="arr">→</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="section-tight">
        <span className="kicker">未来计划</span>
        <h2 className="h-section" style={{ fontSize: 36, margin: "14px 0 24px" }}>
          会接入的还有
        </h2>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14, maxWidth: 800 }}>
          <li className="body-text"><strong style={{ color: "var(--cream)" }}>OPAL · Capture</strong>—— 浏览器 / IDE / 终端的活动捕获，作为蒸馏数据源</li>
          <li className="body-text"><strong style={{ color: "var(--cream)" }}>OPAL · Distill</strong>—— 像素级蒸馏算法层（异璧自研，不开源）</li>
          <li className="body-text"><strong style={{ color: "var(--cream)" }}>OPAL · 第三方 harness adapter</strong>—— Hermes、Aider、Continue、自研 agent 等</li>
        </ul>
      </section>
    </div>
  );
}
