import { MongoClient, type Db, type Collection } from "mongodb";
import type { AnalyticsDocument, AnalyticsEvent } from "./types/events.js";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/analytics";

const MONGO_DB = process.env.MONGO_DB || "analytics";

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Get Db.
 * @returns Promise<Db>.
 */
export async function getDb(): Promise<Db> {
  if (db) return db;
  client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(MONGO_DB);
  return db;
}

/**
 * Get Collections.
 */
export async function getCollections() {
  const database = await getDb();
  return {
    events: database.collection<AnalyticsEvent>("events"),
    analytics: database.collection<AnalyticsDocument>("user_analytics"),
  };
}

/**
 * Close Db.
 */
export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
