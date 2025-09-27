// src/hooks/chat/useChatState.ts
"use client";

import { useState, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { ChatState, ChatActions } from "../../../types/state";
import { Message } from "../../../types/Message";
import { initialMessages } from "../../services/mockData/chat";

const initialState: Omit<ChatState, "isLoading" | "error"> = {
  messages: initialMessages,
  inputMessage: "",
  isTyping: false,
  chatMode: "general",
  activeConversation: null,
  sessionId: null,
};

export function useChatState() {
  const { data: session } = useSession();
  const [state, setState] =
    useState<Omit<ChatState, "isLoading" | "error">>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Individual action callbacks
  const sendMessage = useCallback(
    async (messageText?: string) => {
      const textToSend = messageText || state.inputMessage;
      if (!textToSend?.trim()) return;

      try {
        setError(null);

        const userMessage: Message = {
          id: state.messages.length + 1,
          type: "user",
          content: textToSend,
          timestamp: new Date(),
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, userMessage],
          inputMessage: "",
          isTyping: true,
        }));

        setIsLoading(true);

        // Call chatbot service with session management
        try {
          const { generateAIResponse } = await import("../../utils/chatbot");
          const { message: aiResponse, sessionId } = await generateAIResponse(
            textToSend,
            state.sessionId || undefined
          );

          setState((prev) => ({
            ...prev,
            messages: [...prev.messages, aiResponse],
            isTyping: false,
            sessionId: sessionId, // Update session ID for conversation continuity
          }));
        } catch (error) {
          console.error("Chatbot error:", error);
          setError("Failed to generate AI response");
          setState((prev) => ({ ...prev, isTyping: false }));
        } finally {
          setIsLoading(false);
        }
      } catch {
        setError("Failed to send message");
        setIsLoading(false);
      }
    },
    [state.messages, state.inputMessage, state.sessionId, session?.user?.id]
  );

  const setInputMessage = useCallback((message: string) => {
    setState((prev) => ({ ...prev, inputMessage: message }));
  }, []);

  const setChatMode = useCallback((mode: ChatState["chatMode"]) => {
    setState((prev) => ({ ...prev, chatMode: mode }));
  }, []);

  const clearMessages = useCallback(() => {
    setState((prev) => ({ ...prev, messages: [], sessionId: null }));
  }, []);

  const setActiveConversation = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, activeConversation: id }));
  }, []);

  // Actions object
  const actions = useMemo<ChatActions>(
    () => ({
      sendMessage,
      setInputMessage,
      setChatMode,
      clearMessages,
      setActiveConversation,
    }),
    [
      sendMessage,
      setInputMessage,
      setChatMode,
      clearMessages,
      setActiveConversation,
    ]
  );

  // Computed values
  const conversationStats = useMemo(() => {
    return {
      totalMessages: state.messages.length,
      userMessages: state.messages.filter((m) => m.type === "user").length,
      aiMessages: state.messages.filter((m) => m.type === "ai").length,
    };
  }, [state.messages]);

  const canSendMessage = useMemo(() => {
    return (
      !state.isTyping && !isLoading && state.inputMessage?.trim().length > 0
    );
  }, [state.isTyping, state.inputMessage, isLoading]);

  return {
    // State
    messages: state.messages,
    inputMessage: state.inputMessage,
    isTyping: state.isTyping,
    chatMode: state.chatMode,
    activeConversation: state.activeConversation,
    sessionId: state.sessionId,
    isLoading,
    error,

    // Computed values
    conversationStats,
    canSendMessage,

    // Actions
    actions,
  };
}
