"use client";

import Link from "next/link";
import { useActionState } from "react";
import Ornament from "@/components/Ornament";
import { joinSocietyAction } from "@/server/actions/auth";

export default function RegisterForm({ page }) {
  const [state, action] = useActionState(async (_prev, formData) => joinSocietyAction(formData), null);

  return (
    <>
      <section className="hero">
        <div className="wrap stack">
          <img className="calligraphy" src="/assets/calligraphy-cta.png" alt="" />
          <h1 className="display">{page.title}</h1>
          <p className="lede">{page.lede}</p>
          <Ornament />

          {state?.ok ? (
            <div className="success">
              <h2 className="headline">Your words are with us.</h2>
              <p className="lede" style={{ marginTop: 20 }}>
                Thank you for registering. A member of the CLS team will reach out with the next steps for membership and upcoming gatherings.
              </p>
            </div>
          ) : (
            <form className="form" action={action}>
              {state?.error ? <p className="dash-error">{state.error}</p> : null}
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
          <p className="body">
            Core or EC this semester? <Link href="/staff/apply">Create your staff account</Link>
          </p>
        </div>
      </section>
    </>
  );
}
