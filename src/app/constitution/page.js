import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";
import { getConstitutions, getPage } from "@/server/queries/public";

export const metadata = { title: "Constitution" };

export default async function ConstitutionPage() {
  const [page, constitutions] = await Promise.all([getPage("constitution"), getConstitutions()]);
  const download = constitutions[0]?.file || "/assets/constitution-thumb.png";

  return (
    <SiteShell>
      <section className="hero">
        <div className="wrap stack">
          <div className="stack center">
            <h1 className="display">{page.title}</h1>
            <p className="lede">{page.lede}</p>
          </div>
          <a className="btn btn-outline" href={download} download>
            <img src="/assets/download.svg" alt="" width={16} height={16} />
            Download Constitution PDF
          </a>
          <Ornament />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="writers-head">
            {page.calligraphyImage ? (
              <img className="calligraphy" src={page.calligraphyImage} alt="" />
            ) : null}
            <h2 className="headline">{page.headline}</h2>
            <p className="lede">{page.secondaryLede}</p>
          </div>
          <div className="writer-list">
            {constitutions.map((item) => (
              <article className="writer-row" key={item.title}>
                <div className="writer-meta">
                  <img src={item.file} alt="" width={52} height={52} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.credit}</p>
                  </div>
                </div>
                <a className="btn" href={item.file} download>
                  <img src="/assets/download.svg" alt="" width={16} height={16} />
                  Download to Read
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
