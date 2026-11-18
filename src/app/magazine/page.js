import Link from "next/link";
import ComingSoon from "@/components/ComingSoon";
import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";
import MagazineCover from "@/components/magazine/MagazineCover";
import { getMagazines, getPage, isComingSoon } from "@/server/queries/public";

export const metadata = { title: "Magazine" };
export const revalidate = 300;

export default async function MagazinePage() {
  if (await isComingSoon("magazine")) return <ComingSoon pageKey="magazine" />;
  const [page, issues] = await Promise.all([getPage("magazine"), getMagazines()]);
  const [latest, ...older] = issues;

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
          {!latest ? (
            <p className="lede center">The first issue is on its way. Check back soon.</p>
          ) : (
            <>
              <article className="mag-feature">
                <Link className="mag-cover-link" href={`/magazine/${latest.slug}`} aria-label={`Read ${latest.title}`}>
                  <MagazineCover issue={latest} priority />
                </Link>
                <div className="mag-feature-text">
                  <p className="eyebrow">Latest issue{latest.issue ? ` · ${latest.issue}` : ""}</p>
                  <h2 className="headline">{latest.title}</h2>
                  {latest.summary ? <p className="body">{latest.summary}</p> : null}
                  <div className="mag-actions">
                    <Link className="btn btn-outline" href={`/magazine/${latest.slug}`}>
                      <img src="/assets/book-open.svg" alt="" width={16} height={16} />
                      Read now
                    </Link>
                    <a className="btn" href={latest.file} download>
                      <img src="/assets/download.svg" alt="" width={16} height={16} />
                      Download PDF
                    </a>
                  </div>
                </div>
              </article>

              {older.length ? (
                <>
                  <div className="page-head">
                    <h2 className="headline">{page.headline || "All Issues"}</h2>
                  </div>
                  <div className="mag-grid">
                    {older.map((issue) => (
                      <Link className="mag-card" key={issue.slug} href={`/magazine/${issue.slug}`}>
                        <MagazineCover issue={issue} />
                        <h3>{issue.title}</h3>
                        {issue.issue ? <p>{issue.issue}</p> : null}
                      </Link>
                    ))}
                  </div>
                </>
              ) : null}
            </>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
