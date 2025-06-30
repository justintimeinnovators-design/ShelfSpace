import express from "express";
import prisma from "../prisma.ts";

const router = express.Router();

router.get("/me/preferences", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const preferences = await prisma.preferences.findUnique({
    where: { userId },
  });

  if (!preferences)
    return res.status(404).json({ error: "Preferences not found" });
  res.json(preferences);
});

router.put("/me/preferences", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const updated = await prisma.preferences.upsert({
    where: { userId },
    update: req.body,
    create: {
      userId,
      ...req.body,
    },
  });

  res.json(updated);
});

export default router;
