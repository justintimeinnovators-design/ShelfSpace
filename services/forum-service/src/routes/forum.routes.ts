import express, { Request, Response } from "express";
import prisma from "../prisma.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createForumSchema,
  updateForumSchema,
  createThreadSchema,
  updateThreadSchema,
  createPostSchema,
  updatePostSchema,
  reactionSchema,
} from "../schemas.js";
import { publishAnalyticsEvents } from "../kafka/producer.js";

const router = express.Router();

async function emitAnalyticsEvents(
  req: Request,
  events: Array<Record<string, any>>
) {
  if (events.length === 0) return;
  try {
    await publishAnalyticsEvents(events);
  } catch (error) {
    console.warn("Failed to emit analytics events to Kafka:", error);
  }
}

/**
 * Get Forum Or404.
 * @param forumId - forum Id value.
 */
async function getForumOr404(forumId: string) {
  const forum = await prisma.forum.findUnique({
    where: { id: forumId },
  });
  return forum;
}

/**
 * Require Membership.
 * @param forumId - forum Id value.
 * @param userId - user Id value.
 */
async function requireMembership(forumId: string, userId: string) {
  return prisma.forumMembership.findUnique({
    where: {
      forumId_userId: {
        forumId,
        userId,
      },
    },
  });
}

/**
 * Parse Limit Offset.
 * @param req - req value.
 */
function parseLimitOffset(req: Request) {
  const limit = Math.min(parseInt(String(req.query.limit || "20"), 10) || 20, 100);
  const offset = Math.max(parseInt(String(req.query.offset || "0"), 10) || 0, 0);
  return { limit, offset };
}

// Create a new forum
router.post("/", isAuthenticated, async (req: Request, res: Response) => {
  const parseResult = createForumSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parseResult.error.issues });
  }

  try {
    const forum = await prisma.forum.create({
      data: {
        name: parseResult.data.name,
        description: parseResult.data.description,
        isPublic: parseResult.data.isPublic ?? true,
        tags: parseResult.data.tags || [],
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
    res.status(201).json(forum);

    await emitAnalyticsEvents(req, [
      {
        type: "FORUM_CREATED",
        userId: req.userId,
        payload: { forumId: forum.id, forumName: forum.name },
      },
    ]);
  } catch (error) {
    console.error("Error creating forum:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get all forums
router.get("/", async (req: Request, res: Response) => {
  const { limit, offset } = parseLimitOffset(req);
  try {
    const forums = await prisma.forum.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        memberships: {
          select: {
            id: true,
            forumId: true,
            userId: true,
            role: true,
            createdAt: true,
          },
        },
        _count: { select: { memberships: true, threads: true } },
      },
    });
    res.json(
      forums.map((f) => ({
        ...f,
        memberCount: f._count.memberships,
        threadCount: f._count.threads,
      }))
    );
  } catch (error) {
    console.error("Error fetching forums:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get a single forum
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const forum = await prisma.forum.findUnique({
      where: { id },
      include: {
        memberships: {
          select: {
            id: true,
            forumId: true,
            userId: true,
            role: true,
            createdAt: true,
          },
        },
        _count: { select: { memberships: true, threads: true } },
      },
    });
    if (!forum) {
      return res.status(404).json({ error: "Forum not found" });
    }
    res.json({
      ...forum,
      memberCount: forum._count.memberships,
      threadCount: forum._count.threads,
    });
  } catch (error) {
    console.error("Error fetching forum:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update a forum
router.put("/:id", isAuthenticated, async (req: Request, res: Response) => {
  const { id } = req.params;
  const parseResult = updateForumSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parseResult.error.issues });
  }

  try {
    const forum = await prisma.forum.findUnique({
      where: { id },
      include: { memberships: true },
    });

    if (!forum) {
      return res.status(404).json({ error: "Forum not found" });
    }

    const isAdmin = forum.memberships.some(
      (m) => m.userId === req.userId && m.role === "ADMIN"
    );

    if (!isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedForum = await prisma.forum.update({
      where: { id },
      data: parseResult.data,
      include: {
        memberships: {
          select: {
            id: true,
            forumId: true,
            userId: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    res.json(updatedForum);

    await emitAnalyticsEvents(req, [
      {
        type: "FORUM_UPDATED",
        userId: req.userId,
        payload: { forumId: updatedForum.id, forumName: updatedForum.name },
      },
    ]);
  } catch (error) {
    console.error("Error updating forum:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a forum
router.delete("/:id", isAuthenticated, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const forum = await prisma.forum.findUnique({
      where: { id },
      include: { memberships: true },
    });

    if (!forum) {
      return res.status(404).json({ error: "Forum not found" });
    }

    const isAdmin = forum.memberships.some(
      (m) => m.userId === req.userId && m.role === "ADMIN"
    );

    if (!isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.forum.delete({ where: { id } });
    res.status(204).send();

    await emitAnalyticsEvents(req, [
      {
        type: "FORUM_DELETED",
        userId: req.userId,
        payload: { forumId: forum.id, forumName: forum.name },
      },
    ]);
  } catch (error) {
    console.error("Error deleting forum:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Join a forum
router.post("/:id/join", isAuthenticated, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId!;

  try {
    const forum = await prisma.forum.findUnique({ where: { id } });
    if (!forum) {
      return res.status(404).json({ error: "Forum not found" });
    }

    const existingMembership = await prisma.forumMembership.findUnique({
      where: {
        forumId_userId: { forumId: id, userId },
      },
    });
    if (existingMembership) {
      return res.status(409).json({ error: "User is already a member" });
    }

    const membership = await prisma.forumMembership.create({
      data: { forumId: id, userId },
    });
    res.status(201).json(membership);

    await emitAnalyticsEvents(req, [
      {
        type: "FORUM_JOINED",
        userId: req.userId,
        payload: { forumId: forum.id, forumName: forum.name },
      },
    ]);
  } catch (error: any) {
    console.error("Error joining forum:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "User is already a member" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Leave a forum
router.post("/:id/leave", isAuthenticated, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId!;

  try {
    await prisma.forumMembership.delete({
      where: {
        forumId_userId: { forumId: id, userId },
      },
    });
    res.status(204).send();

    await emitAnalyticsEvents(req, [
      {
        type: "FORUM_LEFT",
        userId: req.userId,
        payload: { forumId: id },
      },
    ]);
  } catch (error: any) {
    console.error("Error leaving forum:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Membership not found" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get forum members
router.get("/:id/members", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const members = await prisma.forumMembership.findMany({
      where: { forumId: id },
    });
    res.json(members);
  } catch (error) {
    console.error("Error fetching forum members:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Verify forum membership
router.get(
  "/:forumId/members/:userId/verify",
  async (req: Request<{ forumId: string; userId: string }>, res: Response) => {
    const { forumId, userId } = req.params;

    try {
      const membership = await prisma.forumMembership.findUnique({
        where: {
          forumId_userId: { forumId, userId },
        },
      });

      if (!membership) {
        return res.status(404).json({ error: "Membership not found" });
      }

      res.status(200).json({ isMember: true });
    } catch (error) {
      console.error("Error verifying membership:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Create a thread
router.post("/:id/threads", isAuthenticated, async (req: Request, res: Response) => {
  const { id } = req.params;
  const parseResult = createThreadSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parseResult.error.issues });
  }

  try {
    const forum = await getForumOr404(id);
    if (!forum) {
      return res.status(404).json({ error: "Forum not found" });
    }

    const membership = await requireMembership(id, req.userId!);
    if (!membership) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const thread = await prisma.forumThread.create({
      data: {
        forumId: id,
        title: parseResult.data.title,
        content: parseResult.data.content,
        createdById: req.userId!,
      },
    });
    res.status(201).json(thread);

    await emitAnalyticsEvents(req, [
      {
        type: "THREAD_CREATED",
        userId: req.userId,
        payload: {
          forumId: forum.id,
          forumName: forum.name,
          threadId: thread.id,
          threadTitle: thread.title,
        },
      },
    ]);
  } catch (error) {
    console.error("Error creating thread:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// List threads
router.get("/:id/threads", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { limit, offset } = parseLimitOffset(req);

  try {
    const forum = await getForumOr404(id);
    if (!forum) {
      return res.status(404).json({ error: "Forum not found" });
    }

    const threads = await prisma.forumThread.findMany({
      where: { forumId: id },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip: offset,
      take: limit,
    });
    res.json(threads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get thread
router.get("/:id/threads/:threadId", async (req: Request, res: Response) => {
  const { id, threadId } = req.params;
  try {
    const thread = await prisma.forumThread.findFirst({
      where: { id: threadId, forumId: id },
    });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread);
  } catch (error) {
    console.error("Error fetching thread:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update thread
router.put("/:id/threads/:threadId", isAuthenticated, async (req: Request, res: Response) => {
  const { id, threadId } = req.params;
  const parseResult = updateThreadSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parseResult.error.issues });
  }

  try {
    const thread = await prisma.forumThread.findFirst({
      where: { id: threadId, forumId: id },
    });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    const membership = await requireMembership(id, req.userId!);
    const isAdmin = membership?.role === "ADMIN" || membership?.role === "MODERATOR";
    const isOwner = thread.createdById === req.userId;
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updated = await prisma.forumThread.update({
      where: { id: threadId },
      data: parseResult.data,
    });
    res.json(updated);

    await emitAnalyticsEvents(req, [
      {
        type: "THREAD_UPDATED",
        userId: req.userId,
        payload: {
          forumId: id,
          threadId: updated.id,
          threadTitle: updated.title,
        },
      },
    ]);
  } catch (error) {
    console.error("Error updating thread:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete thread
router.delete("/:id/threads/:threadId", isAuthenticated, async (req: Request, res: Response) => {
  const { id, threadId } = req.params;
  try {
    const thread = await prisma.forumThread.findFirst({
      where: { id: threadId, forumId: id },
    });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    const membership = await requireMembership(id, req.userId!);
    const isAdmin = membership?.role === "ADMIN" || membership?.role === "MODERATOR";
    const isOwner = thread.createdById === req.userId;
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.forumThread.delete({ where: { id: threadId } });
    res.status(204).send();

    await emitAnalyticsEvents(req, [
      {
        type: "THREAD_DELETED",
        userId: req.userId,
        payload: {
          forumId: id,
          threadId: thread.id,
          threadTitle: thread.title,
        },
      },
    ]);
  } catch (error) {
    console.error("Error deleting thread:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Create post
router.post(
  "/:id/threads/:threadId/posts",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const { id, threadId } = req.params;
    const parseResult = createPostSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: parseResult.error.issues });
    }

    try {
      const thread = await prisma.forumThread.findFirst({
        where: { id: threadId, forumId: id },
      });
      if (!thread) {
        return res.status(404).json({ error: "Thread not found" });
      }

      if (thread.isLocked) {
        return res.status(423).json({ error: "Thread is locked" });
      }

      const membership = await requireMembership(id, req.userId!);
      if (!membership) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const post = await prisma.forumPost.create({
        data: {
          threadId,
          authorId: req.userId!,
          content: parseResult.data.content,
          parentPostId: parseResult.data.parentPostId,
        },
      });

      res.status(201).json(post);

      await emitAnalyticsEvents(req, [
        {
          type: "POST_CREATED",
          userId: req.userId,
          payload: {
            forumId: id,
            threadId,
            threadTitle: thread.title,
            postId: post.id,
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating post:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// List posts
router.get("/:id/threads/:threadId/posts", async (req: Request, res: Response) => {
  const { id, threadId } = req.params;
  const { limit, offset } = parseLimitOffset(req);

  try {
    const thread = await prisma.forumThread.findFirst({
      where: { id: threadId, forumId: id },
    });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    const posts = await prisma.forumPost.findMany({
      where: { threadId },
      orderBy: { createdAt: "asc" },
      skip: offset,
      take: limit,
    });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update post
router.put(
  "/:id/threads/:threadId/posts/:postId",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const { id, threadId, postId } = req.params;
    const parseResult = updatePostSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: parseResult.error.issues });
    }

    try {
      const post = await prisma.forumPost.findFirst({
        where: { id: postId, threadId },
      });
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const membership = await requireMembership(id, req.userId!);
      const isAdmin = membership?.role === "ADMIN" || membership?.role === "MODERATOR";
      const isOwner = post.authorId === req.userId;
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const updated = await prisma.forumPost.update({
        where: { id: postId },
        data: parseResult.data,
      });
      res.json(updated);

      await emitAnalyticsEvents(req, [
        {
          type: "POST_UPDATED",
          userId: req.userId,
          payload: {
            forumId: id,
            threadId,
            postId: updated.id,
          },
        },
      ]);
    } catch (error) {
      console.error("Error updating post:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete post
router.delete(
  "/:id/threads/:threadId/posts/:postId",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const { id, postId } = req.params;
    try {
      const post = await prisma.forumPost.findUnique({
        where: { id: postId },
      });
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const membership = await requireMembership(id, req.userId!);
      const isAdmin = membership?.role === "ADMIN" || membership?.role === "MODERATOR";
      const isOwner = post.authorId === req.userId;
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: "Forbidden" });
      }

      await prisma.forumPost.delete({ where: { id: postId } });
      res.status(204).send();

      await emitAnalyticsEvents(req, [
        {
          type: "POST_DELETED",
          userId: req.userId,
          payload: {
            forumId: id,
            threadId: req.params.threadId,
            postId: post.id,
          },
        },
      ]);
    } catch (error) {
      console.error("Error deleting post:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Add reaction to post
router.post(
  "/:id/threads/:threadId/posts/:postId/reactions",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const { id, postId } = req.params;
    const parseResult = reactionSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: parseResult.error.issues });
    }

    try {
      const membership = await requireMembership(id, req.userId!);
      if (!membership) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const reaction = await prisma.forumPostReaction.upsert({
        where: {
          postId_userId_type: {
            postId,
            userId: req.userId!,
            type: parseResult.data.type,
          },
        },
        create: {
          postId,
          userId: req.userId!,
          type: parseResult.data.type,
        },
        update: {},
      });

      res.status(201).json(reaction);

      await emitAnalyticsEvents(req, [
        {
          type: "POST_REACTED",
          userId: req.userId,
          payload: {
            forumId: id,
            threadId: req.params.threadId,
            postId,
            reaction: parseResult.data.type,
          },
        },
      ]);
    } catch (error) {
      console.error("Error adding reaction:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Remove reaction from post
router.delete(
  "/:id/threads/:threadId/posts/:postId/reactions",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const { id, postId } = req.params;
    const parseResult = reactionSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: parseResult.error.issues });
    }

    try {
      const membership = await requireMembership(id, req.userId!);
      if (!membership) {
        return res.status(403).json({ error: "Forbidden" });
      }

      await prisma.forumPostReaction.delete({
        where: {
          postId_userId_type: {
            postId,
            userId: req.userId!,
            type: parseResult.data.type,
          },
        },
      });
      res.status(204).send();

      await emitAnalyticsEvents(req, [
        {
          type: "POST_REACTED",
          userId: req.userId,
          payload: {
            forumId: id,
            threadId: req.params.threadId,
            postId,
            reaction: parseResult.data.type,
            reason: "removed",
          },
        },
      ]);
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Reaction not found" });
      }
      console.error("Error removing reaction:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
