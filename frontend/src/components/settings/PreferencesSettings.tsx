import { UserSettings } from "./SettingsLayout"; 
import { colors } from '../../utils/colors';

interface Props {
  userSettings: UserSettings;
  handleSettingsUpdate: (section: keyof UserSettings, field: string, value: any) => void;
}

interface Preferences {
  theme: "light" | "dark" | "auto";
  dailyGoal: number;
  weeklyGoal: number;
  monthlyGoal: number;
  readingReminders: boolean;
  autoMarkAsRead: boolean;
  showReadingProgress: boolean;
  publicProfile: boolean;
}

interface Props {
  userSettings: UserSettings;
  handleSettingsUpdate: (section: keyof UserSettings, field: string, value: any) => void;
}

const PreferencesSettings = ({ userSettings, handleSettingsUpdate }: Props) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <h3 className="text-xl font-bold text-gray-800 mb-6">Reading Preferences</h3>

    <div className="space-y-6">
      {/* Theme Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
        <div className="flex space-x-4">
          {[
            { value: "light", label: "Light", icon: "☀️" },
            { value: "dark", label: "Dark", icon: "🌙" },
            { value: "auto", label: "Auto", icon: "🌓" },
          ].map((theme) => (
            <button
              key={theme.value}
              onClick={() => handleSettingsUpdate("preferences", "theme", theme.value)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg border btn-outline ${colors.buttonHover}`}
            >
              <span className="text-lg">{theme.icon}</span>
              <span>{theme.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reading Goals */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Reading Goals</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Daily (minutes)</label>
            <input
              type="number"
              value={userSettings.preferences.dailyGoal}
              onChange={(e) =>
                handleSettingsUpdate("preferences", "dailyGoal", parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Weekly (books)</label>
            <input
              type="number"
              value={userSettings.preferences.weeklyGoal}
              onChange={(e) =>
                handleSettingsUpdate("preferences", "weeklyGoal", parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Monthly (books)</label>
            <input
              type="number"
              value={userSettings.preferences.monthlyGoal}
              onChange={(e) =>
                handleSettingsUpdate("preferences", "monthlyGoal", parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Toggle Options */}
      <div className="space-y-4">
        {[
          {
            key: "readingReminders",
            label: "Daily Reading Reminders",
            desc: "Get notified to maintain your reading streak",
          },
          {
            key: "autoMarkAsRead",
            label: "Auto-mark as Read",
            desc: "Automatically mark books as read when you finish them",
          },
          {
            key: "showReadingProgress",
            label: "Show Reading Progress",
            desc: "Display progress bars and statistics",
          },
          {
            key: "publicProfile",
            label: "Public Profile",
            desc: "Allow others to see your reading activity",
          },
        ].map((option) => (
          <div
            key={option.key}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <h4 className="font-medium text-gray-800">{option.label}</h4>
              <p className="text-sm text-gray-600">{option.desc}</p>
            </div>
            <button
              onClick={() =>
                handleSettingsUpdate(
                  "preferences",
                  option.key,
                  !userSettings.preferences[option.key as keyof Preferences]
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                userSettings.preferences[option.key as keyof Preferences]
                  ? "bg-purple-600"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  userSettings.preferences[option.key as keyof Preferences]
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          Save Preferences
        </button>
      </div>
    </div>
  </div>
);

export default PreferencesSettings;
