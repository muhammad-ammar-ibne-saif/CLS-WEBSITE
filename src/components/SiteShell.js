import Navbar from "./Navbar";
import Footer from "./Footer";
import JoinCta from "./JoinCta";
import HomeBgVideo from "./HomeBgVideo";
import { getSession } from "@/server/dal";
import { getSettings } from "@/server/queries/public";

export default async function SiteShell({ children, showJoin = true, bgVideo = null }) {
  const [settings, session] = await Promise.all([getSettings(), getSession()]);
  return (
    <div className={bgVideo ? "site site-home" : "site"}>
      {bgVideo ? <HomeBgVideo src={bgVideo} /> : null}
      <Navbar settings={settings} session={session} />
      <main>{children}</main>
      {showJoin ? <JoinCta settings={settings} /> : null}
      <Footer settings={settings} />
    </div>
  );
}
