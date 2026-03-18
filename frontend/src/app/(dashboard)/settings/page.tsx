"use client";

import { useState } from "react";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { PreferencesSettings } from "@/components/settings/PreferencesSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { NotificationsSettings } from "@/components/settings/NotificationsSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { User, Bell, Shield, Palette, Lock } from "lucide-react";

/**
 * Settings Page.
 */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "account", label: "Account", icon: Lock },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile": return <ProfileSettings />;
      case "preferences": return <PreferencesSettings />;
      case "notifications": return <NotificationsSettings />;
      case "privacy": return <PrivacySettings />;
      case "account": return <AccountSettings />;
      default: return <ProfileSettings />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(71,85,105,0.25),transparent_50%)]">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-red-50/80 dark:from-slate-950/80 dark:via-slate-900/80 dark:to-slate-800/80" />
      <div className="relative container mx-auto px-4 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-700/80 dark:text-amber-300/80 font-semibold">
          Account
        </p>
        <h1 className="text-4xl md:text-5xl font-serif font-semibold text-gray-900 dark:text-slate-100 mt-3 mb-10">
          Settings
        </h1>

        <div className="flex gap-0 overflow-x-auto border-b border-amber-200/70 dark:border-slate-700 mb-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px ${
                activeTab === id
                  ? "border-amber-500 text-amber-700 dark:text-amber-300"
                  : "border-transparent text-gray-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-amber-200/70 dark:border-slate-700 p-6 md:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
