import Link from "next/link";
import SiteShell from "./SiteShell";
import Ornament from "./Ornament";
import { GATED_PAGES } from "@/config/constants";
import { getSettings } from "@/server/queries/public";

// Shown in place of a public page while the admin keeps it switched to "Coming soon".
export default async function ComingSoon({ pageKey }) {
  const settings = await getSettings();
  const hidden = new Set(settings.comingSoon || []);
  const page = GATED_PAGES.find((item) => item.key === pageKey);
  const live = GATED_PAGES.filter(
    (item) => !hidden.has(item.key) && item.key !== pageKey && item.key !== "home" && item.key !== "register",
  );

  return (
    <SiteShell home={pageKey === "home"} showJoin={false}>
      <section className="hero coming-soon">
        <div className="wrap stack">
          <Ornament />
          {page && pageKey !== "home" ? <p className="eyebrow">{page.label}</p> : null}
          <h1 className="display">{settings.comingSoonTitle || "Coming Soon"}</h1>
          <p className="lede center">{settings.comingSoonLede}</p>
          {live.length ? (
            <div className="coming-soon-links">
              {live.map((item) => (
                <Link className="btn" key={item.key} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
          <Ornament />
        </div>
      </section>
    </SiteShell>
  );
}
