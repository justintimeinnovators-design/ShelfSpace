"use client";

import { useState } from "react";
import {
  Bell,
  Mail,
  MessageCircle,
  Volume2,
  VolumeX,
} from "lucide-react";

export function NotificationsSettings() {
  const [notifications, setNotifications] = useState({
    email: {
      newMessages: true,
      groupUpdates: true,
      bookRecommendations: false,
      readingReminders: true,
      weeklyDigest: true,
    },
    push: {
      newMessages: true,
      groupUpdates: false,
      bookRecommendations: true,
      readingReminders: false,
      weeklyDigest: false,
    },
    inApp: {
      newMessages: true,
      groupUpdates: true,
      bookRecommendations: true,
      readingReminders: true,
      weeklyDigest: true,
    },
    sound: {
      enabled: true,
      volume: 70,
    },
  });

  const handleToggle = (category: keyof typeof notifications, setting: string) => {
    setNotifications(prev => {
      const categorySettings = prev[category];
      return {
        ...prev,
        [category]: {
          ...categorySettings,
          [setting]: !(categorySettings as Record<string, boolean | number>)[setting],
        },
      };
    });
  };

  const handleVolumeChange = (volume: number) => {
    setNotifications(prev => ({
      ...prev,
      sound: {
        ...prev.sound,
        volume,
      },
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 font-serif mb-2">
          Notification Preferences
        </h2>
        <p className="text-gray-600 dark:text-slate-400">
          Choose how you want to be notified about activities and updates.
        </p>
      </div>

      {/* Email Notifications */}
      <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl border border-amber-200 dark:border-slate-600 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              Email Notifications
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Receive notifications via email
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: "newMessages", label: "New Messages", desc: "When someone sends you a message" },
            { key: "groupUpdates", label: "Group Updates", desc: "When your groups have new discussions" },
            { key: "bookRecommendations", label: "Book Recommendations", desc: "Personalized book suggestions" },
            { key: "readingReminders", label: "Reading Reminders", desc: "Daily reading goal reminders" },
            { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary of your reading activity" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-slate-100">{label}</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">{desc}</p>
              </div>
              <button
                onClick={() => handleToggle("email", key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.email[key as keyof typeof notifications.email]
                    ? "bg-amber-500"
                    : "bg-gray-300 dark:bg-slate-500"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.email[key as keyof typeof notifications.email]
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl border border-amber-200 dark:border-slate-600 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              Push Notifications
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Receive notifications on your device
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: "newMessages", label: "New Messages", desc: "When someone sends you a message" },
            { key: "groupUpdates", label: "Group Updates", desc: "When your groups have new discussions" },
            { key: "bookRecommendations", label: "Book Recommendations", desc: "Personalized book suggestions" },
            { key: "readingReminders", label: "Reading Reminders", desc: "Daily reading goal reminders" },
            { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary of your reading activity" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-slate-100">{label}</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">{desc}</p>
              </div>
              <button
                onClick={() => handleToggle("push", key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.push[key as keyof typeof notifications.push]
                    ? "bg-amber-500"
                    : "bg-gray-300 dark:bg-slate-500"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.push[key as keyof typeof notifications.push]
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* In-App Notifications */}
      <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl border border-amber-200 dark:border-slate-600 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              In-App Notifications
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Show notifications within the app
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: "newMessages", label: "New Messages", desc: "When someone sends you a message" },
            { key: "groupUpdates", label: "Group Updates", desc: "When your groups have new discussions" },
            { key: "bookRecommendations", label: "Book Recommendations", desc: "Personalized book suggestions" },
            { key: "readingReminders", label: "Reading Reminders", desc: "Daily reading goal reminders" },
            { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary of your reading activity" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-slate-100">{label}</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">{desc}</p>
              </div>
              <button
                onClick={() => handleToggle("inApp", key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.inApp[key as keyof typeof notifications.inApp]
                    ? "bg-amber-500"
                    : "bg-gray-300 dark:bg-slate-500"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.inApp[key as keyof typeof notifications.inApp]
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sound Settings */}
      <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl border border-amber-200 dark:border-slate-600 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
            {notifications.sound.enabled ? (
              <Volume2 className="h-5 w-5 text-white" />
            ) : (
              <VolumeX className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              Sound Settings
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Control notification sounds
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-slate-100">Enable Sounds</h4>
              <p className="text-sm text-gray-600 dark:text-slate-400">Play sounds for notifications</p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({
                ...prev,
                sound: { ...prev.sound, enabled: !prev.sound.enabled }
              }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.sound.enabled ? "bg-amber-500" : "bg-gray-300 dark:bg-slate-500"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.sound.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {notifications.sound.enabled && (
            <div className="p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-slate-100">Volume</h4>
                <span className="text-sm text-gray-600 dark:text-slate-400">
                  {notifications.sound.volume}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={notifications.sound.volume}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-slate-500 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-amber-200 dark:border-slate-600">
        <button className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium">
          Save Notification Settings
        </button>
      </div>
    </div>
  );
}