'use client';

import React from 'react';
import ProfileSettings from "./ProfileSettings";
import PreferencesSettings from "./PreferencesSettings";
import NotificationsSettings from "./NotificationsSettings";
import PrivacySettings from "./PrivacySettings";
import AccountSettings from "./AccountSettings";
import SettingsSidebar from './SettingsSidebar';

export type UserSettings = {
  profile: {
    name: string;
    email: string;
    bio: string;
    location: string;
    favoriteGenres: string[];
  };
  preferences: {
    theme: "light" | "dark" | "auto";
    dailyGoal: number;
    weeklyGoal: number;
    monthlyGoal: number;
    readingReminders: boolean;
    autoMarkAsRead: boolean;
    showReadingProgress: boolean;
    publicProfile: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    bookRecommendations: boolean;
    groupUpdates: boolean;
    reviewReminders: boolean;
    readingChallenges: boolean;
    newFollowers: boolean;
    bookReleases: boolean;
  };
  privacy: {
    publicLibrary: boolean;
    shareReadingStats: boolean;
    allowRecommendations: boolean;
    dataSyncEnabled: boolean;
    analyticsEnabled: boolean;
  };
};

interface SettingsLayoutProps {
  settingsTab: string;
  setSettingsTab: (tab: string) => void;
  userSettings: UserSettings;
  handleSettingsUpdate: (section: keyof UserSettings, key: string, value: any) => void;
}

export default function SettingsLayout({
  settingsTab,
  setSettingsTab,
  userSettings,
  handleSettingsUpdate
}: SettingsLayoutProps) {

  const renderContent = () => {
    switch (settingsTab) {
      case "profile":
        return <ProfileSettings userSettings={userSettings} handleSettingsUpdate={handleSettingsUpdate} />;
      case "preferences":
        return <PreferencesSettings userSettings={userSettings} handleSettingsUpdate={handleSettingsUpdate} />;
      case "notifications":
        return <NotificationsSettings userSettings={userSettings} handleSettingsUpdate={handleSettingsUpdate} />;
      case "privacy":
        return <PrivacySettings userSettings={userSettings} handleSettingsUpdate={handleSettingsUpdate} />;
      case "account":
        return <AccountSettings userSettings={userSettings} handleSettingsUpdate={handleSettingsUpdate} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SettingsSidebar settingsTab={settingsTab} setSettingsTab={setSettingsTab} />

      {/* Content */}
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
}