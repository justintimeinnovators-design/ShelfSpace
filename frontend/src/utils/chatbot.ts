import axios from "axios";
import { Message } from "@/types";

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
        },
        timeout: 10000, // 10 second timeout
      }
    );
    const { answer, session_id } = response.data;

    const aiMessage: Message = {
      id: Math.floor(Math.random() * 1000000000),
      type: "ai",
      content: answer,
      timestamp: new Date(),
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
      id: Math.floor(Math.random() * 1000000000),
      type: "ai",
      content: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again in a moment.",
      timestamp: new Date(),
      suggestions: [],
    };

    return {
      message: fallbackMessage,
      sessionId: sessionId || "fallback-session",
    };
  }
};
