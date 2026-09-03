import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    year: { type: String, default: "" },
    image: { type: String, default: "" },
    summary: { type: String, default: "" },
    body: { type: String, default: "" },
    startsAt: Date,
    location: { type: String, default: "" },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);
