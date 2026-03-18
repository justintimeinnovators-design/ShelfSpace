import { publishAnalyticsEvents } from "../kafka/producer.js";
export async function emitAnalyticsEvents(req, events, authHeaderOverride) {
    if (events.length === 0)
        return;
    try {
        await publishAnalyticsEvents(events);
    }
    catch (error) {
        console.warn("Failed to emit analytics events to Kafka:", error);
    }
}
