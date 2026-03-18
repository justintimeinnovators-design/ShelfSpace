import type { Collection } from "mongodb";
import type { AnalyticsDocument, AnalyticsEvent, ActivityItem } from "../types/events.js";

const DEFAULT_GOALS = {
  yearlyGoal: 52,
  monthlyPagesGoal: 3000,
  monthlyHoursGoal: 60,
  targetRating: 4.5,
};

/**
 * Create Default Document.
 * @param userId - user Id value.
 * @param nowIso - now Iso value.
 * @returns AnalyticsDocument.
 */
function createDefaultDocument(userId: string, nowIso: string): AnalyticsDocument {
  return {
    userId,
    stats: {
      totalBooks: 0,
      booksRead: 0,
      currentlyReading: 0,
      wantToRead: 0,
      totalPages: 0,
      totalReadingMinutes: 0,
      totalRating: 0,
      ratingCount: 0,
      currentStreak: 0,
      longestStreak: 0,
    },
    monthly: {},
    genres: {},
    ratings: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
    activity: [],
    goals: { ...DEFAULT_GOALS },
    lastActiveDate: null,
    createdAt: nowIso,
    updatedAt: nowIso,
  } as any;
}

/**
 * Update Streak.
 * Increments currentStreak when the user has activity on consecutive days.
 */
function updateStreak(doc: any, timestamp: string) {
  const today = timestamp.slice(0, 10);
  const last = doc.lastActiveDate;

  if (!last) {
    doc.lastActiveDate = today;
    doc.stats.currentStreak = 1;
    doc.stats.longestStreak = Math.max(1, doc.stats.longestStreak);
    return;
  }
  if (last === today) return;

  const d = new Date(today);
  d.setDate(d.getDate() - 1);
  const yesterday = d.toISOString().slice(0, 10);

  if (last === yesterday) {
    doc.stats.currentStreak += 1;
    doc.stats.longestStreak = Math.max(doc.stats.currentStreak, doc.stats.longestStreak);
  } else {
    doc.stats.currentStreak = 1;
  }
  doc.lastActiveDate = today;
}

/**
 * Format Month.
 * @param timestamp - timestamp value.
 * @returns string.
 */
function formatMonth(timestamp: string): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Add Activity.
 * @param doc - doc value.
 * @param item - item value.
 */
function addActivity(doc: AnalyticsDocument, item: ActivityItem) {
  // Ensure unique id even if the same event fires multiple times in a session
  const existingCount = doc.activity.filter((a) => a.id.startsWith(item.id)).length;
  const uniqueItem = existingCount > 0 ? { ...item, id: `${item.id}-${existingCount}` } : item;
  doc.activity = [uniqueItem, ...doc.activity].slice(0, 50);
}

/**
 * Update Monthly.
 * @param doc - doc value.
 * @param timestamp - timestamp value.
 * @param updates - updates value.
 */
function updateMonthly(doc: AnalyticsDocument, timestamp: string, updates: { books?: number; pages?: number; minutes?: number }) {
  const key = formatMonth(timestamp);
  const current = doc.monthly[key] || { books: 0, pages: 0, minutes: 0 };
  doc.monthly[key] = {
    books: current.books + (updates.books || 0),
    pages: current.pages + (updates.pages || 0),
    minutes: current.minutes + (updates.minutes || 0),
  };
}

/**
 * Increment Genre Counts.
 * @param doc - doc value.
 * @param genres - genres value.
 */
function incrementGenreCounts(doc: AnalyticsDocument, genres?: string[]) {
  if (!genres || genres.length === 0) return;
  genres.forEach((genre) => {
    if (!genre) return;
    doc.genres[genre] = (doc.genres[genre] || 0) + 1;
  });
}

/**
 * Apply Status Delta.
 * @param doc - doc value.
 * @param status - status value.
 * @param delta - delta value.
 */
function applyStatusDelta(doc: AnalyticsDocument, status?: string, delta = 1) {
  if (!status) return;
  if (status === "read" || status === "completed") {
    doc.stats.booksRead += delta;
  } else if (status === "currently-reading") {
    doc.stats.currentlyReading += delta;
  } else if (status === "want-to-read") {
    doc.stats.wantToRead += delta;
  }
}

/**
 * Project Event.
 * @param analyticsCollection - analytics Collection value.
 * @param event - event value.
 */
export async function projectEvent(
  analyticsCollection: Collection<AnalyticsDocument>,
  event: AnalyticsEvent
) {
  const nowIso = new Date().toISOString();
  const timestamp = event.timestamp || nowIso;
  const payload = event.payload || {};

  const existing = await analyticsCollection.findOne({ userId: event.userId });
  const doc = existing || createDefaultDocument(event.userId, nowIso);

  updateStreak(doc, timestamp);

  switch (event.type) {
    case "BOOK_ADDED": {
      doc.stats.totalBooks += 1;
      if (payload.pages) {
        doc.stats.totalPages += payload.pages;
        const minutes = Math.round(payload.pages * 2);
        doc.stats.totalReadingMinutes += minutes;
        updateMonthly(doc, timestamp, { books: 1, pages: payload.pages, minutes });
      } else {
        updateMonthly(doc, timestamp, { books: 1 });
      }
      incrementGenreCounts(doc, payload.genres);
      applyStatusDelta(doc, payload.status, 1);

      addActivity(doc, {
        id: `added-${payload.bookId || timestamp}`,
        type: "added",
        title: "Added to Library",
        description: payload.title
          ? `Added "${payload.title}"`
          : "Added a new book",
        timestamp,
        metadata: {
          bookId: payload.bookId,
          title: payload.title,
          author: payload.author,
          genres: payload.genres,
        },
      });
      break;
    }
    case "BOOK_STATUS_CHANGED": {
      applyStatusDelta(doc, payload.previousStatus, -1);
      applyStatusDelta(doc, payload.status, 1);
      const title = payload.status === "read" ? "Finished Reading" : "Updated Reading Status";
      addActivity(doc, {
        id: `status-${payload.bookId || timestamp}`,
        type: payload.status === "read" ? "read" : "started",
        title,
        description: payload.title
          ? `${title}: "${payload.title}"`
          : title,
        timestamp,
        metadata: {
          bookId: payload.bookId,
          title: payload.title,
          author: payload.author,
          status: payload.status,
        },
      });
      break;
    }
    case "BOOK_FINISHED": {
      doc.stats.booksRead += 1;
      addActivity(doc, {
        id: `finished-${payload.bookId || timestamp}`,
        type: "read",
        title: "Finished Reading",
        description: payload.title
          ? `Completed "${payload.title}"`
          : "Completed a book",
        timestamp,
        metadata: {
          bookId: payload.bookId,
          title: payload.title,
          author: payload.author,
        },
      });
      break;
    }
    case "BOOK_RATED": {
      if (typeof payload.rating === "number") {
        const rating = Math.round(payload.rating);
        if (rating >= 1 && rating <= 5) {
          doc.ratings[String(rating)] = (doc.ratings[String(rating)] || 0) + 1;
          doc.stats.totalRating += payload.rating;
          doc.stats.ratingCount += 1;
        }
      }
      addActivity(doc, {
        id: `rated-${payload.bookId || timestamp}`,
        type: "rated",
        title: payload.rating ? `Rated ${payload.rating} Stars` : "Rated a book",
        description: payload.title
          ? `Rated "${payload.title}"`
          : "Rated a book",
        timestamp,
        metadata: {
          bookId: payload.bookId,
          title: payload.title,
          author: payload.author,
          rating: payload.rating,
        },
      });
      break;
    }
    case "BOOK_PROGRESS": {
      addActivity(doc, {
        id: `progress-${payload.bookId || timestamp}`,
        type: "progress",
        title: "Updated Progress",
        description: payload.title
          ? `Progress updated for "${payload.title}"`
          : "Updated reading progress",
        timestamp,
        metadata: {
          bookId: payload.bookId,
          title: payload.title,
          author: payload.author,
          progress: payload.progress,
        },
      });
      break;
    }
    case "READING_SESSION": {
      const minutes = payload.minutes || 0;
      if (minutes > 0) {
        doc.stats.totalReadingMinutes += minutes;
        updateMonthly(doc, timestamp, { minutes });
      }
      addActivity(doc, {
        id: `session-${timestamp}`,
        type: "session",
        title: "Reading Session",
        description: minutes > 0 ? `Read for ${minutes} minutes` : "Reading session logged",
        timestamp,
        metadata: { minutes },
      });
      break;
    }
    case "READING_LIST_CREATED": {
      addActivity(doc, {
        id: `list-created-${payload.listId || timestamp}`,
        type: "added",
        title: "Reading List Created",
        description: payload.listName ? `Created "${payload.listName}"` : "Created a reading list",
        timestamp,
        metadata: {
          listId: payload.listId,
          listName: payload.listName,
        },
      });
      break;
    }
    case "READING_LIST_UPDATED": {
      addActivity(doc, {
        id: `list-updated-${payload.listId || timestamp}`,
        type: "progress",
        title: "Reading List Updated",
        description: payload.listName ? `Updated "${payload.listName}"` : "Updated a reading list",
        timestamp,
        metadata: {
          listId: payload.listId,
          listName: payload.listName,
        },
      });
      break;
    }
    case "READING_LIST_DELETED": {
      addActivity(doc, {
        id: `list-deleted-${payload.listId || timestamp}`,
        type: "progress",
        title: "Reading List Deleted",
        description: payload.listName ? `Deleted "${payload.listName}"` : "Deleted a reading list",
        timestamp,
        metadata: {
          listId: payload.listId,
          listName: payload.listName,
        },
      });
      break;
    }
    case "FORUM_JOINED": {
      addActivity(doc, {
        id: `forum-joined-${payload.forumId || timestamp}`,
        type: "started",
        title: "Joined Forum",
        description: payload.forumName ? `Joined "${payload.forumName}"` : "Joined a forum",
        timestamp,
        metadata: {
          forumId: payload.forumId,
          forumName: payload.forumName,
        },
      });
      break;
    }
    case "FORUM_LEFT": {
      addActivity(doc, {
        id: `forum-left-${payload.forumId || timestamp}`,
        type: "progress",
        title: "Left Forum",
        description: payload.forumName ? `Left "${payload.forumName}"` : "Left a forum",
        timestamp,
        metadata: {
          forumId: payload.forumId,
          forumName: payload.forumName,
        },
      });
      break;
    }
    case "THREAD_CREATED": {
      addActivity(doc, {
        id: `thread-${payload.threadId || timestamp}`,
        type: "started",
        title: "Thread Created",
        description: payload.threadTitle
          ? `Started "${payload.threadTitle}"`
          : "Started a new thread",
        timestamp,
        metadata: {
          forumId: payload.forumId,
          forumName: payload.forumName,
          threadId: payload.threadId,
          threadTitle: payload.threadTitle,
        },
      });
      break;
    }
    case "POST_CREATED": {
      addActivity(doc, {
        id: `post-${payload.postId || timestamp}`,
        type: "progress",
        title: "Posted in Forum",
        description: payload.threadTitle
          ? `Replied in "${payload.threadTitle}"`
          : "Posted in a thread",
        timestamp,
        metadata: {
          forumId: payload.forumId,
          forumName: payload.forumName,
          threadId: payload.threadId,
          threadTitle: payload.threadTitle,
          postId: payload.postId,
        },
      });
      break;
    }
    case "CHAT_SESSION_CREATED": {
      addActivity(doc, {
        id: `chat-session-${payload.sessionId || timestamp}`,
        type: "session",
        title: "Chat Session Started",
        description: "Started a new chat session",
        timestamp,
        metadata: { sessionId: payload.sessionId },
      });
      break;
    }
    case "CHAT_MESSAGE_SENT": {
      addActivity(doc, {
        id: `chat-message-${payload.sessionId || timestamp}`,
        type: "session",
        title: "Chat Message Sent",
        description: "Sent a chat message",
        timestamp,
        metadata: { sessionId: payload.sessionId, messageLength: payload.messageLength },
      });
      break;
    }
    case "CHATBOT_QUERY": {
      addActivity(doc, {
        id: `chatbot-${payload.sessionId || timestamp}`,
        type: "session",
        title: "AI Query",
        description: "Asked ShelfAI a question",
        timestamp,
        metadata: { sessionId: payload.sessionId },
      });
      break;
    }
    case "USER_PROFILE_UPDATED": {
      addActivity(doc, {
        id: `profile-updated-${timestamp}`,
        type: "progress",
        title: "Profile Updated",
        description: "Updated profile details",
        timestamp,
      });
      break;
    }
    default:
      break;
  }

  doc.updatedAt = nowIso;

  if (existing) {
    await analyticsCollection.replaceOne({ userId: event.userId }, doc);
  } else {
    await analyticsCollection.insertOne(doc);
  }
}
