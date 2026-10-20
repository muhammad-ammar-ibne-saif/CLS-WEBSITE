"use server";

import { revalidatePath, updateTag } from "next/cache";
import { ACCOUNT_STATUS, EC_RANKS, ROLES, TEAMS } from "@/config/constants";
import { connectDb } from "@/lib/db";
import { approvalEmail, sendMail } from "@/lib/mailer";
import { uniqueSlug } from "@/lib/slugify";
import { formBool, formNumber, formString } from "@/lib/utils";
import { JoinRequest } from "@/models/JoinRequest";
import { User } from "@/models/User";
import { requireAdmin } from "@/server/dal";

const RANKS = Object.values(EC_RANKS);
const TEAM_VALUES = Object.values(TEAMS);

function refresh() {
  updateTag("cms");
  revalidatePath("/admin");
  revalidatePath("/leadership");
  revalidatePath("/members");
  revalidatePath("/");
}

async function notify(user, approved) {
  try {
    const mail = approvalEmail({ name: user.name, approved, office: user.office });
    await sendMail({ to: user.email, ...mail });
  } catch {
    return false;
  }
  return true;
}

function applyFields(user, formData) {
  const name = formString(formData, "name");
  const office = formString(formData, "office");
  const team = formString(formData, "team");
  const department = formString(formData, "department");
  const avatar = formString(formData, "avatar");
  const rank = formString(formData, "ecRank");

  if (name) user.name = name;
  if (office || formData.has("office")) user.office = office;
  if (TEAM_VALUES.includes(team)) user.team = team;
  if (department) user.department = department;
  if (avatar) user.avatar = avatar;
  user.ecRank = user.team === TEAMS.EC && RANKS.includes(rank) ? rank : "";
  user.sortOrder = formNumber(formData, "sortOrder", user.sortOrder || 0);
  user.isDirector = formBool(formData, "isDirector") || user.ecRank === EC_RANKS.DIRECTOR || /director/i.test(user.office);
  user.showOnLeadership = formBool(formData, "showOnLeadership");
}

export async function reviewMemberAction(formData) {
  const admin = await requireAdmin();
  await connectDb();
  const id = formString(formData, "id");
  const decision = formString(formData, "decision");

  const user = await User.findById(id);
  if (!user || user.role === ROLES.ADMIN) return { error: "Member not found." };

  if (decision === "approve") {
    applyFields(user, formData);
    user.status = ACCOUNT_STATUS.APPROVED;
    user.approvedAt = new Date();
    user.approvedBy = admin._id;
    if (!user.slug) user.slug = await uniqueSlug(User, user.name, user._id);
    await user.save();
    await notify(user, true);
  } else if (decision === "reject") {
    user.status = ACCOUNT_STATUS.REJECTED;
    await user.save();
    await notify(user, false);
  } else if (decision === "suspend") {
    user.status = ACCOUNT_STATUS.SUSPENDED;
    await user.save();
  } else if (decision === "restore") {
    user.status = ACCOUNT_STATUS.APPROVED;
    await user.save();
  } else if (decision === "update") {
    applyFields(user, formData);
    await user.save();
  } else if (decision === "remove") {
    await User.findByIdAndDelete(user._id);
  } else {
    return { error: "Unknown action." };
  }

  refresh();
  return { ok: true };
}

export async function archiveJoinRequestAction(formData) {
  await requireAdmin();
  await connectDb();
  const status = formString(formData, "status");
  await JoinRequest.findByIdAndUpdate(formString(formData, "id"), {
    status: ["new", "contacted", "archived"].includes(status) ? status : "archived",
  });
  revalidatePath("/admin/join-requests");
  revalidatePath("/admin");
}
