import Link from "next/link";
import {
  LayoutGrid,
  Bot,
  KeyRound,
  PlayCircle,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import FeishuNote from "@/components/FeishuNote";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata = {
  title: "社媒爆款内容工厂",
  description:
    "短视频 + 图文一条完整产线。¥28,800（划线 ¥39,800）起。单条 400w+ 播放、单视频涨粉 2w+ 的真实案例方法论，整套打包给你团队复用。",
};

const SCHEDULER_URL =
  "https://ycnm1prsz3tg.feishu.cn/scheduler/e151cf04355136c8";

const PROOFS = [
  {
    src: "/assets/content-factory/douyin-followers-2w.png",
    platform: "抖音",
    headline: "单视频涨粉 2w+",
    detail: "矩阵账号单条视频破圈大爆款",
  },
  {
    src: "/assets/content-factory/xhs-followers-5k.png",
    platform: "小红书",
    headline: "单视频涨粉 5k",
    detail: "笔记 + 视频混排引流爆款",
  },
  {
    src: "/assets/content-factory/vh-views-60w-fans-1w.png",
    platform: "视频号",
    headline: "单条涨粉 1w+",
    detail: "60w+ 播放，私域沉淀效率最高",
  },
  {
    src: "/assets/content-factory/douyin-views-400w.png",
    platform: "抖音",
    headline: "视频播放 400w+",
    detail: "单条 400 万播放，进入官方流量池",
  },
  {
    src: "/assets/content-factory/xhs-views-160w.png",
    platform: "小红书",
    headline: "视频播放 160w",
    detail: "百万播放爆款笔记",
  },
  {
    src: "/assets/content-factory/vh-views-120w.png",
    platform: "视频号",
    headline: "视频播放 120w",
    detail: "百万播放爆款，私域裂变持续",
  },
];

export default function ContentFactoryPage() {
  return (
    <div className="wrap">
      <section className="page-hero">
        <div className="eyebrow">№ 02 · SOCIAL · CONTENT · v0.2</div>
        <h1>
          社媒 <span className="boom-highlight">爆款</span><br />
          内容<em>工厂</em>
        </h1>
        <p className="lede">
          基于飞书<FeishuNote />搭建的 AI 内容生产 + 复盘系统。产品资料、爆款样本、候选文案、图片 / 分镜、人工审核、发布后数据全部在同一个工作空间里——让 1 个内容运营 + 1 条产线，撑起 12 个矩阵号、日产 500+ 条视频，跑出真实爆款。
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
        <span className="kicker">已经做出过的</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 18px" }}>
          真实数据
        </h2>
        <p className="body-text" style={{ marginBottom: 28, maxWidth: 760 }}>
          下面这些都是这套系统在客户业务里真实跑出来的数据——飞书看板自动生成 + 各平台后台截图。
        </p>

        {/* Big dashboard hero */}
        <figure className="proof-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/content-factory/dashboard.png"
            alt="内容工厂社媒增长看板"
            loading="eager"
          />
          <figcaption>
            <span className="proof-tag">数据看板</span>
            整条产线社媒增长——飞书多维表自动生成，矩阵账号、爆款分布、增粉趋势一屏可见
          </figcaption>
        </figure>

        {/* Platform proofs 3×2 grid */}
        <div className="proof-grid">
          {PROOFS.map((p) => (
            <figure className="proof-card" key={p.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.headline} loading="lazy" />
              <figcaption>
                <span className="proof-platform">{p.platform}</span>
                <div className="proof-headline">{p.headline}</div>
                <div className="proof-detail">{p.detail}</div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Production capability */}
        <figure className="proof-production">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/content-factory/production-500.jpg"
            alt="视频工厂日产视频 500+ 条"
            loading="lazy"
          />
          <figcaption>
            <span className="proof-tag">产能极限</span>
            <strong>1 名内容运营 + 整条产线，日产 30s 视频 500+ 条</strong>
            <p>覆盖 12 个矩阵账号、单账号 4 条 / 天，全部经过 AI 生成 + 人工审核闭环。</p>
          </figcaption>
        </figure>
      </section>

      <section className="section-tight">
        <span className="kicker kicker-gold">标准交付 · 约 1 周</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 24px" }}>
          包含什么
        </h2>
        <div className="companion-grid">
          <div className="companion-item">
            <div className="companion-icon"><LayoutGrid size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">飞书内容工厂模板</div>
            <div className="companion-desc">产品库、关键词配置表、对标账号配置表、爆款样本库、内容生成表、图片 / 分镜表、审核视图、复盘表，一次性部署到位。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><Bot size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">标准 Agent + 工作流</div>
            <div className="companion-desc">把上面的 8 张表用飞书工作流串成闭环：选题 → 生成 → 审核 → 发布 → 复盘自动流转。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><KeyRound size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">API key 接入 + preset</div>
            <div className="companion-desc">客户自有大模型 / 作图模型 / 数据服务的 key 接进来配好，标准 preset 一次初始化，团队进场就能生产。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><PlayCircle size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">现场跑通一条闭环</div>
            <div className="companion-desc">从产品入库 → 内容生成 → 人工审核 → 发布后回填 → 数据复盘，全流程跑一遍给团队看。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><GraduationCap size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">4 小时培训</div>
            <div className="companion-desc">建议拆 2 次各 2 小时：Session 1 配置与资料维护，Session 2 内容生成、审核与复盘。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><BookOpen size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">完整文档包</div>
            <div className="companion-desc">操作手册、字段说明、异常处理说明、验收清单——团队后续自维护不卡壳。</div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <span className="kicker">定价</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 8px" }}>
          <span style={{ color: "var(--orange)" }}>¥28,800</span>{" "}
          <span className="price-original">¥39,800</span>
        </h2>
        <p className="lede" style={{ marginBottom: 24 }}>
          Standard 包，约 1 周内完成全部部署、配置、培训与验收。
        </p>

        <div className="includes-card">
          <div className="includes-label">包含</div>
          <ul className="includes-list">
            <li>
              <strong>飞书内容工厂模板部署</strong>
              <span>8 张表 + 工作流全套配置（产品库 / 关键词 / 对标账号 / 爆款样本 / 内容生成 / 分镜 / 审核 / 复盘）</span>
            </li>
            <li>
              <strong>标准 Agent + 工作流配置</strong>
              <span>选题 → 生成 → 审核 → 发布 → 复盘自动闭环</span>
            </li>
            <li>
              <strong>API key 接入 + preset 初始化</strong>
              <span>客户自有大模型 / 作图模型 / 数据服务接入</span>
            </li>
            <li>
              <strong>现场跑通一条完整内容产线</strong>
              <span>从产品入库到发布复盘全流程演示，团队当场上手</span>
            </li>
            <li>
              <strong>4 小时培训（拆 2 次各 2 小时）</strong>
              <span>Session 1 配置与资料维护、Session 2 生成 / 审核 / 复盘</span>
            </li>
            <li>
              <strong>完整文档包 + 14 天答疑窗口</strong>
              <span>操作手册、字段说明、异常处理、验收清单 + 交付后远程答疑</span>
            </li>
          </ul>
        </div>

        <div className="delivery-timeline">
          <div className="dt-track" />
          <div className="dt-stages">
            <div className="dt-step">
              <div className="dt-circle">1</div>
              <div className="dt-bar" />
              <div className="dt-label">前置准备</div>
              <div className="dt-duration">~3 工作日</div>
              <div className="dt-desc">客户准备产品资料、API key、对标账号、合法样本；我方做配置评估</div>
            </div>
            <div className="dt-step">
              <div className="dt-circle">2</div>
              <div className="dt-bar" />
              <div className="dt-label">配置部署</div>
              <div className="dt-duration">~2 工作日</div>
              <div className="dt-desc">飞书模板部署 + Agent 工作流 + API key 接入 + preset 初始化</div>
            </div>
            <div className="dt-step">
              <div className="dt-circle">3</div>
              <div className="dt-bar" />
              <div className="dt-label">现场交付</div>
              <div className="dt-duration">1 天</div>
              <div className="dt-desc">完整内容产线跑通 + 4 小时培训 + 现场验收</div>
            </div>
            <div className="dt-step">
              <div className="dt-circle">4</div>
              <div className="dt-bar" />
              <div className="dt-label">答疑窗口</div>
              <div className="dt-duration">14 天</div>
              <div className="dt-desc">远程支持，覆盖团队上手期所有问题</div>
            </div>
          </div>
          <div className="dt-footer">
            <span>标准交付节奏</span>
            <span><strong>约 1 周</strong> 完成主交付 + 2 周答疑窗口</span>
          </div>
        </div>

        <div className="pricing-notes" style={{ marginTop: 24 }}>
          <div className="pn-title">备注</div>
          <ul>
            <li>第三方 SaaS、模型 API、作图模型、数据服务费用客户自付</li>
            <li>不代发布、不代账号运营、不投流、不做合规授权外的内容抓取</li>
            <li>需要长期陪跑复盘？见 <Link href="/services#companion" style={{ color: "var(--orange)" }}>定制服务 · 陪跑</Link>（¥8,000 / 月起）</li>
            <li>需要企业 API 网关统一管理 key / 审计 / 限额？见 <Link href="/solutions/llm-gateway" style={{ color: "var(--orange)" }}>企业级大模型网关</Link></li>
            <li>需要人工拆解一批样本并沉淀结构模板？见 <Link href="/services#build" style={{ color: "var(--orange)" }}>定制开发</Link></li>
          </ul>
        </div>
      </section>

      <section className="section-tight">
        <span className="kicker">FAQ</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 8px" }}>常见问题</h2>
        <FaqAccordion items={[
          {
            q: "真的能在 1 周内交付完成吗？",
            a: "可以，但需要客户在前置阶段配合完成准备（产品资料、API key、对标账号、合法样本等）。如果客户准备拖到 2-3 周，整体周期就会拉长。我们在前置阶段会有专人对接，让客户的准备工作不卡壳。",
          },
          {
            q: "我们公司没有现成的矩阵账号，能用这套系统吗？",
            a: "可以。这套系统交付的是「内容生产 + 复盘」能力，账号是客户独立运营的资产。如果你刚开始做矩阵，我们可以在备注的「定制开发」中包含账号搭建辅导，但不直接代运营。",
          },
          {
            q: "内容生产出来的质量怎么保证？",
            a: "系统不替你拍板「这条能不能发」，所有内容必须经过你团队的人工审核。系统做的是「批量生成候选 + 数据回填 + 复盘优化」，让你的内容运营把精力放在审核与策略上，而不是从 0 写每一条。",
          },
          {
            q: "真的能做出爆款吗？",
            a: "我们不承诺爆款。但这套系统已经在客户业务里跑出过抖音单视频涨粉 2w+、小红书 / 视频号百万播放等真实数据（看上面截图）。系统提供持续生产的能力，爆款是「持续产能 × 选题判断 × 平台运气」三件事的结果。",
          },
          {
            q: "是不是必须用你们推荐的 AI 模型？",
            a: "不是。客户自有的大模型 / 作图模型 / 数据服务的 API key 都可以接入。我们只做接入配置，不绑模型。如果你想统一管理多个模型的 key、审计、限额，可以加购企业级大模型网关。",
          },
          {
            q: "不会用飞书可以用这套系统吗？",
            a: "标准方案是基于飞书的。如果你公司还没用飞书，我们可以帮你对接合作伙伴价格 + 适合你的客户经理。其他底座（钉钉、Teams、Slack）可以单独评估接入可行性，但不属于标准交付。",
          },
          {
            q: "生产出来的内容版权归谁？",
            a: "归客户。客户提供的产品资料、对标样本、API key 和最终生成结果都在客户的飞书空间里，我们只做配置，交付完即退出，不持有任何客户内容资产。",
          },
          {
            q: "数据安全怎么处理？",
            a: "客户的飞书账号、第三方 API key、产品资料、生成结果默认全部存在客户的飞书租户和私有数据空间中。我们不留备份。更高的安全要求（私有部署、审计日志、加密强化）可以单独评估。",
          },
          {
            q: "这套系统能用多久？会不会过时？",
            a: "飞书模板和工作流是长期可用的资产，系统结构不会因为模型升级而过时。模型本身可能 6-12 个月迭代一次，但只要 API 兼容，你随时可以切换。如果你想要持续优化（新模型适配、新平台接入、新内容形式），可以加购长期陪跑。",
          },
        ]} />
      </section>

      <section className="section-tight">
        <span className="kicker">不承诺的</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 24px" }}>边界</h2>
        <ul className="body-text" style={{ paddingLeft: 24 }}>
          <li>不承诺爆款、播放量、涨粉量、线索量或销售转化（虽然我们已经多次跑出真实爆款）</li>
          <li>不代发布、不代账号运营、不投流</li>
          <li>不做合规授权外的内容抓取</li>
          <li>不承担客户使用第三方未授权数据来源的法律责任</li>
        </ul>
        <p className="body-text" style={{ marginTop: 18, color: "var(--cream-dim)" }}>
          我们交付的是内容生产系统和使用方法。账号运营、人工审核、内容发布、平台分发结果、线索承接和业务转化由客户团队负责。
        </p>
      </section>
    </div>
  );
}
