import express from "express";
import prisma from "../prisma.js";
import { createModerationLogSchema, updateBookValidationSchema } from "../schemas.js";
import { isAuthenticated } from "../middlewares/auth.ts";
import { isAdmin } from "../middlewares/isAdmin.ts";
import { z } from "zod";

const router = express.Router();

// Log a moderation action
router.post("/moderation/log", isAuthenticated, isAdmin, async (req, res) => {
  const parseResult = createModerationLogSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parseResult.error.errors });
  }

  try {
    const log = await prisma.moderationLog.create({
      data: { ...parseResult.data, moderatorId: req.userId! },
    });
    res.status(201).json(log);
  } catch (error) {
    console.error("Error creating moderation log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all moderation logs
router.get("/moderation/logs", isAuthenticated, isAdmin, async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;

  try {
    const logs = await prisma.moderationLog.findMany({
      skip: offset,
      take: limit,
      orderBy: { timestamp: "desc" },
    });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching moderation logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update book validation status
router.put("/book-validation/:bookId", isAuthenticated, isAdmin, async (req, res) => {
  const { bookId } = req.params;
  const parseResult = updateBookValidationSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parseResult.error.errors });
  }

  try {
    const updatedValidation = await prisma.bookValidation.upsert({
      where: { bookId },
      update: { ...parseResult.data, validatorId: req.userId! },
      create: { bookId, ...parseResult.data, validatorId: req.userId! },
    });
    res.json(updatedValidation);
  } catch (error) {
    console.error("Error updating book validation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get book validation status
router.get("/book-validation/:bookId", isAuthenticated, isAdmin, async (req, res) => {
  const { bookId } = req.params;
  try {
    const validation = await prisma.bookValidation.findUnique({
      where: { bookId },
    });
    if (!validation) {
      return res.status(404).json({ error: "Book validation status not found" });
    }
    res.json(validation);
  } catch (error) {
    console.error("Error fetching book validation status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
