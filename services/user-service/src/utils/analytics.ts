import type { Request } from "express";
import { publishAnalyticsEvents } from "../kafka/producer.js";

export async function emitAnalyticsEvents(
  req: Request,
  events: Array<Record<string, any>>,
  authHeaderOverride?: string
) {
  if (events.length === 0) return;
  try {
    await publishAnalyticsEvents(events);
  } catch (error) {
    console.warn("Failed to emit analytics events to Kafka:", error);
  }
}
