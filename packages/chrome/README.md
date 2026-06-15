# @yibi-studio/chrome

Top navigation and footer components from yibi.studio.

## Usage

```tsx
import { SiteChrome } from "@yibi-studio/chrome";
import "@yibi-studio/chrome/styles.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
```

The default logo and QR image paths expect the consuming Next.js app to serve:

- `/assets/logo.png`
- `/assets/team/qr-wechat-mp.jpg`
- `/assets/team/qr-wechat-channels.png`

Override these via component props if the assets live elsewhere.
