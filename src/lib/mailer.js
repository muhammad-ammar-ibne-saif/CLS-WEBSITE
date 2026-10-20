import nodemailer from "nodemailer";
import { escapeHtml } from "@/lib/utils";

function appUrl() {
  return (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

function transport() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
}

export async function sendMail({ to, subject, html, text }) {
  const from = process.env.SMTP_FROM || "COMSATS Literary Society <noreply@localhost>";
  const mailer = transport();
  if (!mailer) {
    console.info("[mail:dev]", { to, subject, text: text || html });
    return { skipped: true };
  }
  await mailer.sendMail({ from, to, subject, html, text });
  return { skipped: false };
}

export function assignmentEmail({ name, planTitle, item, token }) {
  const url = `${appUrl()}/respond/${token}`;
  const when = item.startsAt ? new Date(item.startsAt).toLocaleString() : "";
  return {
    subject: `CLS ${item.kind}: ${item.title}`,
    text: `Salaam ${name || "Director"},

A ${item.kind} on the ${planTitle} calendar needs your response.

${item.title}
${when ? `When: ${when}` : ""}
${item.location ? `Where: ${item.location}` : ""}
${item.description || ""}

Respond here: ${url}

— COMSATS Literary Society`,
    html: `<p>Salaam ${escapeHtml(name || "Director")},</p>
<p>A <strong>${escapeHtml(item.kind)}</strong> on the <strong>${escapeHtml(planTitle)}</strong> calendar needs your response.</p>
<p><strong>${escapeHtml(item.title)}</strong><br/>
${when ? `When: ${escapeHtml(when)}<br/>` : ""}
${item.location ? `Where: ${escapeHtml(item.location)}<br/>` : ""}</p>
<p>${escapeHtml(item.description || "")}</p>
<p><a href="${url}">Accept, decline, or reply</a></p>
<p>— COMSATS Literary Society</p>`,
  };
}

export function approvalEmail({ name, approved, office }) {
  const url = `${appUrl()}/login`;
  if (!approved) {
    return {
      subject: "CLS account update",
      text: `Salaam ${name}, your Core/EC account request was not approved. Write to the current leadership if this looks wrong.`,
      html: `<p>Salaam ${escapeHtml(name)},</p><p>Your Core/EC account request was not approved. Write to the current leadership if this looks wrong.</p>`,
    };
  }
  return {
    subject: "Your CLS profile is live",
    text: `Salaam ${name}, your ${office || "CLS"} account is approved. Sign in at ${url} to publish your profile, memories, and portfolio.`,
    html: `<p>Salaam ${escapeHtml(name)},</p><p>Your ${escapeHtml(office || "CLS")} account is approved.</p><p><a href="${url}">Sign in</a> to publish your profile, memories, and portfolio.</p>`,
  };
}
