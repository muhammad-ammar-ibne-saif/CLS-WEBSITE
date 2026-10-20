import { headers } from "next/headers";

const buckets = new Map();

function sweep(now) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.reset < now) buckets.delete(key);
  }
}

export async function clientAddress() {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for") || "";
  return forwarded.split(",")[0].trim() || list.get("x-real-ip") || "local";
}

export function takeToken(key, limit, windowMs) {
  const now = Date.now();
  sweep(now);
  const bucket = buckets.get(key);
  if (!bucket || bucket.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

export async function limited(scope, limit, windowMs, extra = "") {
  const address = await clientAddress();
  return !takeToken(`${scope}:${address}:${extra}`, limit, windowMs);
}
