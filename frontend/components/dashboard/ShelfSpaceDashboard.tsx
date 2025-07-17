'use client';

import React, { useState } from 'react';
import { Book } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Navigation from '../layout/Navigation';
import Header from '../layout/Header';
import DashboardContent from './DashboardContent';
import AIAssistantContent from '../chat/AIAssistantContent';
import SettingsLayout from '../settings/SettingsLayout';
import LibraryContent from '../library/LibraryContent';
import DiscoverContent from '../discover/DiscoverContent';
import { UserSettings } from '../../types/Settings';
import { Message } from '../../types/Message';

const ShelfSpaceDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your personal reading assistant. I can help you discover new books, track your reading goals, discuss literature, and answer questions about your library. What would you like to explore today?",
      timestamp: new Date(Date.now() - 300000),
      suggestions: ['Recommend me a book', 'Analyze my reading habits', 'Help me set a reading goal', 'Discuss a book I\'m reading']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState('general'); // general, book-discussion, recommendations, analysis
  const [settingsTab, setSettingsTab] = useState('profile');
  const [userSettings, setUserSettings] = useState<UserSettings>({
    profile: {
      name: 'Alex Reader',
      email: 'alex@example.com',
      avatar: '',
      bio: 'Passionate reader exploring new worlds through books',
      location: 'San Francisco, CA',
      favoriteGenres: ['Fiction', 'Science Fiction', 'Biography']
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'America/Los_Angeles',
      readingReminders: true,
      dailyGoal: 30,
      weeklyGoal: 5,
      monthlyGoal: 4,
      autoMarkAsRead: true,
      showReadingProgress: true,
      publicProfile: false
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      bookRecommendations: true,
      groupUpdates: true,
      reviewReminders: true,
      readingChallenges: true,
      newFollowers: false,
      bookReleases: true
    },
    privacy: {
      publicLibrary: false,
      shareReadingStats: true,
      allowRecommendations: true,
      dataSyncEnabled: true,
      analyticsEnabled: true
    }
  });
  const [currentlyReading, setCurrentlyReading] = useState([
    { id: 1, title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", progress: 65, cover: "📖" },
    { id: 2, title: "Atomic Habits", author: "James Clear", progress: 40, cover: "⚡" },
    { id: 3, title: "Klara and the Sun", author: "Kazuo Ishiguro", progress: 85, cover: "🌞" }
  ]);

  const recentActivity = [
    { id: 1, action: "finished", book: "The Midnight Library", time: "2 hours ago" },
    { id: 2, action: "reviewed", book: "Dune", rating: 5, time: "1 day ago" },
    { id: 3, action: "joined", group: "Sci-Fi Book Club", time: "3 days ago" }
  ];

  const recommendations = [
    { id: 1, title: "Project Hail Mary", author: "Andy Weir", reason: "Based on your love for sci-fi", cover: "🚀" },
    { id: 2, title: "The Thursday Murder Club", author: "Richard Osman", reason: "Mystery lovers also enjoyed", cover: "🔍" },
    { id: 3, title: "Educated", author: "Tara Westover", reason: "Trending in your groups", cover: "🎓" }
  ];

  const readingGroups = [
    { id: 1, name: "Modern Fiction Circle", members: 24, currentBook: "The Seven Moons of Maali Almeida" },
    { id: 2, name: "Productivity & Growth", members: 18, currentBook: "Deep Work" },
    { id: 3, name: "Fantasy Realm", members: 32, currentBook: "The Name of the Wind" }
  ];

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

    // Simulate AI response
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isNavigationCollapsed}
        onToggleCollapse={() => setIsNavigationCollapsed(!isNavigationCollapsed)}
        onSignOut={handleSignOut}
      />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isNavigationCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header 
          userName={userSettings.profile.name}
          userEmail={userSettings.profile.email}
          userAvatar={userSettings.profile.avatar}
          showGreeting={activeTab === 'dashboard'}
          pageTitle={
            activeTab === 'library' ? 'Library' :
            activeTab === 'discover' ? 'Discover' :
            activeTab === 'settings' ? 'Settings' :
            activeTab === 'chat' ? 'Chat' :
            undefined
          }
        />
        {activeTab === 'dashboard' && (
          <DashboardContent 
            currentlyReading={currentlyReading}
            recentActivity={recentActivity}
            recommendations={recommendations}
            readingGroups={readingGroups}
          />
        )}
        {activeTab === 'chat' && (
          <AIAssistantContent 
            messages={messages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            isTyping={isTyping}
            chatMode={chatMode}
            setChatMode={setChatMode}
            handleSendMessage={handleSendMessage}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsLayout 
            settingsTab={settingsTab}
            setSettingsTab={setSettingsTab}
            userSettings={userSettings}
            handleSettingsUpdate={handleSettingsUpdate}
          />
        )}
        {activeTab === 'library' && (
          <LibraryContent />
        )}
        {activeTab === 'discover' && (
          <DiscoverContent />
        )}
        {activeTab !== 'dashboard' && activeTab !== 'chat' && activeTab !== 'settings' && activeTab !== 'library' && activeTab !== 'discover' && (
          <div className="p-6 flex items-center justify-center h-96">
            <div className="text-center text-gray-500">
              <Book className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section</h3>
              <p>This section is ready for implementation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShelfSpaceDashboard;