"use server";

import { revalidatePath, updateTag } from "next/cache";
import { PAGE_KEYS } from "@/config/constants";
import { connectDb } from "@/lib/db";
import { uniqueSlug } from "@/lib/slugify";
import { formBool, formNumber, formString, parseJsonList } from "@/lib/utils";
import { Constitution } from "@/models/Constitution";
import { Event } from "@/models/Event";
import { Page } from "@/models/Page";
import { SiteSettings } from "@/models/SiteSettings";
import { Tenure } from "@/models/Tenure";
import { Workshop } from "@/models/Workshop";
import { Writing } from "@/models/Writing";
import { requireAdmin } from "@/server/dal";

function refresh() {
  updateTag("cms");
  revalidatePath("/", "layout");
}

async function persist(Model, id, payload) {
  try {
    if (id) await Model.findByIdAndUpdate(id, payload, { runValidators: true });
    else await Model.create(payload);
  } catch (error) {
    if (error?.code === 11000) return { error: "That slug is already used. Choose another." };
    return { error: "Could not save. Check the fields and try again." };
  }
  refresh();
  return { ok: true };
}

export async function saveSettingsAction(formData) {
  await requireAdmin();
  await connectDb();
  const payload = {
    siteName: formString(formData, "siteName"),
    tagline: formString(formData, "tagline"),
    logo: formString(formData, "logo"),
    homeVideo: formString(formData, "homeVideo"),
    homeShowcase: formString(formData, "homeShowcase"),
    ctaCalligraphy: formString(formData, "ctaCalligraphy"),
    frameArt: formString(formData, "frameArt"),
    footerRose: formString(formData, "footerRose"),
    joinTitle: formString(formData, "joinTitle"),
    joinLede: formString(formData, "joinLede"),
    joinCta: formString(formData, "joinCta"),
    currentSemester: formString(formData, "currentSemester"),
    footerNote: formString(formData, "footerNote"),
    socials: {
      instagram: formString(formData, "instagram"),
      facebook: formString(formData, "facebook"),
      tiktok: formString(formData, "tiktok"),
    },
  };
  await SiteSettings.findOneAndUpdate({ key: "global" }, payload, { upsert: true });
  refresh();
  return { ok: true };
}

export async function savePageAction(formData) {
  await requireAdmin();
  const key = formString(formData, "key");
  if (!PAGE_KEYS.includes(key)) return { error: "Unknown page." };
  await connectDb();
  await Page.findOneAndUpdate(
    { key },
    {
      key,
      title: formString(formData, "title"),
      lede: formString(formData, "lede"),
      body: formString(formData, "body"),
      eyebrow: formString(formData, "eyebrow"),
      headline: formString(formData, "headline"),
      secondaryHeadline: formString(formData, "secondaryHeadline"),
      secondaryLede: formString(formData, "secondaryLede"),
      heroImage: formString(formData, "heroImage"),
      calligraphyImage: formString(formData, "calligraphyImage"),
      ctaLabel: formString(formData, "ctaLabel"),
      ctaHref: formString(formData, "ctaHref"),
      stats: parseJsonList(formString(formData, "statsJson")),
      cards: parseJsonList(formString(formData, "cardsJson")),
    },
    { upsert: true },
  );
  refresh();
  return { ok: true };
}

export async function saveEventAction(formData) {
  await requireAdmin();
  await connectDb();
  const id = formString(formData, "id");
  const title = formString(formData, "title");
  const slug = formString(formData, "slug") || (await uniqueSlug(Event, title, id || undefined));
  const payload = {
    title,
    slug,
    year: formString(formData, "year"),
    image: formString(formData, "image"),
    summary: formString(formData, "summary"),
    body: formString(formData, "body"),
    location: formString(formData, "location"),
    startsAt: formString(formData, "startsAt") || null,
    gallery: parseJsonList(formString(formData, "galleryJson")).filter((row) => row.image),
    published: formBool(formData, "published"),
    order: formNumber(formData, "order"),
  };
  return persist(Event, id, payload);
}

export async function deleteEventAction(formData) {
  await requireAdmin();
  await connectDb();
  await Event.findByIdAndDelete(formString(formData, "id"));
  refresh();
}

export async function saveWritingAction(formData) {
  await requireAdmin();
  await connectDb();
  const id = formString(formData, "id");
  const name = formString(formData, "name");
  const slug = formString(formData, "slug") || (await uniqueSlug(Writing, name, id || undefined));
  const payload = {
    name,
    slug,
    role: formString(formData, "role"),
    image: formString(formData, "image"),
    bio: formString(formData, "bio"),
    published: formBool(formData, "published"),
    order: formNumber(formData, "order"),
    pieces: parseJsonList(formString(formData, "piecesJson")),
  };
  return persist(Writing, id, payload);
}

export async function deleteWritingAction(formData) {
  await requireAdmin();
  await connectDb();
  await Writing.findByIdAndDelete(formString(formData, "id"));
  refresh();
}

export async function saveTenureAction(formData) {
  await requireAdmin();
  await connectDb();
  const id = formString(formData, "id");
  const payload = {
    title: formString(formData, "title"),
    president: formString(formData, "president"),
    yearLabel: formString(formData, "yearLabel"),
    summary: formString(formData, "summary"),
    portrait: formString(formData, "portrait"),
    published: formBool(formData, "published"),
    order: formNumber(formData, "order"),
    events: parseJsonList(formString(formData, "eventsJson")),
  };
  return persist(Tenure, id, payload);
}

export async function deleteTenureAction(formData) {
  await requireAdmin();
  await connectDb();
  await Tenure.findByIdAndDelete(formString(formData, "id"));
  refresh();
}

export async function saveConstitutionAction(formData) {
  await requireAdmin();
  await connectDb();
  const id = formString(formData, "id");
  const payload = {
    title: formString(formData, "title"),
    credit: formString(formData, "credit"),
    file: formString(formData, "file"),
    year: formString(formData, "year"),
    order: formNumber(formData, "order"),
  };
  return persist(Constitution, id, payload);
}

export async function deleteConstitutionAction(formData) {
  await requireAdmin();
  await connectDb();
  await Constitution.findByIdAndDelete(formString(formData, "id"));
  refresh();
}

export async function saveWorkshopAction(formData) {
  await requireAdmin();
  await connectDb();
  const id = formString(formData, "id");
  const title = formString(formData, "title");
  const slug = formString(formData, "slug") || (await uniqueSlug(Workshop, title, id || undefined));
  const payload = {
    title,
    slug,
    kind: formString(formData, "kind") || "upcoming",
    summary: formString(formData, "summary"),
    body: formString(formData, "body"),
    coverImage: formString(formData, "coverImage"),
    instructor: formString(formData, "instructor"),
    location: formString(formData, "location"),
    startsAt: formString(formData, "startsAt") || null,
    endsAt: formString(formData, "endsAt") || null,
    recordingUrl: formString(formData, "recordingUrl"),
    materialsUrl: formString(formData, "materialsUrl"),
    published: formBool(formData, "published"),
    order: formNumber(formData, "order"),
  };
  return persist(Workshop, id, payload);
}

export async function deleteWorkshopAction(formData) {
  await requireAdmin();
  await connectDb();
  await Workshop.findByIdAndDelete(formString(formData, "id"));
  refresh();
}
