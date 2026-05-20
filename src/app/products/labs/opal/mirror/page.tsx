import Link from "next/link";

export const metadata = {
  title: "OPAL · Mirror",
  description:
    "把 Claude / ChatGPT / Gemini / DeepSeek / 豆包 / 千问 6 家网页端历史对话同步到本地 JSON。不依赖第三方服务、不导出 cookie，通过 CDP 让登录态自己拉。",
};

export default function OpalMirrorPage() {
  return (
    <div className="wrap">
      <section className="page-hero">
        <div className="eyebrow">OPAL · MIRROR · OPEN SOURCE</div>
        <h1>
          网页 LLM 历史，
          <br />
          <em>本地全归档。</em>
        </h1>
        <p className="lede" style={{ maxWidth: 820 }}>
          把 Claude / ChatGPT / Gemini / DeepSeek / 豆包 / 千问 网页端的历史对话同步到本地 JSON。不依赖第三方服务、不导出 cookie、不暴露 token——通过 Chrome DevTools Protocol 让你已经登录的 Chrome 标签页自己调它后端的 API，结果回传到本地。
        </p>
        <div style={{ marginTop: 28 }}>
          <a className="btn btn-primary" href="https://github.com/1va7/opal-mirror" target="_blank" rel="noopener noreferrer">
            GitHub <span className="arr">→</span>
          </a>
        </div>
      </section>

      <section className="section-tight">
        <span className="kicker">支持的平台</span>
        <h2 className="h-section" style={{ fontSize: 36, margin: "14px 0 24px" }}>
          6 家网页 LLM
        </h2>
        <div className="price-table">
          {[
            ["Claude", "/api/organizations/{org}/chat_conversations", "干净 REST"],
            ["ChatGPT", "/backend-api/conversation/{id}", "REST + Bearer token"],
            ["Gemini", "/app/{id} DOM 抓取", "没有可用 REST"],
            ["DeepSeek", "/api/v0/chat_session/fetch_page", "内部 REST + Bearer"],
            ["豆包", "/samantha/thread/list", "字节 IM 协议"],
            ["千问", "chat2-api.qianwen.com/api/v1/session", "跨域 REST"],
          ].map(([p, e, t]) => (
            <div className="price-row" key={p}>
              <span className="price-cell k">{p}</span>
              <span className="price-cell" style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--cream-dim)" }}>{e}</span>
              <span className="price-cell note">{t}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-tight">
        <span className="kicker">原理</span>
        <h2 className="h-section" style={{ fontSize: 36, margin: "14px 0 24px" }}>
          让 fetch 跑在浏览器里
        </h2>
        <pre style={{ background: "var(--ink-2)", border: "1px solid var(--line)", padding: 24, fontFamily: "var(--mono)", fontSize: 12, lineHeight: 1.5, overflowX: "auto" }}>
{`Node 脚本 ──HTTP──▶ CDP Proxy(:3456) ──CDP──▶ Chrome ──页面内执行JS──▶ 站点API
                                                                       │
   ◀────────── JSON 结果回传 ───────────────────────────────────────────┘`}
        </pre>
        <p className="body-text" style={{ marginTop: 18, maxWidth: 820 }}>
          fetch 跑在浏览器页面上下文里——cookie/token 自动带上，跨域/CSRF 全免。这是为什么国产几家（DeepSeek/豆包/千问）连官方导出都没有的情况下，依然能稳定同步。
        </p>
      </section>

      <section className="section-tight">
        <span className="kicker">Pixel Distill 接入</span>
        <h2 className="h-section" style={{ fontSize: 36, margin: "14px 0 24px" }}>
          也是蒸馏数据源
        </h2>
        <p className="body-text" style={{ maxWidth: 820 }}>
          Mirror 抓下来的对话历史，可以转成像素级蒸馏可读取的 custom agent log 格式，作为蒸馏管线的输入之一。这是为什么 OPAL 系列既能独立使用，又能整体接入异璧蒸馏。
        </p>
      </section>
    </div>
  );
}
