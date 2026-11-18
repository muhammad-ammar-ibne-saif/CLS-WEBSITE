import mongoose from "mongoose";

const SiteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "global", unique: true },
    siteName: { type: String, default: "COMSATS Literary Society" },
    tagline: { type: String, default: "Promoting literature and poetry in COMSATS Lahore since 2016." },
    logo: { type: String, default: "/assets/logo.webp" },
    homeVideo: { type: String, default: "/assets/home-bg.mp4" },
    homeShowcase: { type: String, default: "" },
    ctaCalligraphy: { type: String, default: "/assets/calligraphy-cta.png" },
    frameArt: { type: String, default: "" },
    footerRose: { type: String, default: "/assets/rose.webp" },
    joinTitle: { type: String, default: "CLS Is Waiting For “Your” Words. So Are We. Join Us Today." },
    joinLede: {
      type: String,
      default:
        "Join a circle of readers, writers, and dreamers who believe literature is meant to be shared, lived, and remembered.",
    },
    joinCta: { type: String, default: "Register Yourself Now" },
    currentSemester: { type: String, default: "" },
    socials: {
      // Empty means "use the link from src/config/defaults.js".
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      youtube: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    footerNote: { type: String, default: "" },
    // Page keys that show the "Coming soon" placeholder. Left undefined (not []) so an
    // older settings row falls back to the defaults instead of opening every page.
    comingSoon: { type: [String], default: undefined },
    comingSoonTitle: { type: String, default: "" },
    comingSoonLede: { type: String, default: "" },
  },
  { timestamps: true },
);

export const SiteSettings =
  mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);
