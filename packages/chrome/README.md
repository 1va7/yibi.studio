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

## Yibi adapter

The root entry exports UI components only. It does not fetch account state,
implement profile pages, or bind to yibi.studio account APIs by default.

Use the optional adapter when a yibi-hosted app wants the nav to show the current
account summary:

```tsx
import { YibiNavAdapter } from "@yibi-studio/chrome/yibi";

export default function Nav() {
  return <YibiNavAdapter />;
}
```

The adapter reads `GET /api/chrome/session` and maps only the thin nav telemetry
contract: account label, avatar, badges, and login/account/logout links. Profile,
ledger, account settings, and module token management remain owned by the main
yibi.studio app.
