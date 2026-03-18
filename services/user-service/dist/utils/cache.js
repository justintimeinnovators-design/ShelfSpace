import { createClient } from "redis";
const REDIS_URL = process.env.REDIS_URL || "redis://redis:6379";
let redisClient = null;
/**
 * Get Redis Client.
 */
async function getRedisClient() {
    if (!redisClient) {
        redisClient = createClient({ url: REDIS_URL });
        redisClient.on("error", (err) => console.error("Redis Client Error", err));
        await redisClient.connect();
    }
    return redisClient;
}
/**
 * Get value from cache
 */
export async function get(key) {
    try {
        const client = await getRedisClient();
        const value = await client.get(key);
        return value ? JSON.parse(value) : null;
    }
    catch (error) {
        console.error("Cache get error:", error);
        return null;
    }
}
/**
 * Set value in cache
 */
export async function set(key, value, options) {
    try {
        const client = await getRedisClient();
        const serialized = JSON.stringify(value);
        if (options?.ttl) {
            await client.setEx(key, options.ttl, serialized);
        }
        else {
            await client.set(key, serialized);
        }
    }
    catch (error) {
        console.error("Cache set error:", error);
        // Don't throw - cache failures shouldn't break the app
    }
}
/**
 * Delete value from cache
 */
export async function del(key) {
    try {
        const client = await getRedisClient();
        await client.del(key);
    }
    catch (error) {
        console.error("Cache del error:", error);
    }
}
/**
 * Delete all keys matching a pattern
 */
export async function delPattern(pattern) {
    try {
        const client = await getRedisClient();
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
            await client.del(keys);
        }
    }
    catch (error) {
        console.error("Cache delPattern error:", error);
    }
}
/**
 * Generate cache key helpers
 */
export const cacheKeys = {
    user: (userId) => `user:${userId}`,
    userPreferences: (userId) => `user:${userId}:preferences`,
    userStats: (userId) => `user:${userId}:stats`,
};
