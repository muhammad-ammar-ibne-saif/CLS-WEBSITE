import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import { getMemberBySlug } from "@/server/queries/public";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const member = await getMemberBySlug(slug);
  return { title: member?.name ?? "Member" };
}

export default async function MemberProfilePage({ params }) {
  const { slug } = await params;
  const member = await getMemberBySlug(slug);
  if (!member) notFound();

  return (
    <SiteShell>
      <section className="hero">
        <div className="wrap stack">
          <img
            src={member.avatar || "/assets/portrait-frame.png"}
            alt=""
            width={120}
            height={120}
            style={{ borderRadius: 12 }}
          />
          <p className="eyebrow">{member.team} · {member.semester}</p>
          <h1 className="display">{member.name}</h1>
          <p className="lede">{member.office || member.headline}</p>
          <p className="body" style={{ maxWidth: 640, textAlign: "center" }}>
            {member.bio || member.headline}
          </p>
        </div>
      </section>
      {(member.memories || []).length ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="page-head">
              <p className="eyebrow">MEMORIES</p>
              <h2 className="headline">What this tenure held</h2>
            </div>
            <div className="event-grid">
              {member.memories.map((memory) => (
                <article className="event-card" key={memory._id}>
                  <img className="cover" src={memory.image} alt="" />
                  <h3>{memory.event || "Memory"}</h3>
                  <p className="body">{memory.caption}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {(member.portfolio || []).length ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            {(member.portfolio || []).map((piece) => (
              <article className="piece" key={piece._id}>
                <p className="eyebrow">{piece.kind}</p>
                <h2>{piece.title}</h2>
                {piece.mediaUrl ? (
                  piece.kind === "video" ? (
                    <video src={piece.mediaUrl} controls style={{ width: "100%", marginBottom: 16 }} />
                  ) : (
                    <img src={piece.mediaUrl} alt="" style={{ width: "100%", marginBottom: 16 }} />
                  )
                ) : null}
                {String(piece.body || "")
                  .split("\n\n")
                  .map((para) => (
                    <p key={para.slice(0, 24)}>{para}</p>
                  ))}
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
