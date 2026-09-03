"use server";

import { revalidatePath } from "next/cache";
import { ACCOUNT_STATUS, ROLES } from "@/config/constants";
import { connectDb } from "@/lib/db";
import { approvalEmail, sendMail } from "@/lib/mailer";
import { uniqueSlug } from "@/lib/slugify";
import { formBool, formString } from "@/lib/utils";
import { JoinRequest } from "@/models/JoinRequest";
import { User } from "@/models/User";
import { requireAdmin } from "@/server/dal";

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/leadership");
  revalidatePath("/members");
  revalidatePath("/");
}

export async function reviewMemberAction(formData) {
  const admin = await requireAdmin();
  await connectDb();
  const id = formString(formData, "id");
  const decision = formString(formData, "decision");
  const office = formString(formData, "office");
  const team = formString(formData, "team");
  const department = formString(formData, "department");
  const isDirector = formBool(formData, "isDirector");
  const showOnLeadership = formBool(formData, "showOnLeadership");

  const user = await User.findById(id);
  if (!user || user.role === ROLES.ADMIN) return { error: "Member not found." };

  if (decision === "approve") {
    user.status = ACCOUNT_STATUS.APPROVED;
    user.approvedAt = new Date();
    user.approvedBy = admin._id;
    if (office) user.office = office;
    if (team) user.team = team;
    if (department) user.department = department;
    user.isDirector = isDirector || /director/i.test(user.office);
    user.showOnLeadership = showOnLeadership;
    if (!user.slug) user.slug = await uniqueSlug(User, user.name, user._id);
    await user.save();
    const mail = approvalEmail({ name: user.name, approved: true, office: user.office });
    await sendMail({ to: user.email, ...mail });
  } else if (decision === "reject") {
    user.status = ACCOUNT_STATUS.REJECTED;
    await user.save();
    const mail = approvalEmail({ name: user.name, approved: false });
    await sendMail({ to: user.email, ...mail });
  } else if (decision === "update") {
    if (office) user.office = office;
    if (team) user.team = team;
    if (department) user.department = department;
    user.isDirector = isDirector;
    user.showOnLeadership = showOnLeadership;
    await user.save();
  }
  refresh();
  return { ok: true };
}

export async function archiveJoinRequestAction(formData) {
  await requireAdmin();
  await connectDb();
  await JoinRequest.findByIdAndUpdate(formString(formData, "id"), {
    status: formString(formData, "status") || "archived",
  });
  revalidatePath("/admin/join-requests");
}
