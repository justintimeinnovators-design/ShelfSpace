"use client";
import { useState } from "react";
import { Award, Book, MessageCircle, TrendingUp } from "lucide-react";
import { formatTime, generateAIResponse } from "@/utils/chatbot";
import { Message } from "../../types/Message";

export default function AIAssistantContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState("general");

  const handleSendMessage = (messageText?: string) => {
    const content = messageText || inputMessage;
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="p-6 h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">AI Reading Assistant</h2>
              <p className="text-sm text-gray-600">Your personal book companion</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>

        {/* Chat Mode Selector */}
        <div className="flex space-x-2">
          {[
            { id: "general", label: "General", icon: MessageCircle },
            { id: "recommendations", label: "Recommendations", icon: TrendingUp },
            { id: "analysis", label: "Reading Analysis", icon: Award },
            { id: "discussion", label: "Book Discussion", icon: Book },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setChatMode(mode.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                chatMode === mode.id
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <mode.icon className="w-4 h-4" />
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Box */}
      <div className="flex-1 bg-white rounded-xl shadow-md flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[500px]">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <div
                  className={`flex items-center mt-1 text-xs text-gray-500 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <span>{formatTime(message.timestamp)}</span>
                </div>

                {message.type === "ai" && message.suggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((sug: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(sug)}
                          className="..."
                        >
                          {sug}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-indigo-dye-500 to-safety-orange-500 text-white order-1 ml-3"
                                          : "bg-gradient-to-r from-verdigris-500 to-indigo-dye-500 text-white order-2 mr-3"
                }`}
              >
                {message.type === "user" ? "U" : "AI"}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  AI
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask me anything about books, reading, or your library..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-purple-500 hover:text-purple-700 disabled:text-gray-300 transition-colors"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[3px] border-y-transparent ml-0.5"></div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 mt-3">
            <span className="text-xs text-gray-500">Quick actions:</span>
            {["Recommend a book", "Set reading goal", "Analyze my habits", "Book discussion"].map((action) => (
              <button
                key={action}
                onClick={() => handleSendMessage(action)}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
