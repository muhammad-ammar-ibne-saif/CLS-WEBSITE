"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [about, setAbout] = useState(false);
  const [events, setEvents] = useState(false);

  useEffect(() => {
    const close = () => {
      setAbout(false);
      setEvents(false);
    };
    window.addEventListener("scroll", close);
    return () => window.removeEventListener("scroll", close);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="logo" aria-label="COMSATS Literary Society home">
          <img src="/assets/logo.png" alt="COMSATS Literary Society" />
        </Link>

        <nav className={`nav-pill${open ? " open" : ""}`}>
          <div className={`nav-drop${about ? " open" : ""}`}>
            <button
              type="button"
              onClick={() => {
                setAbout((v) => !v);
                setEvents(false);
              }}
            >
              About CLS
              <img src="/assets/chevron-down.svg" alt="" width={16} height={16} />
            </button>
            <div className="nav-menu">
              <Link href="/about" onClick={() => setOpen(false)}>About</Link>
              <Link href="/constitution" onClick={() => setOpen(false)}>Constitution</Link>
              <Link href="/leadership" onClick={() => setOpen(false)}>Leadership</Link>
            </div>
          </div>

          <div className={`nav-drop${events ? " open" : ""}`}>
            <button
              type="button"
              onClick={() => {
                setEvents((v) => !v);
                setAbout(false);
              }}
            >
              Events
              <img src="/assets/chevron-down.svg" alt="" width={16} height={16} />
            </button>
            <div className="nav-menu">
              <Link href="/events" onClick={() => setOpen(false)}>Upcoming</Link>
              <Link href="/history" onClick={() => setOpen(false)}>History</Link>
            </div>
          </div>

          <Link href="/writings" className="nav-item" onClick={() => setOpen(false)}>
            Writings
          </Link>

          <Link href="/register" className="btn" onClick={() => setOpen(false)}>
            <img src="/assets/book-open.svg" alt="" width={16} height={16} />
            Register Yourself Now
          </Link>
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}
