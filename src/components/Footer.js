import Link from "next/link";

const SOCIAL_LINKS = [
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
  { key: "facebook", label: "Facebook" },
  { key: "tiktok", label: "TikTok" },
  { key: "linkedin", label: "LinkedIn" },
];

export default function Footer({ settings }) {
  const socials = settings?.socials || {};
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-cols">
          <div className="footer-col">
            <h4>QUICK LINKS</h4>
            <Link href="/about">About</Link>
            <Link href="/constitution">Constitution</Link>
            <Link href="/leadership">Leadership</Link>
            <Link href="/members">Members</Link>
          </div>
          <div className="footer-col">
            <h4>EVENTS</h4>
            <Link href="/events">Upcoming</Link>
            <Link href="/history">History</Link>
            <Link href="/learn">Workshops</Link>
          </div>
        </div>

        <img className="footer-rose" src={settings?.footerRose || "/assets/rose.webp"} alt="" loading="lazy" decoding="async" />

        <div className="footer-cols">
          <div className="footer-col">
            <h4>WRITERS</h4>
            <Link href="/writings">Our Writers</Link>
            <Link href="/magazine">Magazine</Link>
            <Link href="/staff/apply">Core & EC desk</Link>
          </div>
          <div className="footer-col">
            <h4>FIND US AT</h4>
            {SOCIAL_LINKS.filter(({ key }) => socials[key]).map(({ key, label }) => (
              <a key={key} href={socials[key]} target="_blank" rel="noreferrer">
                {label}
              </a>
            ))}
            {settings?.footerNote ? <p>{settings.footerNote}</p> : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
