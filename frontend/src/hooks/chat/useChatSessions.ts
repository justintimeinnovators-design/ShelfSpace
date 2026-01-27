"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { chatService, ChatSession, ChatMessage } from "@/lib/chat-service";

export function useChatSessions() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load sessions on mount
  useEffect(() => {
    console.log("[useChatSessions] Session state:", {
      hasSession: !!session,
      hasAccessToken: !!session?.accessToken,
      accessToken: session?.accessToken ? `${session.accessToken.substring(0, 20)}...` : 'none'
    });
    
    if (session?.accessToken) {
      loadSessions();
    }
  }, [session]);

  // Load specific session when currentSession changes
  useEffect(() => {
    if (currentSession && session?.accessToken) {
      loadSessionMessages(currentSession.id);
    }
  }, [currentSession?.id, session]);

  /**
   * Load all sessions for the user
   */
  const loadSessions = async () => {
    if (!session?.accessToken) {
      console.warn("[useChatSessions] No access token available. User may need to re-login.");
      setError("Please log out and log back in to use chat features");
      return;
    }

    try {
      const sessionList = await chatService.getSessions(session.accessToken, {
        limit: 50,
        includePinned: true,
      });
      // Ensure sessionList is an array
      setSessions(Array.isArray(sessionList) ? sessionList : []);
    } catch (err) {
      console.error("Failed to load sessions:", err);
      setError("Failed to load chat history");
      setSessions([]); // Reset to empty array on error
    }
  };

  /**
   * Load messages for a specific session
   */
  const loadSessionMessages = async (sessionId: string) => {
    if (!session?.accessToken) return;

    try {
      setIsLoading(true);
      const sessionData = await chatService.getSession(session.accessToken, sessionId);
      // Ensure messages is always an array
      const messagesList = Array.isArray(sessionData.messages) ? sessionData.messages : [];
      setMessages(messagesList);
      setCurrentSession(sessionData);
    } catch (err: any) {
      console.error("Failed to load session:", err);
      if (err.response?.status === 410) {
        setError("This chat session has expired");
      } else {
        setError("Failed to load messages");
      }
      setMessages([]); // Reset to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a new chat session
   */
  const createNewSession = async (title?: string) => {
    if (!session?.accessToken) return null;

    try {
      const newSession = await chatService.createSession(
        session.accessToken,
        title ? { title } : undefined
      );
      setSessions((prev) => [newSession, ...prev]);
      setCurrentSession(newSession);
      setMessages([]);
      return newSession;
    } catch (err) {
      console.error("Failed to create session:", err);
      setError("Failed to create new chat");
      return null;
    }
  };

  /**
   * Send a message in the current session
   */
  const sendMessage = async (content?: string) => {
    const messageText = content || inputMessage;
    if (!messageText.trim() || !session?.accessToken) return;

    try {
      setError(null);
      setIsTyping(true);

      // Create session if none exists
      let sessionId = currentSession?.id;
      if (!sessionId) {
        const newSession = await createNewSession();
        if (!newSession) {
          setIsTyping(false);
          return;
        }
        sessionId = newSession.id;
      }

      // Clear input immediately
      setInputMessage("");

      // Send message and get response
      const { userMsg, botMsg } = await chatService.sendChatMessage(
        session.accessToken,
        sessionId,
        messageText
      );

      // Update messages - ensure prev is always an array
      setMessages((prev) => [...(Array.isArray(prev) ? prev : []), userMsg, botMsg]);

      // Update session title if it's the first message
      if (messages.length === 0 && currentSession) {
        const title = chatService.generateTitle(messageText);
        // await chatService.updateSession(session.accessToken, sessionId, { title });
        
        // Update local session
        setCurrentSession((prev) => prev ? { ...prev, title } : null);
        setSessions((prev) =>
          (Array.isArray(prev) ? prev : []).map((s) => (s.id === sessionId ? { ...s, title } : s))
        );
      }

      // Update lastMessageAt in sessions list
      setSessions((prev) =>
        (Array.isArray(prev) ? prev : []).map((s) =>
          s.id === sessionId
            ? { ...s, lastMessageAt: new Date().toISOString() }
            : s
        )
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message");
    } finally {
      setIsTyping(false);
    }
  };

  /**
   * Switch to a different session
   */
  const switchSession = async (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
      await loadSessionMessages(sessionId);
    }
  };

  /**
   * Delete a session
   */
  const deleteSession = async (sessionId: string) => {
    if (!session?.accessToken) return;

    try {
      // await chatService.deleteSession(session.accessToken, sessionId);
      setSessions((prev) => (Array.isArray(prev) ? prev : []).filter((s) => s.id !== sessionId));

      // If deleting current session, clear it
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
      setError("Failed to delete chat");
    }
  };

  /**
   * Pin/unpin a session
   */
  const togglePin = async (sessionId: string) => {
    if (!session?.accessToken) return;

    const sessionToUpdate = sessions.find((s) => s.id === sessionId);
    if (!sessionToUpdate) return;

    try {
      // await chatService.updateSession(session.accessToken, sessionId, {
      //   isPinned: !sessionToUpdate.isPinned,
      // });

      setSessions((prev) =>
        (Array.isArray(prev) ? prev : []).map((s) =>
          s.id === sessionId ? { ...s, isPinned: !s.isPinned } : s
        )
      );
    } catch (err) {
      console.error("Failed to toggle pin:", err);
      setError("Failed to update chat");
    }
  };

  /**
   * Rename a session
   */
  const renameSession = async (sessionId: string, newTitle: string) => {
    if (!session?.accessToken) return;

    try {
      // await chatService.updateSession(session.accessToken, sessionId, {
      //   title: newTitle,
      // });

      setSessions((prev) =>
        (Array.isArray(prev) ? prev : []).map((s) => (s.id === sessionId ? { ...s, title: newTitle } : s))
      );

      if (currentSession?.id === sessionId) {
        setCurrentSession((prev) => (prev ? { ...prev, title: newTitle } : null));
      }
    } catch (err) {
      console.error("Failed to rename session:", err);
      setError("Failed to rename chat");
    }
  };

  /**
   * Clear current session (start fresh)
   */
  const clearCurrentSession = () => {
    setCurrentSession(null);
    setMessages([]);
    setInputMessage("");
  };

  return {
    // State
    sessions,
    currentSession,
    messages,
    inputMessage,
    isTyping,
    isLoading,
    error,

    // Actions
    actions: {
      setInputMessage,
      sendMessage,
      createNewSession,
      switchSession,
      deleteSession,
      togglePin,
      renameSession,
      clearCurrentSession,
      loadSessions,
      refreshSession: loadSessionMessages,
    },
  };
}
