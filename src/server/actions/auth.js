"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ACCOUNT_STATUS, EC_RANKS, ROLES, TEAMS } from "@/config/constants";
import { connectDb } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import { limited } from "@/lib/rate-limit";
import { encryptSession, sessionCookieOptions } from "@/lib/session";
import { uniqueSlug } from "@/lib/slugify";
import { currentSemester, formString } from "@/lib/utils";
import { User } from "@/models/User";
import { JoinRequest } from "@/models/JoinRequest";

const HOUR = 60 * 60 * 1000;

const loginSchema = z.object({
  email: z.string().email().max(160),
  password: z.string().min(8).max(72),
});

const staffSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(160),
  password: z.string().min(8).max(72),
  team: z.enum([TEAMS.CORE, TEAMS.EC]),
  ecRank: z.enum([EC_RANKS.DIRECTOR, EC_RANKS.LEAD, EC_RANKS.COLEAD, ""]).default(""),
  department: z.string().min(2).max(60),
  office: z.string().max(80).optional(),
  semester: z.string().max(40).optional(),
  rollNumber: z.string().max(40).optional(),
  why: z.string().min(8).max(1200),
});

const joinSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(160),
  department: z.string().min(2).max(80),
  rollNumber: z.string().min(3).max(40),
  why: z.string().min(8).max(1200),
});

async function setSessionCookie(user) {
  const token = await encryptSession({
    sub: user._id.toString(),
    role: user.role,
    status: user.status,
  });
  const options = sessionCookieOptions();
  (await cookies()).set(options.name, token, options);
}

function firstIssue(error, fallback) {
  const issue = error.issues?.[0];
  if (!issue) return fallback;
  const field = String(issue.path?.[0] || "");
  const labels = {
    email: "Enter a valid email address.",
    password: "Password must be 8 to 72 characters.",
    name: "Enter your full name.",
    department: "Choose or enter your department.",
    rollNumber: "Enter your roll number.",
    why: "Tell us a little more in a few sentences.",
  };
  return labels[field] || fallback;
}

export async function loginAction(formData) {
  const parsed = loginSchema.safeParse({
    email: formString(formData, "email").toLowerCase(),
    password: formString(formData, "password"),
  });
  if (!parsed.success) return { error: "Enter a valid email and password." };

  if (await limited("login", 10, 10 * 60 * 1000, parsed.data.email)) {
    return { error: "Too many attempts. Wait a few minutes and try again." };
  }

  let user;
  try {
    await connectDb();
    user = await User.findOne({ email: parsed.data.email }).select("+passwordHash");
  } catch {
    return { error: "The service is busy. Please try again in a moment." };
  }

  if (!user || !(await user.checkPassword(parsed.data.password))) {
    return { error: "Those credentials were not recognized." };
  }
  if (user.status === ACCOUNT_STATUS.REJECTED || user.status === ACCOUNT_STATUS.SUSPENDED) {
    return { error: "This account is not active." };
  }

  user.lastLoginAt = new Date();
  await user.save();
  await setSessionCookie(user);

  if (user.role === ROLES.ADMIN) redirect("/admin");
  redirect(user.status === ACCOUNT_STATUS.APPROVED ? "/me" : "/staff/setup");
}

export async function logoutAction() {
  const options = sessionCookieOptions();
  (await cookies()).set(options.name, "", { ...options, maxAge: 0 });
  redirect("/login");
}

export async function applyStaffAction(formData) {
  if (formString(formData, "website")) return { ok: true };

  if (await limited("apply", 6, HOUR)) {
    return { error: "Too many requests from this connection. Try again later." };
  }

  const team = formString(formData, "team");
  const parsed = staffSchema.safeParse({
    name: formString(formData, "name"),
    email: formString(formData, "email").toLowerCase(),
    password: formString(formData, "password"),
    team,
    ecRank: team === TEAMS.EC ? formString(formData, "ecRank") : "",
    department: formString(formData, "department"),
    office: formString(formData, "office"),
    semester: formString(formData, "semester") || currentSemester(),
    rollNumber: formString(formData, "rollNumber"),
    why: formString(formData, "why"),
  });
  if (!parsed.success) return { error: firstIssue(parsed.error, "Please complete every required field.") };
  if (parsed.data.team === TEAMS.EC && !parsed.data.ecRank) {
    return { error: "Choose your Executive Council position." };
  }

  let user;
  try {
    await connectDb();
    const exists = await User.exists({ email: parsed.data.email });
    if (exists) return { error: "An account with that email already exists. Sign in instead." };

    const { why, password, ...rest } = parsed.data;
    const passwordHash = await User.hashPassword(password);
    const slug = await uniqueSlug(User, parsed.data.name);
    user = await User.create({
      ...rest,
      passwordHash,
      slug,
      headline: why,
      role: ROLES.STAFF,
      status: ACCOUNT_STATUS.PENDING,
      isDirector: false,
    });
  } catch (error) {
    if (error?.code === 11000) return { error: "An account with that email already exists. Sign in instead." };
    return { error: "We could not save your request. Please try again in a moment." };
  }

  await setSessionCookie(user);
  redirect("/staff/setup");
}

export async function joinSocietyAction(formData) {
  if (formString(formData, "website")) return { ok: true };

  if (await limited("join", 5, HOUR)) {
    return { error: "Too many registrations from this connection. Try again later." };
  }

  const parsed = joinSchema.safeParse({
    name: formString(formData, "name"),
    email: formString(formData, "email").toLowerCase(),
    department: formString(formData, "department"),
    rollNumber: formString(formData, "roll"),
    why: formString(formData, "why"),
  });
  if (!parsed.success) return { error: firstIssue(parsed.error, "Please complete the form.") };

  try {
    await connectDb();
    const duplicate = await JoinRequest.findOne({
      email: parsed.data.email,
      status: { $in: ["new", "contacted"] },
    });
    if (!duplicate) await JoinRequest.create(parsed.data);
  } catch {
    return { error: "We could not save your registration. Please try again in a moment." };
  }

  try {
    await sendMail({
      to: parsed.data.email,
      subject: "Welcome to COMSATS Literary Society",
      text: `Salaam ${parsed.data.name}, your registration reached CLS. A member of the team will write to you with the next steps.`,
      html: `<p>Salaam ${parsed.data.name.replace(/[<>&"]/g, "")},</p><p>Your registration reached CLS. A member of the team will write to you with the next steps.</p>`,
    });
  } catch {
    return { ok: true };
  }

  return { ok: true };
}
