import axios from "axios";
import { Message, MessageStatus } from "../../types/chat";

// Chatbot service URL
const CHATBOT_URL = process.env.NODE_ENV === 'production' 
  ? "http://chatbot-service:8000/chat"
  : "http://localhost:8000/chat";

export interface ChatbotResponse {
  answer: string;
  session_id: string;
}

export const generateAIResponse = async (
  userMessage: string,
  sessionId?: string
): Promise<{ message: Message; sessionId: string }> => {
  try {
    const response = await axios.post<ChatbotResponse>(
      CHATBOT_URL,
      {
        query: userMessage,
        session_id: sessionId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    const { answer, session_id } = response.data;

    const aiMessage: Message = {
      id: `${Math.floor(Math.random() * 1000000000)}`,
      type: "ai",
      content: answer,
      status: "sent" as MessageStatus,
      conversationId: session_id || "default",
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      suggestions: [], // No suggestions for now
    };

    return {
      message: aiMessage,
      sessionId: session_id,
    };
  } catch (error) {
    console.error("Chatbot service error:", error);
    
    // Simple fallback response
    const fallbackMessage: Message = {
      id: `${Math.floor(Math.random() * 1000000000)}`,
      type: "ai",
      content: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again in a moment.",
      status: "error" as MessageStatus,
      conversationId: sessionId || "default",
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      suggestions: [],
    };

    return {
      message: fallbackMessage,
      sessionId: sessionId || "fallback-session",
    };
  }
};
