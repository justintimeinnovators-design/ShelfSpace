import { MongoClient } from "mongodb";
const MONGO_URI = process.env.MONGO_URI ||
    "mongodb://localhost:27017/analytics";
const MONGO_DB = process.env.MONGO_DB || "analytics";
let client = null;
let db = null;
/**
 * Get Db.
 * @returns Promise<Db>.
 */
export async function getDb() {
    if (db)
        return db;
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
        events: database.collection("events"),
        analytics: database.collection("user_analytics"),
    };
}
/**
 * Close Db.
 */
export async function closeDb() {
    if (client) {
        await client.close();
        client = null;
        db = null;
    }
}
