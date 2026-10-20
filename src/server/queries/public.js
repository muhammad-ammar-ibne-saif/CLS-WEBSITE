import { unstable_cache } from "next/cache";
import { connectDb, isDbConfigured } from "@/lib/db";
import { ecRankOf, toPlain } from "@/lib/utils";
import { ACCOUNT_STATUS, EC_RANK_ORDER, ROLES } from "@/config/constants";
import {
  defaultConstitutions,
  defaultEvents,
  defaultLeadership,
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

const REVALIDATE_SECONDS = 300;
const PERSON_FIELDS = "name slug avatar office team ecRank department headline semester sortOrder isDirector";

function store(name, tags, load) {
  return unstable_cache(
    async (...args) => {
      await connectDb();
      return load(...args);
    },
    ["cls", name],
    { tags: ["cms", ...tags], revalidate: REVALIDATE_SECONDS },
  );
}

async function guarded(run, fallback) {
  if (!isDbConfigured()) return fallback;
  try {
    return await run();
  } catch (error) {
    console.error("[cms]", error.message);
    return fallback;
  }
}

function mergeDefined(base, row) {
  const merged = { ...base };
  for (const [key, value] of Object.entries(row || {})) {
    if (value === "" || value === null || value === undefined) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    merged[key] = value;
  }
  return merged;
}

const loadSettings = store("settings", ["settings"], async () =>
  toPlain(await SiteSettings.findOne({ key: "global" }).lean()),
);

const loadPage = store("page", ["page"], async (key) => toPlain(await Page.findOne({ key }).lean()));

const loadEvents = store("events", ["events"], async () =>
  (await Event.find({ published: true }).sort({ order: 1, year: -1 }).lean()).map(toPlain),
);

const loadWritings = store("writings", ["writings"], async () =>
  (await Writing.find({ published: true }).sort({ order: 1, name: 1 }).lean()).map(toPlain),
);

const loadTenures = store("tenures", ["tenures"], async () =>
  (await Tenure.find({ published: true }).sort({ order: 1 }).lean()).map(toPlain),
);

const loadConstitutions = store("constitutions", ["constitutions"], async () =>
  (await Constitution.find().sort({ order: 1, year: 1 }).lean()).map(toPlain),
);

const loadWorkshops = store("workshops", ["workshops"], async () =>
  (await Workshop.find({ published: true }).sort({ kind: 1, startsAt: -1, order: 1 }).lean()).map(toPlain),
);

const loadLeadership = store("leadership", ["people"], async () =>
  (
    await User.find({
      status: ACCOUNT_STATUS.APPROVED,
      showOnLeadership: true,
      role: { $ne: ROLES.ADMIN },
    })
      .select(PERSON_FIELDS)
      .sort({ sortOrder: 1, office: 1, name: 1 })
      .lean()
  ).map(toPlain),
);

const loadMembers = store("members", ["people"], async () =>
  (
    await User.find({
      status: ACCOUNT_STATUS.APPROVED,
      slug: { $exists: true, $ne: "" },
      role: { $ne: ROLES.ADMIN },
    })
      .select(PERSON_FIELDS)
      .sort({ team: 1, sortOrder: 1, office: 1, name: 1 })
      .lean()
  ).map(toPlain),
);

const loadMember = store("member", ["people"], async (slug) =>
  toPlain(
    await User.findOne({ slug, status: ACCOUNT_STATUS.APPROVED }).select("-passwordHash").lean(),
  ),
);

export async function getSettings() {
  return guarded(async () => {
    const row = await loadSettings();
    return row ? mergeDefined(defaultSettings, row) : defaultSettings;
  }, defaultSettings);
}

export async function getPage(key) {
  const fallback = defaultPages[key] || { key, title: "", lede: "" };
  return guarded(async () => {
    const row = await loadPage(key);
    return row ? mergeDefined(fallback, row) : fallback;
  }, fallback);
}

export async function getEvents() {
  return guarded(async () => {
    const rows = await loadEvents();
    return rows.length ? rows : defaultEvents;
  }, defaultEvents);
}

export async function getEvent(slug) {
  const list = await getEvents();
  return list.find((item) => item.slug === slug) || null;
}

export async function getWritings() {
  return guarded(async () => {
    const rows = await loadWritings();
    return rows.length ? rows : defaultWriters;
  }, defaultWriters);
}

export async function getWriting(slug) {
  const list = await getWritings();
  return list.find((item) => item.slug === slug) || null;
}

export async function getTenures() {
  return guarded(async () => {
    const rows = await loadTenures();
    return rows.length ? rows : defaultTenures;
  }, defaultTenures);
}

export async function getConstitutions() {
  return guarded(async () => {
    const rows = await loadConstitutions();
    return rows.length ? rows : defaultConstitutions;
  }, defaultConstitutions);
}

export async function getWorkshops() {
  return guarded(async () => {
    const rows = await loadWorkshops();
    return rows.length ? rows : defaultWorkshops;
  }, defaultWorkshops);
}

export async function getPublicMembers() {
  return guarded(() => loadMembers(), []);
}

export async function getLeadership() {
  return guarded(() => loadLeadership(), []);
}

export async function getLeadershipGroups() {
  const people = await getLeadership();
  const empty = Object.fromEntries(EC_RANK_ORDER.map((rank) => [rank, []]));
  if (!people.length) {
    return { core: defaultLeadership.map((person) => ({ ...person, href: null })), ec: empty, hasEc: false };
  }
  const core = [];
  const ec = { ...empty };
  for (const person of people) {
    const card = {
      name: person.name,
      role: person.office || (person.team === "ec" ? "Executive Council" : "Core Team"),
      department: person.department,
      image: person.avatar || "",
      href: person.slug ? `/members/${person.slug}` : null,
    };
    if (person.team === "ec") ec[ecRankOf(person)].push(card);
    else core.push(card);
  }
  const hasEc = EC_RANK_ORDER.some((rank) => ec[rank].length > 0);
  return { core, ec, hasEc };
}

export async function getMemberBySlug(slug) {
  return guarded(() => loadMember(slug), null);
}
