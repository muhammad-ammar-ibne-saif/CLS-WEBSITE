import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";
import PersonCard from "@/components/PersonCard";
import { EC_RANK_HEADINGS, EC_RANK_ORDER } from "@/config/constants";
import { getLeadershipGroups, getPage } from "@/server/queries/public";

export const metadata = { title: "Leadership" };
export const revalidate = 300;

export default async function LeadershipPage() {
  const [page, groups] = await Promise.all([getPage("leadership"), getLeadershipGroups()]);
  const ranks = EC_RANK_ORDER.filter((rank) => groups.ec[rank].length > 0);

  return (
    <SiteShell>
      <section className="hero">
        <div className="wrap stack">
          <div className="stack center">
            <h1 className="display">{page.title}</h1>
            <p className="lede">{page.lede}</p>
          </div>
          <Ornament />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap stack">
          <div className="page-head">
            {page.calligraphyImage ? (
              <img className="calligraphy lg" src={page.calligraphyImage} alt="" loading="lazy" decoding="async" />
            ) : null}
            <h2 className="headline">{page.headline}</h2>
          </div>
          <div className="team-grid">
            {groups.core.map((person) => (
              <PersonCard key={person.href || person.name} person={person} />
            ))}
          </div>

          {groups.hasEc ? (
            <>
              <div className="page-head ec-head">
                <Ornament />
                <h2 className="headline">{page.secondaryHeadline}</h2>
                {page.secondaryLede ? <p className="lede">{page.secondaryLede}</p> : null}
              </div>
              {ranks.map((rank) => (
                <div className="rank-block" key={rank}>
                  <h3 className="rank-title">{EC_RANK_HEADINGS[rank]}</h3>
                  <div className={`team-grid is-compact${groups.ec[rank].length === 1 ? " is-solo" : ""}`}>
                    {groups.ec[rank].map((person) => (
                      <PersonCard key={person.href || person.name} person={person} compact />
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : null}

          <Link className="btn" href="/history">
            <img src="/assets/clock.svg" alt="" width={16} height={16}  loading="lazy" decoding="async" />
            See History of CLS
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
