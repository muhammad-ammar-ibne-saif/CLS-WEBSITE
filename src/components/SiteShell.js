import Navbar from "./Navbar";
import Footer from "./Footer";
import JoinCta from "./JoinCta";
import HomeBgVideo from "./HomeBgVideo";
import { getSession } from "@/server/dal";
import { getSettings } from "@/server/queries/public";

export default async function SiteShell({ children, showJoin = true, leftVideo = null }) {
  const [settings, session] = await Promise.all([getSettings(), getSession()]);
  const body = (
    <>
      <main>{children}</main>
      {showJoin ? <JoinCta settings={settings} /> : null}
    </>
  );

  return (
    <div className={leftVideo ? "site site-home" : "site"}>
      <div className="site-rail site-rail-left" aria-hidden="true" />
      <div className="site-rail site-rail-right" aria-hidden="true" />
      <Navbar settings={settings} session={session} />
      {leftVideo ? (
        <div className="home-stage">
          <HomeBgVideo src={leftVideo} />
          <div className="home-stage-body">{body}</div>
        </div>
      ) : (
        body
      )}
      <Footer settings={settings} />
    </div>
  );
}
