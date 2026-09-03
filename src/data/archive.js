import { tenures } from "./site";

const rooms = [
  {
    title: "Society Established: Tenure 2016 - 2017",
    yearLabel: "2016",
    plaque: "The Founding Year",
    mood: "A first room still warm from the people who decided CLS should exist.",
    palette: { wall: 0xf3e6c8, accent: 0x6a673b, light: 0xffe2b0, fog: 0x2a2418 },
    events: [
      { name: "Founding Assembly", note: "A small circle of students named the society and chose literature as a public practice, not a private hobby." },
      { name: "Sham e Ghazal 2016", note: "The first ghazal night: couplets, quiet rooms, and the shape of every Sham e Ghazal that followed." },
      { name: "Open Mic at the Lawn", note: "Unfinished poems, borrowed courage, and the first audience that stayed until the last reader." },
      { name: "Orientation for Readers", note: "New members learned that CLS was a room you enter with a page, not a résumé." },
      { name: "Calligraphy Corner", note: "Ink, reed pens, and the visual language that still sits on CLS posters." },
      { name: "Winter Reading Circle", note: "Short stories passed from hand to hand while the campus emptied for break." },
      { name: "Closing Mushaira", note: "The year ended the way CLS still likes to end things: with verse spoken aloud." },
    ],
  },
  {
    title: "Tenure 2017 - 2018",
    yearLabel: "2017",
    plaque: "The Second Voice",
    mood: "The society learns it can return — that a second year is how a gathering becomes a tradition.",
    palette: { wall: 0xe8dcc0, accent: 0x5c4a2e, light: 0xffd9a0, fog: 0x241c14 },
    events: [
      { name: "Sham e Ghazal 2017", note: "A fuller room, a longer recitation list, and the first time seniors handed the mic to first-years." },
      { name: "Prose Workshop", note: "Essays and short fiction treated as craft, with red ink and kindness in equal measure." },
      { name: "Urdu Nazm Evening", note: "Nazm after nazm until the hall forgot it was a campus auditorium." },
      { name: "Book Swap", note: "Paperbacks left on a blanket; strangers left with someone else's underlines." },
      { name: "Debate × Literature", note: "Argument as a literary form — close reading used as a way to disagree well." },
      { name: "Members' Anthology", note: "The first stapled collection of CLS writing, photocopied and fiercely kept." },
    ],
  },
  {
    title: "Tenure 2018 - 2019",
    yearLabel: "2018",
    plaque: "A Wider Circle",
    mood: "More departments, more languages, more people who did not think they belonged in a literary room — until they did.",
    palette: { wall: 0xdfe6d4, accent: 0x4a5538, light: 0xe4f0c8, fog: 0x1c2218 },
    events: [
      { name: "Bazm e Adab", note: "Critique without cruelty: prose read aloud, then discussed until it got truer." },
      { name: "Sham e Ghazal 2018", note: "Classical forms hosted with new voices; the ghazal as a living demand, not nostalgia." },
      { name: "Inter-Department Recital", note: "Engineers, designers, and scientists proving a couplet does not require a major." },
      { name: "Translation Desk", note: "Urdu into English, English into Urdu — meaning carried carefully across the aisle." },
      { name: "Poster Poetry", note: "Verses wheat-pasted on campus walls so literature would not stay inside one hall." },
      { name: "Guest Poet Night", note: "A visitor at the lectern, and a society learning how to host well." },
    ],
  },
  {
    title: "Tenure 2019 - 2020",
    yearLabel: "2019",
    plaque: "Before the Quiet",
    mood: "The last fully in-person year before the campus emptied. The rooms here still sound crowded.",
    palette: { wall: 0xf0dcc8, accent: 0x7a4a28, light: 0xffc090, fog: 0x2a1810 },
    events: [
      { name: "Shaam e Sukhan", note: "An evening built for many voices at once — recitation, music, and the long applause after." },
      { name: "Sham e Ghazal 2019", note: "The hall dressed for ghazal; students dressed for the occasion of taking language seriously." },
      { name: "Drama Reading", note: "Plays spoken from chairs, stage enough for anyone willing to stand." },
      { name: "Literary Olympiad", note: "Quizzes, extempore, and the friendly heat of knowing a text by heart." },
      { name: "Photography of Words", note: "Members photographed campus sentences: graffiti, notices, and the poetry already on walls." },
      { name: "Farewell for a Tenure", note: "A last circle before the year turned — nobody knew how quiet the next rooms would be." },
    ],
  },
  {
    title: "COVID Timeline: Tenure 2020 - 2022",
    yearLabel: "2020",
    plaque: "The Distance Years",
    mood: "Screens instead of halls. The society learned to keep a conversation alive when nobody could sit in the same row.",
    palette: { wall: 0xc8cdd4, accent: 0x3a4450, light: 0xb8c8e0, fog: 0x12151c },
    events: [
      { name: "Virtual Open Mic", note: "Muted mics, lagging couplets, and the relief of hearing a familiar voice from another house." },
      { name: "Zoom Mushaira", note: "Ghazals through webcams — imperfect rooms, perfect stubbornness." },
      { name: "Write-from-Home", note: "Prompts sent at dusk; pages returned by morning from isolation and boredom and care." },
      { name: "Letters to Campus", note: "Members wrote to a university they could not enter, so the place would not forget them." },
      { name: "Screen Poetry Club", note: "Shared docs, shared silence, the chat window filling with half-lines." },
      { name: "Return Rehearsal", note: "When doors opened again, CLS practiced being a room — chairs, distance, and the first in-person breath." },
    ],
  },
  {
    title: "Tenure 2022 - 2023",
    yearLabel: "2022",
    plaque: "Back in the Room",
    mood: "Bodies in seats again. The archive gets louder here — paper, tea, and the nervous joy of gathering.",
    palette: { wall: 0xe6d8bc, accent: 0x6a5530, light: 0xffe0a8, fog: 0x221a10 },
    events: [
      { name: "Bazm e Adab 2022", note: "Prose, critique, and conversation — literature lived on campus again, not only in a tab." },
      { name: "Welcome Back Recital", note: "First-years who had only known CLS online finally heard the room answer a poem." },
      { name: "Sham e Ghazal Returns", note: "Melody and meter in the same hall, as if the years of screens had been a long interval." },
      { name: "Street Theatre Sketch", note: "A short piece in a courtyard; passers-by becoming an audience without meaning to." },
      { name: "Journal Revival", note: "A campus journal restapled into being — submissions, edits, and a cover that felt like a flag." },
      { name: "Night of New Members", note: "Badges, introductions, and the annual promise that this circle would hold." },
    ],
  },
  {
    title: "Tenure 2023 - 2024",
    yearLabel: "2023",
    plaque: "Form and Melody",
    mood: "Ghazal at the center, but the edges keep growing — critique, performance, and a campus that knows CLS by sound.",
    palette: { wall: 0xe8d0d4, accent: 0x6a3040, light: 0xffc8d4, fog: 0x221016 },
    events: [
      { name: "Sham e Ghazal 2023", note: "Classical forms hosted with patience: listeners who knew when to be quiet." },
      { name: "Shaam e Sukhan Rehearsals", note: "Evenings of cues, cables, and couplets until the show could carry a crowd." },
      { name: "Women's Writing Circle", note: "A room held for voices the syllabus often leaves in the margin." },
      { name: "Critical Essay Night", note: "Close reading as performance — one text, many disagreements, no winner required." },
      { name: "Music × Verse", note: "Ghazal finding a tanpura, nazm finding a pause, the hall finding its pitch." },
      { name: "Archive Evening", note: "Old posters on a table; new members touching the paper of years they had only heard about." },
    ],
  },
  {
    title: "Tenure 2024 - 2025",
    yearLabel: "2024",
    plaque: "A Public Voice",
    mood: "The society speaks to a larger campus — more seats, more noise, more people who came for a friend and stayed for a line.",
    palette: { wall: 0xd8e0d0, accent: 0x3d5a40, light: 0xd0f0c8, fog: 0x141c14 },
    events: [
      { name: "Shaam e Sukhan 2024", note: "Recited verse, open mics, and the voices that keep COMSATS literary culture audible." },
      { name: "Sham e Ghazal 2024", note: "A long night of radif and qafia, with first-years taking seats that used to belong to seniors." },
      { name: "Campus Story Walk", note: "Readings staged in corridors so literature would interrupt the ordinary day." },
      { name: "Editors' Table", note: "Line edits in public — watching a paragraph get braver under many pencils." },
      { name: "Guest Conversation", note: "A writer in the armchair, students leaning in, the hour going longer than scheduled." },
      { name: "Winter Showcase", note: "The year's work laid out: poems, photographs of nights, and the names of who kept the lights on." },
    ],
  },
  {
    title: "Tenure 2025 - 2026 (First Half)",
    yearLabel: "2025",
    plaque: "Two Hundred Voices",
    mood: "A community large enough to fill a hall, still trying to feel like a circle.",
    palette: { wall: 0xf0e4c4, accent: 0x7a6a30, light: 0xffe8a0, fog: 0x241e10 },
    events: [
      { name: "Shaam e Sukhan 2025", note: "Two hundred literates in one vision: to spread love and literature across campus." },
      { name: "Grand Recital", note: "A program stacked with names, still leaving space for someone who signed up at the door." },
      { name: "CLS on the Lawn", note: "Blankets, books, and a portable speaker — the society practicing being unmissable." },
      { name: "Mentorship Pairing", note: "Seniors walking juniors through a first reading, a first edit, a first time at the mic." },
      { name: "Design for Verse", note: "Posters, frames, and the visual craft of announcing a literary night." },
      { name: "Mid-Year Mushaira", note: "A checkpoint in couplets — what the first half had already become." },
    ],
  },
  {
    title: "Tenure 2025 - 2026 (Second Half)",
    yearLabel: "2025·II",
    plaque: "The Handoff",
    mood: "A tenure split in two. The work of keeping a society alive while names on the letterhead change.",
    palette: { wall: 0xe4d8c8, accent: 0x5a4830, light: 0xf0d8b0, fog: 0x1c1610 },
    events: [
      { name: "Transition Council", note: "Files, passwords, and the unglamorous tenderness of handing a society to the next desk." },
      { name: "Late Sham e Ghazal", note: "The second ghazal of a long year — tired, loyal, and still full." },
      { name: "Members' Open Floor", note: "No theme except whoever walked in with a page and needed a listener." },
      { name: "Constitution Reading", note: "The rules read aloud so the next tenure would inherit a spine, not only a calendar." },
      { name: "Thank-You Circle", note: "Names spoken for people who carried chairs, cables, and the quieter kinds of labor." },
      { name: "Bridge Gathering", note: "Outgoing and incoming in one room, drawing the year as a line instead of a cut." },
    ],
  },
  {
    title: "Tenure 2026 - 2027",
    yearLabel: "2026",
    plaque: "Still Being Written",
    mood: "The newest chamber. Walk carefully — some frames are still waiting for their night.",
    palette: { wall: 0xe8e4d4, accent: 0x6a673b, light: 0xf8f0c8, fog: 0x1a1a12 },
    events: [
      { name: "Opening Address", note: "M. Ammar Ibn-e-Saif's tenure begins with the old CLS bet: that a sentence can still change a day." },
      { name: "New Members' Night", note: "Badges, nerves, and the first reading of a society that is already older than its first-years." },
      { name: "Autumn Recital", note: "A program still finding its order — which is how every remembered night once looked." },
      { name: "Workshop Season", note: "Craft in the afternoon: ghazal, prose, and the patience to stay with a weak draft." },
      { name: "Public Literature Day", note: "CLS outside its usual hall, asking the campus to trip over a poem." },
      { name: "The Next Chapter", note: "An empty frame on purpose. This room is not a museum yet — it is a desk." },
    ],
  },
];

const byTitle = Object.fromEntries(rooms.map((room) => [room.title, room]));

export function getHallRooms(tenuresList = tenures) {
  return tenuresList.map((tenure, index) => {
    const archived = byTitle[tenure.title] || {};
    const fromTenure = (tenure.events || [])
      .map((item) =>
        typeof item === "string"
          ? { name: item, note: tenure.summary || "From the CLS archive." }
          : { name: item.name, note: item.note || tenure.summary || "" },
      )
      .filter((item) => item.name);
    const events = fromTenure.length ? fromTenure : archived.events || [];

    return {
      id: tenure._id || `year-${index}`,
      title: tenure.title,
      president: tenure.president,
      summary: tenure.summary || archived.mood || `Records under ${tenure.president}.`,
      yearLabel: tenure.yearLabel || archived.yearLabel || String(2016 + index),
      plaque: archived.plaque || tenure.title,
      mood: archived.mood || "",
      palette: archived.palette || {
        wall: 0xefe6d0,
        accent: 0x6a673b,
        light: 0xffe6b0,
        fog: 0x1a1810,
      },
      events: events.length ? events : [{ name: "Archive in progress", note: "Records for this tenure are still being gathered." }],
    };
  });
}
