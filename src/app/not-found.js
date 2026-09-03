import Link from "next/link";
import SiteShell from "@/components/SiteShell";

export default function NotFound() {
  return (
    <SiteShell showJoin={false}>
      <section className="hero">
        <div className="wrap stack">
          <h1 className="display">This page has not been written yet.</h1>
          <p className="lede">The society archive does not have this address. Return home, or browse events and writings.</p>
          <Link className="btn" href="/">Back to CLS</Link>
        </div>
      </section>
    </SiteShell>
  );
}
