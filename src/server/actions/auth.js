"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ACCOUNT_STATUS, ROLES, TEAMS } from "@/config/constants";
import { connectDb } from "@/lib/db";
import { encryptSession, sessionCookieOptions } from "@/lib/session";
import { uniqueSlug } from "@/lib/slugify";
import { currentSemester, formString } from "@/lib/utils";
import { User } from "@/models/User";
import { JoinRequest } from "@/models/JoinRequest";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const staffSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  team: z.enum([TEAMS.CORE, TEAMS.EC]),
  department: z.string().min(2),
  office: z.string().optional(),
  semester: z.string().optional(),
  rollNumber: z.string().optional(),
  why: z.string().min(8),
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

export async function loginAction(formData) {
  const parsed = loginSchema.safeParse({
    email: formString(formData, "email"),
    password: formString(formData, "password"),
  });
  if (!parsed.success) return { error: "Enter a valid email and password." };

  await connectDb();
  const user = await User.findOne({ email: parsed.data.email }).select("+passwordHash");
  if (!user || !(await user.checkPassword(parsed.data.password))) {
    return { error: "Those credentials were not recognized." };
  }
  if (user.status === ACCOUNT_STATUS.REJECTED || user.status === ACCOUNT_STATUS.SUSPENDED) {
    return { error: "This account is not active." };
  }
  if (user.role !== ROLES.ADMIN && user.status !== ACCOUNT_STATUS.APPROVED) {
    return { error: "Your profile is waiting on admin approval." };
  }

  user.lastLoginAt = new Date();
  await user.save();
  await setSessionCookie(user);
  redirect(user.role === ROLES.ADMIN ? "/admin" : "/me");
}

export async function logoutAction() {
  const options = sessionCookieOptions();
  (await cookies()).set(options.name, "", { ...options, maxAge: 0 });
  redirect("/login");
}

export async function applyStaffAction(formData) {
  const parsed = staffSchema.safeParse({
    name: formString(formData, "name"),
    email: formString(formData, "email").toLowerCase(),
    password: formString(formData, "password"),
    team: formString(formData, "team"),
    department: formString(formData, "department"),
    office: formString(formData, "office"),
    semester: formString(formData, "semester") || currentSemester(),
    rollNumber: formString(formData, "rollNumber"),
    why: formString(formData, "why"),
  });
  if (!parsed.success) return { error: "Please complete every required field." };

  await connectDb();
  const exists = await User.findOne({ email: parsed.data.email });
  if (exists) return { error: "An account with that email already exists." };

  const { why, password, ...rest } = parsed.data;
  const passwordHash = await User.hashPassword(password);
  const slug = await uniqueSlug(User, parsed.data.name);
  await User.create({
    ...rest,
    passwordHash,
    slug,
    headline: why,
    role: ROLES.STAFF,
    status: ACCOUNT_STATUS.PENDING,
    isDirector: /director/i.test(parsed.data.office || ""),
  });
  return { ok: true };
}

export async function joinSocietyAction(formData) {
  const name = formString(formData, "name");
  const email = formString(formData, "email").toLowerCase();
  const department = formString(formData, "department");
  const rollNumber = formString(formData, "roll");
  const why = formString(formData, "why");
  if (!name || !email || !department || !rollNumber || !why) {
    return { error: "Please complete the form." };
  }
  await connectDb();
  await JoinRequest.create({ name, email, department, rollNumber, why });
  return { ok: true };
}
