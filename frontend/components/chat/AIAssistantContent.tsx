"use client";
import { Award, Book, MessageCircle, TrendingUp } from "lucide-react";
import { Message } from "../../types/Message";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import QuickActions from "./QuickActions";

interface AIAssistantContentProps {
  messages: Message[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  isTyping: boolean;
  chatMode: string;
  setChatMode: (mode: string) => void;
  handleSendMessage: (messageText?: string) => void;
}

export default function AIAssistantContent({
  messages,
  inputMessage,
  setInputMessage,
  isTyping,
  chatMode,
  setChatMode,
  handleSendMessage
}: AIAssistantContentProps) {

  return (
    <div className="p-6 h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Shelf AI</h2>
                <p className="text-sm text-gray-600">Your personal book companion</p>
              </div>
              {/* Chat Mode Selector moved here */}
              <div className="flex space-x-2 ml-4">
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
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>
        {/* Removed old Chat Mode Selector below header */}
      </div>

      {/* Chat Box */}
      <div className="flex-1 bg-white rounded-xl shadow-md flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[500px]">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onSuggestionClick={handleSendMessage}
            />
          ))}

          {isTyping && <TypingIndicator />}
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
          <QuickActions onActionClick={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
