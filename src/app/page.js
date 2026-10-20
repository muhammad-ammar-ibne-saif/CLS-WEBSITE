import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";
import Frame from "@/components/Frame";
import { members as fallbackFaces } from "@/data/site";
import { isVideoUrl } from "@/lib/utils";
import { getEvents, getLeadership, getPage, getSettings, getWritings } from "@/server/queries/public";

export const revalidate = 300;

export default async function HomePage() {
  const [settings, page, events, writers, people] = await Promise.all([
    getSettings(),
    getPage("home"),
    getEvents(),
    getWritings(),
    getLeadership(),
  ]);
  const faces = people.filter((person) => person.avatar).map((person) => person.avatar);
  const photos = faces.length ? faces : fallbackFaces;

  return (
    <SiteShell home>
      <section className="hero hero-home">
        <div className="wrap stack">
          <div className="stack center">
            <h1 className="display">{page.title}</h1>
            <p className="lede">{page.lede}</p>
          </div>
          <div className="photo-grid">
            {photos.map((src) => (
              <img key={src} src={src} alt="" width={52} height={52} loading="lazy" decoding="async" />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="events">
        <div className="wrap">
          <div className="events-head">
            {page.calligraphyImage ? (
              <img className="calligraphy lg" src={page.calligraphyImage} alt="" loading="lazy" decoding="async" />
            ) : null}
            <h2 className="headline">{page.headline}</h2>
          </div>

          <div className="frame-stage">
            <Frame variant="landscape" size="hero" src={settings.homeShowcase} sizes="(max-width: 960px) 100vw, 840px" priority>
              {isVideoUrl(settings.homeShowcase) ? null : (
                <Link className="frame-play" href="/events" aria-label="See event details">
                  <img src="/assets/play.svg" alt="" width={96} height={96}  loading="lazy" decoding="async" />
                </Link>
              )}
            </Frame>
          </div>

          <div className="event-grid">
            {events.map((event) => (
              <article className="event-card" key={event.slug}>
                <Link className="frame-link" href={`/events/${event.slug}`} aria-label={event.title}>
                  <Frame src={event.image} alt={event.title} />
                </Link>
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
            <img className="calligraphy" src="/assets/calligraphy-writers.png" alt="Urdu calligraphy"  loading="lazy" decoding="async" />
            <h2 className="headline">{page.secondaryHeadline}</h2>
            <p className="lede">{page.secondaryLede}</p>
          </div>
          <div className="writer-list">
            {writers.map((writer) => (
              <article className="writer-row" key={writer.slug}>
                <div className="writer-meta">
                  <img src={writer.image} alt="" width={52} height={52}  loading="lazy" decoding="async" />
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
