import express from "express";
import prisma from "../prisma.js";
import { isAuthenticated, isGroupMember } from "../middlewares/auth.ts";
import { publishAnalyticsEvents } from "../kafka/producer.js";

const router = express.Router();

async function emitAnalyticsEvents(
  req: express.Request,
  events: Array<Record<string, any>>
) {
  if (events.length === 0) return;
  try {
    await publishAnalyticsEvents(events);
  } catch (error) {
    console.warn("Failed to emit analytics events to Kafka:", error);
  }
}

// Get message history for a group
router.get("/groups/:groupId/messages", isAuthenticated, isGroupMember, async (req, res) => {
  const { groupId } = req.params;
  const limit = parseInt(req.query.limit as string) || 100;
  const offset = parseInt(req.query.offset as string) || 0;

  try {
    const messages = await prisma.message.findMany({
      where: { groupId },
      orderBy: { timestamp: "asc" },
      skip: offset,
      take: limit,
      select: {
        id: true,
        senderId: true,
        groupId: true,
        content: true,
        timestamp: true,
      },
    });
    res.json(messages);

    await emitAnalyticsEvents(req, [
      {
        type: "CHAT_SESSION_UPDATED",
        userId: req.userId,
        payload: { sessionId: groupId, reason: "messages_viewed" },
      },
    ]);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
