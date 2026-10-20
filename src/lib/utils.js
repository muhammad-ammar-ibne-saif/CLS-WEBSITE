const FRAME_ASSETS = new Set([
  "/assets/video-frame.webp",
  "/assets/photo-frame.webp",
  "/assets/portrait-frame.webp",
  "/assets/history-portrait.webp",
  "/assets/frame-sm.webp",
  "/assets/frame-lg.webp",
]);

export const EVENT_COVERS = [
  "/assets/about-banner.png",
  "/assets/members/08.png",
  "/assets/members/18.png",
  "/assets/members/22.png",
  "/assets/members/30.png",
];

export function isFrameAsset(src) {
  return !src || FRAME_ASSETS.has(src);
}

export function unframedMedia(src, fallback = EVENT_COVERS[0]) {
  if (isFrameAsset(src)) return fallback;
  return src;
}

export function isVideoUrl(src) {
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(String(src || ""));
}

export function toPlain(doc) {
  if (!doc) return null;
  const raw = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return JSON.parse(JSON.stringify(raw));
}

export function toId(value) {
  return value?._id?.toString?.() || value?.id || String(value);
}

export function isDirector(user) {
  if (!user) return false;
  if (user.isDirector) return true;
  return /director/i.test(user.office || "");
}

export function ecRankOf(user) {
  if (user?.ecRank) return user.ecRank;
  const office = user?.office || "";
  if (user?.isDirector || /director/i.test(office)) return "director";
  if (/co[\s-]?lead/i.test(office)) return "colead";
  if (/lead/i.test(office)) return "lead";
  return "colead";
}

export function canAccessEc(user) {
  if (!user) return false;
  if (user.role === "admin") return true;
  return user.status === "approved" && user.team === "ec";
}

export function canAccessStaff(user) {
  if (!user) return false;
  if (user.role === "admin") return true;
  return user.status === "approved";
}

export function formString(formData, key, fallback = "") {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : fallback;
}

export function formBool(formData, key) {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
}

export function formNumber(formData, key, fallback = 0) {
  const value = Number(formString(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

export function parseJsonList(raw) {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((row) => row && typeof row === "object") : [];
  } catch {
    return [];
  }
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function compact(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined),
  );
}

export function currentSemester() {
  const now = new Date();
  const year = now.getFullYear();
  const half = now.getMonth() < 6 ? "Spring" : "Fall";
  return `${half} ${year}`;
}
