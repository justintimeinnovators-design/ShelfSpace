export type UserSettings = {
  profile: {
    name: string;
    email: string;
    avatar: string;
    bio: string;
    location: string;
    favoriteGenres: string[];
  };
  preferences: {
    theme: "light" | "dark" | "auto";
    language: string;
    timezone: string;
    readingReminders: boolean;
    dailyGoal: number;
    weeklyGoal: number;
    monthlyGoal: number;
    autoMarkAsRead: boolean;
    showReadingProgress: boolean;
    publicProfile: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    bookRecommendations: boolean;
    groupUpdates: boolean;
    reviewReminders: boolean;
    readingChallenges: boolean;
    newFollowers: boolean;
    bookReleases: boolean;
  };
  privacy: {
    publicLibrary: boolean;
    shareReadingStats: boolean;
    allowRecommendations: boolean;
    dataSyncEnabled: boolean;
    analyticsEnabled: boolean;
  };
};
