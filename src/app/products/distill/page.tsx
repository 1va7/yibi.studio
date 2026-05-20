import Link from "next/link";
import { FEISHU_SCHEDULER_URL } from "@/lib/links";

export const metadata = {
  title: "经验蒸馏 · Experience Distillation",
  description:
    "把好员工的判断变成组织数字资产。3 步：采集（Sensing）/ 识别模式（Patterns）/ 蒸馏成 Skill（Distillation）。Pixel Distill 算法从员工真实工作数据反向识别判断模式。",
};

const SCHEDULER_URL = FEISHU_SCHEDULER_URL;

export default function DistillPage() {
  return (
    <div className="wrap">
      {/* HERO */}
      <section className="page-hero">
        <div className="eyebrow">★ 异璧产品 · 研发中 · 开放内测</div>
        <h1>
          把好员工的<em>经验判断</em>
          <br />
          变成组织的<em>数字资产</em>
        </h1>
        <p className="lede" style={{ marginTop: 18, fontSize: 22, fontWeight: 600, color: "var(--gold)", maxWidth: 880, fontFamily: "var(--serif-en)", fontStyle: "italic" }}>
          经验蒸馏 · Experience Distillation
        </p>
        <p className="body-text" style={{ maxWidth: 820, marginTop: 14 }}>
          头牌运营一离职，选品打法、广告判断和复盘习惯也跟着走了。我们用 Pixel Distill 算法从员工真实工作数据里反向识别判断模式，沉成新员工和 Agent 都能调用的 Skill。
        </p>

        <div className="data-source-strip">
          <span className="dss-label">数据源</span>
          <span className="dss-item">飞书</span>
          <span className="dss-item">Chrome</span>
          <span className="dss-item">Edge</span>
          <span className="dss-item">紫鸟浏览器</span>
          <span className="dss-item">Claude Code</span>
          <span className="dss-item">Codex</span>
          <span className="dss-item">OpenClaw</span>
          <span className="dss-item">Hermes</span>
        </div>

        <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <a className="btn btn-primary" href={SCHEDULER_URL} target="_blank" rel="noopener noreferrer">
            申请<strong style={{ color: "#FFE6A8" }}>限时免费</strong>内测 <span className="arr">→</span>
          </a>
        </div>
      </section>

      {/* PAIN — every day, by hand */}
      <section className="section-tight">
        <span className="kicker">每天，手工，凭脑子</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 8px" }}>
          这些动作里，藏着公司<em>真正值钱的东西</em>
        </h2>
        <p className="body-text" style={{ maxWidth: 820, marginBottom: 8 }}>
          组织里最值钱的不是 SOP，是这些每天发生、却没被记下来的判断。
        </p>
        <div className="pain-grid">
          <div className="pain-card">
            <div className="pain-tag">№ 01 · 选品</div>
            <h4>看了 50 个竞品，拍板凭手感</h4>
            <p>
              拉了 6 张表、看了 50 个 ASIN、问了一圈 ABA。最后选哪个，怎么排序，靠的是头牌脑子里那套筛选标准。
              <em>新人复制不出来——他只是看到了你看到的最后那张图。</em>
            </p>
          </div>
          <div className="pain-card">
            <div className="pain-tag">№ 02 · 广告</div>
            <h4>凭"感觉这周该加预算"调出价</h4>
            <p>
              ACOS、TACoS、转化率、自然位都看了。最后加一档还是减一档，是几年的手感。
              <em>没人能复盘他为什么这么调——也没人能在他离职那天接上。</em>
            </p>
          </div>
          <div className="pain-card">
            <div className="pain-tag">№ 03 · Listing</div>
            <h4>一条一条改，一处一处看效果</h4>
            <p>
              改了标题第二个词，CTR 涨了；换了第三张图，转化掉了。
              <em>这些细颗粒的反馈在头牌脑子里成了感觉，但在公司系统里没有任何留痕。</em>
            </p>
          </div>
          <div className="pain-card">
            <div className="pain-tag">№ 04 · 复盘</div>
            <h4>BSR 那次的打法，散在飞书 + 微信群里</h4>
            <p>
              当年的群消息、Excel、晨会纪要——都在。但没人能从里面完整拼出那次的判断脉络。
              <em>做过 BSR 的团队复刻不出当年的打法，关键判断在那个人脑子里。</em>
            </p>
          </div>
        </div>
      </section>

      {/* COUNTER-POSITIONING */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 56 }}>
        <span className="kicker kicker-gold">现有解法 / 不是不试，是试过了</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 8px" }}>
          为什么<em>这件事一直没被做成</em>
        </h2>
        <p className="body-text" style={{ maxWidth: 820 }}>
          公司里早就试过把头牌的经验留下来。下面是常见的三种尝试，和它们为什么不够。
        </p>

        <div className="counter-list">
          <div className="counter-row">
            <div className="alt">
              <strong>写 SOP</strong>
              <em>每年花几个月做流程梳理</em>
            </div>
            <div className="arr">→</div>
            <div className="ours">
              SOP 写得下流程，<strong>写不下判断</strong>。流程是"先做什么再做什么"，判断是"看到这个为什么选那个"。后者不是文档能记的。
            </div>
          </div>
          <div className="counter-row">
            <div className="alt">
              <strong>做培训 / 录视频</strong>
              <em>请头牌讲一遍，全员看</em>
            </div>
            <div className="arr">→</div>
            <div className="ours">
              培训能传递知识，<strong>传递不了手感</strong>。头牌自己讲都讲不出他怎么选的——因为很多判断是亚意识层的。
            </div>
          </div>
          <div className="counter-row">
            <div className="alt">
              <strong>让大家自己用 ChatGPT</strong>
              <em>给每人发个账号，自己摸索</em>
            </div>
            <div className="arr">→</div>
            <div className="ours">
              经验沉在每个人脑子里，<strong>组织看不见、调不出来</strong>。员工用得越多，组织反而越被动——能力都在个体身上。
            </div>
          </div>
        </div>

        <p className="lede" style={{ marginTop: 28, maxWidth: 820, color: "var(--cream)" }}>
          经验蒸馏不替代上面任何一种。它做的是把<em>看不见的判断</em>反向提取出来，沉到组织能调用的地方。
        </p>
      </section>

      {/* 3 PILLARS */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 56 }}>
        <span className="kicker">产品做的是 3 件事</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 6px" }}>
          采集 · 模式识别 · 经验蒸馏
        </h2>
        <p style={{ fontFamily: "var(--serif-en)", fontStyle: "italic", fontSize: 16, color: "var(--gold)", marginBottom: 8 }}>
          Sensing · Patterns · Distillation
        </p>

        <div className="pillar-trio">
          <div className="pt-item">
            <div className="pt-tag">第 01 步</div>
            <div className="pt-n">01</div>
            <h3>采集</h3>
            <div className="pt-en">Sensing</div>
            <p>
              看到员工每天<strong>真实在做什么</strong>。浏览器 + 飞书 + Agent 日志三个数据源，覆盖一个人 80–90% 的工作。<strong>无侵入式记录</strong>、本地脱敏、端到端加密。原始数据始终留在客户本地。
            </p>
          </div>
          <div className="pt-item">
            <div className="pt-tag">第 02 步</div>
            <div className="pt-n">02</div>
            <h3>识别模式</h3>
            <div className="pt-en">Patterns</div>
            <p>
              从一周/一月的真实动作里找<strong>「做对的那一步」反复发生的位置</strong>。本地传统 ML 算汇总统计，云端用自研算法识别员工的动作模式——哪些是高频工作流、哪些值得沉成 SOP、哪些可以蒸馏成 Skill。
            </p>
          </div>
          <div className="pt-item">
            <div className="pt-tag">第 03 步</div>
            <div className="pt-n">03</div>
            <h3>蒸馏成 Skill</h3>
            <div className="pt-en">Distillation</div>
            <p>
              把判断逻辑沉成<strong>可调用的资产</strong>。挂到 Agent 工作台后，新员工和 Agent 都能直接调用。每月自动迭代：越用越准，<strong>跟着公司业务一起进化</strong>。
            </p>
          </div>
        </div>
      </section>

      {/* ROLE PERSPECTIVES — descriptive use case framing, NOT testimonials */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 56 }}>
        <span className="kicker kicker-gold">3 个角色，3 种受益</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 8px" }}>
          这件事做好之后
        </h2>

        <div className="role-grid">
          <div className="role-card">
            <div className="rc-tag">FOR · 头牌运营</div>
            <h4>影响力放大 10 倍</h4>
            <p>
              不是被克隆 10 个，是<strong>你能做的事变多 10 倍</strong>——日常重复判断交给 Skill，你专注真正难的事。
            </p>
            <p>
              离职那天公司不倒退，意味着<strong>你下一份工作的背景更值钱</strong>——可被验证的"曾让公司从 X 跑到 Y"。
            </p>
          </div>
          <div className="role-card">
            <div className="rc-tag">FOR · 老板</div>
            <h4>核心打法不再被人绑架</h4>
            <p>
              <strong>头牌走了，公司不会跟着停滞。</strong>关键判断逻辑作为组织资产沉下来，下一个接任者上手有据。
            </p>
            <p>
              对外讲：BSR 那次的打法<strong>可复现</strong>，不再是"那个项目我们当年凑巧做对了"。
            </p>
          </div>
          <div className="role-card">
            <div className="rc-tag">FOR · 新员工</div>
            <h4>第一天就有前辈的影子</h4>
            <p>
              入职第一天打开 Agent，<strong>里面有 5 年前辈的判断逻辑</strong>。该看哪个数据、该问哪个问题、该停在哪里——前辈早就在 Skill 里告诉过你。
            </p>
            <p>
              培训周期从月级缩短到周级，<strong>能拿出来打的时间提前 3-6 个月</strong>。
            </p>
          </div>
        </div>

        <p className="body-text" style={{ marginTop: 28, maxWidth: 820, color: "var(--cream-2)", fontStyle: "italic" }}>
          经验蒸馏不是替换人，是把<strong style={{ fontStyle: "normal", color: "var(--orange)" }}>做对的那一步</strong>留下来。
        </p>
      </section>

      {/* ROADMAP — first 6 months */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 56 }}>
        <span className="kicker">你的 6 个月</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 8px" }}>
          从申请到第一波 Skill 沉淀
        </h2>

        <div className="delivery-timeline">
          <div className="dt-stages">
            <div className="dt-track" />
            <div className="dt-step">
              <div className="dt-circle">①</div>
              <div className="dt-label">申请 + Fit 评估</div>
              <div className="dt-duration">~3 工作日</div>
              <div className="dt-desc">提交申请、确认数据源、签 NDA。内测期免费但需评估匹配度。</div>
            </div>
            <div className="dt-step">
              <div className="dt-circle">②</div>
              <div className="dt-label">采集器部署</div>
              <div className="dt-duration">~1 周</div>
              <div className="dt-desc">浏览器扩展 + 飞书接入 + Agent 日志桥接。配置脱敏规则。</div>
            </div>
            <div className="dt-step">
              <div className="dt-circle">③</div>
              <div className="dt-label">数据积累</div>
              <div className="dt-duration">~6 个月</div>
              <div className="dt-desc">系统在背景默默记录。1 周就能出粗 Skill，6 个月后稳定。</div>
            </div>
            <div className="dt-step">
              <div className="dt-circle">④</div>
              <div className="dt-label">Skill 集成 + 迭代</div>
              <div className="dt-duration">每月</div>
              <div className="dt-desc">蒸馏出的 Skill 挂到 Agent 工作台、被新员工调用、按使用反馈再迭代。</div>
            </div>
          </div>
          <div className="dt-footer">
            <span>建议周期</span>
            <span><strong>前 6 个月数据 + 每月迭代</strong> = 越用越值钱</span>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 56 }}>
        <span className="kicker kicker-gold">定价</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 24px" }}>
          内测期 · 免费
        </h2>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 18, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--serif-en)", fontStyle: "italic", fontSize: 42, color: "var(--muted-2)", textDecoration: "line-through", textDecorationThickness: 2, textDecorationColor: "var(--orange)" }}>
            ¥199 / 人 / 月起
          </span>
          <span style={{ fontFamily: "var(--serif-cn)", fontWeight: 700, fontSize: 28, color: "var(--orange)" }}>
            内测中 · 申请<strong style={{ color: "#FFE6A8", background: "var(--orange)", padding: "0 8px" }}>限时免费</strong>开放
          </span>
        </div>
        <p className="body-text" style={{ maxWidth: 820 }}>
          内测期不收费。建议 6 个月以上的数据积累窗口期来出稳定的蒸馏成果——这是一件需要耐心的事，但 1 周已经能出第一批粗 Skill，早期就能验证方向。
        </p>
        <div style={{ marginTop: 28, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <a className="btn btn-primary" href={SCHEDULER_URL} target="_blank" rel="noopener noreferrer">
            申请<strong style={{ color: "#FFE6A8" }}>限时免费</strong>内测 <span className="arr">→</span>
          </a>
          <a className="btn btn-ghost" href={SCHEDULER_URL} target="_blank" rel="noopener noreferrer">
            和产品团队聊聊 <span className="arr">→</span>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--line)", paddingTop: 56 }}>
        <span className="kicker">FAQ</span>
        <h2 className="h-section" style={{ fontSize: 42, margin: "14px 0 8px" }}>
          常见问题
        </h2>
        <FaqAccordion />
      </section>
    </div>
  );
}

import FaqAccordionBase from "@/components/FaqAccordion";

function FaqAccordion() {
  return (
    <FaqAccordionBase
      items={[
        {
          q: "数据安全怎么处理？",
          a: "蒸馏分两步。第一步数据采集，所有原始数据留存在客户本地。我们用传统的本地机器学习模型和数据分析 pipeline，先在本地算出 summary statistics 和 performance stats。第二步进入蒸馏——这一步会通过我们自己的算法和模型来做，需要把数据传到服务器。但全程端到端加密，且在客户本地上传之前会先跑一遍脱敏算法，把 API key、密码、个人隐私这些敏感信息提前剥离。",
        },
        {
          q: "支持哪些 Agent 架构？",
          a: "主流的 Claude Code、Codex、OpenClaw、Hermes 我们都支持。",
        },
        {
          q: "支持哪些操作系统？",
          a: "Mac 和 Windows 都支持。",
        },
        {
          q: "支持哪些浏览器？",
          a: "Chrome 内核的都支持——原生 Chrome、Edge，以及跨境卖家常用的紫鸟浏览器。",
        },
        {
          q: "头牌运营会愿意配合吗？",
          a: "头牌运营本身往往是最支持这件事的——他们清楚自己的判断有多值钱，也清楚一旦离职带不走的话公司业务会被影响。我们也会和头牌做利益对齐：被蒸馏出来的 Skill 可以用他的名字命名、可以记入他的绩效。",
        },
        {
          q: "多久能看到效果？",
          a: "建议的窗口期是 6 个月以上。但其实采集一周的数据就已经能蒸馏出 Skill 了，只是早期蒸馏出来的 Skill 还不够好——数据越多，识别出来的判断越精准。",
        },
        {
          q: "和 OPAL 是什么关系？",
          a: "OPAL 是我们计划开源的 agent 协作基础设施（当前还未开源，未来会开源）。经验蒸馏会基于 OPAL 的数据通路构建。蒸馏算法层本身不开源。",
        },
        {
          q: "我们能不能自己搭一套类似的？",
          a: "OPAL 开源后，数据通路可以自己搭。蒸馏算法是我们的核心能力，不开源也不出售源代码。但合作蒸馏 + 由你团队自维护是可以谈的。",
        },
      ]}
    />
  );
}
