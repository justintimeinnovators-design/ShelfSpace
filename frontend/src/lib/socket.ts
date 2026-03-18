import { io, Socket } from "socket.io-client";
import { getSession } from "next-auth/react";

let socket: Socket | null = null;

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  content: string;
  timestamp: Date | string;
  createdAt?: string;
}

export interface GroupChatEventHandlers {
  onMessage?: (message: ChatMessage) => void;
  onError?: (error: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onUserJoined?: (userId: string) => void;
  onUserLeft?: (userId: string) => void;
}

/**
 * Initialize Socket.IO connection with authentication
 */
export async function initializeSocket(): Promise<Socket | null> {
  if (socket?.connected) {
    return socket;
  }

  try {
    const session = await getSession();
    if (!session?.accessToken) {
      console.error("No access token available for Socket.IO connection");
      return null;
    }

    // Socket.IO connects to the same origin (NGINX gateway) which proxies to chat-service
    const socketUrl = typeof window !== "undefined" ? window.location.origin : "";
    
    socket = io(socketUrl, {
      path: "/socket.io/",
      transports: ["websocket", "polling"],
      auth: {
        token: session.accessToken,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("Socket.IO connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    return socket;
  } catch (error) {
    console.error("Failed to initialize Socket.IO:", error);
    return null;
  }
}

/**
 * Get the current Socket.IO instance
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Join a group chat room
 */
export async function joinGroupChat(groupId: string): Promise<boolean> {
  const sock = socket || (await initializeSocket());
  if (!sock) {
    return false;
  }

  sock.emit("join_group", groupId);
  return true;
}

/**
 * Leave a group chat room
 */
export function leaveGroupChat(groupId: string): void {
  if (!socket || !socket.connected) return;
  socket.emit("leave_group", groupId);
}

/**
 * Send a message to a group chat
 */
export async function sendGroupMessage(groupId: string, content: string): Promise<boolean> {
  const sock = socket || (await initializeSocket());
  if (!sock) {
    return false;
  }

  sock.emit("chat_message", { groupId, content });
  return true;
}

/**
 * Setup event handlers for group chat
 */
export function setupGroupChatHandlers(
  groupId: string,
  handlers: GroupChatEventHandlers
): () => void {
  const sock = socket || null;
  if (!sock) {
    return () => {};
  }

/**
 * Message Handler.
 * @param message - message value.
 */
  const messageHandler = (message: ChatMessage) => {
    if (message.groupId === groupId) {
      // Transform timestamp if needed
      const transformedMessage: ChatMessage = {
        ...message,
        timestamp:
          message.timestamp instanceof Date
            ? message.timestamp
            : message.createdAt
            ? new Date(message.createdAt)
            : typeof message.timestamp === "string"
            ? new Date(message.timestamp)
            : new Date(),
      };
      handlers.onMessage?.(transformedMessage);
    }
  };

/**
 * Error Handler.
 * @param error - error value.
 */
  const errorHandler = (error: { message?: string }) => {
    handlers.onError?.(error.message || "An error occurred");
  };

  sock.on("chat_message", messageHandler);
  sock.on("error", errorHandler);

  if (handlers.onConnect) {
    sock.on("connect", handlers.onConnect);
  }

  if (handlers.onDisconnect) {
    sock.on("disconnect", handlers.onDisconnect);
  }

  // Cleanup function
  return () => {
    sock.off("chat_message", messageHandler);
    sock.off("error", errorHandler);
    if (handlers.onConnect) {
      sock.off("connect", handlers.onConnect);
    }
    if (handlers.onDisconnect) {
      sock.off("disconnect", handlers.onDisconnect);
    }
  };
}

/**
 * Disconnect Socket.IO
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

