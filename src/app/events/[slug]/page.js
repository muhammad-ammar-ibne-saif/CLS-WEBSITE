import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import { events } from "@/data/site";

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = events.find((item) => item.slug === slug);
  return { title: event?.title ?? "Event" };
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const event = events.find((item) => item.slug === slug);
  if (!event) notFound();

  return (
    <SiteShell>
      <section className="hero">
        <div className="wrap stack">
          <p className="eyebrow">{event.year}</p>
          <h1 className="display">{event.title}</h1>
          <p className="lede">{event.summary}</p>
          <img className="frame" src={event.image} alt="" style={{ width: "100%", maxWidth: 640 }} />
          <p className="body" style={{ maxWidth: 720, textAlign: "center" }}>
            This gathering is part of the CLS literary calendar — a public evening of recitation, conversation, and the campus community that has grown around both since 2016. Details, guest lists, and galleries are kept with the society archive and updated as each tenure adds its own chapter.
          </p>
          <Link className="btn" href="/events">Back to events</Link>
        </div>
      </section>
    </SiteShell>
  );
}
