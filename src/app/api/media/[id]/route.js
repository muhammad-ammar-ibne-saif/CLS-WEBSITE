import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { streamMedia } from "@/lib/storage";

export async function GET(_request, { params }) {
  const { id } = await params;
  const media = await streamMedia(id);
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const headers = new Headers();
  headers.set("Content-Type", media.contentType);
  if (media.length) headers.set("Content-Length", String(media.length));
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  if (media.filename) {
    headers.set("Content-Disposition", `inline; filename="${media.filename}"`);
  }
  const body = Readable.toWeb(media.stream);
  return new NextResponse(body, { headers });
}
