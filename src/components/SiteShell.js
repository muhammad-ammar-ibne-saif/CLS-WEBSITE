import Navbar from "./Navbar";
import Footer from "./Footer";
import JoinCta from "./JoinCta";
import HomeBgVideo from "./HomeBgVideo";
import { getSettings } from "@/server/queries/public";

export default async function SiteShell({ children, showJoin = true, home = false }) {
  const settings = await getSettings();
  const style = settings.frameArt
    ? { "--frame-art-sm": `url("${settings.frameArt}")`, "--frame-art-lg": `url("${settings.frameArt}")` }
    : undefined;
  // While registration is "Coming soon", don't advertise it in the join banner.
  const registerClosed = (settings.comingSoon || []).includes("register");

  return (
    <div className={home ? "site site-home" : "site"} style={style}>
      {home ? <HomeBgVideo src={settings.homeVideo} /> : null}
      <Navbar settings={settings} />
      <main>{children}</main>
      {showJoin && !registerClosed ? <JoinCta settings={settings} /> : null}
      <Footer settings={settings} />
    </div>
  );
}
