import { WebSocket } from "ws";
import prisma from "../prisma.js";
import { createMessageSchema } from "../schemas.js";
import { z } from "zod";

interface WebSocketWithId extends WebSocket {
  userId?: string;
  groupId?: string;
}

const clients = new Map<string, Set<WebSocketWithId>>(); // groupId -> Set of clients

export default function handleWebSocketConnection(ws: WebSocketWithId, req: any) {
  // Authenticate WebSocket connection (simplified for now, would use JWT from query/header)
  // For now, assume userId and groupId are passed as query parameters for simplicity
  const urlParams = new URLSearchParams(req.url.split("?")[1]);
  const userId = urlParams.get("userId");
  const groupId = urlParams.get("groupId");

  if (!userId || !groupId) {
    ws.close(1008, "Missing userId or groupId");
    return;
  }

  ws.userId = userId;
  ws.groupId = groupId;

  if (!clients.has(groupId)) {
    clients.set(groupId, new Set<WebSocketWithId>());
  }
  clients.get(groupId)?.add(ws);

  console.log(`Client ${userId} connected to group ${groupId}`);

  ws.on("message", async (message: string) => {
    console.log(`Received message from ${userId} in group ${groupId}: ${message}`);

    try {
      const parsedMessage = JSON.parse(message);
      const messageData = {
        groupId: groupId,
        senderId: userId,
        content: parsedMessage.content,
      };

      const parseResult = createMessageSchema.safeParse(messageData);
      if (!parseResult.success) {
        ws.send(JSON.stringify({ error: "Invalid message format", details: parseResult.error.errors }));
        return;
      }

      // Save message to DB
      const newMessage = await prisma.message.create({
        data: parseResult.data,
      });

      // Broadcast message to all clients in the same group
      clients.get(groupId)?.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(newMessage));
        }
      });
    } catch (error) {
      console.error("Error processing message:", error);
      ws.send(JSON.stringify({ error: "Failed to process message" }));
    }
  });

  ws.on("close", () => {
    console.log(`Client ${userId} disconnected from group ${groupId}`);
    clients.get(groupId)?.delete(ws);
    if (clients.get(groupId)?.size === 0) {
      clients.delete(groupId);
    }
  });

  ws.on("error", (error) => {
    console.error(`WebSocket error for client ${userId} in group ${groupId}:`, error);
  });
}
