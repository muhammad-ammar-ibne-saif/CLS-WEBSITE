import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";
import { getEvents, getPage } from "@/server/queries/public";

export const metadata = { title: "Events" };

export default async function EventsPage() {
  const [page, events] = await Promise.all([getPage("events"), getEvents()]);
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
          <div className="video-stage">
            <img className="frame" src={page.heroImage || "/assets/video-frame.png"} alt="" />
            <span className="play-btn" aria-hidden="true">
              <img src="/assets/play.svg" alt="" width={48} height={48} />
            </span>
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
      </section>
    </SiteShell>
  );
}
