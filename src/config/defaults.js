import { events, writers, leadership, tenures, constitutions } from "@/data/site";

export const defaultSettings = {
  key: "global",
  siteName: "COMSATS Literary Society",
  tagline: "Promoting literature and poetry in COMSATS Lahore since 2016.",
  logo: "/assets/logo.png",
  joinTitle: "CLS Is Waiting For “Your” Words. So Are We. Join Us Today.",
  joinLede:
    "Join a circle of readers, writers, and dreamers who believe literature is meant to be shared, lived, and remembered.",
  joinCta: "Register Yourself Now",
  currentSemester: "Fall 2026",
  socials: {
    instagram: "https://www.instagram.com",
    facebook: "https://www.facebook.com",
    tiktok: "https://www.tiktok.com",
  },
};

export const defaultPages = {
  home: {
    key: "home",
    title: "Promoting Literature & Poetry in COMSATS Lahore Since 2016.",
    lede: "Comsats Literary Society is a community of 200+ literates who have one vision in common and that is to promote & spread love & literature in campus",
    headline: "We’ve organized 100+ On-Campus Events. See Our Literary Legacy",
    secondaryHeadline: "Our Writers Who Keep Our Legacy Alive",
    secondaryLede:
      "CLS has conducted 20+ poetry & prose workshops and has hosted and trained more than 20 writers from its platform.",
    heroImage: "/assets/video-frame.png",
    calligraphyImage: "/assets/calligraphy-events.png",
  },
  about: {
    key: "about",
    title: "COMSATS Literary Society Is One of The Leading Societies In Campus",
    lede: "Spreading across 8+ departments with a history of 50+ successful events, CLS is one of the most recognized and celebrated societies of COMSATS.",
    eyebrow: "OUR STORY",
    headline: "Motivation Behind Building CLS",
    body: "Every meaningful journey begins with a question. Ours was simple: What if every student who carried stories, poems, ideas, or unspoken thoughts had a place where they truly belonged? From that question, COMSATS Literary Society (CLS) was born — not merely as a student society, but as a home for expression, curiosity, and meaningful conversation.",
    heroImage: "/assets/about-banner.png",
    calligraphyImage: "/assets/calligraphy-story.png",
    stats: [
      { value: "2016", label: "Est. since" },
      { value: "110", label: "Events done" },
      { value: "200+", label: "Members" },
      { value: "4", label: "Awards" },
    ],
    cards: [
      { title: "Literature", body: "The reason we exist. We celebrate the power of words to preserve ideas, awaken emotions, and connect people across generations.", image: "/assets/flower-literature.png" },
      { title: "Inspiration", body: "The legacy that guides us. We draw strength from the timeless works of poets, authors, and thinkers who remind us that words can shape the world.", image: "/assets/flower-inspiration.png" },
      { title: "Vision", body: "The force that moves us forward. We strive to build a community where every voice finds the confidence to read, write, and inspire.", image: "/assets/flower-vision.png" },
    ],
  },
  leadership: {
    key: "leadership",
    title: "Led By Teams Who Are Always Ready to Step Forward For Literature",
    lede: "COMSATS Literary Society’s leadership always takes initiative and vision seriously. as its the only way forward in an environment where literature needs our effort to thrive.",
    headline: "Core Team (Tenure 2026 - 2027)",
    calligraphyImage: "/assets/calligraphy-leadership.png",
  },
  history: {
    key: "history",
    title: "Legacy Shaped By Some Brilliant Minds Since 2016",
    lede: "CLS saw 11 presidents serve the society, each for one year where everyone contributed with the best of their efforts to the overall growth of society, to the point where it is today.",
    headline: "A Story of Legacy & Love For Literature",
    calligraphyImage: "/assets/calligraphy-history.png",
  },
  events: {
    key: "events",
    title: "We’ve organized 100+ On-Campus Events. See Our Literary Legacy",
    lede: "From Shaam e Sukhan to Sham e Ghazal, CLS hosts the gatherings that keep literature public on campus.",
    heroImage: "/assets/video-frame.png",
  },
  writings: {
    key: "writings",
    title: "Our Writers Who Keep Our Legacy Alive",
    lede: "CLS has conducted 20+ poetry & prose workshops and has hosted and trained more than 20 writers from its platform.",
  },
  constitution: {
    key: "constitution",
    title: "CLS Believes a Constitution Is More Than Rules. It's a Promise.",
    lede: "No matter you are the president, director, or member, everyone is accountable to the Constitution. We pursue our mission without concentrating power in the hands of a few.",
    headline: "History of Constitutional Development",
    secondaryLede: "CLS has undergone 2 constitutional developments. The first constitution was made in 2016 while new amendments were made in 2026",
    calligraphyImage: "/assets/calligraphy-constitution.png",
  },
  learn: {
    key: "learn",
    title: "Workshops, Craft, and the Rooms Where CLS Teaches",
    lede: "Upcoming sessions you can join, and recordings of the nights already held — ghazal, prose, critique, and the patience a draft deserves.",
  },
  register: {
    key: "register",
    title: "CLS Is Waiting For “Your” Words. So Are We. Join Us Today.",
    lede: "Join a circle of readers, writers, and dreamers who believe literature is meant to be shared, lived, and remembered.",
  },
  members: {
    key: "members",
    title: "The People Who Keep the Room Alive",
    lede: "Approved Core and EC members. Open a portrait to read their work, memories, and the semester they served.",
  },
};

export const defaultLeadership = leadership;
export const defaultEvents = events;
export const defaultWriters = writers;
export const defaultTenures = tenures.map((tenure, index) => ({
  ...tenure,
  events: (tenure.events || []).map((name) =>
    typeof name === "string" ? { name, note: "" } : name,
  ),
  order: index,
}));
export const defaultConstitutions = constitutions;
export const defaultWorkshops = [
  {
    slug: "ghazal-craft-autumn",
    title: "Ghazal Craft: Radif, Qafia, and Patience",
    kind: "upcoming",
    summary: "An afternoon workshop on the ghazal as a living form, not nostalgia.",
    instructor: "Urdu Literature Directorate",
    location: "CLS Hall",
    published: true,
    order: 0,
  },
  {
    slug: "prose-open-table-2025",
    title: "Prose Open Table 2025",
    kind: "recording",
    summary: "A recorded evening of close reading, line edits, and the first public draft.",
    instructor: "English Literature Directorate",
    recordingUrl: "",
    published: true,
    order: 1,
  },
];
