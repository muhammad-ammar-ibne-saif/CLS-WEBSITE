import { NextResponse } from "next/server";
import { saveUpload } from "@/lib/storage";
import { getSession } from "@/server/dal";
import { ACCOUNT_STATUS, ROLES } from "@/config/constants";

const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "video/mp4",
];

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (session.role !== ROLES.ADMIN && session.status !== ACCOUNT_STATUS.APPROVED) {
    return NextResponse.json({ error: "Account is not approved." }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Choose a file." }, { status: 400 });
  }
  if (file.size > 12 * 1024 * 1024) {
    return NextResponse.json({ error: "File must be under 12MB." }, { status: 400 });
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "That file type is not allowed." }, { status: 400 });
  }

  const stored = await saveUpload(file);
  return NextResponse.json(stored);
}
