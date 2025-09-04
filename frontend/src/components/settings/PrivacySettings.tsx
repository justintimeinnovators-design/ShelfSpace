import { UserSettings } from "./SettingsLayout"
import { colors } from '../../utils/colors';

interface PrivacySettingsType {
  publicLibrary: boolean;
  shareReadingStats: boolean;
  allowRecommendations: boolean;
  dataSyncEnabled: boolean;
  analyticsEnabled: boolean;
}

interface Props {
  userSettings: UserSettings;
  handleSettingsUpdate: (section: keyof UserSettings, field: string, value: any) => void;
}

const PrivacySettings = ({ userSettings, handleSettingsUpdate }: Props) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <h3 className="text-xl font-bold text-gray-800 mb-6">Privacy & Data</h3>

    <div className="space-y-4">
      {[
        {
          key: "publicLibrary",
          label: "Public Library",
          desc: "Allow others to see your book collection",
        },
        {
          key: "shareReadingStats",
          label: "Share Reading Statistics",
          desc: "Show your reading progress to others",
        },
        {
          key: "allowRecommendations",
          label: "Personalized Recommendations",
          desc: "Use your data to improve recommendations",
        },
        {
          key: "dataSyncEnabled",
          label: "Data Synchronization",
          desc: "Sync your data across devices",
        },
        {
          key: "analyticsEnabled",
          label: "Usage Analytics",
          desc: "Help improve ShelfSpace with anonymous usage data",
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
                "privacy",
                option.key,
                !userSettings.privacy[option.key as keyof PrivacySettingsType]
              )
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              userSettings.privacy[option.key as keyof PrivacySettingsType]
                ? "bg-indigo-dye-600"
                : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                userSettings.privacy[option.key as keyof PrivacySettingsType]
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>
      ))}
    </div>

    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h4 className="font-medium text-yellow-800 mb-2">Data Export</h4>
      <p className="text-sm text-yellow-700 mb-3">
        Download all your data including books, reviews, and reading history.
      </p>
      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
        Request Data Export
      </button>
    </div>

    <div className="flex justify-end mt-6">
              <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
        Save Privacy Settings
      </button>
    </div>
  </div>
);

export default PrivacySettings;
