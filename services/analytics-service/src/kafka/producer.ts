import { Kafka } from "kafkajs";

const KAFKA_BROKERS = (process.env.KAFKA_BROKERS || "kafka:9092").split(",");

const kafka = new Kafka({
  clientId: "analytics-service-producer",
  brokers: KAFKA_BROKERS,
  ...(process.env.KAFKA_SSL === "true" && { ssl: true }),
  ...(process.env.KAFKA_SASL_USERNAME && {
    sasl: {
      mechanism: (process.env.KAFKA_SASL_MECHANISM || "scram-sha-256") as "scram-sha-256" | "scram-sha-512",
      username: process.env.KAFKA_SASL_USERNAME,
      password: process.env.KAFKA_SASL_PASSWORD!,
    },
  }),
});

const producer = kafka.producer();
let connected = false;

async function ensureConnected() {
  if (!connected) {
    await producer.connect();
    connected = true;
  }
}

export async function publishAnalyticsEvents(
  events: Array<Record<string, any>>
) {
  if (events.length === 0) return;
  await ensureConnected();
  const messages = events.map((event) => ({
    key: event.userId ? String(event.userId) : null,
    value: JSON.stringify(event),
  }));
  await producer.send({ topic: "analytics-events", messages });
}

export async function disconnectProducer() {
  if (connected) {
    await producer.disconnect();
    connected = false;
  }
}
