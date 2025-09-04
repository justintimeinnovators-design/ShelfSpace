// src/app/hooks/useShelfSpace.ts
'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { UserSettings } from '../../../types/Settings';
import { Message } from '../../../types/Message';
import {
  initialUserSettings,
  initialMessages,
  initialCurrentlyReading,
  initialRecentActivity,
  initialRecommendations,
  initialReadingGroups
} from '../data/mock-data';

export const useShelfSpace = () => {
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState('general');
  const [settingsTab, setSettingsTab] = useState('profile');
  const [userSettings, setUserSettings] = useState<UserSettings>(initialUserSettings);
  const [currentlyReading, setCurrentlyReading] = useState(initialCurrentlyReading);
  const recentActivity = initialRecentActivity;
  const recommendations = initialRecommendations;
  const readingGroups = initialReadingGroups;

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      import('../../utils/chatbot').then(({ generateAIResponse }) => {
        const aiResponse = generateAIResponse(messageText, messages);
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      });
    }, 1500);
  };

  const handleSettingsUpdate = (section: keyof UserSettings, key: string, value: any) => {
    setUserSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return {
    activeTab,
    setActiveTab,
    isNavigationCollapsed,
    setIsNavigationCollapsed,
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    chatMode,
    setChatMode,
    settingsTab,
    setSettingsTab,
    userSettings,
    handleSettingsUpdate,
    currentlyReading,
    recentActivity,
    recommendations,
    readingGroups,
    handleSendMessage,
    handleSignOut
  };
};