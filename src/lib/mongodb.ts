
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

declare global {
  var _mongoClient: MongoClient | undefined;
}

const client =
  global._mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  global._mongoClient = client;
}

const db = client.db("fixmate");

export { client, db };
