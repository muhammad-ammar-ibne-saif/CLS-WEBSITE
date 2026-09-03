import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";
import { getPage, getPublicMembers } from "@/server/queries/public";

export const metadata = { title: "Members" };

export default async function MembersPage() {
  const [page, people] = await Promise.all([getPage("members"), getPublicMembers()]);
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
          <div className="team-grid">
            {people.map((person) => (
              <Link className="person" key={person._id} href={`/members/${person.slug || person._id}`}>
                <img src={person.avatar || "/assets/portrait-frame.png"} alt={person.name} />
                <div>
                  <h3>{person.name}</h3>
                  <p>
                    {person.office || person.team} · {person.semester}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
