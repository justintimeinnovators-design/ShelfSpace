import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { randomUUID } from "crypto";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import tokenRoutes from "./routes/token.routes.js";
import chatRoutes from "./routes/chat.routes.js";
const app = express();
const PORT = process.env.PORT || 3001;
// Security middleware - must be first
app.use(helmet({
    contentSecurityPolicy: false, // Managed by API gateway/frontend
    crossOriginEmbedderPolicy: false
}));
app.use(express.json());
// Secure CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map(o => o.trim()) || ["http://localhost:3000"];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        // Check exact match
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        // Allow Vercel preview deployments (*.vercel.app)
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"]
}));
app.use(morgan("dev"));
// Request ID + structured request logging
app.use((req, res, next) => {
    const start = Date.now();
    const requestId = req.headers["x-request-id"] || randomUUID();
    res.setHeader("x-request-id", requestId);
    req.requestId = requestId;
    // Log request start
    console.log(JSON.stringify({
        level: "info",
        msg: "request:start",
        requestId,
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
    }));
    res.on("finish", () => {
        console.log(JSON.stringify({
            level: "info",
            msg: "request:finish",
            requestId,
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: Date.now() - start,
        }));
    });
    next();
});
app.get("/", (req, res) => {
    // console.log(req);
    res.send("Hello from User Service!");
});
app.get("/health", async (_req, res) => {
    try {
        // Basic health check - service is running
        res.json({ status: "ok", service: "user-service" });
    }
    catch (error) {
        res.status(503).json({ status: "error", service: "user-service" });
    }
});
// Mount routes - order matters!
app.use("/api/token", tokenRoutes); // Public token endpoint: GET /api/token/:userId (must be first)
app.use("/api/auth", authRoutes); // Auth verification endpoint
app.use("/api/chat", chatRoutes); // Chat session routes
app.use("/api", userRoutes); // User routes (POST /me, GET /me, etc.)
app.listen(PORT, () => {
    console.log(`User service running at http://localhost:${PORT}`);
});
import { disconnectProducer } from "./kafka/producer.js";
const shutdown = async () => {
    await disconnectProducer();
    process.exit(0);
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
