import express from "express";
import prisma from "../prisma.ts";

const router = express.Router();

router.get("/me", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/me - Update user profile
router.put("/me", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { name, avatarUrl } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, avatarUrl },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/me/preferences - Retrieve user preferences
router.get("/me/preferences", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const preferences = await prisma.preferences.findUnique({
      where: { userId },
    });

    if (!preferences) {
      // If preferences don't exist, we can return default values or a 404
      return res.status(404).json({ error: "Preferences not found." });
    }
    res.json(preferences);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/me/preferences - Update or create user preferences
router.put("/me/preferences", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // We use `upsert` to create preferences if they don't exist, or update them if they do.
    const updatedPreferences = await prisma.preferences.upsert({
      where: { userId },
      update: req.body,
      create: {
        userId,
        ...req.body,
      },
    });
    res.json(updatedPreferences);
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
