"use client";

import { useState, useEffect } from "react";
import ProfileSettings from "./ProfileSettings";
import PreferencesSettings from "./PreferencesSettings";
import NotificationsSettings from "./NotificationsSettings";
import PrivacySettings from "./PrivacySettings";
import AccountSettings from "./AccountSettings";

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

const tabs = ["profile", "preferences", "notifications", "privacy", "account"] as const;
type SettingsTab = (typeof tabs)[number];

export default function SettingsLayout() {
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("profile");

  const [userSettings, setUserSettings] = useState<UserSettings>({
    profile: {
      name: "Viral Vaghela",
      email: "viral@example.com",
      bio: "",
      location: "",
      favoriteGenres: [],
    },
    preferences: {
      theme: "auto",
      dailyGoal: 30,
      weeklyGoal: 2,
      monthlyGoal: 5,
      readingReminders: true,
      autoMarkAsRead: false,
      showReadingProgress: true,
      publicProfile: false,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      bookRecommendations: true,
      groupUpdates: true,
      reviewReminders: true,
      readingChallenges: true,
      newFollowers: false,
      bookReleases: true,
    },
    privacy: {
      publicLibrary: false,
      shareReadingStats: true,
      allowRecommendations: true,
      dataSyncEnabled: true,
      analyticsEnabled: false,
    },
  });

  const handleSettingsUpdate = (
    section: keyof UserSettings,
    field: string,
    value: any
  ) => {
    setUserSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("shelfspace-settings");
    if (stored) {
      setUserSettings(JSON.parse(stored));
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("shelfspace-settings", JSON.stringify(userSettings));
  }, [userSettings]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Settings</h2>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSettingsTab(tab)}
            className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
              settingsTab === tab
                ? "bg-indigo-dye-100 text-indigo-dye-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        {settingsTab === "profile" && (
          <ProfileSettings
            userSettings={userSettings}
            handleSettingsUpdate={handleSettingsUpdate}
          />
        )}
        {settingsTab === "preferences" && (
          <PreferencesSettings
            userSettings={userSettings}
            handleSettingsUpdate={handleSettingsUpdate}
          />
        )}
        {settingsTab === "notifications" && (
          <NotificationsSettings
            userSettings={userSettings}
            handleSettingsUpdate={handleSettingsUpdate}
          />
        )}
        {settingsTab === "privacy" && (
          <PrivacySettings
            userSettings={userSettings}
            handleSettingsUpdate={handleSettingsUpdate}
          />
        )}
        {settingsTab === "account" && (
          <AccountSettings
            userSettings={userSettings}
            handleSettingsUpdate={handleSettingsUpdate}
          />
        )}
      </main>
    </div>
  );
}
