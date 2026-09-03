import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCOUNT_STATUS, ROLES, SESSION_COOKIE } from "@/config/constants";
import { connectDb } from "@/lib/db";
import { decryptSession } from "@/lib/session";
import { canAccessEc, canAccessStaff, toPlain } from "@/lib/utils";
import { User } from "@/models/User";

export const getSession = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const payload = await decryptSession(token);
  if (!payload?.sub) return null;

  try {
    await connectDb();
    const user = await User.findById(payload.sub)
      .select("-passwordHash")
      .lean();
    if (!user) return null;
    if (user.status === ACCOUNT_STATUS.SUSPENDED) return null;
    return toPlain(user);
  } catch {
    return null;
  }
});

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireApproved() {
  const session = await requireSession();
  if (session.role !== ROLES.ADMIN && session.status !== ACCOUNT_STATUS.APPROVED) {
    redirect("/login?error=pending");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireApproved();
  if (session.role !== ROLES.ADMIN) redirect("/me");
  return session;
}

export async function requireStaff() {
  const session = await requireApproved();
  if (!canAccessStaff(session)) redirect("/login");
  return session;
}

export async function requireEc() {
  const session = await requireApproved();
  if (!canAccessEc(session)) redirect("/me");
  return session;
}

export function publicUser(user) {
  if (!user) return null;
  return {
    id: user._id?.toString?.() || user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    team: user.team,
    office: user.office,
    department: user.department,
    status: user.status,
    avatar: user.avatar,
    slug: user.slug,
  };
}
