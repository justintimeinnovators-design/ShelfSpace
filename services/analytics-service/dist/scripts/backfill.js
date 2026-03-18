import axios from "axios";
const ANALYTICS_API_URL = process.env.ANALYTICS_API_URL || "http://localhost:3008/api/analytics";
const USER_LIBRARY_SERVICE_URL = process.env.USER_LIBRARY_SERVICE_URL || "http://localhost:3003";
const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL || "http://localhost:3004";
const REVIEW_SERVICE_URL = process.env.REVIEW_SERVICE_URL || "http://localhost:3002";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const USER_ID = process.env.USER_ID;
const ACCESS_TOKENS = process.env.ACCESS_TOKENS;
const USER_IDS = process.env.USER_IDS;
if ((!ACCESS_TOKEN || !USER_ID) && (!ACCESS_TOKENS || !USER_IDS)) {
    console.error("ACCESS_TOKEN + USER_ID or ACCESS_TOKENS + USER_IDS are required");
    process.exit(1);
}
/**
 * Get Status From List Name.
 * @param name - name value.
 * @returns string | undefined.
 */
function getStatusFromListName(name) {
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
 * Fetch Book.
 * @param bookId - book Id value.
 */
async function fetchBook(bookId) {
    try {
        const response = await axios.get(`${BOOK_SERVICE_URL}/api/books/${bookId}`, { timeout: 5000 });
        return response.data;
    }
    catch {
        return null;
    }
}
/**
 * Get User Auth Pairs.
 * @returns Array<{ userId: string; accessToken: string }>.
 */
function getUserAuthPairs() {
    if (USER_IDS && ACCESS_TOKENS) {
        const ids = USER_IDS.split(",").map((id) => id.trim()).filter(Boolean);
        const tokens = ACCESS_TOKENS.split(",").map((t) => t.trim()).filter(Boolean);
        if (ids.length !== tokens.length) {
            throw new Error("USER_IDS and ACCESS_TOKENS must have the same length");
        }
        return ids.map((userId, index) => ({ userId, accessToken: tokens[index] }));
    }
    return [{ userId: USER_ID, accessToken: ACCESS_TOKEN }];
}
/**
 * Fetch User Reviews.
 * @param userId - user Id value.
 */
async function fetchUserReviews(userId) {
    try {
        const response = await axios.get(`${REVIEW_SERVICE_URL}/reviews/user/${userId}`, {
            params: { limit: 500, offset: 0 },
            timeout: 10000,
        });
        return Array.isArray(response.data) ? response.data : [];
    }
    catch {
        return [];
    }
}
/**
 * Backfill For User.
 * @param userId - user Id value.
 * @param accessToken - access Token value.
 */
async function backfillForUser(userId, accessToken) {
    const authHeader = { Authorization: `Bearer ${accessToken}` };
    const listsResponse = await axios.get(`${USER_LIBRARY_SERVICE_URL}/reading-lists`, {
        params: { includeBooks: "false" },
        headers: authHeader,
    });
    const lists = listsResponse.data || [];
    const events = [];
    for (const list of lists) {
        const status = getStatusFromListName(list.name);
        for (const bookId of list.bookIds || []) {
            const book = await fetchBook(bookId);
            const author = Array.isArray(book?.authors) && book.authors.length > 0
                ? book.authors[0]?.name
                : undefined;
            events.push({
                type: "BOOK_ADDED",
                userId,
                payload: {
                    bookId,
                    title: book?.title,
                    author,
                    pages: book?.num_pages,
                    genres: book?.genres,
                    status,
                    listName: list.name,
                },
            });
            if (typeof book?.rating === "number") {
                events.push({
                    type: "BOOK_RATED",
                    userId,
                    payload: {
                        bookId,
                        title: book?.title,
                        author,
                        rating: book.rating,
                    },
                });
            }
            if (typeof book?.readingProgress === "number") {
                events.push({
                    type: "BOOK_PROGRESS",
                    userId,
                    payload: {
                        bookId,
                        title: book?.title,
                        author,
                        progress: book.readingProgress,
                    },
                });
            }
        }
    }
    const reviews = await fetchUserReviews(userId);
    for (const review of reviews) {
        if (typeof review?.rating !== "number")
            continue;
        const book = await fetchBook(review.bookId);
        const author = Array.isArray(book?.authors) && book.authors.length > 0
            ? book.authors[0]?.name
            : undefined;
        events.push({
            type: "BOOK_RATED",
            userId,
            payload: {
                bookId: review.bookId,
                title: book?.title,
                author,
                rating: review.rating,
            },
        });
    }
    if (events.length === 0) {
        console.log(`No events to backfill for user ${userId}`);
        return;
    }
    const chunkSize = 50;
    for (let i = 0; i < events.length; i += chunkSize) {
        const chunk = events.slice(i, i + chunkSize);
        await axios.post(`${ANALYTICS_API_URL}/events`, { events: chunk }, { headers: authHeader });
        console.log(`User ${userId}: processed ${Math.min(i + chunkSize, events.length)} of ${events.length}`);
    }
}
/**
 * Main.
 */
async function main() {
    const pairs = getUserAuthPairs();
    for (const { userId, accessToken } of pairs) {
        await backfillForUser(userId, accessToken);
    }
}
main().catch((error) => {
    console.error("Backfill failed", error);
    process.exit(1);
});
