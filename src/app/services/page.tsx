import Link from "next/link";
import {
  MessagesSquare,
  Activity,
  BarChart3,
  Repeat,
  Wrench,
  LineChart,
} from "lucide-react";
import ServicesWorkflow from "@/components/ServicesWorkflow";
import { FEISHU_SCHEDULER_URL } from "@/lib/links";

export const metadata = {
  title: "定制服务",
  description: "异璧定制服务：咨询 → 定制开发 → 培训 → 陪跑。让 AI 真正进入你公司的业务流程。",
};

export default function ServicesPage() {
  return (
    <div className="wrap">
      <section className="page-hero" style={{ paddingBottom: 32, marginBottom: 0 }}>
        <div className="eyebrow">定制服务 · CUSTOM ENGAGEMENT</div>
        <h1>
          按你公司的现状，<br />
          <em>把 AI 装到真实业务里。</em>
        </h1>
        <p className="lede">
          你的团队、你的 ERP、你的数据、你的流程都不一样。我们做的事是把 AI Agent 拼进这套现成的工作系统——而不是让你团队迁就一个标准产品。
        </p>
      </section>

      <ServicesWorkflow />

      {/* STEP 1 · CONSULT */}
      <section id="consult" className="svc-section" style={{ scrollMarginTop: 140 }}>
        <span className="kicker-xl">№ 01 · DIAGNOSE</span>
        <h2>
          咨询 / <em>方案诊断</em>
        </h2>
        <p className="lede">
          帮你判断 AI 在你公司里的最小起步动作，输出一份可以直接执行的方案。
        </p>

        <h3 style={{ fontSize: 22, margin: "32px 0 12px" }}>这一步在解决什么</h3>
        <p className="body-text" style={{ maxWidth: 800 }}>
          很多老板买了一堆 AI 工具，员工各自试了一段时间，订单和利润没有明显变化。问题不一定是工具不好，往往是因为没有人系统地看过：哪个流程值得交给 Agent、哪个先做、哪个不要做、用什么模型、接什么数据。我们这一步就是把这件事一次性想清楚。
        </p>

        <h3 style={{ fontSize: 22, margin: "32px 0 12px" }}>交付内容</h3>
        <ul className="body-text" style={{ paddingLeft: 24 }}>
          <li>业务流程梳理 + Agent 化机会清单</li>
          <li>优先级排序：哪个先做、哪个后做、哪个不做</li>
          <li>30 天落地路线图</li>
          <li>推荐的工具 / 数据接入 / 系统架构</li>
          <li>下一步建议：先做诊断 demo、还是直接进入定制开发</li>
        </ul>

        <div className="price-table" style={{ marginTop: 32 }}>
          <div className="price-row">
            <span className="price-cell k">售前沟通</span>
            <span className="price-cell v">免费</span>
            <span className="price-cell note">30 分钟线上</span>
          </div>
          <div className="price-row">
            <span className="price-cell k">方案诊断</span>
            <span className="price-cell v">¥4,980 起</span>
            <span className="price-cell note">按复杂度分档，可抵扣后续开发费</span>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <a className="btn btn-primary" href={FEISHU_SCHEDULER_URL} target="_blank" rel="noopener noreferrer">
            预约售前沟通 <span className="arr">→</span>
          </a>
        </div>
      </section>

      {/* STEP 2 · CUSTOM DEV */}
      <section id="build" className="svc-section" style={{ scrollMarginTop: 140 }}>
        <span className="kicker-xl">№ 02 · BUILD</span>
        <h2>
          定制<em>开发</em>
        </h2>
        <p className="lede">
          把 Agent 接进你公司已有的系统、流程和数据。
        </p>

        <h3 style={{ fontSize: 22, margin: "32px 0 12px" }}>这一步在解决什么</h3>
        <p className="body-text" style={{ maxWidth: 800 }}>
          你公司可能已经在用一些自研或定制开发的 ERP、内部 SaaS、自建数据库——这些系统对外没有标准 API，Agent 默认拿不到里面的数据，也没法在里面执行操作。要让 Agent 真正进入业务流程，就需要这一层定制开发：给它打通入口、配权限、写适配。
        </p>

        <div className="example-block">
          <strong>典型场景：</strong><br />
          · 公司用了一套自研 ERP，所有订单、库存、客户数据都在里面，Agent 现在看不到<br />
          · 业务跑在内部 SaaS（自研工单系统、自研客户管理系统等），需要 Agent 能查能改<br />
          · 数据散在多个 Excel + 飞书多维表 + 老旧数据库里，需要先做归一化再让 Agent 读<br />
          · 公司想让 Agent 调用某个国产 SaaS（卖家精灵、店小秘等），但对方没开放 MCP / API<br />
          · 想用某个 agent harness（Claude Code、OpenClaw、Hermes）部署在公司服务器上而不是云端
        </div>

        <h3 style={{ fontSize: 22, margin: "32px 0 12px" }}>计价</h3>
        <p className="body-text" style={{ maxWidth: 760 }}>
          AI 工程师人天 <strong style={{ color: "var(--orange)" }}>¥1,000 / 人天</strong>。需要多少人天我们在诊断阶段就给你算清楚——不收任何不可见的费用。
        </p>

        <div style={{ marginTop: 28 }}>
          <a className="btn btn-primary" href={FEISHU_SCHEDULER_URL} target="_blank" rel="noopener noreferrer">
            聊聊我的需求 <span className="arr">→</span>
          </a>
        </div>
      </section>

      {/* STEP 3 · TRAINING */}
      <section id="training" className="svc-section" style={{ scrollMarginTop: 140 }}>
        <span className="kicker-xl">№ 03 · TRAIN</span>
        <h2>
          企业<em>内训</em>
        </h2>
        <p className="lede">
          系统搭好之后，让团队真的会用。
        </p>

        <h3 style={{ fontSize: 22, margin: "32px 0 12px" }}>这一步在解决什么</h3>
        <p className="body-text" style={{ maxWidth: 800 }}>
          很多公司花了钱部署 AI 工具，结果员工还是按老方式工作，因为没人系统地教过他们「该把什么任务交给 Agent」「该怎么和 Agent 协作」。我们的内训是 4 个标准课程模块，根据你团队的真实工作场景挑组合——总时长 6 小时，建议拆成 4 节。
        </p>

        <h3 style={{ fontSize: 22, margin: "32px 0 12px" }}>怎么教 · Hands-on Keyboard</h3>
        <p className="body-text" style={{ maxWidth: 800 }}>
          不是单向讲 PPT。参考 Palantir AIP Bootcamp、Anthropic Applied AI、OpenAI Deployment 的 FDE 培训方式——让学员在自己的真实业务、真实数据、真实 Agent 上动手，每节课结束前都跑出一个能用的 Skill 或工作流，培训结束时团队已经有「自己跑通的真实用例」可以带回部门复用。
        </p>

        <h3 style={{ fontSize: 22, margin: "32px 0 14px" }}>4 大标准课程模块</h3>
        <div className="module-grid">
          <div className="module-card">
            <div className="mod-n">01</div>
            <h4>入门 Workshop</h4>
            <p>什么是 Agent / MCP / Skill；员工如何和 Agent 交互；如何修改、复用和设置自己的 Skill。让团队建立通用的人机协作语言。</p>
          </div>
          <div className="module-card">
            <div className="mod-n">02</div>
            <h4>信息收集 · 分析 · 流程自动化</h4>
            <p>用 Agent 做调研、整理资料、跨工具搬数据；常见流程自动化模式（消息流、表格流、文档流）。把团队最高频的「跑腿活」交给 Agent。</p>
          </div>
          <div className="module-card">
            <div className="mod-n">03</div>
            <h4>数据分析 · 内容生产</h4>
            <p>用 Agent 做报表分析、模型预测；内容生产包括写文案（产品文案、合同、内部报告、日报）、做图、做视频、做 prompt 设计。</p>
          </div>
          <div className="module-card">
            <div className="mod-n">04</div>
            <h4>Vibe Coding · Agent Teams</h4>
            <p>用自然语言驱动软件开发；如何设计复杂的多 Agent 协作；agent harness 选型；进阶话题：强化学习、Skill 蒸馏、agent system 架构。</p>
          </div>
        </div>

        <h3 style={{ fontSize: 22, margin: "40px 0 14px" }}>学员能带走什么</h3>
        <div className="fde-grid">
          <div className="fde-item">
            <div className="fde-tag">USE CASE</div>
            <div className="fde-title">一个跑通的真实业务流</div>
            <div className="fde-desc">不是 demo，是用学员自己公司的真实数据、真实任务跑通的端到端流程。结业当天可以拿回部门复用。</div>
          </div>
          <div className="fde-item">
            <div className="fde-tag">SKILL LIBRARY</div>
            <div className="fde-title">个人 Skill 库 3-5 个</div>
            <div className="fde-desc">每个学员手上至少有 3-5 个自己写的、自己改过的、自己用过的 Skill，可立刻接入日常工作。</div>
          </div>
          <div className="fde-item">
            <div className="fde-tag">EVAL HABIT</div>
            <div className="fde-title">评估 Agent 的方法</div>
            <div className="fde-desc">不是「感觉 Agent 不错」，而是用真实样本 + 专家反馈 + 结果指标，判断 Agent 是否真的帮上了业务。</div>
          </div>
        </div>

        <h3 style={{ fontSize: 22, margin: "40px 0 14px" }}>定价</h3>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--serif-en)", fontStyle: "italic", fontWeight: 700, fontSize: 56, color: "var(--orange)", lineHeight: 1 }}>
            ¥19,800
          </span>
          <span style={{ fontFamily: "var(--serif-cn)", fontSize: 18, color: "var(--cream-2)" }}>
            标准包 · 4 节课共 6 小时 · ≤ 20 人
          </span>
        </div>
        <p className="body-text" style={{ marginTop: 14, fontSize: 13, color: "var(--cream-dim)", maxWidth: 760 }}>
          人数 21-50：¥29,800 · 51-100：¥49,800 · 100+ 一对一定制 · 线下另收差旅 · 完全用你业务做练习的「定制版」+ ¥10,000 起
        </p>

        <div style={{ marginTop: 28 }}>
          <a className="btn btn-primary" href={FEISHU_SCHEDULER_URL} target="_blank" rel="noopener noreferrer">
            聊聊我的团队 <span className="arr">→</span>
          </a>
        </div>
      </section>

      {/* STEP 4 · COMPANION */}
      <section id="companion" className="svc-section" style={{ scrollMarginTop: 140 }}>
        <span className="kicker-xl">№ 04 · RUN</span>
        <h2>
          陪跑
        </h2>
        <p className="lede">
          部署和培训只是开始。让 Agent 系统持续跑下去、越用越懂业务，是另一件事。
        </p>

        <h3 style={{ fontSize: 22, margin: "32px 0 12px" }}>这一步在解决什么</h3>
        <p className="body-text" style={{ maxWidth: 800 }}>
          AI 工具一年三换、上游 API 一周一变、员工每周都有新的工作场景冒出来。陪跑就是把这些不稳定性接住——团队不用花精力管它，Agent 始终是「最新可用、最适配业务」的状态。
        </p>

        <h3 style={{ fontSize: 22, margin: "32px 0 14px" }}>包含什么</h3>
        <div className="companion-grid">
          <div className="companion-item">
            <div className="companion-icon"><MessagesSquare size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">专属服务群</div>
            <div className="companion-desc">工程师 + 客户成功经理。工作日 2 小时响应，紧急 30 分钟。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><Activity size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">系统健康巡检</div>
            <div className="companion-desc">每日检查 Agent 运行状态、API 成功率、异常日志、Token 消耗。出问题在你看到之前先修。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><BarChart3 size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">周度健康报告</div>
            <div className="companion-desc">每周输出 Agent 使用情况和问题清单，让你随时知道这套系统在公司里跑得怎么样。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><Repeat size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">双周复盘 Session</div>
            <div className="companion-desc">每两周 1 小时线上诊断 + 复盘 + 现场优化。把使用过程中的痛点变成下一轮迭代。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><Wrench size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">Skill / 知识库优化</div>
            <div className="companion-desc">根据真实使用场景持续迭代 Skill、知识库结构、Agent 架构。系统越用越懂你的业务。</div>
          </div>
          <div className="companion-item">
            <div className="companion-icon"><LineChart size={22} strokeWidth={1.6} /></div>
            <div className="companion-title">月度 ROI 看板</div>
            <div className="companion-desc">任务执行数、员工使用率、模型成本、流程沉淀。让 AI 投入的产出可见、可对账。</div>
          </div>
        </div>

        <h3 style={{ fontSize: 22, margin: "40px 0 14px" }}>我们交付什么 · Deliverables</h3>
        <p className="body-text" style={{ maxWidth: 800, marginBottom: 18 }}>
          参考 Anthropic FDE、Palantir AIP 等团队的交付定义——陪跑不是「群里答疑」，是把客户业务问题真正变成跑在生产流程里的工程资产。
        </p>
        <div className="fde-grid">
          <div className="fde-item">
            <div className="fde-tag">MCP SERVERS</div>
            <div className="fde-title">数据 / 工具接入 MCP</div>
            <div className="fde-desc">把客户内部 ERP、数据仓库、卖家精灵、飞书表、广告后台等接成 MCP server，让全公司 Agent 直接调用。</div>
          </div>
          <div className="fde-item">
            <div className="fde-tag">SUB-AGENTS</div>
            <div className="fde-title">业务专项 Sub-agent</div>
            <div className="fde-desc">为高频场景（选品 / Listing 优化 / 广告复盘 / 客服 / 报告生成）定制专门的 Sub-agent，挂在 Agent 工作台。</div>
          </div>
          <div className="fde-item">
            <div className="fde-tag">AGENT SKILLS</div>
            <div className="fde-title">可复用 Skill 包</div>
            <div className="fde-desc">每月新增一批基于真实使用沉淀的 Skill，进入公司 Skill 库，新员工开箱即用。</div>
          </div>
          <div className="fde-item">
            <div className="fde-tag">DEPLOYMENT PATTERNS</div>
            <div className="fde-title">可复用的 Pattern</div>
            <div className="fde-desc">把「常用流程 + 数据 + Agent + 评估」打包成 deployment pattern，跨部门复制粘贴就能用。</div>
          </div>
          <div className="fde-item">
            <div className="fde-tag">EVAL SUITE</div>
            <div className="fde-title">业务级评估集</div>
            <div className="fde-desc">基于客户真实样本 + 专家反馈 + KPI 输出 eval。模型升级、Skill 改造、Agent 重构都用这套 eval 衡量。</div>
          </div>
          <div className="fde-item">
            <div className="fde-tag">PLAYBOOKS</div>
            <div className="fde-title">运营 Playbook</div>
            <div className="fde-desc">把陪跑期沉淀的判断逻辑、SOP、异常处理写成 Playbook，让客户团队脱离陪跑后能自己运营。</div>
          </div>
        </div>

        <h3 style={{ fontSize: 22, margin: "40px 0 14px" }}>我们衡量什么 · KPIs</h3>
        <p className="body-text" style={{ maxWidth: 800, marginBottom: 18 }}>
          陪跑不是按时长收费的服务——是按这套系统在你公司里跑得怎么样收费的。每月 ROI 看板上看以下 5 个指标的变化：
        </p>
        <div className="fde-grid">
          <div className="fde-item">
            <div className="fde-tag">METRIC · 01</div>
            <div className="fde-title">Agent 任务完成率</div>
            <div className="fde-desc">交给 Agent 的任务里，多少是不用人工返工、直接采纳的。每月跟踪、识别瓶颈、定向优化。</div>
          </div>
          <div className="fde-item">
            <div className="fde-tag">METRIC · 02</div>
            <div className="fde-title">Token 成本 / 业务产出 ROI</div>
            <div className="fde-desc">单位 token 花在哪、产出多少有效成果。让 AI 开销对得起每一分钱，账目可对。</div>
          </div>
          <div className="fde-item">
            <div className="fde-tag">METRIC · 03</div>
            <div className="fde-title">员工人均 Agent 协作时长</div>
            <div className="fde-desc">真在用 vs 摆样子。低于阈值会触发针对性培训，高得过头会触发流程优化建议。</div>
          </div>
          <div className="fde-item">
            <div className="fde-tag">METRIC · 04</div>
            <div className="fde-title">关键流程 Skill 化数量</div>
            <div className="fde-desc">每月新增多少高频流程被沉淀成 Skill / Sub-agent / Pattern。这个数才是真的「组织资产」。</div>
          </div>
          <div className="fde-item">
            <div className="fde-tag">METRIC · 05</div>
            <div className="fde-title">自运营成熟度</div>
            <div className="fde-desc">陪跑结束后，客户团队能不能自己维护这套系统？这是判断陪跑成功与否的终极指标——FDE 离场后系统还能跑、还能进化。</div>
          </div>
          <div className="fde-item">
            <div className="fde-tag">METRIC · 06</div>
            <div className="fde-title">头牌经验沉淀率</div>
            <div className="fde-desc">关键岗位的判断逻辑，有多少被沉淀进了组织资产（Skill / Playbook / Eval）。可加购经验蒸馏获得更深层提取。</div>
          </div>
        </div>

        <h3 style={{ fontSize: 22, margin: "40px 0 14px" }}>定价</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, maxWidth: 720 }}>
          <div className="pricing-card">
            <div className="pc-tier">月包</div>
            <div className="pc-amount">
              <span className="num">¥8,000</span>
              <span className="unit">/ 月</span>
            </div>
            <div className="pc-foot">3 个月起订 · 按月续费</div>
          </div>
          <div className="pricing-card is-featured">
            <div className="pc-tier">
              年包
              <span className="pc-tier-badge">8 折</span>
            </div>
            <div className="pc-amount">
              <span className="num">¥6,400</span>
              <span className="unit">/ 月</span>
            </div>
            <div className="pc-foot">
              年付 <strong>¥76,800 / 年</strong>，比月付省 ¥19,200
            </div>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <a className="btn btn-primary" href={FEISHU_SCHEDULER_URL} target="_blank" rel="noopener noreferrer">
            预约陪跑沟通 <span className="arr">→</span>
          </a>
        </div>
      </section>
    </div>
  );
}
