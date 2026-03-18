"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Settings as SettingsIcon } from "lucide-react";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/api-utils";

type NotificationChannels = {
  email: Record<string, boolean>;
  push: Record<string, boolean>;
  inApp: Record<string, boolean>;
  sound?: { enabled?: boolean; volume?: number };
};

type PrivacySettings = {
  profile?: { showEmail?: boolean; showLocation?: boolean; showBio?: boolean; showReadingGoal?: boolean };
  reading?: { showCurrentlyReading?: boolean; showReadingProgress?: boolean; showReviews?: boolean; showRatings?: boolean; showReadingHistory?: boolean };
  social?: { allowMessages?: boolean; allowFriendRequests?: boolean; showInSearch?: boolean; showOnlineStatus?: boolean };
  data?: { allowAnalytics?: boolean; allowPersonalization?: boolean; allowMarketing?: boolean };
};

type SettingsBlob = {
  preferences?: { dateFormat?: string; readingGoal?: number; bookFormat?: string; autoSave?: boolean };
  notifications?: NotificationChannels;
  privacy?: PrivacySettings;
  profile?: { location?: string; favoriteGenres?: string[] };
};

/**
 * Preferences Settings.
 */
export function PreferencesSettings() {
  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "en",
    timezone: "America/Los_Angeles",
    dateFormat: "MM/DD/YYYY",
    readingGoal: 24,
    bookFormat: "any",
    autoSave: true,
  });
  const [serverSettings, setServerSettings] = useState<SettingsBlob>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadPreferences = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get("/api/user/preferences");
        const settings: SettingsBlob = data?.settings ?? {};
        const prefOverrides = settings.preferences ?? {};

        if (!isMounted) return;

        setServerSettings(settings);
        setPreferences((prev) => ({
          ...prev,
          theme:
            data?.theme === "LIGHT" ? "light"
            : data?.theme === "DARK" ? "dark"
            : data?.theme === "SYSTEM" ? "system"
            : prev.theme,
          language: data?.language ?? prev.language,
          timezone: data?.timezone ?? prev.timezone,
          dateFormat: prefOverrides.dateFormat ?? prev.dateFormat,
          readingGoal: prefOverrides.readingGoal ?? prev.readingGoal,
          bookFormat: prefOverrides.bookFormat ?? prev.bookFormat,
          autoSave: prefOverrides.autoSave ?? prev.autoSave,
        }));
      } catch (err) {
        const status = (err as any)?.response?.status;
        if (status === 404) { if (isMounted) setServerSettings({}); return; }
        if (isMounted) setError(getErrorMessage(err));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadPreferences();
    return () => { isMounted = false; };
  }, []);

  const handleSave = () => {
    const savePreferences = async () => {
      setIsSaving(true);
      setError(null);
      setSaveMessage(null);
      try {
        const existingSettings = serverSettings ?? {};

        const updatedSettings: SettingsBlob = {
          ...existingSettings,
          preferences: {
            ...existingSettings.preferences,
            dateFormat: preferences.dateFormat,
            readingGoal: preferences.readingGoal,
            bookFormat: preferences.bookFormat,
            autoSave: preferences.autoSave,
          },
        };

        await apiClient.put("/api/user/preferences", {
          theme:
            preferences.theme === "light" ? "LIGHT"
            : preferences.theme === "dark" ? "DARK"
            : "SYSTEM",
          language: preferences.language,
          timezone: preferences.timezone,
          settings: updatedSettings,
        });

        setServerSettings(updatedSettings);
        setSaveMessage("Preferences saved.");
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsSaving(false);
      }
    };
    savePreferences();
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

  return (
    <div className="divide-y divide-amber-100 dark:divide-slate-700">
      {/* Appearance */}
      <div className="pb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold mb-5">
          Appearance
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 dark:text-slate-400 font-medium mb-3">
              Theme
            </label>
            <div className="space-y-2">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "system", label: "System", icon: SettingsIcon },
              ].map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer border transition-colors ${
                    preferences.theme === value
                      ? "border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20"
                      : "border-amber-100 dark:border-slate-700 hover:border-amber-200 dark:hover:border-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={value}
                    checked={preferences.theme === value}
                    onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                    className="text-amber-500 focus:ring-amber-500"
                  />
                  <Icon className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                  <span className="text-sm text-gray-900 dark:text-slate-100">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 dark:text-slate-400 font-medium mb-2">
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-3 py-2.5 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 dark:text-slate-400 font-medium mb-2">
                Date Format
              </label>
              <select
                value={preferences.dateFormat}
                onChange={(e) => setPreferences(prev => ({ ...prev, dateFormat: e.target.value }))}
                className="w-full px-3 py-2.5 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Reading */}
      <div className="py-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold mb-5">
          Reading
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 dark:text-slate-400 font-medium mb-2">
              Annual goal
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="200"
                value={preferences.readingGoal}
                onChange={(e) => setPreferences(prev => ({ ...prev, readingGoal: parseInt(e.target.value) || 1 }))}
                className="w-24 px-3 py-2.5 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
              />
              <span className="text-sm text-gray-500 dark:text-slate-400">books / year</span>
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 dark:text-slate-400 font-medium mb-2">
              Preferred format
            </label>
            <select
              value={preferences.bookFormat}
              onChange={(e) => setPreferences(prev => ({ ...prev, bookFormat: e.target.value }))}
              className="w-full px-3 py-2.5 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            >
              <option value="any">Any format</option>
              <option value="physical">Physical books</option>
              <option value="ebook">E-books</option>
              <option value="audiobook">Audiobooks</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-amber-100 dark:border-slate-700">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100">Auto-save progress</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Automatically save your reading progress</p>
          </div>
          <Toggle
            enabled={preferences.autoSave}
            onToggle={() => setPreferences(prev => ({ ...prev, autoSave: !prev.autoSave }))}
          />
        </div>
      </div>

      {/* Save */}
      <div className="pt-6 flex items-center justify-end gap-4">
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {saveMessage && <p className="text-sm text-emerald-600 dark:text-emerald-400">{saveMessage}</p>}
        <button
          onClick={handleSave}
          disabled={isLoading || isSaving}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg transition-colors text-sm font-medium"
        >
          {isSaving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
