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
      instagram: { type: String, default: "https://www.instagram.com" },
      facebook: { type: String, default: "https://www.facebook.com" },
      tiktok: { type: String, default: "https://www.tiktok.com" },
    },
    footerNote: { type: String, default: "" },
  },
  { timestamps: true },
);

export const SiteSettings =
  mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);
