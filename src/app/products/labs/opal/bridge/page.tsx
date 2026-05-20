import Link from "next/link";
import { getRepoStars, formatStars } from "@/lib/github";

export const metadata = {
  title: "OPAL · Bridge",
  description:
    "跨 agent session 翻译。Claude Code ↔ Codex live `--resume` 验证过，支持 title 同步、双向 hook、MCP server、apply_patch 双向映射。MIT 开源。",
};
export const revalidate = 21600;

export default async function OpalBridgePage() {
  const stars = await getRepoStars("1va7/opal-bridge");
  return (
    <div className="wrap">
      <section className="page-hero">
        <div className="eyebrow">OPAL · BRIDGE · OPEN SOURCE · {formatStars(stars)} ★</div>
        <h1>
          <em>跨 agent 的</em>
          <br />
          session 翻译 + resume 桥
        </h1>
        <p className="lede" style={{ maxWidth: 820 }}>
          Claude Code 做到一半，想换 Codex 继续干？不丢上下文，不重新介绍项目，不粘贴摘要。OPAL Bridge 把两边的 session 直接接起来，一行命令切换。
        </p>
        <div style={{ marginTop: 28, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <a className="btn btn-primary" href="https://github.com/1va7/opal-bridge" target="_blank" rel="noopener noreferrer">
            GitHub <span className="arr">→</span>
          </a>
          <Link className="btn btn-ghost" href="/products/labs/opal">
            OPAL 概览 <span className="arr">→</span>
          </Link>
        </div>
      </section>

      <section className="section-tight">
        <span className="kicker kicker-gold">我们解决的问题</span>
        <h2 className="h-section" style={{ fontSize: 36, margin: "14px 0 24px" }}>
          共享记忆 vs 共享状态
        </h2>
        <p className="body-text" style={{ maxWidth: 820, marginBottom: 18 }}>
          一句话讲：「记忆管理」是让 AI 更好地回忆过去；「状态管理」是直接让 AI 回到过去。
        </p>
        <p className="body-text" style={{ maxWidth: 820, marginBottom: 18 }}>
          现在所有的跨 agent 协作方案都是「共享记忆」——把做过的事压成摘要塞给下一个 agent。但摘要丢失了关键判断点。我们做的是「共享状态」：把上一棒的整个现场完整搬过去，颗粒度最高、上下文最全。
        </p>
        <p className="lede" style={{ maxWidth: 820, color: "var(--cream)" }}>
          它就像存档——你点继续游戏，读他的档，就带入了他的角色。
        </p>
      </section>

      <section className="section-tight">
        <span className="kicker">v0.6.0 已实现</span>
        <h2 className="h-section" style={{ fontSize: 36, margin: "14px 0 24px" }}>
          当前能力
        </h2>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, maxWidth: 880 }}>
          {[
            "双向 CC ↔ Codex：live claude --resume / codex resume 都验证通过",
            "共享标题：任一边重命名，对面 picker 自动跟进，不再产生重复文件",
            "自动镜像：CC Stop hook + Codex notify hook，每段对话结束自动同步",
            "历史修复同步：sync --force --include-active --days 365 重渲染旧镜像",
            "空会话降噪：没有 replayable context 的源不会生成空镜像",
            "MCP server：暴露 6 个工具给任意 MCP host（Claude Desktop / Cursor / Cline）",
            "6 核心工具映射：Bash / Read / Glob / Grep / WebSearch / metadata",
            "apply_patch 双向：CC Edit/Write/MultiEdit ↔ Codex apply_patch grammar",
            "subagent inline：自动扫子 agent 目录、拼进主线",
            "compact_boundary 双向翻译",
            "shell 命令模式识别：避免 round-trip 退化",
            "覆盖保护：只允许覆盖 agent-bridge 生成的文件",
            "31 pytest + live resume 双重验证",
          ].map((line) => (
            <li className="body-text" key={line}>
              <span style={{ color: "var(--orange)", marginRight: 8 }}>✓</span>
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="section-tight">
        <span className="kicker">Quick Start</span>
        <h2 className="h-section" style={{ fontSize: 36, margin: "14px 0 24px" }}>
          一行装、一行用
        </h2>
        <pre style={{ background: "var(--ink-2)", border: "1px solid var(--line)", padding: 24, fontFamily: "var(--mono)", fontSize: 13, lineHeight: 1.6, overflowX: "auto" }}>
{`# 安装
python3 -m venv .venv && .venv/bin/pip install -e .

# CC → Codex 翻译 + smoke 验证
.venv/bin/python -m agent_bridge.cli smoke \\
    ~/.claude/projects/<encoded-cwd>/<UUID>.jsonl \\
    --prompt "Reply with: WORKS"

# 拿到 UUID 后直接续上
codex exec resume <UUID> "你的新指令"`}
        </pre>
      </section>
    </div>
  );
}
