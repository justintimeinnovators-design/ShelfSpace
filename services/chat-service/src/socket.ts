import { Server } from "socket.io";
import { createServer } from "http";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import prisma from "./prisma.js";
import { createMessageSchema } from "./schemas.js";
import axios from "axios";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:3001";
const FORUM_SERVICE_URL = process.env.FORUM_SERVICE_URL || "http://localhost:3005";
const REDIS_URL = process.env.REDIS_URL || "redis://redis:6379";

/**
 * Initialize Socket.
 * @param httpServer - http Server value.
 */
export default async function initializeSocket(httpServer: ReturnType<typeof createServer>) {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",").map((o) => o.trim());
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  // Setup Redis adapter for horizontal scaling
  try {
    const pubClient = createClient({ url: REDIS_URL });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    io.adapter(createAdapter(pubClient, subClient));
    console.log("Socket.IO Redis adapter initialized");
  } catch (error) {
    console.error("Failed to initialize Redis adapter:", error);
    console.log("Continuing without Redis adapter (single instance mode)");
  }

  // Socket.io Authentication Middleware
  io.use(async (socket: any, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: Token not provided"));
    }

    try {
      const response = await axios.post(
        `${USER_SERVICE_URL}/api/auth/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.userId) {
        socket.userId = response.data.userId;
        next();
      } else {
        return next(new Error("Authentication error: Invalid token"));
      }
    } catch (error) {
      console.error("Socket Authentication Error: ", error);
      return next(new Error("Authentication error: Could not verify token"));
    }
  });

  io.on("connection", (socket: any) => {
    console.log(`User connected: ${socket.userId}`);

    socket.on("join_group", (groupId: string) => {
      socket.join(groupId);
      console.log(`User ${socket.userId} joined group ${groupId}`);
    });

    socket.on("chat_message", async (data: { groupId: string; content: string }) => {
      const { groupId, content } = data;
      const senderId = socket.userId;

      const parseResult = createMessageSchema.safeParse({ groupId, content });
      if (!parseResult.success) {
        socket.emit("error", { message: "Invalid message format" });
        return;
      }

      try {
        // Verify that the user is a member of the group
        const memberResponse = await axios.get(
          `${FORUM_SERVICE_URL}/api/forums/${groupId}/members/${senderId}/verify`
        );

        if (memberResponse.status !== 200 || !memberResponse.data.isMember) {
          socket.emit("error", { message: "You are not a member of this group" });
          return;
        }

        const message = await prisma.message.create({
          data: {
            groupId,
            senderId,
            content,
          },
        });

        io.to(groupId).emit("chat_message", message);
      } catch (error) {
        console.error("Error saving or broadcasting message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
}
