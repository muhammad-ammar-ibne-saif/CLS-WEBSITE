import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";
import { leadership } from "@/data/site";

export const metadata = { title: "Leadership" };

export default function LeadershipPage() {
  return (
    <SiteShell>
      <section className="hero">
        <div className="wrap stack">
          <div className="stack center">
            <h1 className="display">Led By Teams Who Are Always Ready to Step Forward For Literature</h1>
            <p className="lede">
              COMSATS Literary Society’s leadership always takes initiative and vision seriously. as its the only way forward in an environment where literature needs our effort to thrive.
            </p>
          </div>
          <Ornament />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap stack">
          <div className="page-head">
            <img className="calligraphy lg" src="/assets/calligraphy-leadership.png" alt="Urdu calligraphy" />
            <h2 className="headline">Core Team (Tenure 2026 - 2027)</h2>
          </div>
          <div className="team-grid">
            {leadership.map((person) => (
              <article className="person" key={person.name}>
                <img src={person.image} alt="" />
                <div>
                  <h3>{person.name}</h3>
                  <p>{person.role}</p>
                </div>
              </article>
            ))}
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
