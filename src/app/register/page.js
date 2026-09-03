"use client";

import { useState } from "react";
import SiteShell from "@/components/SiteShell";
import Ornament from "@/components/Ornament";

export default function RegisterPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <SiteShell showJoin={false}>
      <section className="hero">
        <div className="wrap stack">
          <img className="calligraphy" src="/assets/calligraphy-cta.png" alt="" />
          <h1 className="display">CLS Is Waiting For “Your” Words. So Are We. Join Us Today.</h1>
          <p className="lede">
            Join a circle of readers, writers, and dreamers who believe literature is meant to be shared, lived, and remembered.
          </p>
          <Ornament />

          {sent ? (
            <div className="success">
              <h2 className="headline">Your words are with us.</h2>
              <p className="lede" style={{ marginTop: 20 }}>
                Thank you for registering. A member of the CLS team will reach out with the next steps for membership and upcoming gatherings.
              </p>
            </div>
          ) : (
            <form className="form" onSubmit={onSubmit}>
              <label>
                Full name
                <input name="name" required placeholder="Your name" />
              </label>
              <label>
                Email
                <input name="email" type="email" required placeholder="you@students.comsats.edu.pk" />
              </label>
              <label>
                Department
                <input name="department" required placeholder="e.g. Computer Science" />
              </label>
              <label>
                Campus / roll number
                <input name="roll" required placeholder="CIIT/FAXX-XXX-000" />
              </label>
              <label>
                Why do you want to join CLS?
                <textarea name="why" required placeholder="A few sentences are enough." />
              </label>
              <button className="btn btn-outline" type="submit">
                <img src="/assets/book-open.svg" alt="" width={16} height={16} />
                Register Yourself Now
              </button>
            </form>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
