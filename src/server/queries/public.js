import { connection } from "next/server";
import { connectDb, isDbConfigured } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import { ACCOUNT_STATUS, ROLES } from "@/config/constants";
import {
  defaultConstitutions,
  defaultEvents,
  defaultPages,
  defaultSettings,
  defaultTenures,
  defaultWorkshops,
  defaultWriters,
} from "@/config/defaults";
import { Constitution } from "@/models/Constitution";
import { Event } from "@/models/Event";
import { Page } from "@/models/Page";
import { SiteSettings } from "@/models/SiteSettings";
import { Tenure } from "@/models/Tenure";
import { User } from "@/models/User";
import { Workshop } from "@/models/Workshop";
import { Writing } from "@/models/Writing";

async function safe(fn, fallback) {
  if (!isDbConfigured()) return fallback;
  try {
    await connection();
    await connectDb();
    return await fn();
  } catch (error) {
    console.error("[cms]", error.message);
    return fallback;
  }
}

export async function getSettings() {
  return safe(async () => {
    const row = await SiteSettings.findOne({ key: "global" }).lean();
    return row ? toPlain(row) : defaultSettings;
  }, defaultSettings);
}

export async function getPage(key) {
  const fallback = defaultPages[key] || { key, title: "", lede: "" };
  return safe(async () => {
    const row = await Page.findOne({ key }).lean();
    return row ? { ...fallback, ...toPlain(row) } : fallback;
  }, fallback);
}

export async function getEvents() {
  return safe(async () => {
    const rows = await Event.find({ published: true }).sort({ order: 1, year: -1 }).lean();
    return rows.length ? rows.map(toPlain) : defaultEvents;
  }, defaultEvents);
}

export async function getEvent(slug) {
  const list = await getEvents();
  return list.find((item) => item.slug === slug) || null;
}

export async function getWritings() {
  return safe(async () => {
    const rows = await Writing.find({ published: true }).sort({ order: 1, name: 1 }).lean();
    return rows.length ? rows.map(toPlain) : defaultWriters;
  }, defaultWriters);
}

export async function getWriting(slug) {
  const list = await getWritings();
  return list.find((item) => item.slug === slug) || null;
}

export async function getTenures() {
  return safe(async () => {
    const rows = await Tenure.find({ published: true }).sort({ order: 1 }).lean();
    return rows.length ? rows.map(toPlain) : defaultTenures;
  }, defaultTenures);
}

export async function getConstitutions() {
  return safe(async () => {
    const rows = await Constitution.find().sort({ order: 1, year: 1 }).lean();
    return rows.length ? rows.map(toPlain) : defaultConstitutions;
  }, defaultConstitutions);
}

export async function getWorkshops() {
  return safe(async () => {
    const rows = await Workshop.find({ published: true }).sort({ kind: 1, startsAt: -1, order: 1 }).lean();
    return rows.length ? rows.map(toPlain) : defaultWorkshops;
  }, defaultWorkshops);
}

export async function getPublicMembers() {
  return safe(async () => {
    const rows = await User.find({
      status: ACCOUNT_STATUS.APPROVED,
      slug: { $exists: true, $ne: "" },
      role: { $ne: ROLES.ADMIN },
    })
      .select("-passwordHash")
      .sort({ team: 1, office: 1, name: 1 })
      .lean();
    return rows.map(toPlain);
  }, []);
}

export async function getLeadership() {
  return safe(async () => {
    const rows = await User.find({
      status: ACCOUNT_STATUS.APPROVED,
      showOnLeadership: true,
      role: { $ne: ROLES.ADMIN },
    })
      .select("-passwordHash")
      .sort({ team: 1, office: 1, name: 1 })
      .lean();
    return rows.map(toPlain);
  }, []);
}

export async function getMemberBySlug(slug) {
  return safe(async () => {
    const row = await User.findOne({
      slug,
      status: ACCOUNT_STATUS.APPROVED,
    })
      .select("-passwordHash")
      .lean();
    return toPlain(row);
  }, null);
}
