import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";
import { getPage, getWritings } from "@/server/queries/public";

export const metadata = { title: "Writings" };

export default async function WritingsPage() {
  const [page, writers] = await Promise.all([getPage("writings"), getWritings()]);
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
