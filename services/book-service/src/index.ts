import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { randomUUID } from "crypto";
import mongoose from "mongoose";
import { authenticateToken } from "./middlewares/auth.js";
import bookRoutes from "./routes/book.routes.js";
// Avoid automatic index builds in environments where the DB indexes
// are managed manually (Atlas) and may not match schema definitions.
mongoose.set("autoIndex", false);

const app = express();
const PORT = process.env.PORT || 3002;

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

try {
  // Retrieve the MongoDB connection string from environment variables
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error("MONGO_URI is not defined in the .env file.");
    process.exit(1);
  }

  // Attempt to connect to the database
  const conn = await mongoose.connect(mongoURI);

  console.log(`Successfully connected to MongoDB: ${conn.connection.host}`);
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`Error connecting to MongoDB: ${errorMessage}`);
  // Exit process with failure code
  process.exit(1);
}

app.get("/", (_req, res) => {
  res.send("Hello from Book Service!");
});

app.get("/health", async (_req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState === 1) {
      res.json({ status: "ok", service: "book-service" });
    } else {
      res.status(503).json({ status: "error", service: "book-service", error: "Database not connected" });
    }
  } catch (error) {
    res.status(503).json({ status: "error", service: "book-service", error: "Health check failed" });
  }
});

app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`Book service running at http://localhost:${PORT}`);
});

import { disconnectProducer } from "./kafka/producer.js";

const shutdown = async () => {
  await disconnectProducer();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
