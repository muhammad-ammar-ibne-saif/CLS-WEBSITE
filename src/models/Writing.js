import mongoose from "mongoose";

const WritingSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, default: "" },
    image: { type: String, default: "" },
    bio: { type: String, default: "" },
    member: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
    pieces: [
      {
        title: { type: String, required: true },
        body: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true },
);

export const Writing = mongoose.models.Writing || mongoose.model("Writing", WritingSchema);
