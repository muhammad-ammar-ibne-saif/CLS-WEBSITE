import mongoose from "mongoose";
import { ITEM_KINDS, PLAN_STATUS } from "@/config/constants";

const PlanItemSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ITEM_KINDS, default: "event" },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    startsAt: Date,
    endsAt: Date,
    departments: [{ type: String }],
    directorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { _id: true },
);

const SemesterPlanSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    semester: { type: String, required: true, index: true },
    overview: { type: String, default: "" },
    status: { type: String, enum: Object.values(PLAN_STATUS), default: PLAN_STATUS.DRAFT, index: true },
    items: [PlanItemSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    publishedAt: Date,
  },
  { timestamps: true },
);

export const SemesterPlan =
  mongoose.models.SemesterPlan || mongoose.model("SemesterPlan", SemesterPlanSchema);
