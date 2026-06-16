import Link from "next/link.js";
import { FEISHU_SCHEDULER_URL } from "./links.js";
import SocialDock, { type SocialEntry } from "./social.js";

export type FooterProps = {
  schedulerUrl?: string;
  socialEntries?: SocialEntry[];
};

export default function Footer({
  schedulerUrl = FEISHU_SCHEDULER_URL,
  socialEntries,
}: FooterProps) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="word">
              <span className="footer-brand-zh">异璧</span>
            </div>
            <p className="desc">用 AI 打造可以自我进化的公司。</p>
            <SocialDock
              variant="footer"
              className="footer-social"
              entries={socialEntries}
            />
          </div>
          <div>
            <h4>Studio</h4>
            <ul>
              <li>
                <Link href="/services">服务</Link>
              </li>
              <li>
                <Link href="/solutions">解决方案</Link>
              </li>
              <li>
                <Link href="/insights">洞察</Link>
              </li>
              <li>
                <Link href="/about">关于</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Products</h4>
            <ul>
              <li>
                <Link href="/products/distill">经验蒸馏</Link>
              </li>
              <li>
                <Link href="/skills">Skills 库</Link>
              </li>
              <li>
                <Link href="/products/labs">实验室</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Connect</h4>
            <ul>
              <li>
                <Link href="/community">加入社群</Link>
              </li>
              <li>
                <a href="mailto:hi@yibi.studio">hi@yibi.studio</a>
              </li>
              <li>
                <a
                  href={schedulerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  预约咨询
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 异璧科技（深圳）有限公司</span>
          <a
            className="footer-icp"
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            粤ICP备2026017742号-2
          </a>
          <span className="url">
            <em>yibi</em>.studio
          </span>
        </div>
      </div>
    </footer>
  );
}
