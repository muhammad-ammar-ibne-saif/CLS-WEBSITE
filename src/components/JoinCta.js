import Link from "next/link";

export default function JoinCta({ settings }) {
  return (
    <section className="pattern-box">
      <div className="pattern-box-inner">
        <img
          className="calligraphy"
          src="/assets/calligraphy-cta.png"
          alt="Urdu calligraphy"
        />
        <h2 className="display">{settings?.joinTitle || "CLS Is Waiting For “Your” Words. So Are We. Join Us Today."}</h2>
        <p className="lede">
          {settings?.joinLede ||
            "Join a circle of readers, writers, and dreamers who believe literature is meant to be shared, lived, and remembered."}
        </p>
        <Link href="/register" className="btn btn-outline">
          <img src="/assets/book-open.svg" alt="" width={16} height={16} />
          {settings?.joinCta || "Register Yourself Now"}
        </Link>
      </div>
    </section>
  );
}
