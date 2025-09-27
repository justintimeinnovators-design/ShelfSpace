import express from "express";
import prisma from "../prisma.ts";
import {
  updateUserSchema,
  updatePreferencesSchema,
  createUserSchema,
} from "../schemas.ts";
import type { Request, Response } from "express";
import { isAuthenticated, signToken } from "../middlewares/auth.ts";
import { isAdmin } from "../middlewares/isAdmin.ts";
import { validate } from "../middlewares/validate.ts";
import type { User, UserStats, Preferences } from "../types/user.d.ts";
import { z } from "zod";
import { updateUserStatusSchema } from "../schemas.ts"; // Will create this schema

const router = express.Router();

// Create the user
router.post(
  "/me",
  async (
    req: Request<{} | User | z.infer<typeof createUserSchema>>,
    res: Response<
      { error: string } | { error: string; details: any } | { token: string }
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
      
      const token = await signToken({ id: user.id });
      res.json({ 
        token: token,
        user: user,
        isNewUser: true,
        needsPreferences: true
      });
    } catch (error) {
      console.error("Error creating/finding user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
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
      });
      res.json(updatedUser);
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
      // console.log(req.userId);
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        include: { preferences: true, stats: true },
      });
      console.log(user);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
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
      const preferences = await prisma.preferences.findUnique({
        where: { userId: req.userId },
      });

      if (!preferences) {
        // If preferences don't exist, we can return default values or a 404
        res.status(404).json({ error: "Preferences not found." });
        return;
      }
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
      res.json(updatedPreferences);
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
    } catch (error) {
      console.error("Error resetting user preferences:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
