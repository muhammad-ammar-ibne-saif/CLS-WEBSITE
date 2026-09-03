import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";
import { writers } from "@/data/site";

export const metadata = { title: "Writings" };

export default function WritingsPage() {
  return (
    <SiteShell>
      <section className="hero">
        <div className="wrap stack">
          <div className="stack center">
            <h1 className="display">Our Writers Who Keep Our Legacy Alive</h1>
            <p className="lede">
              CLS has conducted 20+ poetry &amp; prose workshops and has hosted and trained more than 20 writers from its platform.
            </p>
          </div>
          <Ornament />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="writer-list">
            {writers.map((writer) => (
              <article className="writer-row" key={writer.slug}>
                <div className="writer-meta">
                  <img src={writer.image} alt="" width={52} height={52} />
                  <div>
                    <h3>{writer.name}</h3>
                    <p>{writer.role}</p>
                  </div>
                </div>
                <Link className="btn" href={`/writings/${writer.slug}`}>Browse Writings</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
