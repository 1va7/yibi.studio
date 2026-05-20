import Link from "next/link";
import { FEISHU_SCHEDULER_URL } from "@/lib/links";

export const metadata = {
  title: "关于异璧",
  description:
    "异璧科技由来自芝加哥大学、清华大学、微软、摩托罗拉的工程师们创立。8+ 年 AI 落地实战，用世界前沿技术加速中国企业的出海进程。",
};

export default function AboutPage() {
  return (
    <div className="wrap">
      <section className="page-hero">
        <div className="eyebrow">关于 · ABOUT</div>
        <h1>
          硅谷 AI 技术
          <br />
          + <em>深圳落地速度</em>
        </h1>
        <p className="lede">
          异璧科技由来自芝加哥大学、清华大学、微软、摩托罗拉的工程师们创立。在 8+ 年的 AI 落地实战中，我们致力于用世界前沿的技术，加速中国企业的出海进程。
        </p>
      </section>

      <section className="section-tight" style={{ paddingBottom: 80 }}>
        <div className="cards-2" style={{ gap: 48 }}>
          <div>
            <span className="kicker">CONNECT</span>
            <h2 className="h-section" style={{ marginTop: 14, fontSize: 36 }}>
              和我们一起
              <br />
              <em>把 AI 装进真实业务</em>
            </h2>
          </div>
          <div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              <li><a href={FEISHU_SCHEDULER_URL} target="_blank" rel="noopener noreferrer" className="more">预约 30min 售前沟通 →</a></li>
              <li><Link href="/insights" className="more">看我们最近写的 →</Link></li>
              <li><Link href="/community" className="more">加入实战社群 →</Link></li>
              <li><a href="mailto:hi@yibi.studio" className="more">hi@yibi.studio</a></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
