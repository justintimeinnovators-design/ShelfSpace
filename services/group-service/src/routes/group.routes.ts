import express, { Request, Response } from "express";
import prisma from "../prisma.js";
import { createGroupSchema, updateGroupSchema } from "../schemas.js";
import { isAuthenticated } from "../middlewares/auth.ts";
import { Group, GroupMembership } from "../types/group.d.ts";
import { z } from "zod";

const router = express.Router();

// Create a new group
router.post("/", isAuthenticated, async (req: Request<{}, Group, z.infer<typeof createGroupSchema>>, res: Response<Group>) => {
  const parseResult = createGroupSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parseResult.error.errors });
  }

  try {
    const group = await prisma.group.create({
      data: {
        ...parseResult.data,
        createdById: req.userId!,
        memberships: {
          create: {
            userId: req.userId!,
            role: "ADMIN",
          },
        },
      },
      include: { memberships: true },
    });
    res.status(201).json(group);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all groups
router.get("/", async (req: Request<{}, Group[], {}, { limit?: string; offset?: string }>, res: Response<Group[]>) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;

  try {
    const groups = await prisma.group.findMany({
      skip: offset,
      take: limit,
    });
    res.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a single group by its ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response<Group>) => {
  const { id } = req.params;
  try {
    const group = await prisma.group.findUnique({
      where: { id },
      include: { memberships: true }, // Include members
    });
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.json(group);
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a group
router.put("/:id", isAuthenticated, async (req: Request<{ id: string }, Group, z.infer<typeof updateGroupSchema>>, res: Response<Group>) => {
  const { id } = req.params;
  const parseResult = updateGroupSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parseResult.error.errors });
  }

  try {
    const group = await prisma.group.findUnique({
      where: { id },
      include: { memberships: true },
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const isAdmin = group.memberships.some(
      (m) => m.userId === req.userId && m.role === "ADMIN"
    );

    if (!isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedGroup = await prisma.group.update({
      where: { id },
      data: parseResult.data,
    });
    res.json(updatedGroup);
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a group
router.delete("/:id", isAuthenticated, async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const group = await prisma.group.findUnique({
      where: { id },
      include: { memberships: true },
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const isAdmin = group.memberships.some(
      (m) => m.userId === req.userId && m.role === "ADMIN"
    );

    if (!isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.group.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Join a group
router.post("/:id/join", isAuthenticated, async (req: Request<{ id: string }>, res: Response<GroupMembership>) => {
  const { id } = req.params;
  const userId = req.userId!;

  try {
    const membership = await prisma.groupMembership.create({
      data: {
        groupId: id,
        userId: userId,
      },
    });
    res.status(201).json(membership);
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Leave a group
router.post("/:id/leave", isAuthenticated, async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const userId = req.userId!;

  try {
    await prisma.groupMembership.delete({
      where: {
        groupId_userId: {
          groupId: id,
          userId: userId,
        },
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get group members
router.get("/:id/members", async (req: Request<{ id: string }>, res: Response<GroupMembership[]>) => {
  const { id } = req.params;

  try {
    const members = await prisma.groupMembership.findMany({
      where: {
        groupId: id,
      },
    });
    res.json(members);
  } catch (error) {
    console.error("Error fetching group members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
