"use client";

import { useState } from "react";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { PreferencesSettings } from "@/components/settings/PreferencesSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { NotificationsSettings } from "@/components/settings/NotificationsSettings";
import {
  User,
  Bell,
  Shield,
  Settings as SettingsIcon,
  Palette,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "account", label: "Account", icon: Lock },
  ];

  const renderSettingsContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "preferences":
        return <PreferencesSettings />;
      case "notifications":
        return <NotificationsSettings />;
      case "privacy":
        return <PrivacySettings />;
      case "account":
        return <AccountSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative z-10">
      <div className="relative container mx-auto px-4 py-8 z-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6">
            <SettingsIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-slate-100 mb-6 font-serif">
            Settings
          </h1>
          <p className="text-xl text-gray-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Customize your reading experience and manage your account preferences.
          </p>
        </div>

        {/* Top Navigation Bar */}
        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 mb-8 overflow-hidden">
          <div className="flex flex-wrap">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 transition-all duration-200 border-b-2 ${
                  activeTab === id
                    ? "bg-amber-50 dark:bg-slate-700 text-amber-700 dark:text-amber-300 border-amber-500"
                    : "text-gray-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-slate-700 hover:text-amber-600 dark:hover:text-amber-200 border-transparent"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-8">
          {renderSettingsContent()}
        </div>
      </div>
    </div>
  );
}