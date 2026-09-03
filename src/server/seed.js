import { ACCOUNT_STATUS, PAGE_KEYS, ROLES } from "@/config/constants";
import {
  defaultConstitutions,
  defaultEvents,
  defaultPages,
  defaultSettings,
  defaultTenures,
  defaultWorkshops,
  defaultWriters,
} from "@/config/defaults";
import { connectDb } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import { currentSemester } from "@/lib/utils";
import { Constitution } from "@/models/Constitution";
import { Event } from "@/models/Event";
import { Page } from "@/models/Page";
import { SiteSettings } from "@/models/SiteSettings";
import { Tenure } from "@/models/Tenure";
import { User } from "@/models/User";
import { Workshop } from "@/models/Workshop";
import { Writing } from "@/models/Writing";

export async function seedDatabase() {
  await connectDb();

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@cls.local").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "change-me-now";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: "CLS Administrator",
      email: adminEmail,
      passwordHash: await User.hashPassword(adminPassword),
      role: ROLES.ADMIN,
      team: "ec",
      office: "Administrator",
      status: ACCOUNT_STATUS.APPROVED,
      slug: "cls-admin",
      semester: currentSemester(),
      showOnLeadership: false,
      approvedAt: new Date(),
    });
  }

  await SiteSettings.findOneAndUpdate({ key: "global" }, defaultSettings, { upsert: true });

  for (const key of PAGE_KEYS) {
    await Page.findOneAndUpdate({ key }, defaultPages[key], { upsert: true, setDefaultsOnInsert: true });
  }

  if ((await Event.countDocuments()) === 0) {
    await Event.insertMany(defaultEvents.map((item, order) => ({ ...item, order, published: true })));
  }
  if ((await Writing.countDocuments()) === 0) {
    await Writing.insertMany(defaultWriters.map((item, order) => ({ ...item, order, published: true })));
  }
  if ((await Tenure.countDocuments()) === 0) {
    await Tenure.insertMany(defaultTenures);
  }
  if ((await Constitution.countDocuments()) === 0) {
    await Constitution.insertMany(defaultConstitutions.map((item, order) => ({ ...item, order })));
  }
  if ((await Workshop.countDocuments()) === 0) {
    await Workshop.insertMany(
      defaultWorkshops.map((item) => ({ ...item, slug: item.slug || slugify(item.title) })),
    );
  }

  return { adminEmail, createdAdmin: Boolean(admin) };
}
