import { Message } from "../../types/Message";

export function generateAIResponse(userMessage: string): Message {
  const suggestions = [
    "Give me book suggestions",
    "What should I read next?",
    "Show me productivity books",
  ];

  return {
    id: Date.now() + 1,
    type: "ai",
    content: `You said: "${userMessage}". Here's something to think about.`,
    timestamp: new Date(),
    suggestions,
  };
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
