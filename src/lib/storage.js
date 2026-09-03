import mongoose from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";
import { connectDb } from "./db";

function bucket() {
  if (!mongoose.connection?.db) {
    throw new Error("Database is not connected");
  }
  return new GridFSBucket(mongoose.connection.db, { bucketName: "media" });
}

export async function saveUpload(file) {
  await connectDb();
  const bytes = Buffer.from(await file.arrayBuffer());
  const filename = file.name || "upload";
  const contentType = file.type || "application/octet-stream";
  const upload = bucket().openUploadStream(filename, {
    contentType,
    metadata: { originalName: filename, contentType },
  });

  await new Promise((resolve, reject) => {
    upload.end(bytes, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  return {
    id: upload.id.toString(),
    url: `/api/media/${upload.id.toString()}`,
    filename,
    contentType,
  };
}

export async function streamMedia(id) {
  await connectDb();
  if (!ObjectId.isValid(id)) return null;
  const files = mongoose.connection.db.collection("media.files");
  const doc = await files.findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  return {
    stream: bucket().openDownloadStream(doc._id),
    contentType: doc.contentType || doc.metadata?.contentType || "application/octet-stream",
    filename: doc.filename,
    length: doc.length,
  };
}
