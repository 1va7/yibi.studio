import Link from "next/link";
import InstructorSocials, { type Social } from "@/components/InstructorSocials";

export const metadata = {
  title: "公开课程",
  description:
    "两位实战派讲师（亚马逊 BSR 操盘手 + AI 创业者），把选品 / Listing / 广告 / 复盘 4 大场景跑一遍。带走 6 大类 Agents + 200+ Skills + 100+ 指标的完整运营基建。",
};

const COMMUNITY_FORM_URL =
  "https://ycnm1prsz3tg.feishu.cn/share/base/form/shrcnCu8CiLYWFiOJJIy9lOTqxd";
const MIKE_AMAZON =
  "https://alliance.amazonads.cn/partner/detail?id=6e6d8e3ae52d11f0b2d10a27846473e8";
const VA7_AMAZON =
  "https://alliance.amazonads.cn/partner/detail?id=ef3d193c1d2411f1b2d10a27846473e8";

const MIKE_SOCIALS: Social[] = [
  {
    type: "wechat-mp",
    label: "跨境电商策",
    count: "2w+",
    qr: "/assets/team/qr-wechat-mp.jpg",
  },
];

const VA7_SOCIALS: Social[] = [
  {
    type: "wechat-channels",
    label: "VA7-AI 创业版",
    count: "2w+",
    qr: "/assets/team/qr-wechat-channels.png",
  },
  {
    type: "xiaohongshu",
    label: "小红书",
    count: "1w+",
    href: "https://www.xiaohongshu.com/user/profile/5bfd693851783a4917f40d5a",
  },
  {
    type: "douyin",
    label: "抖音",
    count: "2w+",
    href: "https://v.douyin.com/Xts7kZ3qvCI/",
  },
];

export default function CoursesPage() {
  return (
    <div className="wrap">
      <section className="page-hero" style={{ paddingBottom: 32 }}>
        <div className="eyebrow">AMAZON · CROSS-BORDER OPERATIONS</div>
        <h1>
          两天一夜，搭出
          <br />
          会自我迭代的 <em>亚马逊 AI 运营系统</em>
        </h1>
        <p className="lede" style={{ maxWidth: 880 }}>
          选品 / Listing / 广告 / 复盘 实战。把冠军运营打法沉淀在公司，让 Agent 越跑越懂业务——你带走的不是几条 prompt，而是一套可以在公司内部复制、追踪、复盘和持续优化的运营基建。
        </p>
      </section>

      {/* COURSE STATS */}
      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="course-stats">
          <div className="course-stat">
            <div className="num">1<span className="plus"></span></div>
            <div className="label">套 AI 运营系统</div>
            <div className="sub">SELF-ITERATING</div>
          </div>
          <div className="course-stat">
            <div className="num">6</div>
            <div className="label">大类 Agents</div>
            <div className="sub">老板 / 运营 / 选品 / Listing / 广告 / 复盘</div>
          </div>
          <div className="course-stat">
            <div className="num">10<span className="plus">+</span></div>
            <div className="label">业务数据源</div>
            <div className="sub">DATA SOURCES</div>
          </div>
          <div className="course-stat">
            <div className="num">100<span className="plus">+</span></div>
            <div className="label">数据指标追踪</div>
            <div className="sub">KPI TRACKING</div>
          </div>
          <div className="course-stat">
            <div className="num">200<span className="plus">+</span></div>
            <div className="label">运营 Skills</div>
            <div className="sub">REUSABLE</div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section-tight" style={{ paddingTop: 0 }}>
        <span className="kicker">关于这门课 · ABOUT</span>
        <h2 className="h-section" style={{ fontSize: 38, margin: "14px 0 18px" }}>
          不是<em>多用几个 AI 工具</em>，是把整套运营系统搭起来
        </h2>
        <p className="body-text" style={{ maxWidth: 880 }}>
          两天一夜，我们会用一个真实小众品类，跑完选品、Listing、广告、复盘主链路；现场把运营判断、数据源、动作记录和员工经验，沉淀进一套会自我迭代的亚马逊 AI 运营系统。
        </p>
        <ul className="solution-metrics" style={{ marginTop: 14, maxWidth: 880 }}>
          <li><strong>买了一堆 AI 工具</strong>，订单和利润没有明显变化</li>
          <li><strong>做过 BSR</strong>，但团队复刻不出当年的打法</li>
          <li><strong>头牌运营一离职</strong>，选品经验、广告判断和复盘习惯一起被带走</li>
        </ul>
      </section>

      {/* INSTRUCTORS */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 56 }}>
        <span className="kicker kicker-gold">讲师 · INSTRUCTORS</span>
        <h2 className="h-section" style={{ fontSize: 38, margin: "14px 0 24px" }}>
          两位<em>实战派</em>讲师
        </h2>

        <div className="instructor-grid">
          <div className="instructor-card">
            <div className="instructor-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/team/mike.jpg" alt="Mike" />
            </div>
            <div>
              <div className="instructor-handle">@Mike</div>
              <div className="instructor-role">亚马逊运营操盘手 · 跨境精品卖家实战派</div>
              <p className="instructor-bio">
                12 年亚马逊一线运营，操盘多个 BSR 类目年 GMV 超 3 亿。从选品到广告到复盘全链路打过仗，带过的运营头牌人均独立做出过爆品。现在每周还在自己的真品类里跑 Agent。
              </p>
              <ul className="instructor-creds">
                <li>12 年亚马逊运营，BSR 类目年 GMV <strong>3 亿+</strong></li>
                <li>上海交通大学 硕士</li>
                <li>头部卖家内培 <strong>30+ 场</strong></li>
                <li>
                  <a href={MIKE_AMAZON} target="_blank" rel="noopener noreferrer">
                    亚马逊广告卖家讲师 ↗
                  </a>
                </li>
              </ul>
              <InstructorSocials socials={MIKE_SOCIALS} />
            </div>
          </div>

          <div className="instructor-card">
            <div className="instructor-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/team/va7.jpg" alt="VA7" />
            </div>
            <div>
              <div className="instructor-handle">@VA7</div>
              <div className="instructor-role">AI 连续创业者 · 异璧科技创始人</div>
              <p className="instructor-bio">
                深耕 AI 落地 8 年，从机器学习、大模型到多 Agent 协作与员工蒸馏。团队日均约 5 亿 Token 企业 Agent 实战调用，累计数百亿 Token 级落地经验。
              </p>
              <ul className="instructor-creds">
                <li>AI 创业 <strong>8 年</strong>，日均 5 亿 Token 企业实战</li>
                <li>芝加哥大学 硕士</li>
                <li>服务跨境电商卖家 <strong>100+</strong></li>
                <li>
                  <a href={VA7_AMAZON} target="_blank" rel="noopener noreferrer">
                    亚马逊广告卖家讲师 ↗
                  </a>
                </li>
              </ul>
              <InstructorSocials socials={VA7_SOCIALS} />
            </div>
          </div>
        </div>
      </section>

      {/* FOR WHOM */}
      <section className="section-tight">
        <span className="kicker">适合什么人 · FOR WHOM</span>
        <h2 className="h-section" style={{ fontSize: 38, margin: "14px 0 18px" }}>
          带着真实业务来的人
        </h2>
        <div className="fit-grid">
          <div className="fit-col fit-yes">
            <div className="fit-head"><span className="fit-tag">✓ 适合</span></div>
            <ul>
              <li>跨境电商企业 <strong>老板</strong> / 合伙人 / 运营总监</li>
              <li>团队规模 <strong>10–100 人</strong>、想做 AI 化的精品卖家</li>
              <li>有 BSR 或类目 top 经验、想把打法沉淀的团队</li>
              <li>已经在用 AI 工具，但效果模糊、缺系统化路径</li>
            </ul>
          </div>
          <div className="fit-col fit-no">
            <div className="fit-head"><span className="fit-tag">✕ 不适合</span></div>
            <ul>
              <li>纯找 prompt 模板和工具列表的人</li>
              <li>没有真实在跑的亚马逊业务、只想听理论</li>
              <li>期待两天上完就有「保证爆款」的承诺</li>
              <li>对 AI / Agent 有强烈抵触情绪</li>
            </ul>
          </div>
        </div>
      </section>

      {/* WHAT YOU TAKE AWAY */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 56 }}>
        <span className="kicker kicker-gold">学员收获 · WHAT YOU&apos;LL TAKE AWAY</span>
        <h2 className="h-section" style={{ fontSize: 38, margin: "14px 0 24px" }}>
          能带回公司直接复用
        </h2>
        <div className="module-grid">
          <div className="module-card">
            <div className="mod-n">01</div>
            <h4>1 套会自我迭代的 AI 系统</h4>
            <p>看懂老板、运营、Agent、数据和复盘机制如何协作，回公司能直接落地复用。</p>
          </div>
          <div className="module-card">
            <div className="mod-n">02</div>
            <h4>6 大类 Agents + 200+ Skills</h4>
            <p>从选品、Listing、广告到复盘，把高手动作拆成可复用、可调度、可迭代的 Skill 能力。</p>
          </div>
          <div className="module-card">
            <div className="mod-n">03</div>
            <h4>10+ 数据源 + 100+ 指标</h4>
            <p>让 Agent 不只是会回答，而是基于业务数据持续判断、动态调整、自我修正。</p>
          </div>
          <div className="module-card">
            <div className="mod-n">04</div>
            <h4>BSR 复盘与员工蒸馏机制</h4>
            <p>把爆品打法、广告判断和头牌运营经验沉淀成公司资产，离职带不走、新员工能调用。</p>
          </div>
        </div>
      </section>

      {/* COURSE OUTLINE */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 56 }}>
        <span className="kicker">课程大纲 · COURSE OUTLINE</span>
        <h2 className="h-section" style={{ fontSize: 38, margin: "14px 0 8px" }}>
          两天 · 8 个模块 · 完整链路
        </h2>

        <div className="day-block">
          <div className="day-head">
            <span className="day-n">01</span>
            <span className="day-t">第一天 · AI 接入运营主链路</span>
            <span className="day-en">Day 1 · Wire AI into the operations backbone</span>
          </div>
          <div className="day-body">
            <ul className="day-modules">
              <li>
                <span className="mod-id">M01</span>
                <span>为什么买了 AI 工具，业务却没有变化：工具焦虑 / 系统缺失 / AI 基建</span>
              </li>
              <li>
                <span className="mod-id">M02</span>
                <span>从数据孤岛到数据土壤：10+ 数据源、100+ 指标如何变成 Agent 上下文</span>
              </li>
              <li>
                <span className="mod-id">M03</span>
                <span>6 大类 Agents 如何协作：老板 / 运营 / 选品 / Listing / 广告 / 复盘</span>
              </li>
              <li>
                <span className="mod-id">M04</span>
                <span>选品、财务预估、竞品判断如何 Agent 化：真实小众品类 + ABA 数据库</span>
              </li>
            </ul>
            <div className="day-deliverables">
              <div className="dl-head">本日交付物 · Day 1 Deliverables</div>
              <ul>
                <li>1 套公司 AI 运营系统健康诊断表</li>
                <li>6 大类 Agents 角色与协作图</li>
                <li>10+ 数据源清单 + 100+ 指标追踪框架</li>
                <li>选品 / Listing / 广告核心链路 Agent 预设</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="day-block">
          <div className="day-head">
            <span className="day-n">02</span>
            <span className="day-t">第二天 · 复盘沉淀 · 自我迭代</span>
            <span className="day-en">Day 2 · Reflection, distillation, self-iteration</span>
          </div>
          <div className="day-body">
            <ul className="day-modules">
              <li>
                <span className="mod-id">M01</span>
                <span>Listing 与广告优化闭环演示：Rufus / AEO / 竞品逆向 / 广告策略复测</span>
              </li>
              <li>
                <span className="mod-id">M02</span>
                <span>完整 AI 运营系统跑通：从任务、数据、Agent、Skills 到复盘日志</span>
              </li>
              <li>
                <span className="mod-id">M03</span>
                <span>AI 建议和老板经验冲突时如何决策：建议、否决、复测、归档机制</span>
              </li>
              <li>
                <span className="mod-id">M04</span>
                <span>员工方法论如何自动蒸馏：从行为数据、Agent Logs、复盘记录提炼打法</span>
              </li>
            </ul>
            <div className="day-deliverables">
              <div className="dl-head">本日交付物 · Day 2 Deliverables</div>
              <ul>
                <li>完整链路 Agents + Skills 集合</li>
                <li>200+ 运营 Skills 地图 / 预设库</li>
                <li>广告建议复测与归档模板</li>
                <li>BSR 打法复盘模板</li>
                <li>员工方法论蒸馏与 AI 能力评估框架</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ENROLLMENT BANNER */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 56 }}>
        <span className="kicker-xl">★ 正在报名 · ENROLLMENT</span>
        <h2 style={{ marginTop: 14, fontSize: 38 }}>
          把<em>冠军运营打法</em>沉淀进你的公司
        </h2>

        <div className="course-banner" style={{ margin: "28px 0 0" }}>
          <div className="cb-left">
            <div className="cb-meta" style={{ marginTop: 12 }}>
              <span><strong>5 月 30 - 31 日</strong></span>
              <span className="dot" />
              <span>深圳</span>
              <span className="dot" />
              <span><strong>¥5,999 / 人</strong></span>
            </div>
            <p className="body-text" style={{ marginTop: 18, maxWidth: 580 }}>
              <strong style={{ color: "var(--cream)" }}>扫码加 Mike 老师微信报名</strong>。报名后客户成功经理会跟进确认行程、餐食和场地细节。
            </p>
            <p style={{ marginTop: 14, fontSize: 14, color: "var(--cream-dim)" }}>
              右侧即 Mike 老师二维码。
            </p>
          </div>
          <div className="cb-right">
            <div
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  background: "#fff",
                  padding: 12,
                  border: "1px solid var(--line)",
                  lineHeight: 0,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/team/qr-mike-wechat.png"
                  alt="加 Mike 老师微信报名"
                  width={170}
                  height={170}
                  style={{ display: "block", width: 170, height: 170 }}
                />
              </div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: ".18em",
                  color: "var(--muted)",
                  textTransform: "uppercase",
                }}
              >
                Mike 老师 · 扫码报名
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAST COHORTS + ENTERPRISE — 2 columns */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 56, paddingBottom: 64 }}>
        <div className="cards-2">
          {/* Past cohort */}
          <div style={{ padding: "32px 32px 28px", border: "1px solid var(--line)", background: "var(--ink-2)", display: "flex", flexDirection: "column" }}>
            <span className="kicker kicker-gold" style={{ marginBottom: 10 }}>往期课程 · ALUMNI</span>
            <h3 style={{ fontSize: 26, color: "var(--cream)", margin: "8px 0 10px" }}>
              OpenClaw <em style={{ color: "var(--gold)", fontStyle: "normal" }}>跨境航海训练营</em>
            </h3>
            <p className="body-text" style={{ fontSize: 14, marginBottom: 18 }}>
              21 天线上长周期航海陪跑。跨境电商 × Agent 领域<strong style={{ color: "var(--cream)" }}>最早的系统训练营</strong>。
            </p>
            <ul className="solution-metrics" style={{ marginBottom: 22 }}>
              <li><strong>463 人</strong> 完成 21 天首期</li>
              <li>每周 3 场直播 + 6 次实战作业</li>
              <li>4 位全职教练带教</li>
            </ul>
            <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--line-soft)" }}>
              <p style={{ fontSize: 13, color: "var(--cream-dim)", marginBottom: 14 }}>
                <strong style={{ color: "var(--gold)" }}>二期敬请期待</strong>——加入社群获取首发通知
              </p>
              <a
                className="btn btn-ghost"
                href={COMMUNITY_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: "12px 18px", fontSize: 12 }}
              >
                加入社群 <span className="arr">→</span>
              </a>
            </div>
          </div>

          {/* Enterprise training */}
          <div style={{ padding: "32px 32px 28px", border: "1px solid var(--line)", background: "var(--ink-2)", display: "flex", flexDirection: "column" }}>
            <span className="kicker" style={{ marginBottom: 10 }}>企业内训 · ENTERPRISE</span>
            <h3 style={{ fontSize: 26, color: "var(--cream)", margin: "8px 0 10px" }}>
              整个团队<em>一起上一遍</em>
            </h3>
            <p className="body-text" style={{ fontSize: 14, marginBottom: 18 }}>
              公开课程是<strong style={{ color: "var(--cream)" }}>个人付费</strong>。企业团队可定制内训：标准课程 + 客户业务做练习。
            </p>
            <ul className="solution-metrics" style={{ marginBottom: 22 }}>
              <li>≤ 20 人 <strong>¥19,800 起</strong></li>
              <li>21–50 人 ¥29,800 · 51–100 人 ¥49,800</li>
              <li>客户业务定制版 +¥10,000 起</li>
            </ul>
            <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--line-soft)" }}>
              <p style={{ fontSize: 13, color: "var(--cream-dim)", marginBottom: 14 }}>
                标准课程 6 小时 / 4 节，线上线下均可
              </p>
              <Link
                className="btn btn-primary"
                href="/services#training"
                style={{ padding: "12px 18px", fontSize: 12 }}
              >
                看企业内训详情 <span className="arr">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
