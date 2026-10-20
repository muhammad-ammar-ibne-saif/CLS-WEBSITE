import Link from "next/link";
import Frame from "@/components/Frame";

export default function PersonCard({ person, compact = false }) {
  const inner = (
    <>
      <Frame src={person.image} alt={person.name} sizes={compact ? "(max-width: 960px) 45vw, 260px" : "(max-width: 960px) 45vw, 320px"} />
      <div className="person-meta">
        <h3>{person.name}</h3>
        <p>{person.role}</p>
        {person.department ? <small>{person.department}</small> : null}
      </div>
    </>
  );
  return person.href ? (
    <Link className="person" href={person.href}>
      {inner}
    </Link>
  ) : (
    <article className="person">{inner}</article>
  );
}
