import Nav, { type NavProps } from "./nav.js";
import Footer, { type FooterProps } from "./footer.js";

export type SiteChromeProps = {
  children: React.ReactNode;
  nav?: NavProps;
  footer?: FooterProps;
  mainClassName?: string;
};

export default function SiteChrome({
  children,
  nav,
  footer,
  mainClassName = "page",
}: SiteChromeProps) {
  return (
    <>
      <Nav {...nav} />
      <main className={mainClassName}>{children}</main>
      <Footer {...footer} />
    </>
  );
}
