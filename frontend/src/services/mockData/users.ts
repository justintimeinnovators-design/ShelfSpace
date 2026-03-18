import { ID } from "@/types/common";

// Mock user data interface
export interface MockUser {
  id: ID;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    theme: "light" | "dark" | "system";
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      readingReminders: boolean;
      groupUpdates: boolean;
    };
  };
  stats: {
    booksRead: number;
    pagesRead: number;
    readingStreak: number;
    joinedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Mock user data
export const mockUsers: MockUser[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/avatars/john-doe.jpg",
    preferences: {
      theme: "light",
      language: "en",
      timezone: "America/New_York",
      notifications: {
        email: true,
        push: true,
        readingReminders: true,
        groupUpdates: false,
      },
    },
    stats: {
      booksRead: 47,
      pagesRead: 12543,
      readingStreak: 15,
      joinedAt: "2023-06-15T00:00:00.000Z",
    },
    createdAt: "2023-06-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "/avatars/jane-smith.jpg",
    preferences: {
      theme: "dark",
      language: "en",
      timezone: "America/Los_Angeles",
      notifications: {
        email: false,
        push: true,
        readingReminders: true,
        groupUpdates: true,
      },
    },
    stats: {
      booksRead: 23,
      pagesRead: 8765,
      readingStreak: 7,
      joinedAt: "2023-08-22T00:00:00.000Z",
    },
    createdAt: "2023-08-22T00:00:00.000Z",
    updatedAt: "2024-01-10T00:00:00.000Z",
  },
];

// Helper functions
/**
 * Get User By Id.
 * @param id - id value.
 * @returns MockUser | undefined.
 */
export function getUserById(id: ID): MockUser | undefined {
  return mockUsers.find((user) => user.id === id);
}

/**
 * Get Current User.
 * @returns MockUser.
 */
export function getCurrentUser(): MockUser {
  const user = mockUsers[0];
  if (!user) {
    throw new Error("No mock users available");
  }
  return user;
}
