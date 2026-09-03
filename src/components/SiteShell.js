import Navbar from "./Navbar";
import Footer from "./Footer";
import JoinCta from "./JoinCta";

export default function SiteShell({ children, showJoin = true }) {
  return (
    <div className="site">
      <Navbar />
      <main>{children}</main>
      {showJoin ? <JoinCta /> : null}
      <Footer />
    </div>
  );
}
