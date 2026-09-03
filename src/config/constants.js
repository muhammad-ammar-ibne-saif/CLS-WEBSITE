export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
};

export const TEAMS = {
  CORE: "core",
  EC: "ec",
};

export const ACCOUNT_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
};

export const PLAN_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};

export const ITEM_KINDS = ["event", "meeting", "workshop", "deadline"];

export const RESPONSE_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  DECLINED: "declined",
  MAYBE: "maybe",
};

export const DEPARTMENTS = [
  "Urdu Literature",
  "English Literature",
  "Events",
  "Media",
  "Design",
  "Publications",
  "Finance",
  "Social Media",
  "Logistics",
  "General",
];

export const PAGE_KEYS = [
  "home",
  "about",
  "leadership",
  "history",
  "events",
  "writings",
  "constitution",
  "learn",
  "register",
  "members",
];

export const SESSION_COOKIE = "cls_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export const PUBLIC_NAV = [
  { href: "/about", label: "About" },
  { href: "/leadership", label: "Leadership" },
  { href: "/events", label: "Events" },
  { href: "/history", label: "History" },
  { href: "/learn", label: "Workshops" },
  { href: "/writings", label: "Writings" },
  { href: "/members", label: "Members" },
];
