import express from "express";
import prisma from "../prisma.ts";

const router = express.Router();

router.get("/me", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { preferences: true },
  });

  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.put("/me", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { name, avatarUrl } = req.body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      avatarUrl,
    },
  });

  res.json(user);
});

export default router;
