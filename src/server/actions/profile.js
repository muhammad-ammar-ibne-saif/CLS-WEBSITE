"use server";

import { revalidatePath } from "next/cache";
import { connectDb } from "@/lib/db";
import { formString } from "@/lib/utils";
import { User } from "@/models/User";
import { requireStaff } from "@/server/dal";

export async function updateProfileAction(formData) {
  const session = await requireStaff();
  await connectDb();
  const user = await User.findById(session._id);
  if (!user) return { error: "Profile not found." };

  user.headline = formString(formData, "headline");
  user.bio = formString(formData, "bio");
  user.avatar = formString(formData, "avatar") || user.avatar;
  user.department = formString(formData, "department") || user.department;
  user.office = formString(formData, "office") || user.office;
  user.socials = {
    instagram: formString(formData, "instagram"),
    facebook: formString(formData, "facebook"),
    website: formString(formData, "website"),
  };
  await user.save();
  revalidatePath("/me");
  revalidatePath(`/members/${user.slug}`);
  revalidatePath("/leadership");
  return { ok: true };
}

export async function addMemoryAction(formData) {
  const session = await requireStaff();
  await connectDb();
  const image = formString(formData, "image");
  if (!image) return { error: "Upload a photograph first." };
  await User.findByIdAndUpdate(session._id, {
    $push: {
      memories: {
        image,
        caption: formString(formData, "caption"),
        event: formString(formData, "event"),
        takenAt: formString(formData, "takenAt") || null,
      },
    },
  });
  revalidatePath("/me");
  return { ok: true };
}

export async function removeMemoryAction(formData) {
  const session = await requireStaff();
  await connectDb();
  await User.findByIdAndUpdate(session._id, {
    $pull: { memories: { _id: formString(formData, "id") } },
  });
  revalidatePath("/me");
}

export async function addPortfolioAction(formData) {
  const session = await requireStaff();
  const title = formString(formData, "title");
  if (!title) return { error: "Give this piece a title." };
  await connectDb();
  await User.findByIdAndUpdate(session._id, {
    $push: {
      portfolio: {
        title,
        kind: formString(formData, "kind") || "writing",
        body: formString(formData, "body"),
        mediaUrl: formString(formData, "mediaUrl"),
      },
    },
  });
  revalidatePath("/me");
  revalidatePath(`/members/${session.slug}`);
  return { ok: true };
}

export async function removePortfolioAction(formData) {
  const session = await requireStaff();
  await connectDb();
  await User.findByIdAndUpdate(session._id, {
    $pull: { portfolio: { _id: formString(formData, "id") } },
  });
  revalidatePath("/me");
}
