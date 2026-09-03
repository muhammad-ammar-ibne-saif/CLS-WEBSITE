"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { ACCOUNT_STATUS, PLAN_STATUS, RESPONSE_STATUS } from "@/config/constants";
import { connectDb } from "@/lib/db";
import { assignmentEmail, sendMail } from "@/lib/mailer";
import { formString } from "@/lib/utils";
import { Assignment } from "@/models/Assignment";
import { SemesterPlan } from "@/models/SemesterPlan";
import { User } from "@/models/User";
import { requireEc, requireSession } from "@/server/dal";

function refreshPlans() {
  revalidatePath("/ec");
  revalidatePath("/admin/plans");
}

async function directorsForItem(item) {
  const ids = (item.directorIds || []).map((id) => id.toString());
  const query = {
    status: ACCOUNT_STATUS.APPROVED,
    $or: [
      ...(ids.length ? [{ _id: { $in: ids } }] : []),
      ...(item.departments?.length
        ? [{ department: { $in: item.departments }, isDirector: true }]
        : []),
    ],
  };
  if (!query.$or.length) return [];
  return User.find(query).select("-passwordHash");
}

export async function savePlanAction(formData) {
  const session = await requireEc();
  await connectDb();
  const id = formString(formData, "id");
  const items = JSON.parse(formString(formData, "itemsJson") || "[]");
  const payload = {
    title: formString(formData, "title"),
    semester: formString(formData, "semester"),
    overview: formString(formData, "overview"),
    items,
    createdBy: session._id,
  };
  if (!payload.title || !payload.semester) return { error: "Title and semester are required." };
  let plan;
  if (id) {
    plan = await SemesterPlan.findByIdAndUpdate(id, payload, { new: true });
  } else {
    plan = await SemesterPlan.create(payload);
  }
  refreshPlans();
  return { ok: true, id: plan._id.toString() };
}

export async function publishPlanAction(formData) {
  await requireEc();
  await connectDb();
  const id = formString(formData, "id");
  const plan = await SemesterPlan.findById(id);
  if (!plan) return { error: "Plan not found." };
  plan.status = PLAN_STATUS.PUBLISHED;
  plan.publishedAt = new Date();
  await plan.save();

  for (const item of plan.items) {
    const directors = await directorsForItem(item);
    for (const director of directors) {
      const token = crypto.randomBytes(24).toString("hex");
      try {
        await Assignment.create({
          plan: plan._id,
          itemId: item._id,
          user: director._id,
          email: director.email,
          token,
        });
        const mail = assignmentEmail({
          name: director.name,
          planTitle: plan.title,
          item,
          token,
        });
        await sendMail({ to: director.email, ...mail });
      } catch (error) {
        if (error.code !== 11000) throw error;
      }
    }
  }
  refreshPlans();
  return { ok: true };
}

export async function deletePlanAction(formData) {
  const session = await requireEc();
  await connectDb();
  const id = formString(formData, "id");
  if (session.role !== "admin") {
    const plan = await SemesterPlan.findById(id);
    if (plan?.status === PLAN_STATUS.PUBLISHED) return { error: "Published plans can only be removed by admin." };
  }
  await Assignment.deleteMany({ plan: id });
  await SemesterPlan.findByIdAndDelete(id);
  refreshPlans();
}

export async function respondAssignmentAction(formData) {
  const token = formString(formData, "token");
  const status = formString(formData, "status");
  const note = formString(formData, "note");
  if (!Object.values(RESPONSE_STATUS).includes(status) || status === RESPONSE_STATUS.PENDING) {
    return { error: "Choose a response." };
  }
  await connectDb();
  const assignment = await Assignment.findOne({ token });
  if (!assignment) return { error: "This invitation is no longer valid." };
  assignment.status = status;
  assignment.note = note;
  assignment.respondedAt = new Date();
  await assignment.save();
  refreshPlans();
  return { ok: true };
}

export async function respondAsDirectorAction(formData) {
  const session = await requireSession();
  await connectDb();
  const assignment = await Assignment.findOne({
    _id: formString(formData, "id"),
    user: session._id,
  });
  if (!assignment) return { error: "Assignment not found." };
  assignment.status = formString(formData, "status");
  assignment.note = formString(formData, "note");
  assignment.respondedAt = new Date();
  await assignment.save();
  refreshPlans();
  return { ok: true };
}
