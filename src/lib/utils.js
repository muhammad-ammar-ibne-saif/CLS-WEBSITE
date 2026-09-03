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
