"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/api-utils";

type NotificationSettings = {
  email: { newMessages: boolean; groupUpdates: boolean; bookRecommendations: boolean; readingReminders: boolean; weeklyDigest: boolean };
  push: { newMessages: boolean; groupUpdates: boolean; bookRecommendations: boolean; readingReminders: boolean; weeklyDigest: boolean };
  inApp: { newMessages: boolean; groupUpdates: boolean; bookRecommendations: boolean; readingReminders: boolean; weeklyDigest: boolean };
  sound: { enabled: boolean; volume: number };
};

type SettingsBlob = { notifications?: NotificationSettings };

const notificationRows = [
  { key: "newMessages", label: "New messages", desc: "When someone sends you a message" },
  { key: "groupUpdates", label: "Forum updates", desc: "New discussions in your forums" },
  { key: "bookRecommendations", label: "Recommendations", desc: "Personalised book suggestions" },
  { key: "readingReminders", label: "Reading reminders", desc: "Daily reading goal reminders" },
  { key: "weeklyDigest", label: "Weekly digest", desc: "Summary of your reading activity" },
];

/**
 * Notifications Settings.
 */
export function NotificationsSettings() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: { newMessages: true, groupUpdates: true, bookRecommendations: false, readingReminders: true, weeklyDigest: true },
    push: { newMessages: true, groupUpdates: false, bookRecommendations: true, readingReminders: false, weeklyDigest: false },
    inApp: { newMessages: true, groupUpdates: true, bookRecommendations: true, readingReminders: true, weeklyDigest: true },
    sound: { enabled: true, volume: 70 },
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
        if (settings.notifications && isMounted) setNotifications(settings.notifications);
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

  const handleToggle = (category: keyof typeof notifications, setting: string) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !(prev[category] as Record<string, boolean | number>)[setting],
      },
    }));
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

  const NotificationGroup = ({
    title,
    category,
  }: {
    title: string;
    category: "email" | "push" | "inApp";
  }) => (
    <div className="py-8">
      <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold mb-4">
        {title}
      </p>
      <div className="divide-y divide-amber-50 dark:divide-slate-700/50">
        {notificationRows.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{label}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">{desc}</p>
            </div>
            <Toggle
              enabled={notifications[category][key as keyof typeof notifications.email]}
              onToggle={() => handleToggle(category, key)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="divide-y divide-amber-100 dark:divide-slate-700">
      <NotificationGroup title="Email" category="email" />
      <NotificationGroup title="Push" category="push" />
      <NotificationGroup title="In-App" category="inApp" />

      {/* Sound */}
      <div className="py-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold mb-4">
          Sound
        </p>
        <div className="divide-y divide-amber-50 dark:divide-slate-700/50">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-slate-100">Enable sounds</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">Play sounds for notifications</p>
            </div>
            <Toggle
              enabled={notifications.sound.enabled}
              onToggle={() => setNotifications(prev => ({ ...prev, sound: { ...prev.sound, enabled: !prev.sound.enabled } }))}
            />
          </div>

          {notifications.sound.enabled && (
            <div className="py-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100">Volume</p>
                <span className="text-xs text-gray-500 dark:text-slate-400">{notifications.sound.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={notifications.sound.volume}
                onChange={(e) => setNotifications(prev => ({ ...prev, sound: { ...prev.sound, volume: parseInt(e.target.value) } }))}
                className="w-full h-1.5 bg-amber-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Save */}
      <div className="pt-6 flex items-center justify-end gap-4">
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {saveMessage && <p className="text-sm text-emerald-600 dark:text-emerald-400">{saveMessage}</p>}
        <button
          disabled={isLoading || isSaving}
          onClick={async () => {
            setIsSaving(true);
            setError(null);
            setSaveMessage(null);
            try {
              const updatedSettings: SettingsBlob = { ...serverSettings, notifications };
              await apiClient.put("/api/user/preferences", { settings: updatedSettings });
              setServerSettings(updatedSettings);
              setSaveMessage("Saved.");
            } catch (err) {
              setError(getErrorMessage(err));
            } finally {
              setIsSaving(false);
            }
          }}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg transition-colors text-sm font-medium"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
