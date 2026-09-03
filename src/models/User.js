import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ACCOUNT_STATUS, ROLES, TEAMS } from "@/config/constants";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.STAFF, index: true },
    team: { type: String, enum: Object.values(TEAMS), default: undefined, index: true },
    office: { type: String, default: "", trim: true },
    department: { type: String, default: "", trim: true },
    semester: { type: String, default: "", trim: true },
    rollNumber: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: Object.values(ACCOUNT_STATUS),
      default: ACCOUNT_STATUS.PENDING,
      index: true,
    },
    isDirector: { type: Boolean, default: false },
    showOnLeadership: { type: Boolean, default: true },
    avatar: { type: String, default: "" },
    headline: { type: String, default: "" },
    bio: { type: String, default: "" },
    slug: { type: String, unique: true, sparse: true },
    socials: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    memories: [
      {
        image: String,
        caption: String,
        event: String,
        takenAt: Date,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    portfolio: [
      {
        title: { type: String, required: true },
        kind: { type: String, enum: ["writing", "photo", "video", "other"], default: "writing" },
        body: { type: String, default: "" },
        mediaUrl: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    approvedAt: Date,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

UserSchema.index({ team: 1, status: 1, department: 1 });

UserSchema.methods.checkPassword = function checkPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hash(password, 12);
};

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
