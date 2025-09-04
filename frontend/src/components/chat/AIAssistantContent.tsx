'use client';

import React from 'react';
import { Message } from '../../../types/Message';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

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
      <ChatHeader chatMode={chatMode} setChatMode={setChatMode} />

      {/* Chat Box */}
      <div className="flex-1 bg-white rounded-xl shadow-md flex flex-col h-0 min-h-0">
        <ChatMessages 
          messages={messages} 
          isTyping={isTyping} 
          handleSendMessage={handleSendMessage} 
        />

        <ChatInput 
          inputMessage={inputMessage} 
          setInputMessage={setInputMessage} 
          handleSendMessage={handleSendMessage} 
        />
      </div>
    </div>
  );
}