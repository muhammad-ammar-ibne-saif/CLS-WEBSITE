import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";
import Frame from "@/components/Frame";
import { getEvents, getPage } from "@/server/queries/public";

export const metadata = { title: "Events" };

export const revalidate = 300;

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
          <div className="frame-stage">
            <Frame variant="landscape" size="hero" src={page.heroImage} sizes="(max-width: 960px) 100vw, 840px" priority />
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
      </section>
    </SiteShell>
  );
}
