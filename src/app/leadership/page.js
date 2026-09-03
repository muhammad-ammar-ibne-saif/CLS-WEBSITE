import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";
import { defaultLeadership } from "@/config/defaults";
import { getLeadership, getPage } from "@/server/queries/public";

export const metadata = { title: "Leadership" };

export default async function LeadershipPage() {
  const [page, people] = await Promise.all([getPage("leadership"), getLeadership()]);
  const roster = people.length
    ? people.map((person) => ({
        name: person.name,
        role: person.office || person.team,
        image: person.avatar || "/assets/portrait-frame.png",
        href: person.slug ? `/members/${person.slug}` : null,
      }))
    : defaultLeadership.map((person) => ({ ...person, href: null }));

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
              <img className="calligraphy lg" src={page.calligraphyImage} alt="" />
            ) : null}
            <h2 className="headline">{page.headline}</h2>
          </div>
          <div className="team-grid">
            {roster.map((person) => {
              const inner = (
                <>
                  <img src={person.image} alt={person.name} />
                  <div>
                    <h3>{person.name}</h3>
                    <p>{person.role}</p>
                  </div>
                </>
              );
              return person.href ? (
                <Link className="person" key={person.name} href={person.href}>
                  {inner}
                </Link>
              ) : (
                <article className="person" key={person.name}>
                  {inner}
                </article>
              );
            })}
          </div>
          <Link className="btn" href="/history">
            <img src="/assets/clock.svg" alt="" width={16} height={16} />
            See History of CLS
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
