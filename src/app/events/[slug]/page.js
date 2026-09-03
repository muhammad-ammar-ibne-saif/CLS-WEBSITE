import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import { getEvent } from "@/server/queries/public";

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
          {event.image ? (
            <img className="frame" src={event.image} alt="" style={{ width: "100%", maxWidth: 640 }} />
          ) : null}
          <p className="body" style={{ maxWidth: 720, textAlign: "center" }}>
            {event.body ||
              "This gathering is part of the CLS literary calendar — a public evening of recitation, conversation, and the campus community that has grown around both since 2016."}
          </p>
          <Link className="btn" href="/events">Back to events</Link>
        </div>
      </section>
    </SiteShell>
  );
}
