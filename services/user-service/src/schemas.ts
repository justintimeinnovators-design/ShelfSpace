import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").max(100).optional(),
  avatarUrl: z.string().url("Must be a valid URL").optional(),
  bio: z.string().max(500).optional(),
  website: z.string().url("Must be a valid URL").optional(),
  isPublic: z.boolean().optional(),
});

export const updatePreferencesSchema = z.object({
  theme: z.enum(["LIGHT", "DARK", "SYSTEM"]).optional(),
  language: z.string().max(10).optional(),
  timezone: z.string().max(50).optional(),
  notificationsEmail: z.boolean().optional(),
  notificationsSMS: z.boolean().optional(),
  newsletterOptIn: z.boolean().optional(),
  dailyDigest: z.boolean().optional(),
  defaultSortOrder: z
    .enum(["MOST_RECENT", "MOST_POPULAR", "ALPHABETICAL"])
    .optional(),
  defaultViewMode: z.enum(["CARD", "LIST"]).optional(),
  compactMode: z.boolean().optional(),
  accessibilityFont: z.boolean().optional(),
  reducedMotion: z.boolean().optional(),
  autoPlayMedia: z.boolean().optional(),
});

export interface UserPayload {
  id: string;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
}
