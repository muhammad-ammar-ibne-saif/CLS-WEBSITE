import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import { writers } from "@/data/site";

export function generateStaticParams() {
  return writers.map((writer) => ({ slug: writer.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const writer = writers.find((item) => item.slug === slug);
  return { title: writer?.name ?? "Writer" };
}

export default async function WriterPage({ params }) {
  const { slug } = await params;
  const writer = writers.find((item) => item.slug === slug);
  if (!writer) notFound();

  return (
    <SiteShell>
      <section className="hero">
        <div className="wrap stack">
          <img src={writer.image} alt="" width={80} height={80} style={{ borderRadius: 8 }} />
          <h1 className="display">{writer.name}</h1>
          <p className="lede">{writer.role}</p>
          <p className="body" style={{ maxWidth: 640, textAlign: "center" }}>{writer.bio}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {writer.pieces.map((piece) => (
            <article className="piece" key={piece.title}>
              <p className="eyebrow">WRITING</p>
              <h2>{piece.title}</h2>
              <p className="meta">{writer.name}</p>
              {piece.body.split("\n\n").map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </article>
          ))}
          <div className="center">
            <Link className="btn" href="/writings">All writers</Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
