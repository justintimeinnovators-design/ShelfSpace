import express from "express";
import prisma from "../prisma.js";
import {
  updateUserSchema,
  updatePreferencesSchema,
  createUserSchema,
} from "../schemas.js";
import type { Request, Response } from "express";
import { isAuthenticated, signToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { validate } from "../middlewares/validate.js";
import type { User, UserStats, Preferences } from "../types/user.d.ts";
import { z } from "zod";
import { updateUserStatusSchema } from "../schemas.js";
import axios from "axios";
import * as cache from "../utils/cache.js";
import { emitAnalyticsEvents } from "../utils/analytics.js";

const router = express.Router();

// Public profile lookup by userId
router.get(
  "/users/:userId/public",
  async (
    req: Request<{ userId: string }>,
    res: Response<{ id: string; name?: string; avatarUrl?: string | null; bio?: string | null; isPublic: boolean }>
  ) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.userId },
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          bio: true,
          isPublic: true,
        },
      });
      if (!user) {
        res.status(404).json({ error: "User not found" } as any);
        return;
      }

      res.json({
        id: user.id,
        name: user.name || undefined,
        avatarUrl: user.avatarUrl,
        bio: user.isPublic ? user.bio : null,
        isPublic: user.isPublic,
      });
    } catch (error) {
      console.error("Error fetching public user profile:", error);
      res.status(500).json({ error: "Internal server error" } as any);
    }
  }
);

// Authenticated profile lookup by userId (returns name even if profile is private)
router.get(
  "/users/:userId/lookup",
  isAuthenticated,
  async (
    req: Request<{ userId: string }>,
    res: Response<{ id: string; name: string | null }>
  ) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.userId },
        select: { id: true, name: true },
      });
      if (!user) {
        res.status(404).json({ error: "User not found" } as any);
        return;
      }
      res.json({ id: user.id, name: user.name || null });
    } catch (error) {
      console.error("Error fetching user lookup:", error);
      res.status(500).json({ error: "Internal server error" } as any);
    }
  }
);

// Create the user
router.post(
  "/me",
  async (
    req: Request<{} | User | z.infer<typeof createUserSchema>>,
    res: Response<
      | { error: string }
      | { error: string; details: any }
      | { token: string; user: User; isNewUser: boolean; needsPreferences: boolean }
    >
  ) => {
    // console.log(req.body);
    const parseResult = createUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      res
        .status(400)
        .json({ error: "Invalid input", details: parseResult.error.errors });
      return;
    }
    // Use all validated fields
    const data = parseResult.data;

    try {
      // Check if user already exists by email
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
        include: { preferences: true }
      });

      if (existingUser) {
        // User exists, log them in
        console.log("User exists, logging in:", existingUser.email);
        const token = await signToken({ id: existingUser.id });
        res.json({ 
          token: token,
          user: existingUser,
          isNewUser: false,
          needsPreferences: !existingUser.preferences
        });
        return;
      }

      // User doesn't exist, create new user
      const user = await prisma.user.create({
        data: data,
        include: { preferences: true }
      });
      console.log("New user created:", user.email);
      
      // Initialize default reading lists for new user (fire and forget)
      const LIBRARY_SERVICE_URL = process.env.LIBRARY_SERVICE_URL || "http://localhost:3003";
      axios.post(
        `${LIBRARY_SERVICE_URL}/reading-lists/initialize-defaults`,
        {},
        {
          headers: {
            Authorization: `Bearer ${await signToken({ id: user.id })}`,
          },
        }
      ).catch((error) => {
        console.error("Failed to initialize default reading lists:", error.message);
        // Don't fail user creation if this fails
      });
      
      const token = await signToken({ id: user.id });
      res.json({ 
        token: token,
        user: user,
        isNewUser: true,
        needsPreferences: true
      });

      await emitAnalyticsEvents(
        req as Request,
        [
          {
            type: "USER_CREATED",
            userId: user.id,
            payload: { targetUserId: user.id },
          },
        ],
        `Bearer ${token}`
      );
    } catch (error) {
      console.error("Error creating/finding user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/public/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const token = await signToken({ id: userId });
    return res.status(200).json({ token: token });
  } catch (error) {
    console.log("Error fetching the token: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.use(isAuthenticated);

router.patch(
  "/me",
  async (
    req: Request<{} | User | z.infer<typeof updateUserSchema>>,
    res: Response<User | { error: string } | { error: string; details: any }>
  ) => {
    const parseResult = updateUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      res
        .status(400)
        .json({ error: "Invalid input", details: parseResult.error.errors });
      return;
    }
    // Use all validated fields
    const updateData = parseResult.data;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: req.userId },
        data: req.body,
        include: { preferences: true, stats: true },
      });
      
      // Invalidate cache
      await cache.del(cache.cacheKeys.user(req.userId!));
      
      res.json(updatedUser);

      await emitAnalyticsEvents(req as Request, [
        {
          type: "USER_PROFILE_UPDATED",
          userId: req.userId,
        },
      ]);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/me",
  async (req: Request, res: Response<User | { error: string }>) => {
    try {
      // Try cache first
      const cacheKey = cache.cacheKeys.user(req.userId!);
      const cachedUser = await cache.get<User>(cacheKey);
      
      if (cachedUser) {
        return res.json(cachedUser);
      }

      // Fetch from database
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        include: { preferences: true, stats: true },
      });
      
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Cache for 5 minutes
      await cache.set(cacheKey, user, { ttl: 300 });
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/me/preferences",
  async (req: Request, res: Response<Preferences | { error: string }>) => {
    try {
      // Try cache first
      const cacheKey = cache.cacheKeys.userPreferences(req.userId!);
      const cachedPrefs = await cache.get<Preferences>(cacheKey);
      
      if (cachedPrefs) {
        return res.json(cachedPrefs);
      }

      const preferences = await prisma.preferences.findUnique({
        where: { userId: req.userId },
      });

      if (!preferences) {
        // If preferences don't exist, we can return default values or a 404
        res.status(404).json({ error: "Preferences not found." });
        return;
      }

      // Cache for 10 minutes (preferences change less frequently)
      await cache.set(cacheKey, preferences, { ttl: 600 });
      
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put(
  "/me/preferences",
  async (
    req: Request<{}, Preferences, z.infer<typeof updatePreferencesSchema>>,
    res: Response<
      Preferences | { error: string } | { error: string; details: any }
    >
  ) => {
    // Zod validation
    const parseResult = updatePreferencesSchema.safeParse(req.body);
    if (!parseResult.success) {
      res
        .status(400)
        .json({ error: "Invalid input", details: parseResult.error.errors });
      return;
    }

    try {
      // We use `upsert` to create preferences if they don't exist, or update them if they do.
      const updatedPreferences = await prisma.preferences.upsert({
        where: { userId: req.userId },
        update: req.body,
        create: {
          userId: req.userId as string,
          ...req.body,
        },
      });
      
      // Invalidate cache
      await cache.del(cache.cacheKeys.userPreferences(req.userId!));
      await cache.del(cache.cacheKeys.user(req.userId!)); // Also invalidate user cache
      
      res.json(updatedPreferences);

      await emitAnalyticsEvents(req as Request, [
        {
          type: "USER_PREFERENCES_UPDATED",
          userId: req.userId,
        },
      ]);
    } catch (error) {
      console.error("Error updating preferences:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/me/stats",
  async (
    req: Request,
    res: Response<Partial<UserStats> | { error: string }>
  ) => {
    try {
      const stats = await prisma.userStats.findUnique({
        where: { userId: req.userId },
      });
      if (!stats) {
        res.json({
          booksRead: 0,
          pagesRead: 0,
          currentStreak: 0,
          longestStreak: 0,
        });
        return;
      }
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete(
  "/me",
  async (req: Request, res: Response) => {
    try {
      await prisma.user.delete({ where: { id: req.userId } });
      await cache.del(cache.cacheKeys.user(req.userId!));
      await cache.del(cache.cacheKeys.userPreferences(req.userId!));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Admin routes
router.put(
  "/users/:userId/status",
  isAdmin,
  async (
    req: Request<
      { userId: string },
      {},
      z.infer<typeof updateUserStatusSchema>
    >,
    res: Response<User | { error: string } | { error: string; details: any }>
  ) => {
    const { userId } = req.params;
    const parseResult = updateUserStatusSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: parseResult.error.errors });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { status: parseResult.data.status },
      });
      res.json(updatedUser);

      await emitAnalyticsEvents(req as Request, [
        {
          type: "USER_STATUS_UPDATED",
          userId: req.userId,
          payload: {
            targetUserId: userId,
            status: parseResult.data.status,
          },
        },
      ]);
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put(
  "/users/:userId/preferences/reset",
  isAdmin,
  async (
    req: Request<{ userId: string }>,
    res: Response<Preferences | { error: string } | { message: string }>
  ) => {
    const { userId } = req.params;
    try {
      // Delete existing preferences to trigger default creation on next access
      await prisma.preferences.deleteMany({
        where: { userId },
      });
      res.status(200).json({ message: "User preferences reset successfully." });

      await emitAnalyticsEvents(req as Request, [
        {
          type: "USER_PREFERENCES_RESET",
          userId: req.userId,
          payload: { targetUserId: userId },
        },
      ]);
    } catch (error) {
      console.error("Error resetting user preferences:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
