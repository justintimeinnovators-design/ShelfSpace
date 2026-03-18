"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ArrowLeft,
  Star,
  Calendar,
  User,
  MessageCircle,
  ThumbsUp,
  Share2,
  Bookmark,
  BookmarkCheck,
  MoreHorizontal,
  Eye,
  Heart,
} from "lucide-react";
import { Book } from "@/types/book";
import { BookDiscussion } from "@/types/bookDetail";
import { bookService } from "@/lib/book-service";
import { useReviews } from "@/hooks/data/useReviews";
import { useSession } from "next-auth/react";
import { libraryService } from "@/services/libraryService";
import { ReadingList } from "@/types/library";
import { useToast } from "@/hooks/useToast";

interface BookDetailFeatureProps {
  bookId: string;
}

/**
 * Book Detail Feature.
 * @param { bookId } - { book Id } value.
 */
export function BookDetailFeature({ bookId }: BookDetailFeatureProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "discussions">("overview");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [bookError, setBookError] = useState<string | null>(null);
  const [newReviewText, setNewReviewText] = useState("");
  const [newTldr, setNewTldr] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editTldr, setEditTldr] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [coverFailed, setCoverFailed] = useState(false);
  const [listCache, setListCache] = useState<ReadingList[] | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveTargetListId, setSaveTargetListId] = useState("");
  const [saveListError, setSaveListError] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isSavingBook, setIsSavingBook] = useState(false);

  // Fetch book details from API
  useEffect(() => {
    let cancelled = false;
    setBookLoading(true);
    setBookError(null);
    setCoverFailed(false);
    
    bookService.getBookById(bookId)
      .then((bookData) => {
        if (!cancelled) {
          setBook(bookData);
          setBookLoading(false);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Error fetching book:", error);
          setBookError(error.message || "Failed to load book");
          setBookLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [bookId]);

  // Reviews from API
  const { reviews, loading: reviewsLoading, error: reviewsError, createReview, updateReview, deleteReview } = useReviews(bookId);

  // Discussions - keeping empty for now as there's no discussions backend endpoint yet
  const discussions: BookDiscussion[] = [];

  const loadReadingLists = useCallback(async () => {
    const response = await libraryService.getReadingLists({ includeBooks: false });
    setListCache(response.data as any);
    return response.data as any;
  }, []);

  const ensureDefaultList = useCallback(async () => {
    let lists = listCache || (await loadReadingLists());
    if (!lists || lists.length === 0) {
      await libraryService.initializeDefaults();
      lists = await loadReadingLists();
    }
    return lists;
  }, [listCache, loadReadingLists]);

  const openSaveModal = useCallback(async () => {
    if (!book) return;
    if (!session?.accessToken) {
      toast.error("Please sign in to save books.");
      return;
    }
    setSaveListError(null);
    const lists = await ensureDefaultList();
    const want = lists.find((list: ReadingList) =>
      list.name.toLowerCase().includes("want")
    );
    setSaveTargetListId(want?.id || (lists[0]?.id ?? ""));
    setIsSaveModalOpen(true);
  }, [book, ensureDefaultList, session?.accessToken, toast]);

/**
 * Handle Bookmark.
 */
  const handleBookmark = () => {
    openSaveModal();
  };

/**
 * Handle Share.
 */
  const handleShare = () => {
    if (!book) return;
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out "${book.title}" by ${book.author}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleCreateList = useCallback(async () => {
    const name = newListName.trim();
    if (!name) {
      setSaveListError("Please enter a list name.");
      return;
    }
    setIsCreatingList(true);
    try {
      const created = await libraryService.createReadingList({
        list: { name },
      });
      const lists = await loadReadingLists();
      setSaveTargetListId((created.data as any)?.id || lists[0]?.id || "");
      setNewListName("");
      setSaveListError(null);
    } catch (err: any) {
      setSaveListError(err?.message || "Failed to create list");
    } finally {
      setIsCreatingList(false);
    }
  }, [newListName, loadReadingLists]);

  const confirmSave = useCallback(async () => {
    if (!book || !saveTargetListId) {
      setSaveListError("Please select a list.");
      return;
    }
    setIsSavingBook(true);
    try {
      await libraryService.addBooksToReadingList(saveTargetListId, [book.id]);
      setIsBookmarked(true);
      setIsSaveModalOpen(false);
      toast.success("Saved to your library.");
    } catch (err) {
      console.error("Failed to save book:", err);
      setSaveListError("Failed to save book. Please sign in and try again.");
    } finally {
      setIsSavingBook(false);
    }
  }, [book, saveTargetListId, toast]);

  if (bookLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6 animate-pulse">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3 font-serif">
            Loading Book...
          </h1>
          <p className="text-gray-600 dark:text-slate-300">
            Please wait while we fetch the book details.
          </p>
        </div>
      </div>
    );
  }

  if (bookError || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3 font-serif">
            {bookError ? "Error Loading Book" : "Book Not Found"}
          </h1>
          <p className="text-gray-600 dark:text-slate-300 mb-6">
            {bookError || "The book you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

/**
 * On Create Review.
 */
  const onCreateReview = async () => {
    if (newReviewText.trim().length < 10) {
      alert("Review text must be at least 10 characters long");
      return;
    }
    const trimmedTldr = newTldr.trim();
    await createReview({
      bookId,
      reviewText: newReviewText,
      rating: newRating,
      ...(trimmedTldr && { tldr: trimmedTldr })
    });
    setNewReviewText("");
    setNewTldr("");
    setNewRating(5);
  };

/**
 * Start Edit Review.
 * @param reviewId - review Id value.
 */
  const startEditReview = (reviewId: string) => {
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return;
    setEditingReviewId(reviewId);
    setEditReviewText(review.reviewText || "");
    setEditTldr(review.tldr || "");
    setEditRating(review.rating || 5);
  };

/**
 * Cancel Edit Review.
 */
  const cancelEditReview = () => {
    setEditingReviewId(null);
    setEditReviewText("");
    setEditTldr("");
    setEditRating(5);
  };

/**
 * On Update Review.
 */
  const onUpdateReview = async () => {
    if (!editingReviewId) return;
    if (editReviewText.trim().length < 10) {
      alert("Review text must be at least 10 characters long");
      return;
    }
    const trimmedTldr = editTldr.trim();
    await updateReview(editingReviewId, {
      reviewText: editReviewText,
      rating: editRating,
      ...(trimmedTldr ? { tldr: trimmedTldr } : { tldr: "" }),
    });
    cancelEditReview();
  };

/**
 * On Delete Review.
 * @param reviewId - review Id value.
 */
  const onDeleteReview = async (reviewId: string) => {
    const confirmed = window.confirm("Delete this review? This cannot be undone.");
    if (!confirmed) return;
    await deleteReview(reviewId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative z-10">
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 dark:bg-slate-800/95 border border-amber-200 dark:border-slate-700 text-amber-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
        {/* Book Header */}
        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-slate-700 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="w-64 h-80 bg-gradient-to-br from-amber-100 to-orange-200 dark:from-slate-700 dark:to-slate-600 rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
                {book.coverImage && !coverFailed ? (
                  <img
                    src={book.coverImage}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover"
                    onError={() => setCoverFailed(true)}
                  />
                ) : (
                  <BookOpen className="h-24 w-24 text-amber-600 dark:text-slate-400" />
                )}
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2 font-serif">
                    {book.title}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-slate-400 mb-4">
                    by {book.author}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBookmark}
                    className="p-2 rounded-lg bg-amber-100 dark:bg-slate-700 hover:bg-amber-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="h-5 w-5 text-amber-600 dark:text-slate-300" />
                    ) : (
                      <Bookmark className="h-5 w-5 text-amber-600 dark:text-slate-300" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg bg-amber-100 dark:bg-slate-700 hover:bg-amber-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Share2 className="h-5 w-5 text-amber-600 dark:text-slate-300" />
                  </button>
                </div>
              </div>

              {/* Rating and Stats */}
                <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor((book.averageRating || 0))
                            ? "text-amber-400 fill-current"
                            : "text-gray-300 dark:text-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 dark:text-slate-400">
                    {book.averageRating?.toFixed(1) || "N/A"} ({book.ratingsCount || 0} ratings)
                  </span>
                </div>
                {book.publishedYear && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span>{book.publishedYear}</span>
                  </div>
                )}
                {book.pages && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                    <BookOpen className="h-4 w-4" />
                    <span>{book.pages} pages</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {book.genres && book.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {book.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-amber-100 dark:bg-slate-700 text-amber-700 dark:text-slate-300 rounded-full text-sm font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {book.description && (
                <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                  {book.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-slate-700 p-8">
          <div className="flex border-b border-amber-200 dark:border-slate-700 mb-8">
            {[
              { id: "overview", label: "Overview", icon: BookOpen },
              { id: "reviews", label: `Reviews (${reviews.length})`, icon: MessageCircle },
              { id: "discussions", label: `Discussions (${discussions.length})`, icon: User },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 dark:border-amber-400"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-amber-50 dark:bg-slate-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                    Book Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-slate-400">ISBN:</span>
                      <span className="text-gray-900 dark:text-slate-100">{book.isbn || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-slate-400">Publisher:</span>
                      <span className="text-gray-900 dark:text-slate-100">{book.publisher || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-slate-400">Language:</span>
                      <span className="text-gray-900 dark:text-slate-100">{book.language || "English"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-slate-400">Format:</span>
                      <span className="text-gray-900 dark:text-slate-100">{book.format || "Paperback"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-slate-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                    Reading Progress
                  </h3>
                  <div className="space-y-3">
                    {book.status && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-slate-400">Status:</span>
                        <span className="text-gray-900 dark:text-slate-100 capitalize">{book.status}</span>
                      </div>
                    )}
                    {(book.readingProgress !== undefined || book.progress !== undefined) && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-slate-400">Progress:</span>
                        <span className="text-gray-900 dark:text-slate-100">{book.readingProgress || book.progress || 0}%</span>
                      </div>
                    )}
                    {book.startedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-slate-400">Started:</span>
                        <span className="text-gray-900 dark:text-slate-100">
                          {new Date(book.startedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {book.finishedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-slate-400">Finished:</span>
                        <span className="text-gray-900 dark:text-slate-100">
                          {new Date(book.finishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {book.personalNotes && (
                <div className="bg-amber-50 dark:bg-slate-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                    Personal Notes
                  </h3>
                  <p className="text-gray-700 dark:text-slate-300">{book.personalNotes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {session?.user ? (
                <div className="bg-amber-50 dark:bg-slate-700/50 rounded-lg p-6 border border-amber-200 dark:border-slate-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Write a review</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <select className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm" value={newRating} onChange={(e) => setNewRating(parseInt(e.target.value))}>
                        {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}★</option>)}
                      </select>
                      <button onClick={onCreateReview} className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-600 text-white text-sm">Submit</button>
                    </div>
                    <input 
                      className="w-full px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm" 
                      placeholder="TL;DR (optional)" 
                      value={newTldr} 
                      onChange={(e) => setNewTldr(e.target.value)} 
                    />
                    <textarea 
                      className="w-full px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm min-h-[120px]" 
                      placeholder="Write your review (minimum 10 characters)..." 
                      value={newReviewText} 
                      onChange={(e) => setNewReviewText(e.target.value)} 
                    />
                    {newReviewText.length > 0 && newReviewText.length < 10 && (
                      <p className="text-xs text-red-600">Review must be at least 10 characters ({newReviewText.length}/10)</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600 dark:text-slate-400">Sign in to write a review.</div>
              )}

              {reviewsLoading && (
                <div className="text-sm text-gray-600 dark:text-slate-400">Loading reviews...</div>
              )}
              {reviewsError && (
                <div className="text-sm text-red-600">{reviewsError}</div>
              )}

              {(!reviews || reviews.length === 0) ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                    No Reviews Yet
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400">
                    Be the first to review this book!
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-amber-50 dark:bg-slate-700/50 rounded-lg p-6 border border-amber-200 dark:border-slate-600"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-slate-100">
                            {/* Author name unknown; backend returns userId only */}
                            Anonymous
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "text-amber-400 fill-current"
                                      : "text-gray-300 dark:text-slate-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-slate-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {session?.user?.id && review.userId === session.user.id && (
                        <div className="flex items-center gap-2">
                          {editingReviewId === review.id ? (
                            <>
                              <button
                                onClick={onUpdateReview}
                                className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white text-xs"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditReview}
                                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditReview(review.id)}
                                className="px-3 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => onDeleteReview(review.id)}
                                className="px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 text-xs"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {editingReviewId === review.id ? (
                      <div className="space-y-3 mb-4">
                        <div className="flex gap-3">
                          <select
                            className="px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                            value={editRating}
                            onChange={(e) => setEditRating(parseInt(e.target.value))}
                          >
                            {[1, 2, 3, 4, 5].map((v) => (
                              <option key={v} value={v}>
                                {v}★
                              </option>
                            ))}
                          </select>
                        </div>
                        <input
                          className="w-full px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                          placeholder="TL;DR (optional)"
                          value={editTldr}
                          onChange={(e) => setEditTldr(e.target.value)}
                        />
                        <textarea
                          className="w-full px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm min-h-[120px]"
                          placeholder="Write your review (minimum 10 characters)..."
                          value={editReviewText}
                          onChange={(e) => setEditReviewText(e.target.value)}
                        />
                        {editReviewText.length > 0 && editReviewText.length < 10 && (
                          <p className="text-xs text-red-600">
                            Review must be at least 10 characters ({editReviewText.length}/10)
                          </p>
                        )}
                      </div>
                    ) : (
                      <>
                        {review.tldr && (
                          <div className="mb-2 p-2 bg-amber-100 dark:bg-slate-600 rounded">
                            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">TL;DR: {review.tldr}</p>
                          </div>
                        )}
                        <p className="text-gray-700 dark:text-slate-300 mb-4 whitespace-pre-wrap">{review.reviewText}</p>
                      </>
                    )}

                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                        <ThumbsUp className="h-4 w-4" />
                        <span>0</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>0</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "discussions" && (
            <div className="space-y-6">
              {discussions.length === 0 ? (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                    No Discussions Yet
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400">
                    Start a discussion about this book!
                  </p>
                </div>
              ) : (
                discussions.map((discussion) => (
                  <div
                    key={discussion.id}
                    className="bg-amber-50 dark:bg-slate-700/50 rounded-lg p-6 border border-amber-200 dark:border-slate-600"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-slate-100">
                            {discussion.author}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-slate-400">
                              {new Date(discussion.createdAt).toLocaleDateString()}
                            </span>
                            {discussion.isPinned && (
                              <span className="text-xs bg-amber-200 dark:bg-slate-600 text-amber-800 dark:text-slate-200 px-2 py-1 rounded">
                                Pinned
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-slate-600 transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-slate-400" />
                      </button>
                    </div>

                    <h5 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">
                      {discussion.title}
                    </h5>
                    <p className="text-gray-700 dark:text-slate-300 mb-4">{discussion.content}</p>

                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                        <Heart className="h-4 w-4" />
                        <span>{discussion.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>{discussion.replies}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                        <Eye className="h-4 w-4" />
                        <span>{discussion.views}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>

                    {discussion.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {discussion.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-amber-200 dark:bg-slate-600 text-amber-800 dark:text-slate-200 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-amber-200 dark:border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
              Add to Reading List
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
              Choose where to save this book.
            </p>

            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Select List
            </label>
            <select
              value={saveTargetListId}
              onChange={(e) => setSaveTargetListId(e.target.value)}
              className="w-full px-4 py-3 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {(listCache || []).map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Or create a new list
              </label>
              <div className="flex gap-2">
                <input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="List name"
                />
                <button
                  onClick={handleCreateList}
                  disabled={isCreatingList}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg transition-colors"
                >
                  {isCreatingList ? "Creating..." : "Create"}
                </button>
              </div>
            </div>

            {saveListError && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-3">
                {saveListError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                disabled={!saveTargetListId || isSavingBook}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white transition-colors"
              >
                {isSavingBook ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapped version with error boundary for use in pages
/**
 * Book Detail Feature With Boundary.
 * @param { bookId } - { book Id } value.
 */
export function BookDetailFeatureWithBoundary({ bookId }: { bookId: string }) {
  return <BookDetailFeature bookId={bookId} />;
}
