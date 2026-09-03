export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function uniqueSlug(Model, base, excludeId) {
  const root = slugify(base) || "item";
  let slug = root;
  let n = 2;
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Model.exists(query);
    if (!exists) return slug;
    slug = `${root}-${n}`;
    n += 1;
  }
}
