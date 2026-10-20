"use server";

import { revalidatePath } from "next/cache";
import { deleteMedia } from "@/lib/storage";
import { formString } from "@/lib/utils";
import { requireAdmin } from "@/server/dal";

export async function deleteMediaAction(formData) {
  await requireAdmin();
  const id = formString(formData, "id");
  const removed = await deleteMedia(id);
  revalidatePath("/admin/media");
  return removed ? { ok: true } : { error: "File not found." };
}
