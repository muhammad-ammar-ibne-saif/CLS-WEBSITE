import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";
import { constitutions } from "@/data/site";

export const metadata = { title: "Constitution" };

export default function ConstitutionPage() {
  return (
    <SiteShell>
      <section className="hero">
        <div className="wrap stack">
          <div className="stack center">
            <h1 className="display">CLS Believes a Constitution Is More Than Rules. It&apos;s a Promise.</h1>
            <p className="lede">
              No matter you are the president, director, or member, everyone is accountable to the Constitution. We pursue our mission without concentrating power in the hands of a few.
            </p>
          </div>
          <a className="btn btn-outline" href="/assets/constitution-thumb.png" download>
            <img src="/assets/download.svg" alt="" width={16} height={16} />
            Download Constitution PDF
          </a>
          <Ornament />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="writers-head">
            <img className="calligraphy" src="/assets/calligraphy-constitution.png" alt="Urdu calligraphy" />
            <h2 className="headline">History of Constitutional Development</h2>
            <p className="lede">
              CLS has undergone 2 constitutional developments. The first constitution was made in 2016 while new amendments were made in 2026
            </p>
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
