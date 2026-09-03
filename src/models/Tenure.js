import mongoose from "mongoose";

const TenureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    president: { type: String, required: true },
    yearLabel: { type: String, default: "" },
    summary: { type: String, default: "" },
    portrait: { type: String, default: "/assets/history-portrait.png" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    events: [
      {
        name: String,
        note: String,
        image: String,
      },
    ],
  },
  { timestamps: true },
);

export const Tenure = mongoose.models.Tenure || mongoose.model("Tenure", TenureSchema);
