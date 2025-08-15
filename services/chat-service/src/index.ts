import express from "express";
import cors from "cors";
import morgan from "morgan";
import { WebSocketServer } from "ws";
import chatRoutes from "./routes/chat.routes.ts";
import handleWebSocketConnection from "./websockets/chat.websocket.ts";

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.send("Hello from Chat Service!");
});

app.use("/api/chat", chatRoutes);

const server = app.listen(PORT, () => {
  console.log(`Chat service running at http://localhost:${PORT}`);
});

// Initialize WebSocket Server
const wss = new WebSocketServer({ server });

wss.on("connection", handleWebSocketConnection);

console.log("WebSocket server initialized.");
