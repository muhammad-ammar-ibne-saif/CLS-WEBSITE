import Navbar from "./Navbar";
import Footer from "./Footer";
import JoinCta from "./JoinCta";
import { getSession } from "@/server/dal";
import { getSettings } from "@/server/queries/public";

export default async function SiteShell({ children, showJoin = true }) {
  const [settings, session] = await Promise.all([getSettings(), getSession()]);
  return (
    <div className="site">
      <Navbar settings={settings} session={session} />
      <main>{children}</main>
      {showJoin ? <JoinCta settings={settings} /> : null}
      <Footer settings={settings} />
    </div>
  );
}
