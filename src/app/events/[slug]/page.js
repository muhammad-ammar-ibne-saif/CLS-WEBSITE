import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import Frame from "@/components/Frame";
import { getEvent } from "@/server/queries/public";

export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  return { title: event?.title ?? "Event" };
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  return (
    <SiteShell>
      <section className="hero">
        <div className="wrap stack">
          <p className="eyebrow">{event.year}</p>
          <h1 className="display">{event.title}</h1>
          <p className="lede">{event.summary}</p>
          <div className="frame-narrow">
            <Frame src={event.image} alt={event.title} size="hero" sizes="(max-width: 960px) 90vw, 420px" priority />
          </div>
          <p className="body" style={{ maxWidth: 720, textAlign: "center" }}>
            {event.body ||
              "This gathering is part of the CLS literary calendar — a public evening of recitation, conversation, and the campus community that has grown around both since 2016."}
          </p>
          {(event.gallery || []).length ? (
            <div className="gallery-grid">
              {event.gallery.map((item, index) => (
                <figure key={`${item.image}-${index}`}>
                  <Frame src={item.image} alt={item.caption || event.title} />
                  {item.caption ? <figcaption>{item.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          ) : null}
          <Link className="btn" href="/events">Back to events</Link>
        </div>
      </section>
    </SiteShell>
  );
}
