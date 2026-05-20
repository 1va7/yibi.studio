import Link from "next/link";
import { FEISHU_SCHEDULER_URL } from "@/lib/links";

export const metadata = {
  title: "电商 AIGC 套图 · AI TVC",
  description:
    "亚马逊套图 GEO ¥2,500 起、AI TVC 品牌片 ¥100/秒（25s 起订）。COSMO 规则驱动、用户共情、场景化—— AIGC 不只该好看，还该好卖。",
};

export default function AigcPage() {
  return (
    <div className="wrap">
      <section className="page-hero">
        <div className="eyebrow">电商 AIGC · COMMERCE AIGC</div>
        <h1>
          畅销的<br />
          才是<em>好内容</em>
        </h1>
        <p className="lede">
          AIGC 不只该好看，还该好卖。
        </p>
      </section>

      {/* GEO 套图 */}
      <section className="svc-section" id="geo">
        <span className="kicker">№ 01 · GEO</span>
        <h2>
          亚马逊套图 <em>GEO</em>
          <br />
          更好的 CTR 与销转率
        </h2>

        <div className="flow">
          <div className="flow-step">
            <span className="flow-n">①</span>
            <h4>数据驱动</h4>
            <p>
              采集 50+ Rufus FAQ，挖掘 3,000+ 评论，分析典型用户画像与主要购买意图。
            </p>
          </div>
          <div className="flow-step">
            <span className="flow-n">②</span>
            <h4>算法优化</h4>
            <p>
              围绕 COSMO 规则，突出使用场景、贴近购买意图，大幅优化 GEO 效果。
            </p>
          </div>
          <div className="flow-step">
            <span className="flow-n">③</span>
            <h4>用户共情</h4>
            <p>
              基于用户画像还原真实画面，调动情绪钩子，唤醒内在动机，提高购买转化率。
            </p>
          </div>
        </div>

        <div className="price-table" style={{ marginTop: 32 }}>
          <div className="price-row">
            <span className="price-cell k">视觉套图</span>
            <span className="price-cell v">¥2,500 / 套起</span>
            <span className="price-cell note">约 15 张起（主图 + A+）</span>
          </div>
          <div className="price-row">
            <span className="price-cell k">交付周期</span>
            <span className="price-cell v">5 个工作日</span>
            <span className="price-cell note">付款 + 提供产品信息后</span>
          </div>
          <div className="price-row">
            <span className="price-cell k">样品</span>
            <span className="price-cell v">寄拍 / 客户提供</span>
            <span className="price-cell note">多视角图片均可</span>
          </div>
        </div>
      </section>

      {/* 案例对比 */}
      <section className="svc-section" id="cases">
        <span className="kicker">№ 02 · CASES</span>
        <h2>
          案例对比 <em>CASE COMPARISON</em>
          <br />
          我们的方案 vs 友商的方案
        </h2>
        <p className="lede">
          同一个 SKU，常见的友商方案 vs 我们的方案——差别不在分辨率，差在
          <strong style={{ color: "var(--cream)" }}>从用户购买动机出发的视觉决策</strong>。
        </p>

        {/* Case 1 — Sound of Silence */}
        <div className="case-block">
          <div className="case-head">
            <span className="case-num">CASE 01</span>
            <h3 className="case-title">汽车隔音/静音卖点表达</h3>
            <span className="case-note">注：产品特征及客户信息已做模糊处理</span>
          </div>

          <div className="case-compare">
            <figure className="case-side case-side-ours">
              <div className="case-label">
                <span className="case-side-tag">BY YIBI</span>
                <span className="case-side-name">我们的方案</span>
              </div>
              <div className="case-img-frame">
                <img src="/aigc/ours-soundofsilence.webp" alt="异璧方案：THE SOUND OF SILENCE 主图" />
              </div>
              <figcaption>
                场景化主图：用 <em>THE SOUND OF SILENCE</em> 情绪标题切入静音卖点，
                后排乘客（含儿童 / 老人）真实在车内安睡的画面调动共情，
                COSMO 维度直接命中 「家庭出行 / 长途驾驶」 购买意图。
              </figcaption>
            </figure>

            <figure className="case-side case-side-theirs">
              <div className="case-label">
                <span className="case-side-tag tag-them">ECOMMERCE / COMPETITOR</span>
                <span className="case-side-name">友商的方案</span>
              </div>
              <div className="case-img-frame">
                <img src="/aigc/competitor-soundofsilence.webp" alt="友商方案：常见参数对比主图" />
              </div>
              <figcaption>
                标准 3D 渲染 + 功能图标罗列：信息密度高，但缺少使用场景与情绪入口，
                CTR 与停留时长在用户画像不清晰时容易掉档。
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Case 2 — Video TVC demo */}
        <div className="case-block">
          <div className="case-head">
            <span className="case-num">CASE 02</span>
            <h3 className="case-title">高海拔冲锋衣 TVC（AI 影视级生成）</h3>
            <span className="case-note">AI 直接生成 3D 渲染 + 极端外景，省下 ¥1,000+/秒 的传统建模费</span>
          </div>

          <figure className="case-video-frame">
            <video
              src="/aigc/tvc-highaltitude-jacket.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
            >
              视频加载中
            </video>
            <figcaption>
              19s · 高海拔风雪外景 / 极端测试 / 产品近景特写——
              全流程 AI 生成，<em>无需出外景、无需建模师</em>。
              单条 TVC 制作周期从传统的 4–6 周压缩到 5 个工作日。
            </figcaption>
          </figure>
        </div>

        <p className="case-attribution">
          素材来源：<a href="https://www.metana.ai/" target="_blank" rel="noreferrer">metana.ai</a>
          （异璧科技产品展示页 · 案例对比仅作 case research 引用）
        </p>
      </section>

      {/* TVC */}
      <section className="svc-section" id="tvc">
        <span className="kicker">№ 03 · TVC</span>
        <h2>
          产品 / <em>品牌宣传片</em>
          <br />
          1 / 100 的价格做出影视级大片
        </h2>

        <div className="cards-2" style={{ marginTop: 32 }}>
          <div className="card">
            <div className="card-meta">
              <span className="tag">AI 渲染</span>
            </div>
            <h3>AI 直接生成影视级 3D 渲染结果</h3>
            <p className="card-desc">
              省下 ¥1,000+ / 秒的 3D 建模费用。同样的视觉精度，成本只有传统制作的 1/100。
            </p>
          </div>
          <div className="card">
            <div className="card-meta">
              <span className="tag">AI 外景</span>
            </div>
            <h3>极端场景、特技挑战、航拍 / POV</h3>
            <p className="card-desc">
              那些原本要拉拍摄组到极地、登山、潜水的场景，AI 直接生成。
            </p>
          </div>
        </div>

        <h3 style={{ fontSize: 22, margin: "40px 0 14px" }}>适用场景</h3>
        <ul className="body-text" style={{ paddingLeft: 24 }}>
          <li>品牌大促（年中、黑五、年终）</li>
          <li>海外市场投放（Amazon Brand Video、社媒广告投流）</li>
          <li>官网品牌视频 / PR 宣传</li>
          <li><strong style={{ color: "var(--cream)" }}>Amazon Sponsored Product Video 测人群与场景</strong>：针对不同人群和场景做不同脚本视频投流，找准之后投放数据会有量级差别——我们做和套图同样的调研 + 脚本设计流程，把命中率拉起来</li>
        </ul>

        {/* New pricing block — by-second pricing with min order callout */}
        <div className="tvc-price">
          <div className="tvc-price-main">
            <span className="tvc-price-label">AI TVC / 品牌广告片</span>
            <span className="tvc-price-num">
              <em>¥100</em><span className="tvc-price-unit"> / 秒</span>
            </span>
            <span className="tvc-price-badge">MIN. 25S</span>
          </div>
          <div className="tvc-price-meta">
            <span className="tvc-price-min">25 秒起订</span>
            <span className="tvc-price-bulk">量大从优</span>
            <span className="tvc-price-incl">含脚本撰写 · 分镜 · 视觉生成 · 剪辑</span>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="cta-bar" style={{ margin: 0, border: "1px solid var(--line)" }}>
          <span className="kicker">下一步</span>
          <h2 style={{ fontSize: 42, marginTop: 14 }}>
            把产品资料给我们，
            <br />
            <em>5 个工作日</em> 拿到初稿。
          </h2>
          <div style={{ display: "inline-flex", gap: 16, marginTop: 32 }}>
            <a className="btn btn-primary" href={FEISHU_SCHEDULER_URL} target="_blank" rel="noopener noreferrer">
              预约报价 <span className="arr">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
