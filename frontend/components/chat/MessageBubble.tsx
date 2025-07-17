import React from 'react';
import { Message } from '../../types/Message';
import { formatTime } from '../../utils/chatbot';

interface MessageBubbleProps {
  message: Message;
  onSuggestionClick?: (suggestion: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onSuggestionClick }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <div
          className={`flex items-center mt-1 text-xs text-gray-500 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <span>{formatTime(message.timestamp)}</span>
        </div>

        {!isUser && message.suggestions && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestionClick?.(suggestion)}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
          isUser
            ? 'bg-gradient-to-r from-indigo-dye-500 to-safety-orange-500 text-white order-1 ml-3'
            : 'bg-gradient-to-r from-verdigris-500 to-indigo-dye-500 text-white order-2 mr-3'
        }`}
      >
        {isUser ? 'U' : 'AI'}
      </div>
    </div>
  );
};

export default MessageBubble;
