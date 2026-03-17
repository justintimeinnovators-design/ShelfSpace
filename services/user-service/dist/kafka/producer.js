import { Kafka } from "kafkajs";
const SERVICE = "user-service";
const KAFKA_BROKERS = (process.env.KAFKA_BROKERS || "kafka:9092").split(",");
const kafka = new Kafka({
    clientId: SERVICE,
    brokers: KAFKA_BROKERS,
});
const producer = kafka.producer();
let connected = false;
async function ensureConnected() {
    if (!connected) {
        await producer.connect();
        connected = true;
        console.log(`[kafka:producer][${SERVICE}] connected to ${KAFKA_BROKERS.join(",")}`);
    }
}
export async function publishAnalyticsEvents(events) {
    if (events.length === 0)
        return;
    try {
        await ensureConnected();
        const messages = events.map((event) => ({
            key: event.userId ? String(event.userId) : null,
            value: JSON.stringify(event),
        }));
        await producer.send({ topic: "analytics-events", messages });
        const types = events.map((e) => e.type).join(", ");
        console.log(`[kafka:producer][${SERVICE}] published ${events.length} event(s): ${types}`);
    }
    catch (error) {
        const types = events.map((e) => e.type).join(", ");
        console.error(`[kafka:producer][${SERVICE}] failed to publish [${types}]:`, error);
    }
}
export async function disconnectProducer() {
    if (connected) {
        await producer.disconnect();
        connected = false;
        console.log(`[kafka:producer][${SERVICE}] disconnected`);
    }
}
