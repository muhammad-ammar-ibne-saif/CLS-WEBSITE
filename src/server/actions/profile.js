"use server";

import { revalidatePath, updateTag } from "next/cache";
import { ACCOUNT_STATUS, EC_RANKS, TEAMS } from "@/config/constants";
import { connectDb } from "@/lib/db";
import { formString } from "@/lib/utils";
import { User } from "@/models/User";
import { requireApplicant, requireStaff } from "@/server/dal";

const RANKS = Object.values(EC_RANKS);

function refreshPeople(slug) {
  updateTag("cms");
  revalidatePath("/leadership");
  revalidatePath("/members");
  if (slug) revalidatePath(`/members/${slug}`);
}

export async function updateProfileAction(formData) {
  const session = await requireApplicant();
  await connectDb();
  const user = await User.findById(session._id);
  if (!user) return { error: "Profile not found." };

  const headline = formString(formData, "headline");
  if (headline.length > 240) return { error: "Keep the headline under 240 characters." };
  const bio = formString(formData, "bio");
  if (bio.length > 4000) return { error: "Keep the bio under 4000 characters." };

  user.headline = headline;
  user.bio = bio;
  user.avatar = formString(formData, "avatar") || user.avatar;
  user.socials = {
    instagram: formString(formData, "instagram"),
    facebook: formString(formData, "facebook"),
    website: formString(formData, "website"),
  };

  if (user.status === ACCOUNT_STATUS.PENDING) {
    const department = formString(formData, "department");
    const office = formString(formData, "office");
    const rank = formString(formData, "ecRank");
    if (department) user.department = department;
    if (office) user.office = office;
    if (user.team === TEAMS.EC) {
      if (!RANKS.includes(rank)) return { error: "Choose your Executive Council position." };
      user.ecRank = rank;
    }
  }

  await user.save();
  refreshPeople(user.slug);
  revalidatePath("/me");
  revalidatePath("/staff/setup");
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
        caption: formString(formData, "caption").slice(0, 400),
        event: formString(formData, "event").slice(0, 160),
        takenAt: formString(formData, "takenAt") || null,
      },
    },
  });
  refreshPeople(session.slug);
  revalidatePath("/me");
  return { ok: true };
}

export async function removeMemoryAction(formData) {
  const session = await requireStaff();
  await connectDb();
  await User.findByIdAndUpdate(session._id, {
    $pull: { memories: { _id: formString(formData, "id") } },
  });
  refreshPeople(session.slug);
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
        title: title.slice(0, 160),
        kind: formString(formData, "kind") || "writing",
        body: formString(formData, "body").slice(0, 20000),
        mediaUrl: formString(formData, "mediaUrl"),
      },
    },
  });
  refreshPeople(session.slug);
  revalidatePath("/me");
  return { ok: true };
}

export async function removePortfolioAction(formData) {
  const session = await requireStaff();
  await connectDb();
  await User.findByIdAndUpdate(session._id, {
    $pull: { portfolio: { _id: formString(formData, "id") } },
  });
  refreshPeople(session.slug);
  revalidatePath("/me");
}
