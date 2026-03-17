import { Router } from "express";
import { publishAnalyticsEvents } from "../kafka/producer.js";
import { eventsSchema } from "../schemas.js";
const router = Router();
// HTTP gateway for services that cannot use Kafka directly (e.g. chatbot-service).
// Validates the payload and publishes to the analytics-events Kafka topic.
// All DB writes and projections are handled by the Kafka consumer.
router.post("/events", async (req, res) => {
    try {
        const body = req.body;
        const parsed = Array.isArray(body)
            ? { events: body }
            : body?.events
                ? body
                : { events: [body] };
        const { events } = eventsSchema.parse(parsed);
        const enrichedEvents = events.map((event) => ({
            ...event,
            userId: event.userId || req.userId,
            timestamp: event.timestamp || new Date().toISOString(),
        }));
        await publishAnalyticsEvents(enrichedEvents);
        res.json({ success: true, processed: events.length });
    }
    catch (error) {
        console.error("Failed to enqueue analytics events:", error);
        res.status(400).json({ error: error?.message || "Invalid event payload" });
    }
});
export default router;
