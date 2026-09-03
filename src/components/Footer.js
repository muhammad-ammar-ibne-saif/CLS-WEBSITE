import Link from "next/link";

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

        <img className="footer-rose" src="/assets/rose.png" alt="Illustrated rose" />

        <div className="footer-cols">
          <div className="footer-col">
            <h4>WRITERS</h4>
            <Link href="/writings">Our Writers</Link>
            <Link href="/staff/apply">Core & EC desk</Link>
          </div>
          <div className="footer-col">
            <h4>FIND US AT</h4>
            <a href={socials.instagram || "https://www.instagram.com"} target="_blank" rel="noreferrer">Instagram</a>
            <a href={socials.facebook || "https://www.facebook.com"} target="_blank" rel="noreferrer">Facebook</a>
            <a href={socials.tiktok || "https://www.tiktok.com"} target="_blank" rel="noreferrer">Tiktok</a>
            {settings?.footerNote ? <p>{settings.footerNote}</p> : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
