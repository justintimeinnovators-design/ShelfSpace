/**
 * Chat service wrapper.
 *
 * Coordinates:
 * - session CRUD against user-service chat endpoints,
 * - chatbot response generation via chatbot endpoint,
 * - best-effort persistence of user/assistant messages.
 */
import api from "./api";

const apiBase = process.env["NEXT_PUBLIC_API_URL"]?.replace(/\/$/, "");
const CHAT_API_URL =
  process.env["NEXT_PUBLIC_USER_SERVICE_URL"] ||
  (apiBase ? `${apiBase}/api` : "") ||
  "http://localhost:3001/api";

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  isPinned: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  expiresAt: string;
  messages?: ChatMessage[];
  messageCount?: number;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  bookContext?: string;
  metadata?: any;
}

export interface CreateSessionInput {
  title?: string;
}

export interface UpdateSessionInput {
  title?: string;
  isPinned?: boolean;
  isVisible?: boolean;
}

export interface AddMessageInput {
  role: "user" | "assistant";
  content: string;
  bookContext?: string;
  metadata?: any;
}

class ChatService {
  /**
   * Fetches all sessions for authenticated user.
   */
  async getSessions(
    token: string,
    options?: {
      limit?: number;
      offset?: number;
      includePinned?: boolean;
    }
  ): Promise<ChatSession[]> {
    const response = await api.get(`${CHAT_API_URL}/chat/sessions`, {
      params: options,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  /**
   * Creates a new chat session.
   */
  async createSession(token: string, input?: CreateSessionInput): Promise<ChatSession> {
    const response = await api.post(
      `${CHAT_API_URL}/chat/sessions`,
      input || {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  /**
   * Fetches a session including message history.
   */
  async getSession(token: string, sessionId: string): Promise<ChatSession> {
    const response = await api.get(`${CHAT_API_URL}/chat/sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  // /**
  //  * Add a message to a session
  //  */
  /**
   * Persists one message record into a chat session.
   */
  async addMessage(
    token: string,
    sessionId: string,
    message: AddMessageInput
  ): Promise<ChatMessage> {
    const response = await api.post(
      `${CHAT_API_URL}/chat/sessions/${sessionId}/messages`,
      message,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  /**
   * Updates mutable session metadata (title, pin, visibility).
   */
  async updateSession(
    token: string,
    sessionId: string,
    updates: UpdateSessionInput
  ): Promise<void> {
    await api.patch(`${CHAT_API_URL}/chat/sessions/${sessionId}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  /**
   * Deletes a session and associated message history.
   */
  async deleteSession(token: string, sessionId: string): Promise<void> {
    await api.delete(`${CHAT_API_URL}/chat/sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  /**
   * Extends session expiration window.
   */
  async refreshSession(token: string, sessionId: string): Promise<void> {
    await api.post(
      `${CHAT_API_URL}/chat/sessions/${sessionId}/refresh`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  /**
   * Sends user message to chatbot and returns user+assistant message pair.
   *
   * Flow:
   * 1) Request answer from chatbot service.
   * 2) Build normalized local message objects.
   * 3) Persist both messages to user-service (best effort).
   */
  async sendChatMessage(
    token: string,
    sessionId: string,
    userMessage: string,
    bookContext?: string
  ): Promise<{ userMsg: ChatMessage; botMsg: ChatMessage }> {
    // 1. Get bot response from chatbot service
    let response: string;
    let metadata: any;
    let shelfAiSessionId: string | undefined;
    try {
      const botResponse = await api.post("/chatbot/chat", {
        query: userMessage,
        session_id: sessionId,
      });
      response = botResponse.data?.answer || "";
      shelfAiSessionId = botResponse.data?.session_id || sessionId;
      metadata = botResponse.data?.metadata;
    } catch (error: any) {
      console.warn("Chatbot request failed:", error);
      response =
        "I'm sorry, I'm having trouble connecting to ShelfAI right now. Please try again in a moment.";
      shelfAiSessionId = sessionId;
    }
    
    const userMsg: ChatMessage = {
      role: "user",
      content: userMessage,
      timestamp: Date.now().toString(),
      ...(bookContext && { bookContext }),
    };
    const botMsg: ChatMessage = {
      role: "assistant",
      content: response,
      timestamp: Date.now().toString(),
      ...(bookContext && { bookContext }),
      metadata: {
        ...(metadata && { ...metadata }),
        shelfAiSessionId,
      },
    };

    // Persist failure should not block UX; caller still receives chatbot answer.
    // 2. Store messages in user-service (best effort)
    try {
      await this.addMessage(token, sessionId, {
        role: "user",
        content: userMessage,
        ...(bookContext && { bookContext }),
        metadata: {
          shelfAiSessionId,
        },
      });
      await this.addMessage(token, sessionId, {
        role: "assistant",
        content: response,
        ...(bookContext && { bookContext }),
        metadata: {
          ...(metadata && { ...metadata }),
          shelfAiSessionId,
        },
      });
    } catch (error) {
      console.warn("Failed to persist chat messages:", error);
    }

    return { userMsg, botMsg };
  }

  /**
   * Generates a compact session title from first user prompt.
   */
  generateTitle(firstMessage: string): string {
    const maxLength = 50;
    if (firstMessage.length <= maxLength) {
      return firstMessage;
    }
    return firstMessage.slice(0, maxLength) + "...";
  }
}

export const chatService = new ChatService();
