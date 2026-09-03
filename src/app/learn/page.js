import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";
import { getPage, getWorkshops } from "@/server/queries/public";

export const metadata = { title: "Workshops" };

export default async function LearnPage() {
  const [page, workshops] = await Promise.all([getPage("learn"), getWorkshops()]);
  const upcoming = workshops.filter((item) => item.kind !== "recording");
  const recordings = workshops.filter((item) => item.kind === "recording");

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
            <p className="eyebrow">UPCOMING</p>
            <h2 className="headline">Sessions still ahead</h2>
          </div>
          <div className="event-grid">
            {upcoming.map((item) => (
              <article className="event-card" key={item.slug}>
                {item.coverImage ? <img className="cover" src={item.coverImage} alt="" /> : null}
                <h3>{item.title}</h3>
                <p className="body">{item.summary}</p>
                <p className="body">
                  {item.instructor}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
              </article>
            ))}
          </div>
          <div className="page-head" style={{ marginTop: 48 }}>
            <p className="eyebrow">ARCHIVE</p>
            <h2 className="headline">Recordings of past workshops</h2>
          </div>
          <div className="event-grid">
            {recordings.map((item) => (
              <article className="event-card" key={item.slug}>
                {item.coverImage ? <img className="cover" src={item.coverImage} alt="" /> : null}
                <h3>{item.title}</h3>
                <p className="body">{item.summary}</p>
                {item.recordingUrl ? (
                  <a className="btn" href={item.recordingUrl} target="_blank" rel="noreferrer">
                    Watch recording
                  </a>
                ) : (
                  <p className="body">Recording being archived.</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
