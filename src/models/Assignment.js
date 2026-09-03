import mongoose from "mongoose";
import { RESPONSE_STATUS } from "@/config/constants";

const AssignmentSchema = new mongoose.Schema(
  {
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "SemesterPlan", required: true, index: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: Object.values(RESPONSE_STATUS),
      default: RESPONSE_STATUS.PENDING,
    },
    note: { type: String, default: "" },
    respondedAt: Date,
  },
  { timestamps: true },
);

AssignmentSchema.index({ plan: 1, itemId: 1, user: 1 }, { unique: true });

export const Assignment =
  mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);
