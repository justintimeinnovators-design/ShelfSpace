import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { randomUUID } from "crypto";
import adminRoutes from "./routes/admin.routes.js";
import prisma from "./prisma.js";

const app = express();
const PORT = process.env.PORT || 3007;

// Security middleware - must be first
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(express.json());

// Secure CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map(o => o.trim()) || ["http://localhost:3000"];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"]
}));

app.use(morgan("dev"));

// Request ID + structured request logging
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = (req.headers["x-request-id"] as string) || randomUUID();
  res.setHeader("x-request-id", requestId);
  (req as any).requestId = requestId;

  console.log(
    JSON.stringify({
      level: "info",
      msg: "request:start",
      requestId,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
    })
  );

  res.on("finish", () => {
    console.log(
      JSON.stringify({
        level: "info",
        msg: "request:finish",
        requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - start,
      })
    );
  });

  next();
});

app.get("/", (_req, res) => {
  res.send("Hello from Admin Service!");
});

app.get("/health", async (_req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", service: "admin-service" });
  } catch (error) {
    res.status(503).json({ status: "error", service: "admin-service", error: "Database connection failed" });
  }
});

app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Admin service running at http://localhost:${PORT}`);
});

import { disconnectProducer } from "./kafka/producer.js";

const shutdown = async () => {
  await disconnectProducer();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
