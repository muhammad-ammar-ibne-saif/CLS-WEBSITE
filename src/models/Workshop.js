import mongoose from "mongoose";

const WorkshopSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    kind: { type: String, enum: ["upcoming", "recording"], default: "upcoming", index: true },
    summary: { type: String, default: "" },
    body: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    instructor: { type: String, default: "" },
    location: { type: String, default: "" },
    startsAt: Date,
    endsAt: Date,
    recordingUrl: { type: String, default: "" },
    materialsUrl: { type: String, default: "" },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Workshop = mongoose.models.Workshop || mongoose.model("Workshop", WorkshopSchema);
