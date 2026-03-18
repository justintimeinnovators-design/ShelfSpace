"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/api-utils";

type PrivacySettingsState = {
  profile: { showEmail: boolean; showLocation: boolean; showBio: boolean; showReadingGoal: boolean };
  reading: { showCurrentlyReading: boolean; showReadingProgress: boolean; showReviews: boolean; showRatings: boolean; showReadingHistory: boolean };
  social: { allowMessages: boolean; allowFriendRequests: boolean; showInSearch: boolean; showOnlineStatus: boolean };
  data: { allowAnalytics: boolean; allowPersonalization: boolean; allowMarketing: boolean };
};

type SettingsBlob = { privacy?: PrivacySettingsState };

/**
 * Privacy Settings.
 */
export function PrivacySettings() {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettingsState>({
    profile: { showEmail: false, showLocation: true, showBio: true, showReadingGoal: true },
    reading: { showCurrentlyReading: true, showReadingProgress: true, showReviews: true, showRatings: true, showReadingHistory: false },
    social: { allowMessages: true, allowFriendRequests: true, showInSearch: true, showOnlineStatus: true },
    data: { allowAnalytics: true, allowPersonalization: true, allowMarketing: false },
  });
  const [serverSettings, setServerSettings] = useState<SettingsBlob>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get("/api/user/preferences");
        const settings: SettingsBlob = data?.settings ?? {};
        if (settings.privacy && isMounted) setPrivacySettings(settings.privacy);
        if (isMounted) setServerSettings(settings);
      } catch (err) {
        const status = (err as any)?.response?.status;
        if (status === 404) { if (isMounted) setServerSettings({}); return; }
        if (isMounted) setError(getErrorMessage(err));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadSettings();
    return () => { isMounted = false; };
  }, []);

  const handleToggle = (category: 'profile' | 'reading' | 'social' | 'data', setting: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [setting]: !(prev[category] as any)[setting] },
    }));
  };

  const handleSave = () => {
    const saveSettings = async () => {
      setIsSaving(true);
      setError(null);
      setSaveMessage(null);
      try {
        const updatedSettings: SettingsBlob = { ...serverSettings, privacy: privacySettings };
        await apiClient.put("/api/user/preferences", { settings: updatedSettings });
        setServerSettings(updatedSettings);
        setSaveMessage("Saved.");
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsSaving(false);
      }
    };
    saveSettings();
  };

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
        enabled ? "bg-amber-500" : "bg-gray-200 dark:bg-slate-600"
      }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );

  const ToggleGroup = ({
    title,
    rows,
    category,
  }: {
    title: string;
    rows: { key: string; label: string; desc: string }[];
    category: 'profile' | 'reading' | 'social' | 'data';
  }) => (
    <div className="py-8">
      <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold mb-4">
        {title}
      </p>
      <div className="divide-y divide-amber-50 dark:divide-slate-700/50">
        {rows.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{label}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">{desc}</p>
            </div>
            <Toggle
              enabled={(privacySettings[category] as any)[key]}
              onToggle={() => handleToggle(category, key)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="divide-y divide-amber-100 dark:divide-slate-700">
      <ToggleGroup
        title="Profile"
        category="profile"
        rows={[
          { key: "showEmail", label: "Show email address", desc: "Display your email on your profile" },
          { key: "showLocation", label: "Show location", desc: "Display your location information" },
          { key: "showBio", label: "Show bio", desc: "Display your personal bio" },
          { key: "showReadingGoal", label: "Show reading goal", desc: "Display your annual reading goal" },
        ]}
      />
      <ToggleGroup
        title="Reading Activity"
        category="reading"
        rows={[
          { key: "showCurrentlyReading", label: "Show currently reading", desc: "Display books you're currently reading" },
          { key: "showReadingProgress", label: "Show reading progress", desc: "Display your reading progress on books" },
          { key: "showReviews", label: "Show reviews", desc: "Make your book reviews visible to others" },
          { key: "showRatings", label: "Show ratings", desc: "Display your book ratings" },
          { key: "showReadingHistory", label: "Show reading history", desc: "Display your complete reading history" },
        ]}
      />
      <ToggleGroup
        title="Social"
        category="social"
        rows={[
          { key: "allowMessages", label: "Allow messages", desc: "Let other users send you messages" },
          { key: "allowFriendRequests", label: "Allow friend requests", desc: "Let others send you friend requests" },
          { key: "showInSearch", label: "Show in search", desc: "Make your profile discoverable in search" },
          { key: "showOnlineStatus", label: "Show online status", desc: "Display when you're online" },
        ]}
      />
      <ToggleGroup
        title="Data"
        category="data"
        rows={[
          { key: "allowAnalytics", label: "Allow analytics", desc: "Help improve the app with anonymous usage data" },
          { key: "allowPersonalization", label: "Allow personalisation", desc: "Use your data to personalise your experience" },
          { key: "allowMarketing", label: "Allow marketing", desc: "Receive promotional emails and offers" },
        ]}
      />

      {/* Save */}
      <div className="pt-6 flex items-center justify-end gap-4">
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {saveMessage && <p className="text-sm text-emerald-600 dark:text-emerald-400">{saveMessage}</p>}
        <button
          onClick={handleSave}
          disabled={isLoading || isSaving}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg transition-colors text-sm font-medium"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
