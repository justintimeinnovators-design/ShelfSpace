"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useGroupChat } from "@/hooks/data/useGroupChat";
import {
  Send,
  Users,
  AlertCircle,
  Loader2,
  ChevronUp,
} from "lucide-react";

interface GroupChatFeatureProps {
  groupId: string;
  groupName?: string;
}

export function GroupChatFeature({ groupId, groupName = "Group" }: GroupChatFeatureProps) {
  const { data: session } = useSession();
  const [inputMessage, setInputMessage] = useState("");
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { messages, isConnected, isLoading, error, sendMessage } = useGroupChat({
    groupId,
    autoJoin: true,
    fetchHistory: true,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isScrolledToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isScrolledToBottom]);

  // Check if user is scrolled to bottom
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsScrolledToBottom(isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSend = async () => {
    if (!inputMessage.trim() || !isConnected) return;

    try {
      await sendMessage(inputMessage);
      setInputMessage("");
    } catch (err) {
      // Error is already handled by the hook
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsScrolledToBottom(true);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 dark:from-slate-700 dark:to-slate-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 dark:bg-slate-500/30 rounded-lg">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-serif">
              {groupName} Chat
            </h3>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-200" : "bg-red-200"
                }`}
              />
              <p className="text-sm text-amber-100 dark:text-slate-300">
                {isConnected ? "Connected" : "Connecting..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 flex items-center gap-2 flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-amber-50/30 to-orange-50/30 dark:from-slate-900/50 dark:to-slate-800/50"
      >
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-slate-400">Loading chat...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Users className="h-12 w-12 text-gray-400 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-slate-400">
                No messages yet. Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwnMessage = message.senderId === session?.user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[75%] ${
                      isOwnMessage ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                        isOwnMessage
                          ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                          : "bg-gradient-to-br from-amber-400 to-orange-500"
                      }`}
                    >
                      {message.senderId === session?.user?.id
                        ? "You"
                        : message.senderId.slice(0, 2).toUpperCase()}
                    </div>

                    {/* Message Bubble */}
                    <div className={`flex-1 ${isOwnMessage ? "flex justify-end" : ""}`}>
                      <div
                        className={`px-4 py-2 rounded-2xl shadow-sm ${
                          isOwnMessage
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                            : "bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 border border-amber-200 dark:border-slate-600"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwnMessage
                              ? "text-indigo-100"
                              : "text-gray-500 dark:text-slate-400"
                          }`}
                        >
                          {message.timestamp instanceof Date
                            ? message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : typeof message.timestamp === "string"
                            ? new Date(message.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : message.createdAt
                            ? new Date(message.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}

        {/* Scroll to bottom button */}
        {!isScrolledToBottom && messages.length > 0 && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-8 p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition-colors"
            aria-label="Scroll to bottom"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-amber-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800 flex-shrink-0">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isConnected
                  ? "Type a message..."
                  : "Connecting to chat..."
              }
              disabled={!isConnected}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 resize-none min-h-[50px] max-h-32 disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputMessage.trim() || !isConnected || isLoading}
            className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:from-amber-500 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

