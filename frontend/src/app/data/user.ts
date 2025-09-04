
import { UserSettings } from '../../../types/Settings';

export const initialUserSettings: UserSettings = {
  profile: {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/75.jpg',
    bio: 'A passionate reader and software engineer.',
    location: 'San Francisco, CA',
    favoriteGenres: ['Science Fiction', 'Fantasy', 'Non-Fiction'],
  },
  preferences: {
    theme: 'light',
    language: 'en-US',
    timezone: 'America/Los_Angeles',
    readingReminders: true,
    dailyGoal: 30,
    weeklyGoal: 2,
    monthlyGoal: 8,
    autoMarkAsRead: true,
    showReadingProgress: true,
    publicProfile: true,
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    bookRecommendations: true,
    groupUpdates: true,
    reviewReminders: true,
    readingChallenges: true,
    newFollowers: true,
    bookReleases: true,
  },
  privacy: {
    publicLibrary: true,
    shareReadingStats: true,
    allowRecommendations: true,
    dataSyncEnabled: true,
    analyticsEnabled: false,
  },
};
