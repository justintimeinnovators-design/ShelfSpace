import { Kafka } from "kafkajs";
import { getCollections } from "../db.js";
import { projectEvent } from "../projections/projector.js";
const KAFKA_BROKERS = (process.env.KAFKA_BROKERS || "kafka:9092").split(",");
const kafka = new Kafka({
    clientId: "analytics-service-consumer",
    brokers: KAFKA_BROKERS,
});
const consumer = kafka.consumer({ groupId: "analytics-consumer-group" });
export async function startConsumer() {
    await consumer.connect();
    console.log(`[kafka:consumer][analytics-service] connected to ${KAFKA_BROKERS.join(",")}`);
    await consumer.subscribe({ topic: "analytics-events", fromBeginning: false });
    console.log(`[kafka:consumer][analytics-service] subscribed to analytics-events`);
    await consumer.run({
        eachMessage: async ({ message, partition }) => {
            if (!message.value)
                return;
            try {
                const event = JSON.parse(message.value.toString());
                console.log(`[kafka:consumer][analytics-service] received ${event.type} | userId=${event.userId ?? "n/a"} | partition=${partition}`);
                const { events: eventsCollection, analytics } = await getCollections();
                await eventsCollection.insertOne({
                    ...event,
                    timestamp: event.timestamp || new Date().toISOString(),
                });
                await projectEvent(analytics, event);
                console.log(`[kafka:consumer][analytics-service] projected ${event.type} | userId=${event.userId ?? "n/a"}`);
            }
            catch (error) {
                console.error(`[kafka:consumer][analytics-service] failed to process event:`, error);
            }
        },
    });
    console.log("[kafka:consumer][analytics-service] running — listening on analytics-events");
}
export async function stopConsumer() {
    await consumer.disconnect();
    console.log("[kafka:consumer][analytics-service] disconnected");
}
