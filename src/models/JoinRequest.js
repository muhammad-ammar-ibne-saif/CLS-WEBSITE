import mongoose from "mongoose";

const JoinRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    department: { type: String, required: true },
    rollNumber: { type: String, required: true },
    why: { type: String, required: true },
    status: { type: String, enum: ["new", "contacted", "archived"], default: "new", index: true },
  },
  { timestamps: true },
);

export const JoinRequest =
  mongoose.models.JoinRequest || mongoose.model("JoinRequest", JoinRequestSchema);
