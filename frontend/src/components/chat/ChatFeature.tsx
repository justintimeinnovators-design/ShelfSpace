"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ChatErrorFallback } from "@/components/common/ErrorFallbacks/ChatErrorFallback";
import { useChatState } from "@/hooks/chat/useChatState";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  MessageCircle, 
  Send, 
  Trash2, 
  BookOpen,
  User,
  Menu,
  X,
  History
} from "lucide-react";

export interface ChatFeatureProps {
  className?: string;
}

export function ChatFeature({ className }: ChatFeatureProps) {
  const {
    messages,
    inputMessage,
    isTyping,
    isLoading,
    error,
    actions,
  } = useChatState();

  const { actualTheme } = useTheme();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Mock chat history data
  const chatHistory = [
    { id: 1, title: "Book Recommendations", preview: "Can you suggest some fantasy novels?", timestamp: "2 hours ago" },
    { id: 2, title: "Writing Help", preview: "Help me brainstorm ideas for a sci-fi novel", timestamp: "1 day ago" },
    { id: 3, title: "Literary Analysis", preview: "Explain the themes in 1984", timestamp: "3 days ago" },
    { id: 4, title: "Reading Goals", preview: "How can I read more books this year?", timestamp: "1 week ago" },
  ];

  return (
    <ErrorBoundary fallback={ChatErrorFallback}>
      <div className={`h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 ${className || ""}`}>
        {/* Decorative book-themed background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl opacity-5 dark:opacity-10">💬</div>
          <div className="absolute top-40 right-20 text-4xl opacity-5 dark:opacity-10">📚</div>
          <div className="absolute bottom-20 left-1/4 text-5xl opacity-5 dark:opacity-10">✍️</div>
          <div className="absolute bottom-40 right-1/3 text-3xl opacity-5 dark:opacity-10">✨</div>
        </div>

        <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Chat Container */}
          <div className="h-full bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-slate-700 overflow-hidden flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 dark:from-slate-700 dark:to-slate-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 dark:bg-slate-500/30 rounded-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white font-serif">
                      ShelfAI
                    </h2>
                    <p className="text-sm text-amber-100 dark:text-slate-300">
                      Your literary companion
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/20 dark:hover:bg-slate-500/30 transition-colors duration-200 rounded-lg"
                    title="Chat history"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => actions.clearMessages()}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/20 dark:hover:bg-slate-500/30 transition-colors duration-200 rounded-lg"
                    title="Clear conversation"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Chat History Sidebar */}
              {isHistoryOpen && (
                <div className="w-80 border-r border-amber-200 dark:border-slate-700 bg-gradient-to-b from-amber-50/50 to-orange-50/50 dark:from-slate-800/50 dark:to-slate-700/50 flex flex-col">
                  <div className="p-4 border-b border-amber-200 dark:border-slate-700 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-serif">
                        Chat History
                      </h3>
                      <button
                        onClick={() => setIsHistoryOpen(false)}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {chatHistory.map((chat) => (
                      <div
                        key={chat.id}
                        className="p-3 bg-white/80 dark:bg-slate-700/80 rounded-lg border border-amber-200 dark:border-slate-600 hover:bg-amber-50/80 dark:hover:bg-slate-600/80 transition-colors duration-200 cursor-pointer"
                      >
                        <div className="flex items-start space-x-2">
                          <History className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">
                              {chat.title}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-slate-300 truncate mt-1">
                              {chat.preview}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                              {chat.timestamp}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6">
                          <BookOpen className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3 font-serif">
                          Welcome to ShelfAI
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-slate-300 italic">
                          "The more that you read, the more things you will know. The more that you learn, the more places you'll go." - Dr. Seuss
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`flex items-start space-x-3 max-w-4xl ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                            {/* Avatar */}
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                              message.type === "user" 
                                ? "bg-gradient-to-br from-indigo-500 to-purple-600" 
                                : "bg-gradient-to-br from-amber-400 to-orange-500"
                            }`}>
                              {message.type === "user" ? (
                                <User className="h-5 w-5 text-white" />
                              ) : (
                                <BookOpen className="h-5 w-5 text-white" />
                              )}
                            </div>
                            
                            {/* Message Bubble */}
                            <div className={`flex-1 ${
                              message.type === "user" ? "flex justify-end" : "flex justify-start"
                            }`}>
                              <div className={`px-6 py-4 rounded-2xl shadow-lg max-w-3xl relative ${
                                message.type === "user"
                                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                                  : "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-700 dark:to-slate-600 text-gray-900 dark:text-slate-100 border border-amber-200 dark:border-slate-600"
                              }`}>
                                {/* Message tail */}
                                <div className={`absolute top-4 w-0 h-0 ${
                                  message.type === "user" 
                                    ? "right-[-8px] border-l-[8px] border-l-indigo-500" 
                                    : "left-[-8px] border-r-[8px] border-r-amber-200 dark:border-r-slate-600"
                                } border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent`}></div>
                                
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                  {message.type === "ai" ? (
                                    <ReactMarkdown
                                      components={{
                                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                                        strong: ({ children }) => <strong className="font-semibold text-amber-600 dark:text-amber-400">{children}</strong>,
                                        em: ({ children }) => <em className="italic text-blue-600 dark:text-blue-400">{children}</em>,
                                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                        li: ({ children }) => <li className="text-gray-700 dark:text-slate-300">{children}</li>,
                                        h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-gray-900 dark:text-slate-100">{children}</h1>,
                                        h2: ({ children }) => <h2 className="text-base font-semibold mb-2 text-gray-900 dark:text-slate-100">{children}</h2>,
                                        h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 text-gray-900 dark:text-slate-100">{children}</h3>,
                                      }}
                                    >
                                      {message.content}
                                    </ReactMarkdown>
                                  ) : (
                                    <p className="mb-0 leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                  )}
                                </div>
                                
                                {/* Message timestamp */}
                                <div className={`text-xs mt-2 opacity-70 ${
                                  message.type === "user" ? "text-indigo-100" : "text-gray-500 dark:text-slate-400"
                                }`}>
                                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                              <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-700 dark:to-slate-600 px-6 py-4 rounded-2xl shadow-lg border border-amber-200 dark:border-slate-600 relative">
                              <div className="absolute top-4 left-[-8px] w-0 h-0 border-r-[8px] border-r-amber-200 dark:border-r-slate-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"></div>
                              <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                </div>
                                <span className="text-sm text-gray-600 dark:text-slate-300 italic">ShelfAI is thinking...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="border-t border-amber-200 dark:border-slate-700 p-6 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-slate-800/50 dark:to-slate-700/50">
                  <div className="flex items-end space-x-4">
                    <div className="flex-1">
                      <textarea
                        value={inputMessage}
                        onChange={(e) => actions.setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            actions.sendMessage();
                          }
                        }}
                        placeholder="Ask ShelfAI about books, writing, or literary topics..."
                        className="w-full px-4 py-3 border border-amber-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 resize-none min-h-[50px] max-h-32 shadow-sm"
                        disabled={isLoading}
                        rows={1}
                      />
                    </div>
                    <button
                      onClick={() => actions.sendMessage()}
                      disabled={!inputMessage?.trim() || isLoading}
                      className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-3 text-xs text-gray-500 dark:text-slate-400">
                    Press Enter to send, Shift+Enter for new line
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ChatFeature;