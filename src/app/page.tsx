import Link from "next/link";
import { listInsights, type InsightRow } from "@/lib/feishu";
import QRBlock from "@/components/QRBlock";
import { getRepoStarInfo, formatStars } from "@/lib/github";
import { cleanCoverUrl } from "@/lib/covers";
import { autoLinkTopics, buildGroups } from "@/lib/insightsGroups";

export const metadata = {
  title: { absolute: "异璧科技 · 用 AI 打造可以自我进化的公司" },
  description:
    "异璧科技 · 跨境电商 AI 运营系统 / 社媒内容工厂 / 电商 AIGC 套图 / 企业级大模型网关 + 经验蒸馏 / OpenClaw / OPAL 等开源工具。从员工经验到 Agent 落地，让 AI 真正变成业务系统。",
};
export const revalidate = 60;

const SCHEDULER_URL =
  "https://ycnm1prsz3tg.feishu.cn/scheduler/e151cf04355136c8";
const COMMUNITY_FORM_URL =
  "https://ycnm1prsz3tg.feishu.cn/share/base/form/shrcnCu8CiLYWFiOJJIy9lOTqxd";

function PlatformBadge({ p }: { p?: string }) {
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: ".18em",
        color: "#fff",
        background: "rgba(0,0,0,.55)",
        padding: "4px 8px",
        textTransform: "uppercase",
        backdropFilter: "blur(8px)",
      }}
    >
      {p || "—"}
    </span>
  );
}

function ContentCard({ it }: { it: InsightRow }) {
  const cover = cleanCoverUrl(it.cover_url);
  const href = it.platform_url || "#";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hero-content-card"
    >
      {cover && (
        // Direct CDN load — browser context works where server-side proxy 403s.
        // For images that fail, the gradient bg shows through.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt={it.title || ""}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      )}
      <div className="hero-content-overlay" />
      <div className="hero-content-top">
        <PlatformBadge p={it.platform} />
        {it.metric_likes ? (
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "#fff",
              letterSpacing: ".1em",
              background: "rgba(0,0,0,.55)",
              padding: "4px 8px",
              backdropFilter: "blur(8px)",
            }}
          >
            👍 {it.metric_likes.toLocaleString()}
          </span>
        ) : null}
      </div>
      <div className="hero-content-bottom">
        <div className="hero-content-title">{it.title}</div>
        {it.author && (
          <div className="hero-content-by">by {it.author}</div>
        )}
      </div>
    </a>
  );
}

export default async function HomePage() {
  // Pull insights from Feishu. If the call fails, render empty hero rather than fake data.
  let insights: InsightRow[] = [];
  try {
    const live = await listInsights();
    if (live.length > 0) insights = live;
  } catch {
    /* ignore — empty hero is preferable to mock */
  }

  // Live GitHub stars for open-source product cards
  const [openclawInfo, bridgeInfo] = await Promise.all([
    getRepoStarInfo("1va7/openclaw-pm"),
    getRepoStarInfo("1va7/opal-bridge"),
  ]);

  // Cross-platform topic dedup so the same idea posted to 抖音 + 小红书 + 公号
  // doesn't show up as 3 separate cards in the hero scroll.
  const linkedInsights = autoLinkTopics(insights);
  const groups = buildGroups(linkedInsights);

  // Hero content scroller — user-curated via Bitable `is_homepage_hero` on
  // ANY variant in the group. Fallback to top-12 groups by best metric_likes
  // so the section is never empty.
  const curatedGroups = groups.filter((g) =>
    [g.primary, ...g.variants].some((r) => r.is_homepage_hero),
  );
  const heroGroups = curatedGroups.length > 0
    ? curatedGroups.slice(0, 12)
    : [...groups]
        .sort((a, b) => b.topMetricLikes - a.topMetricLikes)
        .slice(0, 12);
  // ContentCard takes an InsightRow, so unwrap each group to its primary.
  const heroContent: InsightRow[] = heroGroups.map((g) => g.primary);

  // Recent for "最近动态" section — also dedup by topic, then take latest 6.
  const recent: InsightRow[] = [...groups]
    .sort(
      (a, b) =>
        (b.primary.date_published || 0) - (a.primary.date_published || 0),
    )
    .slice(0, 6)
    .map((g) => g.primary);

  return (
    <div>
      {/* HERO: real content stream */}
      <section className="home-hero-v2 wrap">
        <div className="hero-head">
          <div>
            <div className="hero-h-eyebrow">最近发的</div>
            <h1 className="hero-h-title">
              <em>异璧</em> 在做什么
            </h1>
          </div>
          <p className="hero-h-lede">
            判断不靠口号。看我们正在跑的 Agent、刚开源的工具、最近一周写的文章和视频——比任何 thesis 都准。
          </p>
        </div>
      </section>

      <section className="hero-scroll-section">
        <div className="hero-scroll">
          {heroContent.map((it) => (
            <ContentCard key={it.slug} it={it} />
          ))}
          <Link href="/insights" className="hero-content-card hero-content-more">
            <div className="hero-content-overlay" />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                color: "#fff",
                fontFamily: "var(--serif-cn)",
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 700 }}>看全部</div>
              <div
                style={{
                  fontFamily: "var(--serif-en)",
                  fontStyle: "italic",
                  fontSize: 16,
                  color: "var(--gold)",
                }}
              >
                {insights.length} 条洞察 →
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 28 }}>
        <div className="hero-cta-row">
          <a
            className="btn btn-primary"
            href={SCHEDULER_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            和我们聊聊你公司的 Agent 怎么做 <span className="arr">→</span>
          </a>
          <a
            className="btn btn-ghost"
            href={COMMUNITY_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            加入跨境 Agent 实战社群 <span className="arr">→</span>
          </a>
        </div>
      </section>

      {/* SOLUTIONS — with real metrics */}
      <div className="wrap">
        <section className="section-tight">
          <div className="section-head">
            <div className="l">
              <span className="kicker-xl">解决方案</span>
              <h2 className="h-section">3 套已经在跑、有结果的系统</h2>
            </div>
            <div className="r">
              <Link
                href="/solutions"
                style={{
                  color: "var(--orange-light)",
                  fontFamily: "var(--serif-en)",
                  fontStyle: "italic",
                  fontSize: 14,
                  textTransform: "none",
                }}
              >
                全部 →
              </Link>
            </div>
          </div>

          <div className="cards-3 solution-cards">
            <Link className="card solution-card" href="/solutions/amazon-ai">
              <div className="card-meta">
                <span className="tag">№ 01 · AMAZON</span>
                <span>v1.3</span>
              </div>
              <h3>跨境电商 AI 运营系统</h3>
              <ul className="solution-metrics">
                <li><strong>100+</strong> 跨境团队部署过</li>
                <li><strong>6 小时</strong> 标准内训覆盖 4 大场景</li>
                <li><strong>3 步</strong> 交付：部署 → 内训 → 经验蒸馏</li>
              </ul>
              <div className="card-foot">
                <span className="price-tag">¥29,800 起</span>
                <span className="arr">→</span>
              </div>
            </Link>

            <Link className="card solution-card" href="/solutions/content-factory">
              <div className="card-meta">
                <span className="tag">№ 02 · SOCIAL</span>
                <span>v0.2</span>
              </div>
              <h3>社媒内容工厂</h3>
              <ul className="solution-metrics">
                <li><strong>抖音</strong> 单条 400w+ 播放 · 单视频涨粉 2w+</li>
                <li><strong>小红书 / 视频号</strong> 单条涨粉 5k / 1w+</li>
                <li><strong>12 矩阵号</strong> · 1 人 + 产线日产 500+ 条</li>
              </ul>
              <div className="card-foot">
                <span className="price-tag">¥28,800 起</span>
                <span className="arr">→</span>
              </div>
            </Link>

            <Link className="card solution-card" href="/solutions/llm-gateway">
              <div className="card-meta">
                <span className="tag">№ 03 · ENTERPRISE</span>
                <span>v1.0</span>
              </div>
              <h3>企业级大模型网关</h3>
              <ul className="solution-metrics">
                <li><strong>5–10 亿 token / 天</strong> · 异璧内部跑了一年</li>
                <li><strong>100+ 大模型</strong> 接入，多租户 + 权限分级</li>
                <li><strong>1 周</strong> 部署完即归客户所有</li>
              </ul>
              <div className="card-foot">
                <span className="price-tag">¥8,000 起</span>
                <span className="arr">→</span>
              </div>
            </Link>
          </div>

          <p className="body-text" style={{ marginTop: 22, color: "var(--cream-dim)", fontSize: 14 }}>
            按件计费的服务：<Link href="/services/aigc" style={{ color: "var(--orange-light)" }}>电商 AIGC 套图</Link>（¥2,500 / 套起）· <Link href="/services/aigc" style={{ color: "var(--orange-light)" }}>AI TVC 品牌片</Link>（¥100 / 秒，25s 起订）· <Link href="/services" style={{ color: "var(--orange-light)" }}>定制开发 + 陪跑</Link>（¥1,000 / 人天起）
          </p>
        </section>

        {/* DISTILL — rewritten to 3 steps */}
        <section className="distill-spotlight">
          <div className="ds-left">
            <span className="kicker-xl kicker-gold">★ 异璧产品</span>
            <h2>
              经验蒸馏
              <br />
              <em>Experience Distillation</em>
            </h2>
            <p className="lede" style={{ marginBottom: 18, maxWidth: 540 }}>
              把好员工的判断变成组织数字资产。
            </p>
            <p className="body-text" style={{ marginBottom: 28, maxWidth: 560 }}>
              头牌运营一离职，选品打法、广告判断和复盘习惯也跟着走了。我们的 Pixel Distill 算法从员工真实工作数据里反向识别判断模式，沉成新员工和 Agent 都能直接调用的 Skill。
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link className="btn btn-primary" href="/products/distill">
                申请<strong style={{ color: "#FFE6A8" }}>限时免费</strong>内测 <span className="arr">→</span>
              </Link>
              <Link className="btn btn-ghost" href="/products/distill">
                看产品详情 <span className="arr">→</span>
              </Link>
            </div>
          </div>
          <div className="ds-right">
            <div className="ds-step">
              <div className="ds-num">①</div>
              <div>
                <div className="ds-title">采集 · Sensing</div>
                <div className="ds-desc">
                  <strong>浏览器</strong>（Chrome / Edge / 紫鸟）+ <strong>飞书</strong> + <strong>Agent 日志</strong>（Claude Code / Codex / OpenClaw / Hermes）三个数据源，覆盖一个人 80–90% 的真实工作。无侵入式记录，数据全部留在客户本地。
                </div>
              </div>
            </div>
            <div className="ds-step">
              <div className="ds-num">②</div>
              <div>
                <div className="ds-title">识别模式 · Patterns</div>
                <div className="ds-desc">
                  本地脱敏 → 端到端加密 → 云端用自研算法识别动作模式：哪些是高频工作流、哪些值得沉成 SOP、哪些可以蒸馏成 Skill。1 周就能出粗 Skill，6 个月稳定。
                </div>
              </div>
            </div>
            <div className="ds-step">
              <div className="ds-num">③</div>
              <div>
                <div className="ds-title">蒸馏成 Skill · Distillation</div>
                <div className="ds-desc">
                  把判断逻辑沉成可调用的资产，挂到 Agent 工作台。新员工和 Agent 都能直接调用，<strong>每月自动迭代、越用越准</strong>。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OPEN SOURCE — Labs + Skills */}
        <section className="section-tight">
          <div className="section-head">
            <div className="l">
              <span className="kicker-xl">开源 / 开放</span>
              <h2 className="h-section">交付里磨出来的工具，全开放</h2>
            </div>
            <div className="r">
              <Link
                href="/products/labs"
                style={{
                  color: "var(--orange-light)",
                  fontFamily: "var(--serif-en)",
                  fontStyle: "italic",
                  fontSize: 14,
                  textTransform: "none",
                }}
              >
                全部 →
              </Link>
            </div>
          </div>
          <p className="body-text" style={{ marginBottom: 28, maxWidth: 760 }}>
            每个项目结束之后我们都会回头看：哪些能力反复用上？把这些抽出来开源。除了经验蒸馏的核心算法，其他都免费。
          </p>

          <div className="cards-3">
            <Link className="card" href="/products/labs/openclaw-pm">
              <div className="card-meta">
                <span className="tag">OPENCLAW · PM</span>
                <span className="star-pill" title={openclawInfo.ok ? `${openclawInfo.stars} stars` : "GitHub API 暂不可用"}>
                  {formatStars(openclawInfo.stars)} ★
                </span>
              </div>
              <h3>OpenClaw PM</h3>
              <p className="card-desc">
                让 AI Agent 成为优秀的项目经理。V2 含任务管理、Session 隔离、GatewayRestart 强制恢复、主动 Interview、Checkpoint 机制。
              </p>
              <div className="card-foot">
                <span>github.com/1va7/openclaw-pm</span>
                <span className="arr">→</span>
              </div>
            </Link>

            <Link className="card" href="/products/labs/opal/bridge">
              <div className="card-meta">
                <span className="tag">OPAL · BRIDGE</span>
                <span className="star-pill" title={bridgeInfo.ok ? `${bridgeInfo.stars} stars` : "GitHub API 暂不可用"}>
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
            </Link>

            <Link className="card" href="/skills">
              <div className="card-meta">
                <span className="tag">SKILLS · 卷宗</span>
                <span className="star-pill">219 项</span>
              </div>
              <h3>开源 Skills 库</h3>
              <p className="card-desc">
                从 200+ 真实跨境项目里精选 — 选品、Listing、广告、复盘、客服、内容、合规 13 个职能。直接接入 Claude Code · Codex · OpenClaw · Hermes。
              </p>
              <div className="card-foot">
                <span>yibi.studio/skills</span>
                <span className="arr">→</span>
              </div>
            </Link>
          </div>
        </section>

        {/* COURSE BANNER */}
        <section className="section-tight">
          <div className="course-banner">
            <div className="cb-left">
              <span className="kicker-xl">★ 正在报名</span>
              <h2>
                两天一夜 · <em>搭出会自我迭代的</em>
                <br />
                亚马逊 AI 运营系统
              </h2>
              <p className="body-text" style={{ marginBottom: 20 }}>
                两位实战派讲师（亚马逊 BSR 操盘手 + AI 创业者），把选品 / Listing / 广告 / 复盘 4 大场景跑一遍。带走 6 大类 Agents + 200+ Skills + 100+ 指标的完整运营基建——不是几条 prompt。
              </p>
              <div className="cb-meta">
                <span><strong>5 月 30 - 31 日</strong></span>
                <span className="dot" />
                <span>深圳</span>
                <span className="dot" />
                <span><strong>¥5,999</strong></span>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 22 }}>
                <Link className="btn btn-primary" href="/courses">
                  查看课程详情 <span className="arr">→</span>
                </Link>
              </div>
            </div>
            <div className="cb-right">
              <QRBlock url="https://yibi.studio/courses" label="扫码看课程" size={180} />
            </div>
          </div>
        </section>

        {/* RECENT CONTENT */}
        <section className="section-tight">
          <div className="section-head">
            <div className="l">
              <span className="kicker-xl">最近动态</span>
              <h2 className="h-section">这周和上周</h2>
            </div>
            <div className="r">
              <Link
                href="/insights"
                style={{
                  color: "var(--orange-light)",
                  fontFamily: "var(--serif-en)",
                  fontStyle: "italic",
                  fontSize: 14,
                  textTransform: "none",
                }}
              >
                全部 →
              </Link>
            </div>
          </div>
          <div className="notes-grid">
            {recent.slice(0, 3).map((it) => (
              <a
                key={it.slug}
                href={it.platform_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="note-card"
              >
                <div>
                  <div className="note-meta">
                    <span className="tag">{it.type || "—"} · {it.platform || "—"}</span>
                    {it.metric_likes ? (
                      <span>👍 {it.metric_likes.toLocaleString()}</span>
                    ) : null}
                  </div>
                  <h3>{it.title || "—"}</h3>
                  {it.summary && (
                    <p className="note-excerpt">{it.summary.slice(0, 100)}</p>
                  )}
                </div>
                <div className="note-by">by {it.author || "—"}</div>
              </a>
            ))}
          </div>
        </section>

        {/* CTA — booking + QR */}
        <section className="cta-bar bottom-cta-bar">
          <div className="bottom-cta-top">
            <span className="kicker-xl">下一步</span>
            <h2>
              和我们的工程师 <em>聊 30 分钟</em>，免费。
            </h2>
          </div>
          <div className="bottom-cta-body">
            <div>
              <p className="lede">
                你说说公司的 Agent 现在卡在哪、买过什么没用上的工具、最痛的那个流程。我们告诉你下一步的最小动作。
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <a
                  className="btn btn-primary"
                  href={SCHEDULER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  选时间预约 <span className="arr">→</span>
                </a>
                <a
                  className="btn btn-ghost"
                  href={COMMUNITY_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  加入实战社群 <span className="arr">→</span>
                </a>
              </div>
            </div>
            <div className="qr-row">
              <QRBlock url={SCHEDULER_URL} label="扫码预约咨询" size={150} />
              <QRBlock url={COMMUNITY_FORM_URL} label="扫码加入社群" size={150} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
