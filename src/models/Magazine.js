import mongoose from "mongoose";

const MagazineSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    issue: { type: String, default: "" },
    summary: { type: String, default: "" },
    cover: { type: String, default: "" },
    file: { type: String, default: "" },
    publishedOn: { type: Date, default: null },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Magazine = mongoose.models.Magazine || mongoose.model("Magazine", MagazineSchema);
