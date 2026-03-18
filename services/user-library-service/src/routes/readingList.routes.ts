import express, { Request, Response } from "express";
import prisma from "../prisma.js";
import {
  createReadingListSchema,
  updateReadingListSchema,
  moveBooksSchema,
} from "../schemas.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { z } from "zod";
import axios from "axios";
import { publishAnalyticsEvents } from "../kafka/producer.js";

const router = express.Router();
const BOOK_SERVICE_URL =
  process.env.BOOK_SERVICE_URL?.trim() || "http://localhost:3004";
const VALIDATE_BOOK_IDS = process.env.VALIDATE_BOOK_IDS === "true";

/**
 * Validate Book Ids.
 * @param bookIds - book Ids value.
 */
async function validateBookIds(bookIds: string[]) {
  if (!VALIDATE_BOOK_IDS || bookIds.length === 0) {
    return;
  }

  const uniqueIds = Array.from(new Set(bookIds));
  try {
    const results = await Promise.all(
      uniqueIds.map((bookId) =>
        axios.get(`${BOOK_SERVICE_URL}/api/books/${bookId}`, { timeout: 5000 })
      )
    );
    const invalid = results.filter((r) => r.status !== 200);
    if (invalid.length > 0) {
      throw new Error("Invalid book ids");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw Object.assign(new Error("Invalid book ids"), { status: 400 });
    }
    throw Object.assign(new Error("Book service unavailable"), { status: 503 });
  }
}

/**
 * Get Status From List Name.
 * @param name - name value.
 * @returns string | undefined.
 */
function getStatusFromListName(name: string): string | undefined {
  const listName = name.toLowerCase();
  if (listName.includes("finished") || listName.includes("read") || listName.includes("completed")) {
    return "read";
  }
  if (listName.includes("currently") || listName.includes("reading")) {
    return "currently-reading";
  }
  if (listName.includes("want") || listName.includes("wish")) {
    return "want-to-read";
  }
  return undefined;
}

/**
 * Fetch Book Details.
 * @param bookIds - book Ids value.
 */
async function fetchBookDetails(bookIds: string[]) {
  if (bookIds.length === 0) return new Map<string, any>();
  const results = await Promise.all(
    bookIds.map(async (bookId) => {
      try {
        const response = await axios.get(`${BOOK_SERVICE_URL}/api/books/${bookId}`, {
          timeout: 5000,
        });
        return [bookId, response.data] as const;
      } catch (error) {
        console.warn(`Failed to fetch book details for ${bookId}`);
        return [bookId, null] as const;
      }
    })
  );
  return new Map(results);
}

async function emitAnalyticsEvents(
  req: Request,
  events: Array<Record<string, any>>
) {
  if (events.length === 0) return;
  try {
    const eventsWithUserId = events.map((e) => ({ userId: req.userId, ...e }));
    await publishAnalyticsEvents(eventsWithUserId);
  } catch (error) {
    console.warn("Failed to emit analytics events to Kafka:", error);
  }
}

// Get all reading lists for the authenticated user
router.get("/", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { includeBooks } = req.query;
    const booksLimit = req.query.booksLimit
      ? Math.max(parseInt(String(req.query.booksLimit), 10), 0)
      : undefined;
    const booksOffset = req.query.booksOffset
      ? Math.max(parseInt(String(req.query.booksOffset), 10), 0)
      : undefined;

    const lists = await prisma.readingList.findMany({
      where: { userId: req.userId! },
      orderBy: [{ isDefault: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      include: includeBooks === "true" ? {
        books: {
          orderBy: { sortOrder: "asc" },
          select: {
            bookId: true,
            addedAt: true,
            sortOrder: true,
          },
          ...(booksLimit !== undefined ? { take: booksLimit } : {}),
          ...(booksOffset !== undefined ? { skip: booksOffset } : {}),
        },
        _count: { select: { books: true } },
      } : {
        books: { select: { bookId: true } },
        _count: { select: { books: true } },
      },
    });

    const formattedLists = lists.map((list) => ({
      id: list.id,
      userId: list.userId,
      name: list.name,
      description: list.description,
      color: list.color,
      icon: list.icon,
      isPublic: list.isPublic,
      isDefault: list.isDefault,
      sortOrder: list.sortOrder,
      bookIds: list.books.map((b) => b.bookId),
      bookCount: list._count.books,
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt.toISOString(),
    }));

    res.json(formattedLists);
  } catch (error) {
    console.error("Error fetching reading lists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a single reading list by ID
router.get("/:id", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { includeBooks } = req.query;
    const booksLimit = req.query.booksLimit
      ? Math.max(parseInt(String(req.query.booksLimit), 10), 0)
      : undefined;
    const booksOffset = req.query.booksOffset
      ? Math.max(parseInt(String(req.query.booksOffset), 10), 0)
      : undefined;

    const list = await prisma.readingList.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
      include: includeBooks === "true" ? {
        books: {
          orderBy: { sortOrder: "asc" },
          select: {
            bookId: true,
            addedAt: true,
            sortOrder: true,
          },
          ...(booksLimit !== undefined ? { take: booksLimit } : {}),
          ...(booksOffset !== undefined ? { skip: booksOffset } : {}),
        },
        _count: { select: { books: true } },
      } : {
        books: { select: { bookId: true } },
        _count: { select: { books: true } },
      },
    });

    if (!list) {
      return res.status(404).json({ error: "Reading list not found" });
    }

    const formattedList = {
      id: list.id,
      userId: list.userId,
      name: list.name,
      description: list.description,
      color: list.color,
      icon: list.icon,
      isPublic: list.isPublic,
      isDefault: list.isDefault,
      sortOrder: list.sortOrder,
      bookIds: list.books.map((b) => b.bookId),
      bookCount: list._count.books,
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt.toISOString(),
    };

    res.json(formattedList);
  } catch (error) {
    console.error("Error fetching reading list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new reading list
router.post(
  "/",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const parseResult = createReadingListSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: parseResult.error.issues });
    }

    try {
      await validateBookIds(parseResult.data.bookIds || []);

      // Get current user's list count to set sort order
      const userListsCount = await prisma.readingList.count({
        where: { userId: req.userId! },
      });

      const list = await prisma.readingList.create({
        data: {
          userId: req.userId!,
          name: parseResult.data.name,
          description: parseResult.data.description,
          color: parseResult.data.color,
          icon: parseResult.data.icon,
          isPublic: parseResult.data.isPublic ?? false,
          sortOrder: userListsCount,
          books: {
            create: parseResult.data.bookIds?.map((bookId, index) => ({
              bookId,
              sortOrder: index,
            })) || [],
          },
        },
        include: {
          books: {
            select: {
              bookId: true,
            },
          },
        },
      });

      const formattedList = {
        id: list.id,
        userId: list.userId,
        name: list.name,
        description: list.description,
        color: list.color,
        icon: list.icon,
        isPublic: list.isPublic,
        isDefault: list.isDefault,
        sortOrder: list.sortOrder,
        bookIds: list.books.map((b) => b.bookId),
        bookCount: list.books.length,
        createdAt: list.createdAt.toISOString(),
        updatedAt: list.updatedAt.toISOString(),
      };

      res.status(201).json(formattedList);

      await emitAnalyticsEvents(req, [
        {
          type: "READING_LIST_CREATED",
          payload: {
            listId: formattedList.id,
            listName: formattedList.name,
          },
        },
      ]);

      if (parseResult.data.bookIds && parseResult.data.bookIds.length > 0) {
        const bookDetails = await fetchBookDetails(parseResult.data.bookIds);
        const status = getStatusFromListName(list.name);
        const events = parseResult.data.bookIds.map((bookId) => {
          const book = bookDetails.get(bookId);
          const author =
            Array.isArray(book?.authors) && book.authors.length > 0
              ? book.authors[0]?.name
              : undefined;
          return {
            type: "BOOK_ADDED",
            payload: {
              bookId,
              title: book?.title,
              author,
              pages: book?.num_pages,
              genres: book?.genres,
              status,
              listName: list.name,
            },
          };
        });
        await emitAnalyticsEvents(req, events);
      }
    } catch (error) {
      console.error("Error creating reading list:", error);
      const status = (error as any)?.status;
      if (status) {
        res.status(status).json({ error: (error as Error).message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Update a reading list
router.put(
  "/:id",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const parseResult = updateReadingListSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: parseResult.error.issues });
    }

    try {
      // Verify ownership
      const existingList = await prisma.readingList.findFirst({
        where: {
          id,
          userId: req.userId!,
        },
      });

      if (!existingList) {
        return res.status(404).json({ error: "Reading list not found" });
      }

      // Prevent modification of default lists (except sortOrder)
      if (existingList.isDefault) {
        const hasProtectedField =
          parseResult.data.name !== undefined ||
          parseResult.data.description !== undefined ||
          parseResult.data.color !== undefined ||
          parseResult.data.icon !== undefined ||
          parseResult.data.isPublic !== undefined;
        if (hasProtectedField) {
          return res
            .status(400)
            .json({ error: "Cannot modify default reading lists" });
        }
      }

      const updateData: any = {};
      if (parseResult.data.name !== undefined) updateData.name = parseResult.data.name;
      if (parseResult.data.description !== undefined)
        updateData.description = parseResult.data.description;
      if (parseResult.data.color !== undefined) updateData.color = parseResult.data.color;
      if (parseResult.data.icon !== undefined) updateData.icon = parseResult.data.icon;
      if (parseResult.data.isPublic !== undefined)
        updateData.isPublic = parseResult.data.isPublic;
      if (parseResult.data.sortOrder !== undefined)
        updateData.sortOrder = parseResult.data.sortOrder;

      const list = await prisma.readingList.update({
        where: { id },
        data: updateData,
        include: {
          books: {
            select: {
              bookId: true,
            },
          },
        },
      });

      const formattedList = {
        id: list.id,
        userId: list.userId,
        name: list.name,
        description: list.description,
        color: list.color,
        icon: list.icon,
        isPublic: list.isPublic,
        isDefault: list.isDefault,
        sortOrder: list.sortOrder,
        bookIds: list.books.map((b) => b.bookId),
        bookCount: list.books.length,
        createdAt: list.createdAt.toISOString(),
        updatedAt: list.updatedAt.toISOString(),
      };

      res.json(formattedList);

      await emitAnalyticsEvents(req, [
        {
          type: "READING_LIST_UPDATED",
          payload: {
            listId: formattedList.id,
            listName: formattedList.name,
          },
        },
      ]);
    } catch (error) {
      console.error("Error updating reading list:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete a reading list
router.delete("/:id", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingList = await prisma.readingList.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!existingList) {
      return res.status(404).json({ error: "Reading list not found" });
    }

    if (existingList.isDefault) {
      return res
        .status(400)
        .json({ error: "Cannot delete default reading lists" });
    }

    await prisma.readingList.delete({
      where: { id },
    });

    res.status(204).send();

    await emitAnalyticsEvents(req, [
      {
        type: "READING_LIST_DELETED",
        payload: {
          listId: existingList.id,
          listName: existingList.name,
        },
      },
    ]);
  } catch (error) {
    console.error("Error deleting reading list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Move books between reading lists
router.post(
  "/:id/move-books",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const parseResult = moveBooksSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: parseResult.error.issues });
    }

    try {
      // Verify source list ownership
      const sourceList = await prisma.readingList.findFirst({
        where: {
          id,
          userId: req.userId!,
        },
      });

      if (!sourceList) {
        return res.status(404).json({ error: "Source reading list not found" });
      }

      // Verify target list ownership
      const targetList = await prisma.readingList.findFirst({
        where: {
          id: parseResult.data.targetListId,
          userId: req.userId!,
        },
      });

      if (!targetList) {
        return res.status(404).json({ error: "Target reading list not found" });
      }

      await validateBookIds(parseResult.data.bookIds);

      // Remove books from source list
      await prisma.readingListBook.deleteMany({
        where: {
          readingListId: id,
          bookId: {
            in: parseResult.data.bookIds,
          },
        },
      });

      const sourceBooks = await prisma.readingListBook.findMany({
        where: {
          readingListId: id,
          bookId: { in: parseResult.data.bookIds },
        },
        orderBy: { sortOrder: "asc" },
        select: { bookId: true },
      });
      const orderedBookIds =
        sourceBooks.length > 0
          ? sourceBooks.map((b) => b.bookId)
          : parseResult.data.bookIds;

      // Add books to target list (skip if already exists)
      const existingBooks = await prisma.readingListBook.findMany({
        where: {
          readingListId: parseResult.data.targetListId,
          bookId: {
            in: parseResult.data.bookIds,
          },
        },
        select: { bookId: true },
      });

      const existingBookIds = new Set(existingBooks.map((b) => b.bookId));
      const newBookIds = orderedBookIds.filter(
        (id) => !existingBookIds.has(id)
      );

      if (newBookIds.length > 0) {
        const currentMaxSort = await prisma.readingListBook.findFirst({
          where: { readingListId: parseResult.data.targetListId },
          orderBy: { sortOrder: "desc" },
          select: { sortOrder: true },
        });

        const maxSort = currentMaxSort?.sortOrder ?? -1;

        await prisma.readingListBook.createMany({
          data: newBookIds.map((bookId, index) => ({
            readingListId: parseResult.data.targetListId,
            bookId,
            sortOrder: maxSort + 1 + index,
          })),
        });
      }

      res.status(200).json({ success: true });

      await emitAnalyticsEvents(req, [
        {
          type: "READING_LIST_BOOKS_MOVED",
          payload: {
            listId: parseResult.data.targetListId,
            listName: targetList.name,
          },
        },
      ]);

      const previousStatus = getStatusFromListName(sourceList.name);
      const status = getStatusFromListName(targetList.name);
      if (previousStatus !== status) {
        const bookDetails = await fetchBookDetails(parseResult.data.bookIds);
        const events = parseResult.data.bookIds.map((bookId) => {
          const book = bookDetails.get(bookId);
          const author =
            Array.isArray(book?.authors) && book.authors.length > 0
              ? book.authors[0]?.name
              : undefined;
          return {
            type: "BOOK_STATUS_CHANGED",
            payload: {
              bookId,
              title: book?.title,
              author,
              pages: book?.num_pages,
              genres: book?.genres,
              status,
              previousStatus,
              listName: targetList.name,
            },
          };
        });
        await emitAnalyticsEvents(req, events);
      }
    } catch (error) {
      console.error("Error moving books:", error);
      const status = (error as any)?.status;
      if (status) {
        res.status(status).json({ error: (error as Error).message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Add books to a reading list
router.post(
  "/:id/books",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const bookIdsFromQuery = req.query.bookIds;
    const bookIdsFromBody = req.body?.bookIds;
    const bookIdsRaw = Array.isArray(bookIdsFromBody)
      ? bookIdsFromBody
      : typeof bookIdsFromQuery === "string"
        ? bookIdsFromQuery.split(",").map((v) => v.trim()).filter(Boolean)
        : Array.isArray(bookIdsFromQuery)
          ? bookIdsFromQuery
          : [];

    const bookIdsSchema = z.object({
      bookIds: z.array(z.string()).min(1),
    });

    const parseResult = bookIdsSchema.safeParse({ bookIds: bookIdsRaw });
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: parseResult.error.issues });
    }

    try {
      const list = await prisma.readingList.findFirst({
        where: {
          id,
          userId: req.userId!,
        },
      });

      if (!list) {
        return res.status(404).json({ error: "Reading list not found" });
      }

      await validateBookIds(parseResult.data.bookIds);

      // Get existing books to avoid duplicates
      const existingBooks = await prisma.readingListBook.findMany({
        where: {
          readingListId: id,
          bookId: {
            in: parseResult.data.bookIds,
          },
        },
        select: { bookId: true },
      });

      const existingBookIds = new Set(existingBooks.map((b) => b.bookId));
      const newBookIds = parseResult.data.bookIds.filter(
        (bookId) => !existingBookIds.has(bookId)
      );

      if (newBookIds.length > 0) {
        const currentMaxSort = await prisma.readingListBook.findFirst({
          where: { readingListId: id },
          orderBy: { sortOrder: "desc" },
          select: { sortOrder: true },
        });

        const maxSort = currentMaxSort?.sortOrder ?? -1;

        await prisma.readingListBook.createMany({
          data: newBookIds.map((bookId, index) => ({
            readingListId: id,
            bookId,
            sortOrder: maxSort + 1 + index,
          })),
        });
      }

      // Return updated list
      const updatedList = await prisma.readingList.findUnique({
        where: { id },
        include: {
          books: {
            select: {
              bookId: true,
            },
          },
        },
      });

      const formattedList = {
        id: updatedList!.id,
        userId: updatedList!.userId,
        name: updatedList!.name,
        description: updatedList!.description,
        color: updatedList!.color,
        icon: updatedList!.icon,
        isPublic: updatedList!.isPublic,
        isDefault: updatedList!.isDefault,
        sortOrder: updatedList!.sortOrder,
        bookIds: updatedList!.books.map((b) => b.bookId),
        bookCount: updatedList!.books.length,
        createdAt: updatedList!.createdAt.toISOString(),
        updatedAt: updatedList!.updatedAt.toISOString(),
      };

      res.status(200).json(formattedList);

      if (newBookIds.length > 0) {
        const bookDetails = await fetchBookDetails(newBookIds);
        const status = getStatusFromListName(list.name);
        const events = newBookIds.map((bookId) => {
          const book = bookDetails.get(bookId);
          const author =
            Array.isArray(book?.authors) && book.authors.length > 0
              ? book.authors[0]?.name
              : undefined;
          return {
            type: "BOOK_ADDED",
            payload: {
              bookId,
              title: book?.title,
              author,
              pages: book?.num_pages,
              genres: book?.genres,
              status,
              listName: list.name,
            },
          };
        });
        await emitAnalyticsEvents(req, events);
      }
    } catch (error) {
      console.error("Error adding books to reading list:", error);
      const status = (error as any)?.status;
      if (status) {
        res.status(status).json({ error: (error as Error).message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Remove books from a reading list
router.delete(
  "/:id/books",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const bookIdsFromQuery = req.query.bookIds;
    const bookIdsFromBody = req.body?.bookIds;
    const bookIdsRaw = Array.isArray(bookIdsFromBody)
      ? bookIdsFromBody
      : typeof bookIdsFromQuery === "string"
        ? bookIdsFromQuery.split(",").map((v) => v.trim()).filter(Boolean)
        : Array.isArray(bookIdsFromQuery)
          ? bookIdsFromQuery
          : [];

    const bookIdsSchema = z.object({
      bookIds: z.array(z.string()).min(1),
    });

    const parseResult = bookIdsSchema.safeParse({ bookIds: bookIdsRaw });
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: parseResult.error.issues });
    }

    try {
      const list = await prisma.readingList.findFirst({
        where: {
          id,
          userId: req.userId!,
        },
      });

      if (!list) {
        return res.status(404).json({ error: "Reading list not found" });
      }

      await validateBookIds(parseResult.data.bookIds);

      await prisma.readingListBook.deleteMany({
        where: {
          readingListId: id,
          bookId: {
            in: parseResult.data.bookIds,
          },
        },
      });

      res.status(204).send();

      await emitAnalyticsEvents(req, [
        {
          type: "READING_LIST_BOOKS_REMOVED",
          payload: {
            listId: list.id,
            listName: list.name,
          },
        },
      ]);
    } catch (error) {
      console.error("Error removing books from reading list:", error);
      const status = (error as any)?.status;
      if (status) {
        res.status(status).json({ error: (error as Error).message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Initialize default reading lists for a new user
router.post(
  "/initialize-defaults",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId!;

      // Check if user already has default lists
      const existingDefaults = await prisma.readingList.findMany({
        where: {
          userId,
          isDefault: true,
        },
      });

      if (existingDefaults.length > 0) {
        return res.status(200).json({
          message: "Default lists already exist",
          lists: existingDefaults.map((list) => ({
            id: list.id,
            name: list.name,
          })),
        });
      }

      // Create three default lists
      const defaultLists = [
        {
          name: "Currently Reading",
          description: "Books I'm currently reading",
          color: "#3B82F6",
          icon: "📖",
          isDefault: true,
          isPublic: false,
          sortOrder: 0,
        },
        {
          name: "Want to Read",
          description: "Books I want to read in the future",
          color: "#10B981",
          icon: "📚",
          isDefault: true,
          isPublic: false,
          sortOrder: 1,
        },
        {
          name: "Finished",
          description: "Books I've finished reading",
          color: "#8B5CF6",
          icon: "✅",
          isDefault: true,
          isPublic: false,
          sortOrder: 2,
        },
      ];

      const createdLists = await Promise.all(
        defaultLists.map((listData) =>
          prisma.readingList.create({
            data: {
              userId,
              ...listData,
            },
            include: {
              books: {
                select: {
                  bookId: true,
                },
              },
            },
          })
        )
      );

      const formattedLists = createdLists.map((list) => ({
        id: list.id,
        userId: list.userId,
        name: list.name,
        description: list.description,
        color: list.color,
        icon: list.icon,
        isPublic: list.isPublic,
        isDefault: list.isDefault,
        sortOrder: list.sortOrder,
        bookIds: list.books.map((b) => b.bookId),
        bookCount: list.books.length,
        createdAt: list.createdAt.toISOString(),
        updatedAt: list.updatedAt.toISOString(),
      }));

      res.status(201).json({
        message: "Default reading lists created",
        lists: formattedLists,
      });
    } catch (error) {
      console.error("Error initializing default lists:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
