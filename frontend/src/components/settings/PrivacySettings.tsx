"use client";

import { useState } from "react";
import {
  Shield,
  Eye,
  Users,
  BookOpen,
  CheckCircle,
} from "lucide-react";

export function PrivacySettings() {
  const [privacySettings, setPrivacySettings] = useState({
    profile: {
      showEmail: false,
      showLocation: true,
      showBio: true,
      showReadingGoal: true,
    },
    reading: {
      showCurrentlyReading: true,
      showReadingProgress: true,
      showReviews: true,
      showRatings: true,
      showReadingHistory: false,
    },
    social: {
      allowMessages: true,
      allowFriendRequests: true,
      showInSearch: true,
      showOnlineStatus: true,
    },
    data: {
      allowAnalytics: true,
      allowPersonalization: true,
      allowMarketing: false,
    },
  });

  const handleToggle = (category: 'profile' | 'reading' | 'social' | 'data', setting: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !(prev[category] as any)[setting],
      },
    }));
  };

  const handleSave = () => {
    console.log("Saving privacy settings:", privacySettings);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 font-serif mb-2">
          Privacy Controls
        </h2>
        <p className="text-gray-600 dark:text-slate-400">
          Control your privacy and what information is visible to others.
        </p>
      </div>

      {/* Profile Privacy */}
      <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl border border-amber-200 dark:border-slate-600 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
            <Eye className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              Profile Privacy
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Control what information is visible on your profile
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: "showEmail", label: "Show Email Address", desc: "Display your email on your profile" },
            { key: "showLocation", label: "Show Location", desc: "Display your location information" },
            { key: "showBio", label: "Show Bio", desc: "Display your personal bio" },
            { key: "showReadingGoal", label: "Show Reading Goal", desc: "Display your annual reading goal" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-slate-100">{label}</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">{desc}</p>
              </div>
              <button
                onClick={() => handleToggle("profile", key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacySettings.profile[key as keyof typeof privacySettings.profile]
                    ? "bg-amber-500"
                    : "bg-gray-300 dark:bg-slate-500"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings.profile[key as keyof typeof privacySettings.profile]
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reading Activity Privacy */}
      <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl border border-amber-200 dark:border-slate-600 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              Reading Activity Privacy
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Control what reading information others can see
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: "showCurrentlyReading", label: "Show Currently Reading", desc: "Display books you're currently reading" },
            { key: "showReadingProgress", label: "Show Reading Progress", desc: "Display your reading progress on books" },
            { key: "showReviews", label: "Show Reviews", desc: "Make your book reviews visible to others" },
            { key: "showRatings", label: "Show Ratings", desc: "Display your book ratings" },
            { key: "showReadingHistory", label: "Show Reading History", desc: "Display your complete reading history" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-slate-100">{label}</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">{desc}</p>
              </div>
              <button
                onClick={() => handleToggle("reading", key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacySettings.reading[key as keyof typeof privacySettings.reading]
                    ? "bg-amber-500"
                    : "bg-gray-300 dark:bg-slate-500"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings.reading[key as keyof typeof privacySettings.reading]
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Privacy */}
      <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl border border-amber-200 dark:border-slate-600 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              Social Privacy
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Control your social interactions and visibility
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: "allowMessages", label: "Allow Messages", desc: "Let other users send you messages" },
            { key: "allowFriendRequests", label: "Allow Friend Requests", desc: "Let others send you friend requests" },
            { key: "showInSearch", label: "Show in Search", desc: "Make your profile discoverable in search" },
            { key: "showOnlineStatus", label: "Show Online Status", desc: "Display when you're online" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-slate-100">{label}</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">{desc}</p>
              </div>
              <button
                onClick={() => handleToggle("social", key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacySettings.social[key as keyof typeof privacySettings.social]
                    ? "bg-amber-500"
                    : "bg-gray-300 dark:bg-slate-500"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings.social[key as keyof typeof privacySettings.social]
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data & Analytics */}
      <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl border border-amber-200 dark:border-slate-600 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              Data & Analytics
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Control how your data is used for analytics and personalization
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: "allowAnalytics", label: "Allow Analytics", desc: "Help improve the app with anonymous usage data" },
            { key: "allowPersonalization", label: "Allow Personalization", desc: "Use your data to personalize your experience" },
            { key: "allowMarketing", label: "Allow Marketing", desc: "Receive promotional emails and offers" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-slate-100">{label}</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">{desc}</p>
              </div>
              <button
                onClick={() => handleToggle("data", key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacySettings.data[key as keyof typeof privacySettings.data]
                    ? "bg-amber-500"
                    : "bg-gray-300 dark:bg-slate-500"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings.data[key as keyof typeof privacySettings.data]
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Summary */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-700 dark:to-slate-600 rounded-xl border border-amber-200 dark:border-slate-600 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              Privacy Summary
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Your current privacy settings overview
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-slate-100 mb-2">Profile Visibility</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {Object.values(privacySettings.profile).filter(Boolean).length} of 4 settings enabled
            </p>
          </div>
          <div className="p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-slate-100 mb-2">Reading Activity</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {Object.values(privacySettings.reading).filter(Boolean).length} of 5 settings enabled
            </p>
          </div>
          <div className="p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-slate-100 mb-2">Social Features</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {Object.values(privacySettings.social).filter(Boolean).length} of 4 settings enabled
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-amber-200 dark:border-slate-600">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium"
        >
          Save Privacy Settings
        </button>
      </div>
    </div>
  );
}