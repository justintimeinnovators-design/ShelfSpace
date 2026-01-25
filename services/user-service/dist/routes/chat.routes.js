import express from "express";
import prisma from "../prisma.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { getChatMessages, appendChatMessage, deleteChatMessages, refreshChatTTL } from "../utils/redis.js";
const router = express.Router();
// All routes require authentication
router.use(isAuthenticated);
/**
 * GET /api/chat/sessions
 * List all chat sessions for the authenticated user
 * Only returns sessions that haven't expired (< 24 hours old)
 */
router.get("/sessions", async (req, res) => {
    try {
        const { limit = 50, offset = 0, includePinned = true } = req.query;
        const now = new Date();
        const sessions = await prisma.chatSession.findMany({
            where: {
                userId: req.userId,
                isVisible: true,
                OR: [
                    { expiresAt: { gt: now } }, // Not expired
                    ...(includePinned === 'true' ? [{ isPinned: true }] : []) // Or pinned (keep forever)
                ]
            },
            orderBy: [
                { isPinned: 'desc' },
                { lastMessageAt: 'desc' }
            ],
            take: Number(limit),
            skip: Number(offset)
        });
        res.json(sessions);
    }
    catch (error) {
        console.error("Error fetching chat sessions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
/**
 * POST /api/chat/sessions
 * Create a new chat session
 */
router.post("/sessions", async (req, res) => {
    try {
        const { title } = req.body;
        const session = await prisma.chatSession.create({
            data: {
                userId: req.userId,
                title: title || "New Chat"
            }
        });
        res.status(201).json(session);
    }
    catch (error) {
        console.error("Error creating chat session:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
/**
 * GET /api/chat/sessions/:sessionId
 * Get a specific session with its messages from Redis
 */
router.get("/sessions/:sessionId", async (req, res) => {
    try {
        const sessionId = req.params.sessionId;
        // Verify session belongs to user
        const session = await prisma.chatSession.findFirst({
            where: {
                id: sessionId,
                userId: req.userId
            }
        });
        if (!session) {
            res.status(404).json({ error: "Session not found" });
            return;
        }
        // Check if session has expired
        const now = new Date();
        if (session.expiresAt < now && !session.isPinned) {
            res.status(410).json({
                error: "Session expired",
                message: "This chat session has expired. Messages are no longer available."
            });
            return;
        }
        // Get messages from Redis
        const messages = await getChatMessages(sessionId);
        res.json({
            ...session,
            messages,
            messageCount: messages.length
        });
    }
    catch (error) {
        console.error("Error fetching chat session:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
/**
 * POST /api/chat/sessions/:sessionId/messages
 * Add a message to the session (stores in Redis)
 */
router.post("/sessions/:sessionId/messages", async (req, res) => {
    try {
        const sessionId = req.params.sessionId;
        const { role, content, bookContext, metadata } = req.body;
        if (!role || !content) {
            res.status(400).json({ error: "Role and content are required" });
            return;
        }
        // Verify session belongs to user
        const session = await prisma.chatSession.findFirst({
            where: {
                id: sessionId,
                userId: req.userId
            }
        });
        if (!session) {
            res.status(404).json({ error: "Session not found" });
            return;
        }
        // Check if session has expired
        const now = new Date();
        if (session.expiresAt < now && !session.isPinned) {
            res.status(410).json({
                error: "Session expired",
                message: "Cannot add messages to an expired session."
            });
            return;
        }
        // Create message object
        const message = {
            role,
            content,
            timestamp: new Date().toISOString(),
            ...(bookContext && { bookContext }),
            ...(metadata && { metadata })
        };
        // Append to Redis
        const success = await appendChatMessage(sessionId, message);
        if (!success) {
            res.status(500).json({ error: "Failed to store message" });
            return;
        }
        // Update session's lastMessageAt and refresh expiry
        await prisma.chatSession.update({
            where: { id: sessionId },
            data: {
                lastMessageAt: new Date(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Reset to 24 hours from now
            }
        });
        res.status(201).json(message);
    }
    catch (error) {
        console.error("Error adding message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
/**
 * PATCH /api/chat/sessions/:sessionId
 * Update session metadata (title, pin status)
 */
router.patch("/sessions/:sessionId", async (req, res) => {
    try {
        const sessionId = req.params.sessionId;
        const { title, isPinned, isVisible } = req.body;
        const updateData = {};
        if (title !== undefined)
            updateData.title = title;
        if (isPinned !== undefined)
            updateData.isPinned = isPinned;
        if (isVisible !== undefined)
            updateData.isVisible = isVisible;
        const result = await prisma.chatSession.updateMany({
            where: {
                id: sessionId,
                userId: req.userId
            },
            data: updateData
        });
        if (result.count === 0) {
            res.status(404).json({ error: "Session not found" });
            return;
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error("Error updating session:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
/**
 * DELETE /api/chat/sessions/:sessionId
 * Delete a session and its messages
 */
router.delete("/sessions/:sessionId", async (req, res) => {
    try {
        const sessionId = req.params.sessionId;
        // Delete from database
        const result = await prisma.chatSession.deleteMany({
            where: {
                id: sessionId,
                userId: req.userId
            }
        });
        if (result.count === 0) {
            res.status(404).json({ error: "Session not found" });
            return;
        }
        // Delete messages from Redis
        await deleteChatMessages(sessionId);
        res.json({ success: true });
    }
    catch (error) {
        console.error("Error deleting session:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
/**
 * POST /api/chat/sessions/:sessionId/refresh
 * Refresh the TTL of a session (extend by 24 hours)
 */
router.post("/sessions/:sessionId/refresh", async (req, res) => {
    try {
        const sessionId = req.params.sessionId;
        // Verify session belongs to user
        const session = await prisma.chatSession.findFirst({
            where: {
                id: sessionId,
                userId: req.userId
            }
        });
        if (!session) {
            res.status(404).json({ error: "Session not found" });
            return;
        }
        // Update expiry in database
        await prisma.chatSession.update({
            where: { id: sessionId },
            data: {
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        });
        // Refresh Redis TTL
        await refreshChatTTL(sessionId);
        res.json({ success: true, message: "Session refreshed for 24 hours" });
    }
    catch (error) {
        console.error("Error refreshing session:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
/**
 * POST /api/chat/cleanup
 * Admin/Cron endpoint to hide expired sessions
 */
router.post("/cleanup", async (req, res) => {
    try {
        const now = new Date();
        // Mark expired, non-pinned sessions as invisible
        const result = await prisma.chatSession.updateMany({
            where: {
                expiresAt: { lt: now },
                isPinned: false,
                isVisible: true
            },
            data: {
                isVisible: false
            }
        });
        res.json({
            success: true,
            hiddenCount: result.count,
            message: `Hidden ${result.count} expired sessions`
        });
    }
    catch (error) {
        console.error("Error cleaning up sessions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
export default router;
