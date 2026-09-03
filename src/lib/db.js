import mongoose from "mongoose";

const globalForMongo = globalThis;

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (globalForMongo.__clsMongoDownUntil && Date.now() < globalForMongo.__clsMongoDownUntil) {
    throw new Error("Database unavailable");
  }

  if (globalForMongo.__clsMongoConnect) {
    return globalForMongo.__clsMongoConnect;
  }

  globalForMongo.__clsMongoConnect = mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 1500,
  });

  try {
    await globalForMongo.__clsMongoConnect;
    globalForMongo.__clsMongoDownUntil = 0;
    return mongoose.connection;
  } catch (error) {
    globalForMongo.__clsMongoConnect = null;
    globalForMongo.__clsMongoDownUntil = Date.now() + 8000;
    throw error;
  }
}

export function isDbConfigured() {
  return Boolean(process.env.MONGODB_URI);
}
