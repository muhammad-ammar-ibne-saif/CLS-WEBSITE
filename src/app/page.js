import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";
import { events, members, writers } from "@/data/site";

export default function HomePage() {
  return (
    <SiteShell>
      <section className="hero pattern-edges">
        <div className="wrap stack">
          <div className="stack center">
            <h1 className="display">Promoting Literature &amp; Poetry in COMSATS Lahore Since 2016.</h1>
            <p className="lede">
              Comsats Literary Society is a community of 200+ literates who have one vision in common and that is to promote &amp; spread love &amp; literature in campus
            </p>
          </div>
          <div className="photo-grid">
            {members.map((src) => (
              <img key={src} src={src} alt="" width={52} height={52} />
            ))}
          </div>
        </div>
      </section>
      <div className="pattern-bottom" />

      <section className="section" id="events">
        <div className="wrap">
          <div className="events-head">
            <img className="calligraphy lg" src="/assets/calligraphy-events.png" alt="Urdu calligraphy" />
            <h2 className="headline">We’ve organized 100+ On-Campus Events. See Our Literary Legacy</h2>
          </div>

          <div className="video-stage">
            <img className="frame" src="/assets/video-frame.png" alt="CLS event highlight" />
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
            <h2 className="headline">Our Writers Who Keep Our Legacy Alive</h2>
            <p className="lede">
              CLS has conducted 20+ poetry &amp; prose workshops and has hosted and trained more than 20 writers from its platform.
            </p>
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
