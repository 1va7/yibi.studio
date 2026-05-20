type SocialBase = {
  label?: string;
  count?: string; // e.g. "2w+", "1w+"
};

export type Social =
  | (SocialBase & { type: "wechat-mp"; qr: string; subtitle?: string })
  | (SocialBase & { type: "wechat-channels"; qr: string; subtitle?: string })
  | (SocialBase & { type: "xiaohongshu"; href: string })
  | (SocialBase & { type: "douyin"; href: string });

const PLATFORM: Record<
  Social["type"],
  { name: string; icon: React.ReactNode }
> = {
  "wechat-mp": {
    name: "公众号",
    // simple WeChat-style speech bubble (dark gray, no brand color)
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
        <path
          fill="currentColor"
          d="M9.5 4C5.36 4 2 6.91 2 10.5c0 2.06 1.13 3.88 2.88 5.05L4 18l2.62-1.4c.91.22 1.86.34 2.88.34l.54-.02A6.65 6.65 0 0 1 9 14c0-3.31 3.13-6 7-6 .5 0 1 .04 1.47.13C16.5 5.45 13.34 4 9.5 4M7 8.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M22 14c0-2.76-2.69-5-6-5s-6 2.24-6 5c0 2.76 2.69 5 6 5 .68 0 1.34-.1 1.94-.27L20 20l-.6-1.78A4.7 4.7 0 0 0 22 14m-9-.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0m5 0a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0"
        />
      </svg>
    ),
  },
  "wechat-channels": {
    name: "视频号",
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
        <path fill="currentColor" d="M8 5v14l11-7z" />
      </svg>
    ),
  },
  xiaohongshu: {
    name: "小红书",
    icon: (
      // simple "RED" book-mark shape
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
        <path
          fill="currentColor"
          d="M5 3h14v18l-7-3.5L5 21V3m4 5v8l3-1.5L15 16V8z"
        />
      </svg>
    ),
  },
  douyin: {
    name: "抖音",
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
        <path
          fill="currentColor"
          d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.6 2.6 0 0 1-2.6 2.5c-1.44 0-2.6-1.17-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.23-1.48"
        />
      </svg>
    ),
  },
};

function PillContent({ social }: { social: Social }) {
  const meta = PLATFORM[social.type];
  return (
    <>
      <span className="sp-ic">{meta.icon}</span>
      <span className="sp-name">{social.label || meta.name}</span>
      {social.count && <span className="sp-count">{social.count}</span>}
    </>
  );
}

export default function InstructorSocials({ socials }: { socials: Social[] }) {
  return (
    <div className="social-row">
      {socials.map((s, i) => {
        const isQr = s.type === "wechat-mp" || s.type === "wechat-channels";
        const meta = PLATFORM[s.type];

        if (isQr && "qr" in s) {
          return (
            <span key={i} className="social-pill sp-has-qr" tabIndex={0}>
              <PillContent social={s} />
              <span className="sp-qr-pop" role="tooltip">
                <span className="sp-qr-head">
                  <span className="sp-qr-tag">{meta.name}</span>
                  <span className="sp-qr-name">{s.label || meta.name}</span>
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.qr} alt={`${s.label || meta.name} 二维码`} />
                <span className="sp-qr-foot">扫码或长按识别</span>
              </span>
            </span>
          );
        }
        if ((s.type === "xiaohongshu" || s.type === "douyin") && "href" in s) {
          return (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-pill"
            >
              <PillContent social={s} />
            </a>
          );
        }
        return null;
      })}
    </div>
  );
}
