import mongoose from "mongoose";

const ConstitutionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    credit: { type: String, default: "" },
    file: { type: String, default: "" },
    year: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Constitution =
  mongoose.models.Constitution || mongoose.model("Constitution", ConstitutionSchema);
