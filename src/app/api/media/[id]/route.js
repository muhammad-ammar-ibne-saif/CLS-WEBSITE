import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { streamMedia } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { id } = await params;

  let media;
  try {
    media = await streamMedia(id, request.headers.get("range"));
  } catch {
    return NextResponse.json({ error: "Storage unavailable" }, { status: 503 });
  }
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (media.invalidRange) {
    return new NextResponse(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${media.length}` },
    });
  }

  const headers = new Headers();
  headers.set("Content-Type", media.contentType);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("ETag", media.etag);
  if (media.filename) {
    headers.set("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(media.filename)}`);
  }

  if (request.headers.get("if-none-match") === media.etag) {
    media.stream.destroy();
    return new NextResponse(null, { status: 304, headers });
  }

  if (media.partial) {
    headers.set("Content-Range", `bytes ${media.start}-${media.end}/${media.length}`);
    headers.set("Content-Length", String(media.end - media.start + 1));
  } else if (media.length) {
    headers.set("Content-Length", String(media.length));
  }

  return new NextResponse(Readable.toWeb(media.stream), { status: media.partial ? 206 : 200, headers });
}
