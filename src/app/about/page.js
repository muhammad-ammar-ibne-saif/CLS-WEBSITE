import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";
import { getPage } from "@/server/queries/public";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const page = await getPage("about");
  return (
    <SiteShell>
      <section className="hero">
        <div className="wrap stack">
          <div className="stack center">
            <h1 className="display">{page.title}</h1>
            <p className="lede">{page.lede}</p>
          </div>
          <div className="stats">
            {(page.stats || []).map((stat) => (
              <div className="stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {page.heroImage ? (
        <>
          <section className="banner-frame pattern-edges">
            <img className="banner" src={page.heroImage} alt="" />
          </section>
          <div className="pattern-bottom" />
        </>
      ) : null}

      <section className="section story">
        <div className="wrap stack">
          <p className="eyebrow">{page.eyebrow || "OUR STORY"}</p>
          <h2 className="headline center">{page.headline}</h2>
          <p className="center">{page.body}</p>
          {page.calligraphyImage ? <img className="calligraphy lg" src={page.calligraphyImage} alt="" /> : null}
          <Ornament />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap stack">
          <div className="page-head">
            <p className="eyebrow">OUR VALUES</p>
            <h2 className="headline">What CLS Stands For</h2>
          </div>
          <div className="values">
            {(page.cards || []).map((card) => (
              <article className="value-card" key={card.title}>
                {card.image ? <img src={card.image} alt="" width={80} height={80} /> : null}
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
          <Link className="btn" href={page.ctaHref || "/leadership"}>
            {page.ctaLabel || "See Our Leadership"}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
