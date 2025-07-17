import { UserSettings } from "./SettingsLayout";

interface Notifications {
  emailNotifications: boolean;
  pushNotifications: boolean;
  bookRecommendations: boolean;
  groupUpdates: boolean;
  reviewReminders: boolean;
  readingChallenges: boolean;
  newFollowers: boolean;
  bookReleases: boolean;
}

interface Props {
  userSettings: UserSettings;
  handleSettingsUpdate: (section: keyof UserSettings, field: string, value: any) => void;
}

const NotificationsSettings = ({ userSettings, handleSettingsUpdate }: Props) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <h3 className="text-xl font-bold text-gray-800 mb-6">Notification Settings</h3>

    <div className="space-y-4">
      {[
        { key: "emailNotifications", label: "Email Notifications", desc: "Receive notifications via email" },
        { key: "pushNotifications", label: "Push Notifications", desc: "Get browser/app notifications" },
        { key: "bookRecommendations", label: "Book Recommendations", desc: "AI-powered book suggestions" },
        { key: "groupUpdates", label: "Reading Group Updates", desc: "Activity from your reading groups" },
        { key: "reviewReminders", label: "Review Reminders", desc: "Reminders to review books you've read" },
        { key: "readingChallenges", label: "Reading Challenges", desc: "Updates about reading challenges" },
        { key: "newFollowers", label: "New Followers", desc: "When someone follows your profile" },
        { key: "bookReleases", label: "Book Releases", desc: "New releases from your favorite authors" },
      ].map((option) => (
        <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-800">{option.label}</h4>
            <p className="text-sm text-gray-600">{option.desc}</p>
          </div>
          <button
            onClick={() =>
              handleSettingsUpdate(
                "notifications",
                option.key,
                !userSettings.notifications[option.key as keyof Notifications]
              )
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              userSettings.notifications[option.key as keyof Notifications]
                ? "bg-purple-600"
                : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                userSettings.notifications[option.key as keyof Notifications]
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>
      ))}
    </div>

    <div className="flex justify-end mt-6">
      <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
        Save Notifications
      </button>
    </div>
  </div>
);

export default NotificationsSettings;
