import mongoose from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";
import sharp from "sharp";
import { connectDb } from "./db";

const MAX_SIDE = 2000;

const EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export function extensionFor(contentType) {
  return EXTENSIONS[contentType] || "bin";
}

export function detectType(bytes) {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes.toString("latin1", 1, 4) === "PNG") return "image/png";
  if (bytes.toString("latin1", 0, 4) === "GIF8") return "image/gif";
  if (bytes.toString("latin1", 0, 4) === "RIFF" && bytes.toString("latin1", 8, 12) === "WEBP") return "image/webp";
  if (bytes.toString("latin1", 0, 4) === "%PDF") return "application/pdf";
  if (bytes.toString("latin1", 4, 8) === "ftyp") return "video/mp4";
  if (bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) return "video/webm";
  return null;
}

function bucket() {
  if (!mongoose.connection?.db) {
    throw new Error("Database is not connected");
  }
  return new GridFSBucket(mongoose.connection.db, { bucketName: "media" });
}

function cleanName(name, ext) {
  const base = String(name || "upload")
    .replace(/\.[^./\\]+$/, "")
    .replace(/[^\w\- ]+/g, "")
    .trim()
    .slice(0, 60);
  return `${base || "upload"}.${ext}`;
}

export function mediaUrl(id, contentType) {
  return `/api/media/${id}.${extensionFor(contentType)}`;
}

export async function saveUpload(file, { imagesOnly = false } = {}) {
  await connectDb();
  let bytes = Buffer.from(await file.arrayBuffer());
  let contentType = detectType(bytes);
  if (!contentType || (imagesOnly && !contentType.startsWith("image/"))) {
    throw new Error("That file type is not allowed.");
  }

  if (contentType === "image/jpeg" || contentType === "image/png" || contentType === "image/webp") {
    bytes = await sharp(bytes)
      .rotate()
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    contentType = "image/webp";
  }

  const filename = cleanName(file.name, extensionFor(contentType));
  const upload = bucket().openUploadStream(filename, {
    contentType,
    metadata: { originalName: file.name || filename, contentType },
  });

  await new Promise((resolve, reject) => {
    upload.end(bytes, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  const id = upload.id.toString();
  return { id, url: mediaUrl(id, contentType), filename, contentType, length: bytes.length };
}

export async function listMedia({ skip = 0, limit = 60, kind = "" } = {}) {
  await connectDb();
  const query = {};
  if (kind === "image") query.contentType = /^image\//;
  if (kind === "video") query.contentType = /^video\//;
  const rows = await mongoose.connection.db
    .collection("media.files")
    .find(query)
    .sort({ uploadDate: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  return rows.map((row) => {
    const contentType = row.contentType || row.metadata?.contentType || "application/octet-stream";
    return {
      id: row._id.toString(),
      url: mediaUrl(row._id.toString(), contentType),
      filename: row.filename,
      contentType,
      length: row.length,
      uploadDate: row.uploadDate,
    };
  });
}

export async function countMedia() {
  await connectDb();
  return mongoose.connection.db.collection("media.files").countDocuments();
}

export async function deleteMedia(id) {
  await connectDb();
  if (!ObjectId.isValid(id)) return false;
  await bucket().delete(new ObjectId(id));
  return true;
}

export async function streamMedia(rawId, range) {
  await connectDb();
  const id = String(rawId || "").replace(/\.[a-z0-9]+$/i, "");
  if (!ObjectId.isValid(id)) return null;
  const doc = await mongoose.connection.db.collection("media.files").findOne({ _id: new ObjectId(id) });
  if (!doc) return null;

  const contentType = doc.contentType || doc.metadata?.contentType || "application/octet-stream";
  const length = doc.length;
  let start = 0;
  let end = length - 1;
  let partial = false;

  const match = /^bytes=(\d*)-(\d*)$/.exec(range || "");
  if (match && length > 0) {
    if (match[1] === "" && match[2] !== "") {
      start = Math.max(0, length - Number(match[2]));
    } else {
      start = match[1] === "" ? 0 : Number(match[1]);
      end = match[2] === "" ? length - 1 : Math.min(Number(match[2]), length - 1);
    }
    if (start > end || start >= length) return { invalidRange: true, length };
    partial = true;
  }

  const stream =
    length === 0
      ? bucket().openDownloadStream(doc._id)
      : bucket().openDownloadStream(doc._id, { start, end: end + 1 });

  return { stream, contentType, filename: doc.filename, length, start, end, partial, etag: `"${id}"` };
}
