
'use client';

import React from 'react';
import { Message } from '../../../types/Message';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  handleSendMessage: (messageText?: string) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isTyping, handleSendMessage }) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onSuggestionClick={handleSendMessage}
        />
      ))}

      {isTyping && <TypingIndicator />}
    </div>
  );
};

export default ChatMessages;
