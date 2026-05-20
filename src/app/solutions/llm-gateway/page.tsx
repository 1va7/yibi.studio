import Link from "next/link";
import {
  Search,
  Server,
  Plug,
  ShieldCheck,
  Activity,
  Globe,
  GraduationCap,
  RefreshCw,
  ArrowUpCircle,
  Settings2,
  MessagesSquare,
  AlertTriangle,
  FileBarChart2,
} from "lucide-react";
import FaqAccordion from "@/components/FaqAccordion";
import CostChart from "@/components/CostChart";

export const metadata = {
  title: "企业级大模型网关",
  description:
    "把企业买好的海外大模型账号（OpenAI/Anthropic/Google 等 100+）打成全公司能统一使用的企业级 API。搭建 ¥8,000 起、月度运维 ¥1,000/月起。",
};

const SCHEDULER_URL =
  "https://ycnm1prsz3tg.feishu.cn/scheduler/e151cf04355136c8";

export default function LlmGatewayPage() {
  return (
    <div className="wrap">
      <section className="page-hero">
        <div className="eyebrow">№ 03 · ENTERPRISE · LLM GATEWAY · v1.0</div>
        <h1>
          企业级<br />
          <em>大模型网关</em>
        </h1>
        <p className="lede">
          把企业已经买好的海外大模型账号（OpenAI、Anthropic、Google 等），部署成一套全公司能统一使用的企业级 AI 网关：一个入口、一套权限、一个看板、一次切换。我们不是 AI 算力转售商，也不是 API 中间商——账号、数据、服务器、网关代码全部归你所有。
        </p>
        <div style={{ marginTop: 28, display: "flex", gap: 16 }}>
          <a className="btn btn-primary" href={SCHEDULER_URL} target="_blank" rel="noopener noreferrer">
            预约方案沟通 <span className="arr">→</span>
          </a>
        </div>
      </section>

      {/* STATS — VA7 internal usage as proof */}
      <section className="section-tight">
        <span className="kicker">异璧自己跑了一年</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 18px" }}>
          真实使用数据
        </h2>
        <p className="body-text" style={{ marginBottom: 32, maxWidth: 760 }}>
          这套网关不是 PPT 上的概念——异璧团队自己每天都在用。下面是我们内部一年的真实使用量级。
        </p>
        <div className="stats-grid">
          <div className="stat">
            <div className="stat-num">5–10<span className="stat-num-unit">亿</span></div>
            <div className="stat-unit">token / 天</div>
            <div className="stat-label">内部团队 + 客户日常调用</div>
          </div>
          <div className="stat">
            <div className="stat-num">100<span className="stat-num-unit">+</span></div>
            <div className="stat-unit">大模型接入</div>
            <div className="stat-label">OpenAI · Anthropic · Google · Mistral · DeepSeek 等</div>
          </div>
          <div className="stat">
            <div className="stat-num">多<span className="stat-num-unit">租户</span></div>
            <div className="stat-unit">权限分级</div>
            <div className="stat-label">团队 / 项目 / 员工各自的额度、权限、审计</div>
          </div>
          <div className="stat">
            <div className="stat-num">1<span className="stat-num-unit">周</span></div>
            <div className="stat-unit">部署完归客户</div>
            <div className="stat-label">服务器 / 数据 / 代码 / 账号都是你的</div>
          </div>
        </div>
      </section>

      {/* WHEN TO BUY — buyer profile + cost comparison */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 80, marginTop: 80 }}>
        <span className="kicker">什么情况下值得采购</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 18px" }}>
          团队月用量过线，PAYG 就<em>明显贵起来</em>
        </h2>
        <p className="lede" style={{ maxWidth: 880 }}>
          单看经济账：用最顶级模型（Claude / GPT / Gemini）的全员 pay-as-you-go 是一条<strong style={{ color: "var(--cream)" }}>随用量线性上涨</strong>的支出。Gateway 是一条<strong style={{ color: "var(--orange)" }}>固定月费</strong>。当公司月度 token 用量进入 10 亿（1B）量级，两条线就交叉了——再往上，Gateway 越用越省。
        </p>

        <CostChart />

        <p className="body-text" style={{ marginTop: 18, fontSize: 14, color: "var(--cream-dim)", maxWidth: 820 }}>
          上图为示意：水平线 = 你企业自有 subscription/seats + 服务器 + 我方运维的<em>固定</em>月成本；斜线 = 全员各自 PAYG 的<em>线性</em>月成本。交点位置随企业规模、模型组合、上下文长度浮动，10 亿是一个常见 break-even 阈值。<br />
          除了钱，还有 3 件事是 PAYG 模式拿不到的：<strong style={{ color: "var(--cream)" }}>统一权限</strong>（按部门/项目分配）、<strong style={{ color: "var(--cream)" }}>成本可见</strong>（谁花了多少做什么）、<strong style={{ color: "var(--cream)" }}>模型可切换</strong>（业务代码不动，模型一键切）。
        </p>

        <h3 style={{ fontSize: 22, margin: "40px 0 12px" }}>什么情况下你该买这个</h3>
        <div className="buyer-checklist">
          <div className="buyer-item"><span className="check">✓</span><span>团队月度 token 用量已经接近或超过 <strong>10 亿</strong>，PAYG 账单越来越贵</span></div>
          <div className="buyer-item"><span className="check">✓</span><span>员工各自开账号、各自付费，公司<strong>看不到也管不住</strong>谁在用什么</span></div>
          <div className="buyer-item"><span className="check">✓</span><span>多部门、多项目，需要按<strong>组织维度分配额度</strong>和做成本对账</span></div>
          <div className="buyer-item"><span className="check">✓</span><span>有合规 / 审计要求，需要<strong>调用日志</strong>和权限可追溯</span></div>
          <div className="buyer-item"><span className="check">✓</span><span>用了多家厂商（OpenAI / Anthropic / Google），希望<strong>切换模型业务代码不动</strong></span></div>
          <div className="buyer-item"><span className="check">✓</span><span>有海外公司主体 + 海外账号，但<strong>没有 IT 团队</strong>专职运维 AI 基础设施</span></div>
        </div>
      </section>

      {/* SOLVES 3 THINGS — from doc sheet 0 */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 80, marginTop: 80 }}>
        <span className="kicker">解决</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 24px" }}>三件事</h2>
        <div className="price-table">
          {[
            ["员工各自注册账号、各自付费，公司看不见", "全公司统一入口，权限和成本可控"],
            ["ChatGPT、Claude、Gemini 各用各的，切换麻烦", "一套 API，任意切换主流模型"],
            ["AI 月底报销一堆，分不清是哪个部门花的", "部门 / 项目 / 个人维度的成本看板"],
          ].map(([k, v]) => (
            <div className="price-row" key={k}>
              <span className="price-cell k" style={{ width: "50%" }}>{k}</span>
              <span className="price-cell" style={{ width: "50%", color: "var(--orange)", fontWeight: 600 }}>→ {v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FIT */}
      <section className="section-tight">
        <span className="kicker">适合的</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 24px" }}>什么样的企业</h2>
        <div className="fit-grid">
          <div className="fit-col fit-yes">
            <div className="fit-head"><span className="fit-tag">✓ 适合</span></div>
            <ul>
              <li>已经拥有海外公司主体 + 海外大模型账号的出海企业</li>
              <li>团队 10 人以上，员工已经在用海外 AI，但公司缺乏统一管理</li>
              <li>希望把 AI 使用情况可见、可控、可审计</li>
              <li>有 IT 负责人或运营管理员能配合配置和日常使用</li>
              <li>公司要做合规审计 / 财务对账 / 部门成本分摊</li>
            </ul>
          </div>
          <div className="fit-col fit-no">
            <div className="fit-head"><span className="fit-tag">✕ 不适合</span></div>
            <ul>
              <li>还没有海外公司主体、海外账号（我们不代办这些）</li>
              <li>希望我们提供海外 AI 账号或算力（我们不卖账号）</li>
              <li>希望我们承诺账号永不被封、API 永不被限流</li>
              <li>没有 IT 配合、不愿意员工改变 AI 使用习惯</li>
              <li>对 AI / Agent 有强烈抵触抗拒情绪</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TWO PRODUCTS OVERVIEW */}
      <section className="section-tight">
        <span className="kicker kicker-gold">两个独立产品</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 24px" }}>
          一次性部署 + 月度运维（可选）
        </h2>
        <p className="body-text" style={{ marginBottom: 32, maxWidth: 800 }}>
          网关搭建是一次性工程，<strong style={{ color: "var(--cream)" }}>1 周内交付完归你所有</strong>。
          上线之后，是否订阅我们的月度运维由你决定——有专业 IT 团队的企业可以自己维护，没有的话由我们兜底。
        </p>

        <div className="cards-2">
          <div className="card" style={{ borderTop: "3px solid var(--orange)" }}>
            <div className="card-meta">
              <span className="tag">产品 ① · 一次性</span>
              <span>SETUP</span>
            </div>
            <h3>网关搭建与部署</h3>
            <p className="card-desc">
              1 周内完成现场调研 → 部署 → 模型接入 → 权限配置 → 管理员培训。交付完账号、服务器、网关代码、所有数据都归你所有，我们退出。
            </p>
            <div className="card-foot" style={{ borderTop: "1px solid var(--line-soft)", marginTop: 18, paddingTop: 14 }}>
              <span className="price-tag">¥8,000 起</span>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>200 人以内 · 5 模型 · 10 个 key</span>
            </div>
          </div>

          <div className="card" style={{ borderTop: "3px solid var(--gold)" }}>
            <div className="card-meta">
              <span className="tag" style={{ color: "var(--gold)" }}>产品 ② · 月度订阅</span>
              <span>OPS</span>
            </div>
            <h3>持续运维（可选）</h3>
            <p className="card-desc">
              上游 API 变更适配、新模型适配、配置调整、日常答疑、异常定位、月度报表——这些事我们替你扛。终止订阅后系统继续归你，无任何卡脖子环节。
            </p>
            <div className="card-foot" style={{ borderTop: "1px solid var(--line-soft)", marginTop: 18, paddingTop: 14 }}>
              <span className="price-tag" style={{ color: "var(--gold)" }}>¥1,000 / 月 起</span>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>3 个月起订 · 12 月签约 9 折</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT 1 DETAILS */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 80, marginTop: 80 }}>
        <span className="kicker">产品 ①</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 8px" }}>
          网关搭建与部署 · <span style={{ color: "var(--orange)" }}>¥8,000 起</span>
        </h2>
        <p className="lede" style={{ marginBottom: 24 }}>
          1 周以内，把企业 AI 网关装好、接好、配好。
        </p>

        <h3 style={{ fontSize: 22, margin: "32px 0 14px" }}>交付内容 · 7 项</h3>
        <div className="companion-grid">
          <div className="companion-item">
            <div className="companion-icon"><Search size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">现场调研</div>
            <div className="companion-desc">工程师上门半天，梳理企业网络、组织架构、账号情况、权限诉求，输出配置方案。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><Server size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">网关系统部署</div>
            <div className="companion-desc">在客户服务器上部署企业级 AI 网关（基于成熟开源框架定制），数据库初始化、安全配置。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><Plug size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">多模型接入</div>
            <div className="companion-desc">接入客户已有的所有海外大模型账号，统一 API 出口。5 个模型 / 10 个 key 在标准包内。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><ShieldCheck size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">用户与权限配置</div>
            <div className="companion-desc">按部门 / 角色配置初始用户、权限矩阵、使用配额、模型路由策略。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><Activity size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">监控与告警</div>
            <div className="companion-desc">基础监控大盘 + 告警通知（用量异常、错误率异常等）。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><Globe size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">域名与 SSL</div>
            <div className="companion-desc">配置企业内部访问域名和 HTTPS。</div>
          </div>
          <div className="companion-item" style={{ gridColumn: "span 1" }}>
            <div className="companion-icon"><GraduationCap size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">管理员培训 + 操作手册</div>
            <div className="companion-desc">1 小时培训（系统概览 / 用户权限 / 配额 / 上游模型 / 异常处理）+ PDF 操作手册。建议 1-3 人，超过 3 人 +¥500 / 人。</div>
          </div>
        </div>

        <h3 style={{ fontSize: 22, margin: "40px 0 14px" }}>交付节奏 · 1 周</h3>
        <div className="delivery-timeline">
          <div className="dt-track" />
          <div className="dt-stages">
            <div className="dt-step">
              <div className="dt-circle">1</div>
              <div className="dt-label">现场调研</div>
              <div className="dt-duration">Day 1</div>
              <div className="dt-desc">工程师上门，半天</div>
            </div>
            <div className="dt-step">
              <div className="dt-circle">2</div>
              <div className="dt-label">方案确认</div>
              <div className="dt-duration">Day 2</div>
              <div className="dt-desc">输出配置方案 + QA List，客户确认</div>
            </div>
            <div className="dt-step">
              <div className="dt-circle">3</div>
              <div className="dt-label">部署 · 接入 · 配置</div>
              <div className="dt-duration">Day 3 – 5</div>
              <div className="dt-desc">部署、多模型接入、用户权限、监控配置</div>
            </div>
            <div className="dt-step">
              <div className="dt-circle">4</div>
              <div className="dt-label">测试 · 验收 · 培训</div>
              <div className="dt-duration">Day 6 – 7</div>
              <div className="dt-desc">客户验收 + 1 小时管理员培训</div>
            </div>
          </div>
          <div className="dt-footer">
            <span>标准交付节奏</span>
            <span><strong>1 周</strong> 完成全部部署</span>
          </div>
        </div>

        <h3 style={{ fontSize: 22, margin: "40px 0 14px" }}>价格 · 3 档</h3>
        <div className="price-table">
          <div className="price-row">
            <span className="price-cell k">标准部署包</span>
            <span className="price-cell v">¥8,000 起</span>
            <span className="price-cell note">200 人以内团队 · 5 个上游模型 · 10 个 API key</span>
          </div>
          <div className="price-row">
            <span className="price-cell k">复杂集成</span>
            <span className="price-cell v">¥5,000 – 30,000</span>
            <span className="price-cell note">SSO、AD / LDAP、HR 系统对接等，单独评估</span>
          </div>
          <div className="price-row">
            <span className="price-cell k">超规模部署</span>
            <span className="price-cell v">单独评估</span>
            <span className="price-cell note">200 人以上、多区域、高可用集群</span>
          </div>
        </div>

        <h3 style={{ fontSize: 22, margin: "40px 0 14px" }}>客户需要准备</h3>
        <div className="price-table" style={{ marginTop: 0 }}>
          <div className="price-row">
            <span className="price-cell k">海外大模型账号</span>
            <span className="price-cell note">OpenAI / Anthropic / Google 等，客户自有</span>
          </div>
          <div className="price-row">
            <span className="price-cell k">服务器</span>
            <span className="price-cell note">一台 VPS：&lt;50 人 2C4G50G · 50–100 人 4C8G100G · 100–200 人 8C16G200G</span>
          </div>
          <div className="price-row">
            <span className="price-cell k">域名</span>
            <span className="price-cell note">一个用于网关访问的域名</span>
          </div>
          <div className="price-row">
            <span className="price-cell k">管理员</span>
            <span className="price-cell note">1-3 名，接受培训后负责日常运营</span>
          </div>
          <div className="price-row">
            <span className="price-cell k">组织架构</span>
            <span className="price-cell note">部门、人员清单，提供给工程师做初始配置</span>
          </div>
        </div>

        <p className="body-text" style={{ marginTop: 18, fontSize: 13.5, color: "var(--cream-dim)" }}>
          服务器、域名、模型 API 费用由客户自行承担，云服务费、API 调用费由客户直接付费给上游，不经过我方。
        </p>
      </section>

      {/* PRODUCT 2 DETAILS */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 80, marginTop: 80 }}>
        <span className="kicker kicker-gold">产品 ② · 可选订阅</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 8px" }}>
          持续运维 · <span style={{ color: "var(--gold)" }}>¥1,000 / 月起</span>
        </h2>
        <p className="lede" style={{ marginBottom: 8 }}>
          网关上线之后，真正的麻烦在长期运行里——OpenAI 改 API、Claude 出新模型、上游限速、配额调整、月度对账。
        </p>
        <p className="body-text" style={{ marginBottom: 24 }}>
          这些事单独看都不大，加起来就是一个不专职的 IT 同事会被烦死的工作量。我们的运维 scope 卡得很清楚——只解决「网关侧」的事。
        </p>

        <h3 style={{ fontSize: 22, margin: "32px 0 14px" }}>包含什么 · 6 项</h3>
        <div className="companion-grid">
          <div className="companion-item">
            <div className="companion-icon"><RefreshCw size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">上游协议跟进</div>
            <div className="companion-desc">OpenAI / Anthropic / Google 等更新 API 格式或新增模型时，我们做兼容。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><ArrowUpCircle size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">网关版本升级</div>
            <div className="companion-desc">系统版本升级、安全补丁、Bug 修复。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><Settings2 size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">配置调整</div>
            <div className="companion-desc">增删改用户、部门、配额、模型路由等。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><MessagesSquare size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">日常答疑</div>
            <div className="companion-desc">微信 / 钉钉群内工作时间响应，管理员有问题随时问。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><AlertTriangle size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">异常初步定位</div>
            <div className="companion-desc">系统报错、用量异常时协助定位。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><FileBarChart2 size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">月度报表</div>
            <div className="companion-desc">用量、成本、错误率等月度数据汇总。</div>
          </div>
        </div>

        <h3 style={{ fontSize: 22, margin: "40px 0 14px" }}>定价</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, maxWidth: 720 }}>
          <div className="pricing-card">
            <div className="pc-tier">月包</div>
            <div className="pc-amount">
              <span className="num">¥1,000</span>
              <span className="unit">/ 月</span>
            </div>
            <div className="pc-foot">3 个月起订 · 工作日 9-18 群内 4 小时响应</div>
          </div>
          <div className="pricing-card is-featured">
            <div className="pc-tier">
              年包
              <span className="pc-tier-badge">8 折</span>
            </div>
            <div className="pc-amount">
              <span className="num">¥800</span>
              <span className="unit">/ 月</span>
            </div>
            <div className="pc-foot">
              年付 <strong>¥9,600 / 年</strong>，比月付省 ¥2,400
            </div>
          </div>
        </div>
        <p className="body-text" style={{ marginTop: 16, fontSize: 13.5, color: "var(--cream-dim)", maxWidth: 820 }}>
          <strong style={{ color: "var(--cream)" }}>非标增项 单独沟通定价</strong>：非工作时间紧急响应、月度配置调整超过 1 次的超频部分、7×24 全天候定制运维——这几件事单次成本难标准化，按实际情况评估。
        </p>

        <h3 style={{ fontSize: 22, margin: "40px 0 14px" }}>不在运维范围内</h3>
        <div className="price-table">
          {[
            ["上游账号被封、被限流", "客户自行联系 OpenAI / Anthropic 处理，我们配合接入新账号"],
            ["服务器本身性能 / 硬件 / 宕机", "客户自行处理云服务商问题"],
            ["客户网络问题（防火墙 / 带宽 / 运营商）", "客户自行解决"],
            ["客户业务代码层面的 Bug", "客户开发团队负责"],
            ["上游账号充值、付费", "员工自行操作"],
          ].map(([k, v]) => (
            <div className="price-row" key={k}>
              <span className="price-cell k" style={{ width: "40%" }}>{k}</span>
              <span className="price-cell note" style={{ width: "60%" }}>{v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* LOCAL MODEL CALLOUT */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 80, marginTop: 80 }}>
        <span className="kicker kicker-gold">不在标品里 · 定制</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 18px" }}>
          有<em>自有本地算力</em>？也能接进 Gateway
        </h2>
        <p className="lede" style={{ maxWidth: 880 }}>
          一些企业（金融、医疗、央国企、有合规约束的出海公司）有自己的 GPU 集群或本地推理服务，想把开源大模型（Llama、Qwen、DeepSeek、Mistral 等）和云端 API 模型一起接到同一个 Gateway。这件事我们能做，但不在标准部署包里——架构、网络、安全和 SLA 都需要单独评估。
        </p>

        <div className="local-callout">
          <div>
            <h3>
              <em>混合云 / 本地</em>大模型接入
            </h3>
            <p>
              统一入口同时接通：
            </p>
            <ul className="solution-metrics" style={{ marginTop: 10 }}>
              <li>云端商业模型（OpenAI / Anthropic / Google / Mistral 等）</li>
              <li>本地开源模型（vLLM / SGLang / Ollama / TGI / TensorRT-LLM 推理服务）</li>
              <li>企业自部署的微调 / RAG / 蒸馏模型</li>
              <li>按敏感度路由：内部数据走本地、公开任务走云端</li>
            </ul>
          </div>
          <div>
            <h3 style={{ marginBottom: 14 }}>评估时我们需要了解</h3>
            <ul className="solution-metrics" style={{ marginBottom: 22 }}>
              <li>本地模型部署方式（推理框架 / 显存规格 / 集群数量）</li>
              <li>预期并发与 QPS</li>
              <li>数据敏感等级与合规要求（私有部署 / 审计 / 加密）</li>
              <li>是否需要训练 / 微调 / RAG 流水线</li>
            </ul>
            <a
              className="btn btn-primary"
              href={SCHEDULER_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              联系销售评估 <span className="arr">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* GLOBAL BOUNDARY */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 80, marginTop: 80 }}>
        <span className="kicker">全局边界</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 24px" }}>我们做 / 不做</h2>
        <div className="cards-2">
          <div className="card">
            <h3 style={{ color: "var(--cream)" }}>我们做</h3>
            <ul className="card-desc" style={{ paddingLeft: 20, marginTop: 8 }}>
              <li>在客户已有海外账号的基础上，搭建企业级 AI 网关</li>
              <li>接入客户已有的所有主流海外大模型</li>
              <li>配置用户、权限、配额、监控、审计</li>
              <li>培训管理员（1 小时 + PDF 手册）</li>
              <li>提供长期运维支持（可选）</li>
            </ul>
          </div>
          <div className="card">
            <h3 style={{ color: "var(--muted)" }}>我们不做</h3>
            <ul className="card-desc" style={{ paddingLeft: 20, marginTop: 8 }}>
              <li>不提供海外公司主体注册</li>
              <li>不提供海外大模型账号</li>
              <li>不卖 API 算力或 token</li>
              <li>不承诺账号永不被封 / API 永不被限流</li>
              <li>不代客户管理上游账号的充值与付款</li>
              <li>不解决客户自有服务器、网络、业务代码的问题</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <span className="kicker">FAQ</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 8px" }}>常见问题</h2>
        <FaqAccordion items={[
          {
            q: "能不能自己搭？",
            a: "可以。网关基于成熟的开源项目，有技术团队的企业完全可以自行部署。我们提供的价值是省去摸索时间、规避常见部署坑（数据库迁移、镜像版本、安全配置、模型适配等），以及长期的运维兜底。",
          },
          {
            q: "部署完之后系统归谁？",
            a: "完全归客户。服务器、数据、网关代码、所有账号都是客户的。我们交付完即退出，运维期外不再访问客户系统。",
          },
          {
            q: "如果终止运维订阅，会发生什么？",
            a: "系统继续归客户所有，正常运行。客户可以自己运维或换其他运维方。我们撤回所有访问权限，不留任何卡脖子环节。",
          },
          {
            q: "海外账号被封了怎么办？",
            a: "账号是客户的，被封是客户和上游之间的事，我们不能也不应该插手。运维范围内，我们做的是「账号换了之后，帮你把新账号接到网关里」——这部分是网关侧的事。",
          },
          {
            q: "服务器宕机算运维范围吗？",
            a: "不算。服务器是客户的资产，服务器层面的问题（性能、网络、硬件）由客户自己解决。我们运维的是网关系统本身。",
          },
          {
            q: "上游 API 变了，要自己改吗？",
            a: "不用。上游服务商更新 API 格式、新增模型、调整参数，这些是运维的核心工作之一。我们会及时跟进做兼容适配，客户不用关心。",
          },
          {
            q: "我们已经有自己的 IT 团队，还需要运维订阅吗？",
            a: "不一定。如果客户 IT 团队对 AI 网关运维熟悉、有时间维护，完全可以不订阅运维。我们也乐意把内部运维 SOP 分享给客户 IT 团队，帮他们快速上手。运维订阅适合「没有专职 IT 维护这件事的精力」的企业。",
          },
          {
            q: "数据安全怎么处理？",
            a: "所有数据存在客户自己的服务器上，我们运维期间通过子账号访问，所有操作有日志可查。客户随时可以撤回访问权限。更高的安全要求（私有部署、审计日志、加密强化）可以单独评估。",
          },
          {
            q: "这套和「跨境电商 AI 运营系统」是什么关系？",
            a: "企业 AI 网关是基础设施层——把 AI 接给员工用。AI 运营系统是应用层——让员工真正把 AI 放进业务流程。两者可以独立使用，也可以一起用。先有网关、再做运营系统，是最自然的路径。",
          },
        ]} />
      </section>
    </div>
  );
}
