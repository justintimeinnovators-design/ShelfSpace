
'use client';

import React from 'react';
import { Award, Book, MessageCircle, TrendingUp } from 'lucide-react';

interface ChatHeaderProps {
  chatMode: string;
  setChatMode: (mode: string) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatMode, setChatMode }) => {
  return (
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
    </div>
  );
};

export default ChatHeader;
