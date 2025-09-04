
'use client';

import React from 'react';
import { Book } from 'lucide-react';
import DashboardContent from './DashboardContent';
import AIAssistantContent from '../chat/AIAssistantContent';
import SettingsLayout from '../settings/SettingsLayout';
import LibraryContent from '../library/LibraryContent';
import DiscoverContent from '../discover/DiscoverContent';
import GroupsContent from '../groups/GroupsContent';
import { useShelfSpace } from '../../app/hooks/useShelfSpace';

interface DashboardRouterProps {
  activeTab: string;
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({ activeTab }) => {
  const {
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
  } = useShelfSpace();

  switch (activeTab) {
    case 'dashboard':
      return <DashboardContent 
                currentlyReading={currentlyReading}
                recentActivity={recentActivity}
                recommendations={recommendations}
                readingGroups={readingGroups}
              />;
    case 'chat':
      return <AIAssistantContent 
                messages={messages}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                isTyping={isTyping}
                chatMode={chatMode}
                setChatMode={setChatMode}
                handleSendMessage={handleSendMessage}
              />;
    case 'settings':
      return <SettingsLayout 
                settingsTab={settingsTab}
                setSettingsTab={setSettingsTab}
                userSettings={userSettings}
                handleSettingsUpdate={handleSettingsUpdate}
              />;
    case 'library':
      return <LibraryContent />;
    case 'discover':
      return <DiscoverContent />;
    case 'groups':
      return <GroupsContent />;
    default:
      return (
        <div className="p-8 flex items-center justify-center h-96">
          <div className="text-center text-gray-500">
            <Book className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section</h3>
            <p>This section is ready for implementation</p>
          </div>
        </div>
      );
  }
};

export default DashboardRouter;
