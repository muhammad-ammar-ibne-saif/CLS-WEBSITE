import { NextResponse } from "next/server";
import { listMedia, saveUpload } from "@/lib/storage";
import { limited } from "@/lib/rate-limit";
import { getSession } from "@/server/dal";
import { ACCOUNT_STATUS, ROLES } from "@/config/constants";

export const dynamic = "force-dynamic";

const MAX_BYTES = 40 * 1024 * 1024;
const MAX_PENDING_BYTES = 8 * 1024 * 1024;

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const isAdmin = session.role === ROLES.ADMIN;
  const isPending = !isAdmin && session.status === ACCOUNT_STATUS.PENDING;
  if (!isAdmin && !isPending && session.status !== ACCOUNT_STATUS.APPROVED) {
    return NextResponse.json({ error: "Account is not active." }, { status: 403 });
  }

  if (await limited("upload", 40, 10 * 60 * 1000, String(session._id))) {
    return NextResponse.json({ error: "Too many uploads. Try again in a few minutes." }, { status: 429 });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Upload could not be read." }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Choose a file." }, { status: 400 });
  }
  const cap = isPending ? MAX_PENDING_BYTES : MAX_BYTES;
  if (file.size > cap) {
    return NextResponse.json(
      { error: `File must be under ${Math.round(cap / 1024 / 1024)}MB.` },
      { status: 400 },
    );
  }

  try {
    const stored = await saveUpload(file, { imagesOnly: isPending });
    return NextResponse.json(stored);
  } catch (error) {
    const known = error.message === "That file type is not allowed.";
    return NextResponse.json(
      { error: known ? error.message : "Upload failed. Try another file." },
      { status: known ? 400 : 500 },
    );
  }
}

export async function GET(request) {
  const session = await getSession();
  if (!session || session.role !== ROLES.ADMIN) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const skip = Math.max(0, Number(searchParams.get("skip")) || 0);
  const kind = searchParams.get("kind") || "";
  const items = await listMedia({ skip, limit: 48, kind });
  return NextResponse.json({ items });
}
