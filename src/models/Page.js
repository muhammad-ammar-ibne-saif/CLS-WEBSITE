import mongoose from "mongoose";
import { PAGE_KEYS } from "@/config/constants";

const PageSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, enum: PAGE_KEYS },
    title: { type: String, default: "" },
    lede: { type: String, default: "" },
    body: { type: String, default: "" },
    eyebrow: { type: String, default: "" },
    headline: { type: String, default: "" },
    secondaryHeadline: { type: String, default: "" },
    secondaryLede: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    calligraphyImage: { type: String, default: "" },
    ctaLabel: { type: String, default: "" },
    ctaHref: { type: String, default: "" },
    stats: [
      {
        value: String,
        label: String,
      },
    ],
    cards: [
      {
        title: String,
        body: String,
        image: String,
      },
    ],
    extra: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export const Page = mongoose.models.Page || mongoose.model("Page", PageSchema);
