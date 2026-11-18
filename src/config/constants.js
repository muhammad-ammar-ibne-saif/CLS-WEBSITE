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

export const EC_RANKS = {
  DIRECTOR: "director",
  LEAD: "lead",
  COLEAD: "colead",
};

export const EC_RANK_ORDER = [EC_RANKS.DIRECTOR, EC_RANKS.LEAD, EC_RANKS.COLEAD];

export const EC_RANK_LABELS = {
  [EC_RANKS.DIRECTOR]: "Director",
  [EC_RANKS.LEAD]: "Lead",
  [EC_RANKS.COLEAD]: "Co-Lead",
};

export const EC_RANK_HEADINGS = {
  [EC_RANKS.DIRECTOR]: "Directorates",
  [EC_RANKS.LEAD]: "Leads",
  [EC_RANKS.COLEAD]: "Co-Leads",
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
  "magazine",
];

// Public pages the admin can switch to a "Coming soon" placeholder from /admin/site.
export const GATED_PAGES = [
  { key: "home", label: "Home", href: "/" },
  { key: "about", label: "About", href: "/about" },
  { key: "constitution", label: "Constitution", href: "/constitution" },
  { key: "leadership", label: "Leadership", href: "/leadership" },
  { key: "members", label: "Members", href: "/members" },
  { key: "events", label: "Events", href: "/events" },
  { key: "history", label: "History", href: "/history" },
  { key: "learn", label: "Workshops", href: "/learn" },
  { key: "writings", label: "Writings", href: "/writings" },
  { key: "magazine", label: "Magazine", href: "/magazine" },
  { key: "register", label: "Register", href: "/register" },
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
  { href: "/magazine", label: "Magazine" },
  { href: "/members", label: "Members" },
];
