
'use client';

import React from 'react';
import QuickActions from './QuickActions';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (messageText?: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ inputMessage, setInputMessage, handleSendMessage }) => {
  return (
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
  );
};

export default ChatInput;
