export const members = Array.from({ length: 56 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `/assets/members/${n}.png`;
});

export const events = [
  {
    slug: "shaam-e-sukhan-2025",
    title: "Shaam e Sukhan 2025",
    year: "2025",
    image: "/assets/photo-frame.png",
    summary:
      "A community of 200+ literates who have one vision in common and that is to promote & spread love & literature in campus",
  },
  {
    slug: "shaam-e-sukhan-2024",
    title: "Shaam e Sukhan 2024",
    year: "2024",
    image: "/assets/video-frame.png",
    summary:
      "An evening of recited verse, open mics, and the voices that keep COMSATS literary culture alive.",
  },
  {
    slug: "sham-e-ghazal-2023",
    title: "Sham e Ghazal 2023",
    year: "2023",
    image: "/assets/history-portrait.png",
    summary:
      "A gathering built around ghazal, melody, and the classical forms CLS has hosted since its earliest years.",
  },
  {
    slug: "bazm-e-adab-2022",
    title: "Bazm e Adab 2022",
    year: "2022",
    image: "/assets/photo-frame.png",
    summary:
      "Prose, critique, and conversation — a campus assembly for readers who want literature lived, not only studied.",
  },
];

export const writers = [
  {
    slug: "muhammad-abdullah-ali",
    name: "Muhammad Abdullah Ali",
    role: "9th President of COMSATS Literary Society",
    image: "/assets/members/18.png",
    bio: "A former president whose tenure helped shape how CLS writes, hosts, and remembers its own work.",
    pieces: [
      {
        title: "A Room Where Words Belong",
        body: "There are campuses that treat literature as an elective, a quiet corner, a thing you do when engineering is done. CLS was never that room. It was the place students carried unfinished couplets, half-built essays, and the stubborn belief that a sentence could still change a day.\n\nAbdullah wrote the way a president has to write: not only for the page, but for the people who would have to live with the page afterwards. The society he served still feels that pressure — to be a home, not a brand.",
      },
    ],
  },
  {
    slug: "umer-bilal-mukhlis",
    name: "Umer Bilal Mukhlis",
    role: "Urdu Literature Director, CLS",
    image: "/assets/members/22.png",
    bio: "Director of Urdu literature, keeping ghazal, nazm, and the older cadences of the language at the center of campus life.",
    pieces: [
      {
        title: "What the Ghazal Still Asks",
        body: "A ghazal is not nostalgia. It is a demand: that feeling be given form, that form be given patience, and that patience be shared in a room of listeners who know when to be quiet.\n\nAt COMSATS, Urdu is not an archive. It is a living craft. Mukhlis has spent years asking students to treat that craft with the seriousness it deserves — and the joy it still offers.",
      },
    ],
  },
  {
    slug: "hira-sajid",
    name: "Hira Sajid",
    role: "Member, CLS",
    image: "/assets/members/30.png",
    bio: "A member of CLS whose prose and presence remind the society that legacy is made by people still in the room.",
    pieces: [
      {
        title: "Notes from a Member",
        body: "You join a literary society because you want a reader. You stay because you find a circle. Hira’s work sits in that second, harder category: writing that makes a campus feel less like a corridor and more like a conversation.\n\nThe pages here are a small window. The rest is still being written, as every CLS tenure has always insisted.",
      },
    ],
  },
];

export const leadership = [
  { name: "Saima Akhtar Chatha", role: "Faculty Advisor", image: "/assets/portrait-frame.png" },
  { name: "M. Ammar Ibn-e-Saif", role: "President", image: "/assets/portrait-frame.png" },
  { name: "Sajjad Haider", role: "Vice President", image: "/assets/portrait-frame.png" },
  { name: "Talha Zafar", role: "General Secretary", image: "/assets/portrait-frame.png" },
  { name: "Zoha Sattar", role: "Finance Secretary", image: "/assets/portrait-frame.png" },
  { name: "Esha", role: "Social Secretary", image: "/assets/portrait-frame.png" },
];

export const tenures = [
  {
    title: "Society Established: Tenure 2016 - 2017",
    president: "Ahmed Ghani",
    summary:
      "Every society has a beginning, but only a few grow into a legacy. CLS was founded with a simple belief: that literature has the power to shape minds, preserve culture, and bring people together through the written and spoken word. What started as a small gathering of students with a shared love for poetry, storytelling, and meaningful dialogue gradually became a community that celebrates expression in all its forms. Through every generation of members, every elected leadership, and every event held, CLS has continued to evolve while remaining true to its purpose. Our history is not merely a record of years gone by; it is a collection of voices, ideas, and contributions that continue to inspire those who become part of this journey. As new chapters are written, CLS remains committed to carrying forward a tradition where literature is not only studied, but lived.",
    events: ["Sham e Ghazal 2016", "Sham e Ghazal 2016", "Sham e Ghazal 2016"],
  },
  { title: "Tenure 2017 - 2018", president: "Ahmed Ghani" },
  { title: "Tenure 2018 - 2019", president: "Ahmed Ghani" },
  { title: "Tenure 2019 - 2020", president: "Ahmed Ghani" },
  { title: "COVID Timeline: Tenure 2020 - 2022", president: "Ahmed Ghani" },
  { title: "Tenure 2022 - 2023", president: "Ahmed Ghani" },
  { title: "Tenure 2023 - 2024", president: "Ahmed Ghani" },
  { title: "Tenure 2024 - 2025", president: "Ahmed Ghani" },
  { title: "Tenure 2025 - 2026 (First Half)", president: "Ahmed Ghani" },
  { title: "Tenure 2025 - 2026 (Second Half)", president: "Ahmed Ghani" },
  { title: "Tenure 2026 - 2027", president: "M. Ammar Ibn-e-Saif" },
];

export const constitutions = [
  {
    title: "Constitution - 2016",
    credit: "Drafted by Rija Ahmed & her team",
    file: "/assets/constitution-thumb.png",
  },
  {
    title: "Constitution - 2026",
    credit: "Drafted by Muhammad Ammar & his team",
    file: "/assets/constitution-thumb.png",
  },
];
