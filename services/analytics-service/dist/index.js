import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import eventsRouter from "./routes/events.routes.js";
import queryRouter from "./routes/query.routes.js";
import { isAuthenticated } from "./middlewares/auth.js";
import { getDb } from "./db.js";
import { startConsumer, stopConsumer } from "./kafka/consumer.js";
import { disconnectProducer } from "./kafka/producer.js";
const app = express();
const PORT = process.env.PORT || 3008;
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.get("/health", async (_req, res) => {
    try {
        await getDb();
        res.json({ status: "ok", service: "analytics-service" });
    }
    catch (error) {
        res.status(503).json({ status: "error", service: "analytics-service" });
    }
});
app.use(isAuthenticated);
app.use("/api/analytics", eventsRouter);
app.use("/api/analytics", queryRouter);
app.listen(PORT, () => {
    console.log(`Analytics service running on port ${PORT}`);
});
startConsumer().catch((err) => {
    console.error("Failed to start Kafka consumer:", err);
});
const shutdown = async () => {
    await stopConsumer();
    await disconnectProducer();
    process.exit(0);
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
