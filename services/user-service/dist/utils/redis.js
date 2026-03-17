import Redis from 'ioredis';
const REDIS_URL = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL || 'redis://localhost:6379';
let redis = null;
/**
 * Get Redis Client.
 * @returns Redis.Redis.
 */
export function getRedisClient() {
    if (!redis) {
        const isUpstash = REDIS_URL.startsWith('rediss://');
        redis = new Redis.default(REDIS_URL, {
            maxRetriesPerRequest: 3,
            /**
             * Retry Strategy.
             * @param times - times value.
             */
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            /**
             * Reconnect On Error.
             * @param err - err value.
             */
            reconnectOnError(err) {
                const targetError = 'READONLY';
                if (err.message.includes(targetError)) {
                    return true;
                }
                return false;
            },
            ...(isUpstash && {
                tls: {
                    rejectUnauthorized: false, // For Upstash Redis
                },
            }),
        });
        redis.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });
        redis.on('connect', () => {
            console.log('Redis Client Connected');
        });
    }
    return redis;
}
const CHAT_KEY_PREFIX = 'chat:';
const CHAT_TTL = 86400; // 24 hours in seconds
/**
 * Get Chat Messages.
 * @param sessionId - session Id value.
 * @returns Promise<ChatMessage[]>.
 */
export async function getChatMessages(sessionId) {
    try {
        const client = getRedisClient();
        const key = `${CHAT_KEY_PREFIX}${sessionId}`;
        const data = await client.get(key);
        if (!data) {
            return [];
        }
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Error getting chat messages from Redis:', error);
        return [];
    }
}
/**
 * Set Chat Messages.
 * @param sessionId - session Id value.
 * @param messages - messages value.
 * @returns Promise<boolean>.
 */
export async function setChatMessages(sessionId, messages) {
    try {
        const client = getRedisClient();
        const key = `${CHAT_KEY_PREFIX}${sessionId}`;
        // Store with 24-hour TTL
        await client.setex(key, CHAT_TTL, JSON.stringify(messages));
        return true;
    }
    catch (error) {
        console.error('Error setting chat messages in Redis:', error);
        return false;
    }
}
/**
 * Append Chat Message.
 * @param sessionId - session Id value.
 * @param message - message value.
 * @returns Promise<boolean>.
 */
export async function appendChatMessage(sessionId, message) {
    try {
        const messages = await getChatMessages(sessionId);
        messages.push(message);
        return await setChatMessages(sessionId, messages);
    }
    catch (error) {
        console.error('Error appending chat message:', error);
        return false;
    }
}
/**
 * Delete Chat Messages.
 * @param sessionId - session Id value.
 * @returns Promise<boolean>.
 */
export async function deleteChatMessages(sessionId) {
    try {
        const client = getRedisClient();
        const key = `${CHAT_KEY_PREFIX}${sessionId}`;
        await client.del(key);
        return true;
    }
    catch (error) {
        console.error('Error deleting chat messages from Redis:', error);
        return false;
    }
}
/**
 * Refresh Chat TTL.
 * @param sessionId - session Id value.
 * @returns Promise<boolean>.
 */
export async function refreshChatTTL(sessionId) {
    try {
        const client = getRedisClient();
        const key = `${CHAT_KEY_PREFIX}${sessionId}`;
        await client.expire(key, CHAT_TTL);
        return true;
    }
    catch (error) {
        console.error('Error refreshing chat TTL:', error);
        return false;
    }
}
