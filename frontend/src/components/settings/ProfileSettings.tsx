import { UserSettings } from "./SettingsLayout"; 
import { colors } from '../../utils/colors';

interface Props {
  userSettings: UserSettings;
  handleSettingsUpdate: (section: keyof UserSettings, field: string, value: any) => void;
}

interface Profile {
  name: string;
  email: string;
  bio: string;
  location: string;
  favoriteGenres: string[];
}



export default function ProfileSettings({ userSettings, handleSettingsUpdate }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h3>

      <div className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-dye-500 to-safety-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {userSettings.profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Change Photo
            </button>
            <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={userSettings.profile.name}
              onChange={(e) => handleSettingsUpdate("profile", "name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-dye-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={userSettings.profile.email}
              onChange={(e) => handleSettingsUpdate("profile", "email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-dye-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea
            value={userSettings.profile.bio}
            onChange={(e) => handleSettingsUpdate("profile", "bio", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Tell us about yourself and your reading interests..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={userSettings.profile.location}
            onChange={(e) => handleSettingsUpdate("profile", "location", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="City, State/Country"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Genres</label>
          <div className="flex flex-wrap gap-2">
            {[
              "Fiction",
              "Non-Fiction",
              "Mystery",
              "Romance",
              "Science Fiction",
              "Fantasy",
              "Biography",
              "History",
              "Self-Help",
              "Poetry",
            ].map((genre) => {
              const selected = userSettings.profile.favoriteGenres.includes(genre);
              return (
                <button
                  key={genre}
                  onClick={() => {
                    const genres = userSettings.profile.favoriteGenres;
                    const newGenres = selected
                      ? genres.filter((g) => g !== genre)
                      : [...genres, genre];
                    handleSettingsUpdate("profile", "favoriteGenres", newGenres);
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selected
                      ? "bg-indigo-dye-100 text-indigo-dye-700 border border-indigo-dye-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
