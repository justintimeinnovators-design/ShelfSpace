"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/api-utils";
import { ForumService, ForumDTO } from "@/lib/forum-service";
import { ReviewService, ReviewDTO } from "@/lib/review-service";
import { libraryService } from "@/services/libraryService";
import { bookService } from "@/lib/book-service";
import { toListSlug } from "@/lib/slug";
import { Book } from "@/types/book";
import { ReadingList } from "@/types/library";
import {
  BookOpen,
  Users,
  Star,
  Library,
  MapPin,
  Calendar,
} from "lucide-react";

type ProfileSettingsBlob = {
  profile?: {
    location?: string;
    favoriteGenres?: string[];
  };
  preferences?: {
    readingGoal?: number;
    bookFormat?: string;
  };
};

interface ProfilePageClientProps {
  userId?: string;
}

/**
 * Profile Page Client.
 * @param { userId } - { user Id } value.
 */
export function ProfilePageClient({ userId }: ProfilePageClientProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
  });
  const [settings, setSettings] = useState<ProfileSettingsBlob>({});
  const [readingLists, setReadingLists] = useState<ReadingList[]>([]);
  const [forums, setForums] = useState<ForumDTO[]>([]);
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [reviewBooks, setReviewBooks] = useState<Record<string, Book>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || session?.user?.id || "";
  const isSelf = !userId || userId === session?.user?.id;

  useEffect(() => {
    let isMounted = true;

/**
 * Load Profile.
 */
    const loadProfile = async () => {
      if (!targetUserId) return;
      setLoading(true);
      setError(null);
      try {
        if (isSelf) {
          const [userRes, prefRes] = await Promise.allSettled([
            apiClient.get("/api/user/me"),
            apiClient.get("/api/user/preferences"),
          ]);

          if (userRes.status === "fulfilled") {
            const user = userRes.value.data;
            if (isMounted) {
              setProfile({
                name: user?.name || "",
                email: user?.email || "",
                bio: user?.bio || "",
              });
            }
          }

          if (prefRes.status === "fulfilled") {
            const pref = prefRes.value.data;
            if (isMounted) {
              setSettings(pref?.settings ?? {});
            }
          }
        } else {
          const publicRes = await apiClient.get(`/api/user/public/${targetUserId}`);
          if (isMounted) {
            setProfile({
              name: publicRes.data?.name || "",
              email: "",
              bio: publicRes.data?.bio || "",
            });
            setSettings({});
          }
        }

        const listPromise = isSelf
          ? libraryService.getReadingLists({ includeBooks: false })
          : Promise.resolve({ data: [] as ReadingList[] } as any);

        const [listRes, forumRes, reviewRes] = await Promise.allSettled([
          listPromise,
          ForumService.list({ limit: 200 }),
          ReviewService.listByUser(targetUserId, { limit: 20 }),
        ]);

        if (isMounted && listRes.status === "fulfilled") {
          setReadingLists(listRes.value.data || []);
        }
        if (isMounted && forumRes.status === "fulfilled") {
          const allForums = forumRes.value;
          const activeForums = allForums.filter((forum) =>
            forum.memberships?.some((m) => m.userId === targetUserId)
          );
          setForums(activeForums);
        }
        if (isMounted && reviewRes.status === "fulfilled") {
          setReviews(reviewRes.value || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [targetUserId, isSelf, session?.user?.id]);

  useEffect(() => {
    let isMounted = true;
/**
 * Load Review Books.
 */
    const loadReviewBooks = async () => {
      if (!reviews.length) return;
      const uniqueIds = Array.from(new Set(reviews.map((r) => r.bookId))).slice(0, 10);
      try {
        const results = await Promise.all(
          uniqueIds.map(async (id) => [id, await bookService.getBookById(id)] as const)
        );
        if (isMounted) {
          const map: Record<string, Book> = {};
          results.forEach(([id, book]) => {
            map[id] = book;
          });
          setReviewBooks(map);
        }
      } catch {
        // Best-effort
      }
    };
    loadReviewBooks();
    return () => {
      isMounted = false;
    };
  }, [reviews]);

  const favoriteGenres = settings.profile?.favoriteGenres || [];
  const readingGoal = settings.preferences?.readingGoal;
  const bookFormat = settings.preferences?.bookFormat;

  const formattedReadingGoal = useMemo(() => {
    if (!readingGoal) return "Not set";
    return `${readingGoal} books/year`;
  }, [readingGoal]);

  if (!session?.user && !userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            Sign in to view your profile
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Please sign in to see your profile details.
          </p>
        </div>
      </div>
    );
  }

  const usernameSlug = (profile.name || profile.email || "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(71,85,105,0.25),transparent_50%)]">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-red-50/80 dark:from-slate-950/80 dark:via-slate-900/80 dark:to-slate-800/80" />
      <div className="relative container mx-auto px-4 py-12">
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 border border-amber-200/70 dark:border-slate-700 text-amber-700 dark:text-amber-200 text-sm mb-6"
        >
          Back
        </button>
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-700/80 dark:text-amber-300/80 font-semibold">
            Reader Profile
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-gray-900 dark:text-slate-100 mt-3">
            ShelfSpace Reading Ledger
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-slate-300 max-w-2xl mt-4">
            A curated snapshot of your reading life, the conversations you keep, and the reviews you leave behind.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-4">
            <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-200/70 dark:border-slate-700 p-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {(profile.name || profile.email || "U").slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-slate-100">
                    {profile.name || "Your Profile"}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{profile.email}</p>
                </div>
              </div>

              {profile.bio && (
                <p className="text-sm text-gray-700 dark:text-slate-300 mt-5 leading-relaxed">
                  {profile.bio}
                </p>
              )}

              <div className="mt-6 space-y-3 text-sm text-gray-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{settings.profile?.location || "Location not set"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedReadingGoal}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{bookFormat ? `${bookFormat} reader` : "Any format"}</span>
                </div>
              </div>

              {favoriteGenres.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold mb-3">
                    Favorite Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {favoriteGenres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 text-xs rounded-full bg-amber-100/80 dark:bg-slate-700 text-amber-700 dark:text-slate-200"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          <section className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-amber-200/70 dark:border-slate-700 p-4 shadow-lg">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold">
                  Lists
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mt-2">
                  {readingLists.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-400">Reading lists curated</p>
              </div>
              <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-amber-200/70 dark:border-slate-700 p-4 shadow-lg">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold">
                  Forums
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mt-2">
                  {forums.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-400">Communities joined</p>
              </div>
              <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-amber-200/70 dark:border-slate-700 p-4 shadow-lg">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold">
                  Reviews
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mt-2">
                  {reviews.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-400">Reflections shared</p>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-200/70 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Library className="h-5 w-5 text-amber-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Reading Lists</h2>
              </div>
            {loading ? (
              <p className="text-sm text-gray-600 dark:text-slate-400">Loading lists...</p>
            ) : !isSelf ? (
              <p className="text-sm text-gray-600 dark:text-slate-400">Reading lists are private.</p>
            ) : readingLists.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-slate-400">No reading lists yet.</p>
            ) : (
                <div className="divide-y divide-amber-100/70 dark:divide-slate-700">
                  {readingLists.map((list) => (
                    <Link
                      key={list.id}
                      href={`/profile/${usernameSlug}/lists/${toListSlug(list)}`}
                      className="py-3 flex items-start justify-between gap-4 hover:bg-amber-50/60 dark:hover:bg-slate-700/50 rounded-xl px-3 -mx-3 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-slate-100">{list.name}</p>
                        {list.description && (
                          <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">{list.description}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-slate-300">
                        {list.bookIds?.length || 0} books
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-200/70 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-5 w-5 text-amber-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Active Forums</h2>
                </div>
                {loading ? (
                  <p className="text-sm text-gray-600 dark:text-slate-400">Loading forums...</p>
                ) : forums.length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-slate-400">No forum memberships yet.</p>
                ) : (
                  <div className="space-y-3">
                    {forums.map((forum) => (
                      <div key={forum.id} className="p-3 rounded-xl bg-amber-50/70 dark:bg-slate-700/60">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 dark:text-slate-100">{forum.name}</span>
                          <span className="text-xs text-gray-500 dark:text-slate-300">
                            {forum.threadCount ?? 0} threads
                          </span>
                        </div>
                        {forum.description && (
                          <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">{forum.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-200/70 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="h-5 w-5 text-amber-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Recent Reviews</h2>
                </div>
                {loading ? (
                  <p className="text-sm text-gray-600 dark:text-slate-400">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-slate-400">No reviews yet.</p>
                ) : (
                  <div className="space-y-3">
                    {reviews.slice(0, 6).map((review) => {
                      const book = reviewBooks[review.bookId];
                      return (
                        <div key={review.id} className="p-3 rounded-xl bg-amber-50/70 dark:bg-slate-700/60">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-slate-100">
                              {book?.title || "Book"}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-slate-300">
                              {review.rating}★
                            </span>
                          </div>
                          {review.tldr && (
                            <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                              {review.tldr}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
