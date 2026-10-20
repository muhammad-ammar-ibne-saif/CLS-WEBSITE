"use client";

import Link from "next/link";
import Ornament from "@/components/Ornament";
import ActionForm from "@/components/admin/ActionForm";
import SubmitButton from "@/components/admin/SubmitButton";
import { joinSocietyAction } from "@/server/actions/auth";

export default function RegisterForm({ page, calligraphy }) {
  const success = (
    <div className="success">
      <h2 className="headline">Your words are with us.</h2>
      <p className="lede" style={{ marginTop: 20 }}>
        Thank you for registering. A member of the CLS team will reach out with the next steps for membership and upcoming gatherings.
      </p>
    </div>
  );

  return (
    <section className="hero">
      <div className="wrap stack">
        <img className="calligraphy" src={calligraphy} alt="" loading="lazy" decoding="async" />
        <h1 className="display">{page.title}</h1>
        <p className="lede">{page.lede}</p>
        <Ornament />

        <ActionForm action={joinSocietyAction} className="form" successText="" successView={success}>
          <input className="hp-field" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label>
            Full name
            <input name="name" required maxLength={80} autoComplete="name" placeholder="Your name" />
          </label>
          <label>
            Email
            <input name="email" type="email" required maxLength={160} autoComplete="email" placeholder="you@students.comsats.edu.pk" />
          </label>
          <label>
            Department
            <input name="department" required maxLength={80} placeholder="e.g. Computer Science" />
          </label>
          <label>
            Campus / roll number
            <input name="roll" required minLength={3} maxLength={40} placeholder="FA24-BST-019" />
          </label>
          <label>
            Why do you want to join CLS?
            <textarea name="why" required minLength={8} maxLength={1200} placeholder="A few sentences are enough." />
          </label>
          <SubmitButton pendingText="Sending">Register Yourself Now</SubmitButton>
        </ActionForm>
        <p className="body">
          Core or EC this semester? <Link href="/staff/apply">Create your staff account</Link>
        </p>
      </div>
    </section>
  );
}
