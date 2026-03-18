"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { userApi } from "@/lib/user-api";
import { bookService } from "@/lib/book-service";
import { ReviewService } from "@/lib/review-service";
import { ForumService } from "@/lib/forum-service";
import { libraryService } from "@/services/libraryService";

/**
 * Result Box.
 * @param { value } - { value } value.
 */
function ResultBox({ value }: { value: any }) {
  if (value === null || value === undefined) return null;
  return (
    <pre className="mt-3 p-3 rounded-lg bg-amber-50/70 dark:bg-slate-700/40 border border-amber-200 dark:border-slate-600 text-xs overflow-x-auto">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

/**
 * Services Console.
 */
export function ServicesConsole() {
  const { data: session } = useSession();
  const token = session?.accessToken || "";
  const userId = session?.user?.id || "";

  const [userResult, setUserResult] = useState<any>(null);
  const [bookResult, setBookResult] = useState<any>(null);
  const [libraryResult, setLibraryResult] = useState<any>(null);
  const [reviewResult, setReviewResult] = useState<any>(null);
  const [forumResult, setForumResult] = useState<any>(null);

  const [bookId, setBookId] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [forumId, setForumId] = useState("");
  const [threadId, setThreadId] = useState("");
  const [postId, setPostId] = useState("");
  const [listId, setListId] = useState("");

  const [newBookTitle, setNewBookTitle] = useState("Console Book");
  const [newBookAuthor, setNewBookAuthor] = useState("Console Author");
  const [searchQuery, setSearchQuery] = useState("test");

  const [newReviewText, setNewReviewText] = useState("Console review text");
  const [newReviewRating, setNewReviewRating] = useState(5);

  const [newForumName, setNewForumName] = useState("Console Forum");
  const [newForumDescription, setNewForumDescription] = useState("Console forum description");

  const [newThreadTitle, setNewThreadTitle] = useState("Console Thread");
  const [newThreadContent, setNewThreadContent] = useState("Thread content");

  const [newPostContent, setNewPostContent] = useState("Post content");

  const [newListName, setNewListName] = useState("Console List");
  const [newListDescription, setNewListDescription] = useState("List description");
  const [targetListId, setTargetListId] = useState("");

  const [adminUserId, setAdminUserId] = useState("");
  const [adminStatus, setAdminStatus] = useState<"ACTIVE" | "SUSPENDED" | "BANNED" | "DEACTIVATED">("ACTIVE");

  const [prefTheme, setPrefTheme] = useState<"LIGHT" | "DARK" | "SYSTEM">("LIGHT");
  const [prefLanguage, setPrefLanguage] = useState("en");

  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 font-serif mb-6">
          Services Console
        </h1>
        <p className="text-gray-600 dark:text-slate-400 mb-8">
          Uses your current session token. Sign in to execute authenticated routes.
        </p>

        {/* User Service */}
        <section className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">User Service</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={async () => setUserResult(await userApi.verify(token))} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">Verify Token</button>
            <button onClick={async () => setUserResult(await userApi.getMe(token))} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">Get Me</button>
            <button onClick={async () => setUserResult(await userApi.getPreferences(token))} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">Get Preferences</button>
            <button
              onClick={async () =>
                setUserResult(
                  await userApi.updatePreferences(token, {
                    theme: prefTheme,
                    language: prefLanguage,
                    notificationsEmail: false,
                    notificationsSMS: false,
                    newsletterOptIn: false,
                    dailyDigest: false,
                    defaultSortOrder: "MOST_RECENT",
                    defaultViewMode: "CARD",
                    compactMode: false,
                    accessibilityFont: false,
                    reducedMotion: false,
                    autoPlayMedia: false,
                  })
                )
              }
              className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white"
            >
              Update Preferences
            </button>
            <button onClick={async () => setUserResult(await userApi.getStats(token))} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">Get Stats</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Bio" value={profileBio} onChange={(e) => setProfileBio(e.target.value)} />
            <button onClick={async () => setUserResult(await userApi.updateMe(token, { name: profileName, bio: profileBio }))} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">Update Profile</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <select className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" value={prefTheme} onChange={(e) => setPrefTheme(e.target.value as any)}>
              <option value="LIGHT">LIGHT</option>
              <option value="DARK">DARK</option>
              <option value="SYSTEM">SYSTEM</option>
            </select>
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="language" value={prefLanguage} onChange={(e) => setPrefLanguage(e.target.value)} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="User ID (token)" value={adminUserId} onChange={(e) => setAdminUserId(e.target.value)} />
            <button onClick={async () => setUserResult(await userApi.getTokenForUser(adminUserId))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Get Token by UserId</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <select className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" value={adminStatus} onChange={(e) => setAdminStatus(e.target.value as any)}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="BANNED">BANNED</option>
              <option value="DEACTIVATED">DEACTIVATED</option>
            </select>
            <button onClick={async () => setUserResult(await userApi.updateUserStatus(token, adminUserId, adminStatus))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Update User Status</button>
            <button onClick={async () => setUserResult(await userApi.resetUserPreferences(token, adminUserId))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Reset Preferences</button>
          </div>
          <ResultBox value={userResult} />
        </section>

        {/* Book Service */}
        <section className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">Book Service</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={async () => setBookResult(await bookService.getBooks({ page: 1, limit: 5 }))} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">List Books</button>
            <button onClick={async () => setBookResult(await bookService.searchBooks(searchQuery, 1))} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">Search Books</button>
            <button onClick={async () => setBookResult(await bookService.getGenres())} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">Genres</button>
            <button onClick={async () => setBookResult(await bookService.getAuthors())} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">Authors</button>
            <button onClick={async () => setBookResult(await bookService.getLanguages())} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">Languages</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Search query" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Book ID" value={bookId} onChange={(e) => setBookId(e.target.value)} />
            <button onClick={async () => setBookResult(await bookService.getBookById(bookId))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Get Book</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Title" value={newBookTitle} onChange={(e) => setNewBookTitle(e.target.value)} />
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Author" value={newBookAuthor} onChange={(e) => setNewBookAuthor(e.target.value)} />
            <button
              onClick={async () => {
                const response = await libraryService.createBook({
                  title: newBookTitle,
                  author: newBookAuthor,
                  description: "Console created",
                  genres: ["Console"],
                });
                setBookResult(response.data);
                setBookId(response.data.id);
              }}
              className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800"
            >
              Create Book
            </button>
            <button
              onClick={async () => {
                const response = await libraryService.updateBook({ 
                  id: bookId, 
                  updates: { title: `${newBookTitle} (Updated)` } 
                });
                setBookResult(response.data);
              }}
              className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800"
            >
              Update Book
            </button>
            <button
              onClick={async () => {
                await libraryService.deleteBook(bookId);
                setBookResult({ deleted: true });
              }}
              className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800"
            >
              Delete Book
            </button>
          </div>
          <ResultBox value={bookResult} />
        </section>

        {/* Library Service */}
        <section className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">User Library Service</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={async () => setLibraryResult(await libraryService.initializeDefaults())} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">Init Defaults</button>
            <button onClick={async () => setLibraryResult(await libraryService.getReadingLists({ includeBooks: true }))} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">List Reading Lists</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="List ID" value={listId} onChange={(e) => setListId(e.target.value)} />
            <button onClick={async () => setLibraryResult(await libraryService.getReadingList(listId, true))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Get List</button>
            <button onClick={async () => setLibraryResult(await libraryService.deleteReadingList({ id: listId }))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Delete List</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="New list name" value={newListName} onChange={(e) => setNewListName(e.target.value)} />
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Description" value={newListDescription} onChange={(e) => setNewListDescription(e.target.value)} />
            <button
              onClick={async () => {
                const res = await libraryService.createReadingList({ list: { name: newListName, description: newListDescription } } as any);
                setLibraryResult(res);
                setListId(res.data.id);
              }}
              className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800"
            >
              Create List
            </button>
            <button onClick={async () => setLibraryResult(await libraryService.updateReadingList({ id: listId, updates: { name: `${newListName} Updated` } } as any))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Update List</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Book ID" value={bookId} onChange={(e) => setBookId(e.target.value)} />
            <button onClick={async () => setLibraryResult(await libraryService.addBooksToReadingList(listId, [bookId]))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Add Book</button>
            <button onClick={async () => setLibraryResult(await libraryService.removeBooksFromReadingList(listId, [bookId]))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Remove Book</button>
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Target List ID" value={targetListId} onChange={(e) => setTargetListId(e.target.value)} />
            <button onClick={async () => setLibraryResult(await libraryService.moveBooks({ sourceListId: listId, targetListId, bookIds: [bookId] } as any))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Move Book</button>
          </div>
          <ResultBox value={libraryResult} />
        </section>

        {/* Review Service */}
        <section className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">Review Service</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={async () => setReviewResult(await ReviewService.listByBook(bookId))} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">List by Book</button>
            <button onClick={async () => setReviewResult(await ReviewService.listByUser(userId))} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">List by User</button>
            <button onClick={async () => setReviewResult(await ReviewService.getById(reviewId))} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">Get by Id</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Book ID" value={bookId} onChange={(e) => setBookId(e.target.value)} />
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Review ID" value={reviewId} onChange={(e) => setReviewId(e.target.value)} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Review text" value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)} />
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" type="number" min={1} max={5} value={newReviewRating} onChange={(e) => setNewReviewRating(Number(e.target.value))} />
            <button
              onClick={async () => {
                const created = await ReviewService.create({ bookId, reviewText: newReviewText, rating: newReviewRating });
                setReviewResult(created);
                setReviewId(created.id);
              }}
              className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800"
            >
              Create Review
            </button>
            <button onClick={async () => setReviewResult(await ReviewService.update(reviewId, { reviewText: `${newReviewText} updated`, rating: newReviewRating }))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Update Review</button>
            <button onClick={async () => setReviewResult(await ReviewService.remove(reviewId))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Delete Review</button>
          </div>
          <ResultBox value={reviewResult} />
        </section>

        {/* Forum Service */}
        <section className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">Forum Service</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={async () => setForumResult(await ForumService.list())} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">List Forums</button>
            <button onClick={async () => setForumResult(await ForumService.getById(forumId))} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">Get Forum</button>
            <button onClick={async () => setForumResult(await ForumService.getMembers(forumId))} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">Members</button>
            <button onClick={async () => setForumResult(await ForumService.verifyMembership(forumId, userId))} className="px-3 py-2 text-sm rounded bg-amber-500 hover:bg-amber-600 text-white">Verify Membership</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Forum ID" value={forumId} onChange={(e) => setForumId(e.target.value)} />
            <button onClick={async () => setForumResult(await ForumService.join(forumId))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Join</button>
            <button onClick={async () => setForumResult(await ForumService.leave(forumId))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Leave</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Name" value={newForumName} onChange={(e) => setNewForumName(e.target.value)} />
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Description" value={newForumDescription} onChange={(e) => setNewForumDescription(e.target.value)} />
            <button
              onClick={async () => {
                const created = await ForumService.create({ name: newForumName, description: newForumDescription, isPublic: true, tags: ["console"] });
                setForumResult(created);
                setForumId(created.id);
              }}
              className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800"
            >
              Create Forum
            </button>
            <button onClick={async () => setForumResult(await ForumService.update(forumId, { description: `${newForumDescription} updated` }))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Update Forum</button>
            <button onClick={async () => setForumResult(await ForumService.delete(forumId))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Delete Forum</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Thread ID" value={threadId} onChange={(e) => setThreadId(e.target.value)} />
            <button onClick={async () => setForumResult(await ForumService.listThreads(forumId))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">List Threads</button>
            <button onClick={async () => setForumResult(await ForumService.getThread(forumId, threadId))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Get Thread</button>
            <button onClick={async () => setForumResult(await ForumService.updateThread(forumId, threadId, { title: `${newThreadTitle} updated` }))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Update Thread</button>
            <button onClick={async () => setForumResult(await ForumService.deleteThread(forumId, threadId))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Delete Thread</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Thread title" value={newThreadTitle} onChange={(e) => setNewThreadTitle(e.target.value)} />
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Thread content" value={newThreadContent} onChange={(e) => setNewThreadContent(e.target.value)} />
            <button
              onClick={async () => {
                const created = await ForumService.createThread(forumId, { title: newThreadTitle, content: newThreadContent });
                setForumResult(created);
                setThreadId(created.id);
              }}
              className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800"
            >
              Create Thread
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Post ID" value={postId} onChange={(e) => setPostId(e.target.value)} />
            <button onClick={async () => setForumResult(await ForumService.listPosts(forumId, threadId))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">List Posts</button>
            <button onClick={async () => setForumResult(await ForumService.updatePost(forumId, threadId, postId, { content: `${newPostContent} updated` }))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Update Post</button>
            <button onClick={async () => setForumResult(await ForumService.deletePost(forumId, threadId, postId))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Delete Post</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" placeholder="Post content" value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} />
            <button
              onClick={async () => {
                const created = await ForumService.createPost(forumId, threadId, { content: newPostContent });
                setForumResult(created);
                setPostId(created.id);
              }}
              className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800"
            >
              Create Post
            </button>
            <button onClick={async () => setForumResult(await ForumService.addReaction(forumId, threadId, postId, "LIKE"))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Add Reaction</button>
            <button onClick={async () => setForumResult(await ForumService.removeReaction(forumId, threadId, postId, "LIKE"))} className="px-3 py-2 text-sm rounded bg-amber-100 hover:bg-amber-200 text-amber-800">Remove Reaction</button>
          </div>
          <ResultBox value={forumResult} />
        </section>
      </div>
    </div>
  );
}
