import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-cols">
          <div className="footer-col">
            <h4>QUICK LINKS</h4>
            <Link href="/about">About</Link>
            <Link href="/constitution">Constitution</Link>
            <Link href="/leadership">Leadership</Link>
          </div>
          <div className="footer-col">
            <h4>EVENTS</h4>
            <Link href="/events">Upcoming</Link>
            <Link href="/history">History</Link>
          </div>
        </div>

        <img className="footer-rose" src="/assets/rose.png" alt="Illustrated rose" />

        <div className="footer-cols">
          <div className="footer-col">
            <h4>WRITERS</h4>
            <Link href="/writings">Our Writers</Link>
          </div>
          <div className="footer-col">
            <h4>FIND US AT</h4>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://www.tiktok.com" target="_blank" rel="noreferrer">Tiktok</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
