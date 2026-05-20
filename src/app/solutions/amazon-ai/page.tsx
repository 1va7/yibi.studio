import Link from "next/link";
import FeishuNote from "@/components/FeishuNote";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata = {
  title: "跨境电商 AI 运营系统",
  description:
    "把跨境电商的运营、广告、客服、复盘打成一套可执行的 AI 操作系统。¥29,800（划线 ¥39,800）起。从数据采集到 Agent 决策，整套部署 + 培训 + 陪跑。",
};

const SCHEDULER_URL =
  "https://ycnm1prsz3tg.feishu.cn/scheduler/e151cf04355136c8";

export default function AmazonAiPage() {
  return (
    <div className="wrap">
      <section className="page-hero">
        <div className="eyebrow">№ 01 · AMAZON · CROSS-BORDER · v1.3</div>
        <h1>
          跨境电商
          <br />
          <em>AI 运营系统</em>
        </h1>
        <p className="lede">
          搭一套能在真实业务里跑起来、越用越懂业务的 AI 运营系统：先把飞书<FeishuNote />、模型、工具、数据源和员工 Agent 环境接好；再教团队把日常工作交给 Agent 协作完成；最后通过陪跑和经验蒸馏，把运营经验、判断逻辑和高频流程沉淀成公司资产。
        </p>
        <div style={{ marginTop: 28, display: "flex", gap: 16 }}>
          <a
            className="btn btn-primary"
            href={SCHEDULER_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            预约方案沟通 <span className="arr">→</span>
          </a>
        </div>
      </section>

      <section className="section-tight">
        <span className="kicker">解决的</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 24px" }}>
          三件事
        </h2>
        <div className="price-table">
          {[
            ["数据散在表格、SaaS、聊天和个人电脑里", "数据理得清，Agent 能读到该读的数据"],
            ["员工会用 ChatGPT，但不会把 AI 放进业务流程", "团队用得起来，日常工作能经由 Agent 完成"],
            ["头牌运营一走，选品经验、广告判断、复盘习惯也被带走", "经验沉得下，流程能闭环，打法能被复用"],
          ].map(([k, v]) => (
            <div className="price-row" key={k}>
              <span className="price-cell k" style={{ width: "50%" }}>{k}</span>
              <span className="price-cell" style={{ width: "50%", color: "var(--orange)", fontWeight: 600 }}>→ {v}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-tight">
        <span className="kicker kicker-gold">交付路径</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 24px" }}>
          3 步交付
        </h2>
        <div className="flow">
          <div className="flow-step">
            <span className="flow-n">①</span>
            <h4>基础环境配置</h4>
            <p>飞书<FeishuNote /> AI 工作台、Agent harness、常用工具接入、基础 Skills 库——把员工和 Agent 协作的工作台搭起来。</p>
          </div>
          <div className="flow-step">
            <span className="flow-n">②</span>
            <h4>Agent 部署（10 个以内）</h4>
            <p>覆盖选品 / Listing / 广告 / 复盘 4 大场景的核心 Agent，配上对应 Skills、知识库和工作流。</p>
          </div>
          <div className="flow-step">
            <span className="flow-n">③</span>
            <h4>企业内训（6 小时）</h4>
            <p>4 节标准课程：入门 Workshop / 信息收集·分析·自动化 / 数据分析·内容生产 / Vibe Coding·Agent Teams。让团队真正能用起来。</p>
          </div>
        </div>
        <p className="body-text" style={{ marginTop: 18, fontSize: 13, color: "var(--cream-dim)" }}>
          模型 / API 网关、定制系统接入、长期陪跑、经验蒸馏不在标准包内——见下方备注。
        </p>
      </section>

      <section className="section-tight">
        <span className="kicker">适合的</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 24px" }}>什么样的企业</h2>
        <div className="fit-grid">
          <div className="fit-col fit-yes">
            <div className="fit-head">
              <span className="fit-tag">✓ 适合</span>
            </div>
            <ul>
              <li>已经有跨境电商运营团队，希望把 AI 真正放进日常工作</li>
              <li>买过不少 AI 工具，但订单、利润、组织效率没有明显变化</li>
              <li>团队 10 人左右起步，老板或运营负责人愿意推动流程升级</li>
              <li>有选品、Listing、广告、库存、竞品、复盘等多类运营工作</li>
              <li>希望把冠军运营打法、广告判断和复盘习惯沉淀进公司</li>
            </ul>
          </div>
          <div className="fit-col fit-no">
            <div className="fit-head">
              <span className="fit-tag">✕ 不适合</span>
            </div>
            <ul>
              <li>对 AI / Agent 有强烈抵触抗拒情绪</li>
              <li>希望我们代运营、代投广告、代管 Amazon 账号</li>
              <li>希望 AI 自动登录 Amazon 后台全权接管店铺、自动改价、自动否词、自动改 Listing</li>
              <li>要求保证销量、利润、排名、ACOS 或 ROAS</li>
              <li>内部没有负责人配合，也不愿意让员工改变工作方式</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <span className="kicker">定价</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 8px" }}>
          <span style={{ color: "var(--orange)" }}>¥29,800</span>{" "}
          <span className="price-original">¥39,800</span>
        </h2>
        <p className="lede" style={{ marginBottom: 24 }}>
          一口价标准包，三件事一起做。
        </p>

        <div className="includes-card">
          <div className="includes-label">包含</div>
          <ul className="includes-list">
            <li>
              <strong>基础环境配置</strong>
              <span>飞书 AI 工作台、Agent harness、常用工具接入、基础 Skills 库</span>
            </li>
            <li>
              <strong>Agent 部署（10 个以内）</strong>
              <span>覆盖选品 / Listing / 广告 / 复盘 4 大场景的核心 Agent</span>
            </li>
            <li>
              <strong>企业内训（4 节课，共 6 小时）</strong>
              <span>入门 Workshop / 信息收集·分析·自动化 / 数据分析·内容生产 / Vibe Coding·Agent Teams</span>
            </li>
          </ul>
        </div>

        <div className="pricing-notes">
          <div className="pn-title">备注</div>
          <ul>
            <li>超出 10 人席位：+¥1,500 / 人，量大可折扣</li>
            <li>第三方 SaaS、模型 API、服务器费用客户自付（飞书、卖家精灵等账号客户自购，我们负责配置接入）</li>
            <li>模型 / API 网关搭建——见 <Link href="/solutions/llm-gateway" style={{ color: "var(--orange)" }}>企业级大模型网关</Link></li>
            <li>需要接入公司自研 ERP / 内部 SaaS / 闭源工具——见 <Link href="/services#build" style={{ color: "var(--orange)" }}>定制服务 · 定制开发</Link>（¥1,000 / 人天）</li>
            <li>部署完想长期陪跑？见 <Link href="/services#companion" style={{ color: "var(--orange)" }}>定制服务 · 陪跑</Link>（¥8,000 / 月起）</li>
            <li>想做经验蒸馏，把头牌运营的判断变成组织资产？见 <Link href="/products/distill" style={{ color: "var(--orange)" }}>经验蒸馏</Link>（内测中，限时免费）</li>
          </ul>
        </div>
      </section>

      <section className="section-tight">
        <span className="kicker">FAQ</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 8px" }}>常见问题</h2>
        <FaqAccordion items={[
          {
            q: "和传统数字化的「咨询 + 方案 + 落地」不一样在哪？",
            a: "传统数字化先访谈员工、画流程图、定义数据底座、再开发静态系统——这条路在 AI 时代会很慢。业务变化太快，员工说不清真实工作流程，关键判断只在真实任务里暴露。我们更推荐：先把企业 AI 工作环境准备好，让团队在这个环境里真实工作；再让 Agent 一边参与业务、一边留下数据痕迹；最后基于真实使用痕迹，把数据基础夯实成企业 AI 底座。AI 系统在业务里长出来，不是先关门造完美系统。",
          },
          {
            q: "已经买了很多 AI 工具，还需要这套系统吗？",
            a: "要看这些工具有没有进入业务流程。如果员工只是偶尔打开工具问问题，经验不会沉淀，老板也看不到过程。我们的重点是把工具、数据、流程和复盘接成一个能持续运转的系统。",
          },
          {
            q: "是不是必须用飞书？",
            a: "当前最成熟的 AI 底座是飞书。其他底座（钉钉、Teams、Slack）可以评估，但不属于标准交付——如果你用的不是飞书，预约咨询，我们会帮你拿到飞书合作伙伴价格 + 对接合适的客户经理。",
          },
          {
            q: "会不会替我们自动操作 Amazon 后台？",
            a: "标准方案不做自动登录后台、自动改价、自动否词、自动改 Listing 等高风险动作。系统可以给建议、生成材料、做检查和复盘，最终执行由客户团队人工确认。",
          },
          {
            q: "多久能看到效果？",
            a: "环境部署完成后，团队可以立刻开始使用 Agent 做日常工作，Day 1 就能看到员工和 Agent 的交互成果。经验沉淀和员工蒸馏需要持续数据，通常 6 个月后产生稳定效果。",
          },
          {
            q: "数据安全怎么处理？",
            a: "客户的飞书、SaaS、API key、模型账号和业务数据原则上归客户自己持有。我们只在授权范围内配置系统。更高要求的数据隔离、私有化部署、审计和权限管理可以单独评估。",
          },
        ]} />
      </section>
    </div>
  );
}

