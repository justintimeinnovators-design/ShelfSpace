"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  initializeSocket,
  joinGroupChat,
  leaveGroupChat,
  sendGroupMessage as sendSocketMessage,
  setupGroupChatHandlers,
  type ChatMessage,
} from "@/lib/socket";
import { ChatService } from "@/lib/forum-chat-service";

interface UseForumChatOptions {
  forumId: string;
  autoJoin?: boolean;
  fetchHistory?: boolean;
}

/**
 * Use Forum Chat.
 * @param { forumId, autoJoin - { forum Id, auto Join value.
 */
export function useForumChat({ forumId, autoJoin = true, fetchHistory = true }: UseForumChatOptions) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, _setOnlineUsers] = useState<Set<string>>(new Set());
  const cleanupRef = useRef<(() => void) | null>(null);
  const hasJoinedRef = useRef(false);

  // Initialize socket and join forum
  useEffect(() => {
    if (!autoJoin || !session?.accessToken || !forumId) {
      return;
    }

    let mounted = true;

/**
 * Setup Chat.
 */
    const setupChat = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize socket
        const socket = await initializeSocket();
        if (!socket) {
          throw new Error("Failed to initialize socket connection");
        }

        if (mounted) {
          setIsConnected(socket.connected);

          // Setup event handlers
          const cleanup = setupGroupChatHandlers(forumId, {
            onMessage: (message) => {
              setMessages((prev) => {
                // Avoid duplicates
                if (prev.some((m) => m.id === message.id)) {
                  return prev;
                }
                return [...prev, message];
              });
            },
            onError: (err) => {
              setError(err);
            },
            onConnect: () => {
              setIsConnected(true);
              if (!hasJoinedRef.current) {
                joinGroupChat(forumId);
                hasJoinedRef.current = true;
              }
            },
            onDisconnect: () => {
              setIsConnected(false);
            },
          });

          cleanupRef.current = cleanup;

          // Join the forum if socket is already connected
          if (socket.connected && !hasJoinedRef.current) {
            await joinGroupChat(forumId);
            hasJoinedRef.current = true;
          }

          // Fetch message history
          if (fetchHistory) {
            try {
              const history = await ChatService.getMessages(forumId, { limit: 100 });
              setMessages(
                history.map((msg) => ({
                  ...msg,
                  timestamp: typeof msg.timestamp === "string" 
                    ? new Date(msg.timestamp) 
                    : msg.createdAt 
                    ? new Date(msg.createdAt) 
                    : new Date(),
                }))
              );
            } catch (err: any) {
              console.error("Failed to fetch chat history:", err);
              // Don't set error for history fetch failure, just log it
            }
          }

          setIsLoading(false);
        }
      } catch (err: any) {
        console.error("Failed to setup chat:", err);
        if (mounted) {
          setError(err.message || "Failed to connect to chat");
          setIsLoading(false);
        }
      }
    };

    setupChat();

    return () => {
      mounted = false;
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (hasJoinedRef.current) {
        leaveGroupChat(forumId);
        hasJoinedRef.current = false;
      }
    };
  }, [forumId, autoJoin, session?.accessToken, fetchHistory]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) {
        return;
      }

      try {
        setError(null);
        const success = await sendSocketMessage(forumId, content.trim());
        if (!success) {
          throw new Error("Failed to send message");
        }
      } catch (err: any) {
        console.error("Failed to send message:", err);
        setError(err.message || "Failed to send message");
        throw err;
      }
    },
    [forumId]
  );

  const loadMoreMessages = useCallback(async () => {
    if (isLoading || messages.length === 0) return;

    try {
      setIsLoading(true);
      const history = await ChatService.getMessages(forumId, {
        limit: 50,
        offset: messages.length,
      });

      if (history.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMessages = history
            .filter((msg) => !existingIds.has(msg.id))
            .map((msg) => ({
              ...msg,
              timestamp: new Date(msg.timestamp || msg.createdAt || Date.now()),
            }));

          // Merge and sort by timestamp
          const merged = [...newMessages, ...prev].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          return merged;
        });
      }

      setIsLoading(false);
    } catch (err: any) {
      console.error("Failed to load more messages:", err);
      setError(err.message || "Failed to load messages");
      setIsLoading(false);
    }
  }, [forumId, messages.length, isLoading]);

  return {
    messages,
    isConnected,
    isLoading,
    error,
    onlineUsers,
    sendMessage,
    loadMoreMessages,
  };
}

