import express from "express";
import type { Request, Response } from "express";
import prisma from "../prisma.js";
import { signToken } from "../middlewares/auth.js";

const router = express.Router();

// Get token by userId - GET /api/token/:userId
// NOTE: This is a public route for testing/development. Should be secured in production.
router.get("/:userId", async (req: Request, res: Response) => {
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
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
