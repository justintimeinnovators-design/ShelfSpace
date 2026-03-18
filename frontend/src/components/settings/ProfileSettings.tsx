"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getUserDisplayName, getUserInitials } from "@/utils/greetings";
import { MapPin, X, Save } from "lucide-react";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/api-utils";

type SettingsBlob = {
  profile?: {
    location?: string;
    favoriteGenres?: string[];
  };
  preferences?: {
    readingGoal?: number;
    bookFormat?: string;
  };
};

/**
 * Profile Settings.
 */
export function ProfileSettings() {
  const { data: session } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    favoriteGenres: [] as string[],
    avatar: "",
  });
  const [serverSettings, setServerSettings] = useState<SettingsBlob>({});
  const [readingGoal, setReadingGoal] = useState(24);
  const [bookFormat, setBookFormat] = useState("any");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [newGenre, setNewGenre] = useState("");

  useEffect(() => {
    if (session?.user) {
      const displayName = getUserDisplayName(session.user.name, session.user.email);
      const initials = getUserInitials(session.user.name, session.user.email);
      setProfile(prev => ({
        ...prev,
        name: session.user.name || displayName,
        email: session.user.email || "",
        avatar: initials,
      }));
    }
  }, [session]);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [userResult, prefResult] = await Promise.allSettled([
          apiClient.get("/api/user/me"),
          apiClient.get("/api/user/preferences"),
        ]);

        if (userResult.status === "rejected") throw userResult.reason;

        let prefData: any = null;
        if (prefResult.status === "fulfilled") {
          prefData = prefResult.value.data;
        } else if ((prefResult.reason as any)?.response?.status !== 404) {
          throw prefResult.reason;
        }

        const userData = userResult.value.data;
        const settings: SettingsBlob = prefData?.settings ?? {};

        if (!isMounted) return;

        setProfile((prev) => ({
          ...prev,
          name: userData?.name || prev.name,
          email: userData?.email || prev.email,
          bio: userData?.bio || prev.bio,
          location: settings.profile?.location ?? prev.location,
          favoriteGenres: settings.profile?.favoriteGenres ?? prev.favoriteGenres,
        }));
        setReadingGoal(settings.preferences?.readingGoal ?? 24);
        setBookFormat(settings.preferences?.bookFormat ?? "any");
        setServerSettings(settings);
      } catch (err) {
        if (isMounted) setError(getErrorMessage(err));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProfile();
    return () => { isMounted = false; };
  }, []);

  const availableGenres = [
    "Fantasy", "Science Fiction", "Mystery", "Romance", "Thriller",
    "Historical Fiction", "Literary Fiction", "Non-Fiction", "Biography",
    "Self-Help", "Poetry", "Drama", "Horror", "Adventure", "Comedy",
  ];

  const handleSave = () => {
    const saveProfile = async () => {
      setIsSaving(true);
      setError(null);
      setSaveMessage(null);
      try {
        const updatedSettings: SettingsBlob = {
          ...serverSettings,
          profile: {
            ...(serverSettings.profile ?? {}),
            location: profile.location,
            favoriteGenres: profile.favoriteGenres,
          },
          preferences: {
            ...(serverSettings.preferences ?? {}),
            readingGoal,
            bookFormat,
          },
        };

        await Promise.all([
          apiClient.patch("/api/user/me", { name: profile.name, bio: profile.bio }),
          apiClient.put("/api/user/preferences", { settings: updatedSettings }),
        ]);

        setServerSettings(updatedSettings);
        setSaveMessage("Profile saved.");
        router.push("/profile");
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsSaving(false);
      }
    };
    saveProfile();
  };

  const addGenre = () => {
    if (newGenre && !profile.favoriteGenres.includes(newGenre)) {
      setProfile(prev => ({ ...prev, favoriteGenres: [...prev.favoriteGenres, newGenre] }));
      setNewGenre("");
    }
  };

  const removeGenre = (genre: string) => {
    setProfile(prev => ({ ...prev, favoriteGenres: prev.favoriteGenres.filter(g => g !== genre) }));
  };

  return (
    <div className="divide-y divide-amber-100 dark:divide-slate-700">
      {/* Identity */}
      <div className="pb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {profile.avatar || "?"}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-slate-100">{profile.name || "—"}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 dark:text-slate-400 font-medium mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2.5 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 dark:text-slate-400 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-3 py-2.5 border border-amber-200/60 dark:border-slate-700 rounded-lg bg-amber-50/50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 cursor-not-allowed text-sm"
            />
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Managed by your sign-in provider</p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 dark:text-slate-400 font-medium mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 h-4 w-4" />
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                className="w-full pl-9 pr-3 py-2.5 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                placeholder="City, Country"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 dark:text-slate-400 font-medium mb-2">
              Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2.5 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none text-sm"
              placeholder="A few words about your reading life..."
            />
          </div>
        </div>
      </div>

      {/* Favourite Genres */}
      <div className="py-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold mb-5">
          Favourite Genres
        </p>

        {profile.favoriteGenres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.favoriteGenres.map((genre) => (
              <span
                key={genre}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 dark:bg-slate-700 text-amber-700 dark:text-slate-200 rounded-full text-sm"
              >
                {genre}
                <button
                  onClick={() => removeGenre(genre)}
                  className="hover:text-amber-900 dark:hover:text-slate-100 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <select
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            className="px-3 py-2 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
          >
            <option value="">Select a genre...</option>
            {availableGenres
              .filter(g => !profile.favoriteGenres.includes(g))
              .map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <button
            onClick={addGenre}
            disabled={!newGenre}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
          >
            Add
          </button>
        </div>
      </div>

      {/* Reading Preferences */}
      <div className="py-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold mb-5">
          Reading Preferences
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-gray-500 dark:text-slate-400 font-medium mb-2">
              Annual reading goal
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="200"
                value={readingGoal}
                onChange={(e) => setReadingGoal(parseInt(e.target.value || "0", 10))}
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
              value={bookFormat}
              onChange={(e) => setBookFormat(e.target.value)}
              className="w-full px-3 py-2.5 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            >
              <option value="any">Any format</option>
              <option value="physical">Physical books</option>
              <option value="ebook">E-books</option>
              <option value="audiobook">Audiobooks</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="pt-6 flex items-center justify-end gap-4">
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {saveMessage && <p className="text-sm text-emerald-600 dark:text-emerald-400">{saveMessage}</p>}
        <button
          onClick={handleSave}
          disabled={isLoading || isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
