import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";
import { members as fallbackFaces } from "@/data/site";
import { getEvents, getLeadership, getPage, getWritings } from "@/server/queries/public";

export default async function HomePage() {
  const [page, events, writers, people] = await Promise.all([
    getPage("home"),
    getEvents(),
    getWritings(),
    getLeadership(),
  ]);
  const faces = people.filter((person) => person.avatar).map((person) => person.avatar);
  const photos = faces.length ? faces : fallbackFaces;

  return (
    <SiteShell>
      <section className="hero pattern-edges">
        <div className="wrap stack">
          <div className="stack center">
            <h1 className="display">{page.title}</h1>
            <p className="lede">{page.lede}</p>
          </div>
          <div className="photo-grid">
            {photos.map((src) => (
              <img key={src} src={src} alt="" width={52} height={52} />
            ))}
          </div>
        </div>
      </section>
      <div className="pattern-bottom" />

      <section className="section" id="events">
        <div className="wrap">
          <div className="events-head">
            {page.calligraphyImage ? (
              <img className="calligraphy lg" src={page.calligraphyImage} alt="" />
            ) : null}
            <h2 className="headline">{page.headline}</h2>
          </div>

          <div className="video-stage">
            <img className="frame" src={page.heroImage || "/assets/video-frame.png"} alt="CLS event highlight" />
            <Link className="play-btn" href="/events" aria-label="See event details">
              <img src="/assets/play.svg" alt="" width={48} height={48} />
            </Link>
          </div>

          <div className="event-grid">
            {events.map((event) => (
              <article className="event-card" key={event.slug}>
                <img className="cover" src={event.image} alt="" />
                <h3>{event.title}</h3>
                <p className="body">{event.summary}</p>
                <Link className="btn" href={`/events/${event.slug}`}>See details</Link>
              </article>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 80 }}>
          <Ornament />
        </div>
      </section>

      <section className="section" id="writers">
        <div className="wrap">
          <div className="writers-head">
            <img className="calligraphy" src="/assets/calligraphy-writers.png" alt="Urdu calligraphy" />
            <h2 className="headline">{page.secondaryHeadline}</h2>
            <p className="lede">{page.secondaryLede}</p>
          </div>
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
            <div className="center">
              <Link className="btn" href="/writings">See All Writers</Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
