"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { DashboardErrorFallback } from "@/components/common/ErrorFallbacks/DashboardErrorFallback";
import { PreferencesModal } from "@/components/modals/PreferencesModal";
import { useUserSetup } from "@/hooks/useUserSetup";
import { getPersonalizedGreeting, getReadingQuote } from "@/utils/greetings";
import {
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
  FloatingElement,
  FloatingActionButton,
  useToastNotifications,
} from "@/components/ui";
import {
  BookOpen, 
  Library,
  Plus,
  BarChart3,
  Target,
  Sparkles,
  Clock,
  Check
} from "lucide-react";
import {
  ReadingAnalytics,
  ActivityTimeline,
  RecommendationsGrid,
  ReadingGoals,
  CurrentlyReading
} from "./sections";
import { useReadingLists } from "@/hooks/data/useReadingLists";
import { useMemo } from "react";

// Calculate reading stats from real data
function calculateReadingStats(readingLists: any[]) {
  if (!readingLists || readingLists.length === 0) {
    return {
      totalBooks: 0,
      booksRead: 0,
      currentlyReading: 0,
      wantToRead: 0,
      readingGoal: 52, // Default goal
      currentStreak: 0,
      averageRating: 0,
      totalPages: 0,
      readingTime: 0,
      favoriteGenre: "N/A",
    };
  }

  let totalBooks = 0;
  let booksRead = 0;
  let currentlyReading = 0;
  let wantToRead = 0;
  let totalPages = 0;
  let totalRating = 0;
  let ratingCount = 0;
  const genreCounts: Record<string, number> = {};

  readingLists.forEach((list) => {
    const books = list.books || [];
    totalBooks += books.length;

    books.forEach((book: any) => {
      if (book.pages) totalPages += book.pages;
      if (book.rating) {
        totalRating += book.rating;
        ratingCount++;
      }
      if (book.genres) {
        book.genres.forEach((genre: string) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });

    const listName = list.name.toLowerCase();
    if (listName.includes("finished") || listName.includes("read") || listName.includes("completed")) {
      booksRead += books.length;
    } else if (listName.includes("currently") || listName.includes("reading")) {
      currentlyReading += books.length;
    } else if (listName.includes("want") || listName.includes("wish")) {
      wantToRead += books.length;
    }
  });

  const favoriteGenre = Object.keys(genreCounts).length > 0
    ? (Object.entries(genreCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "N/A")
    : "N/A";

  // Estimate reading time (assuming 2 minutes per page)
  const readingTime = Math.round(totalPages * 2 / 60); // hours

  return {
    totalBooks,
    booksRead,
    currentlyReading,
    wantToRead,
    readingGoal: 52, // Default goal, can be customized
    currentStreak: 0, // Would need additional tracking
    averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
    totalPages,
    readingTime,
    favoriteGenre,
  };
}

export interface DashboardFeatureProps {
  className?: string;
}

export function DashboardFeature({ className }: DashboardFeatureProps) {
  const { needsPreferences, isLoading, isNewUser } = useUserSetup();
  const [showPreferences, setShowPreferences] = useState(false);
  const { success, info } = useToastNotifications();
  const { data: readingLists } = useReadingLists({ includeBooks: true });
  const { data: session } = useSession();

  // Get user name from session
  const userName = session?.user?.name;
  const personalizedGreeting = getPersonalizedGreeting(userName);
  const readingQuote = getReadingQuote();

  // Calculate stats from real data
  const readingStats = useMemo(() => {
    return calculateReadingStats(readingLists || []);
  }, [readingLists]);

  // Show preferences modal for new users or users without preferences
  useEffect(() => {
    if (!isLoading && needsPreferences) {
      setShowPreferences(true);
    }
  }, [needsPreferences, isLoading]);

  return (
    <ErrorBoundary fallback={DashboardErrorFallback}>
      <div className={`min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative z-10 ${className || ""}`}>
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Modern Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-slate-100 font-serif">
                  {personalizedGreeting}!
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 dark:text-slate-300 mt-1">
                  {isNewUser 
                    ? "Welcome to ShelfSpace! Let's start your reading journey."
                    : readingQuote
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Overview */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StaggerItem>
              <div className="p-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between mb-4">
                  <Library className="h-8 w-8" />
                  <FloatingElement className="text-2xl opacity-60"><Library className="h-6 w-6" /></FloatingElement>
                </div>
                <div className="text-3xl font-bold mb-1">
                  <AnimatedCounter value={readingStats.totalBooks} />
                </div>
                <div className="text-amber-100">Library Collection</div>
              </div>
            </StaggerItem>
            
            <StaggerItem>
              <div className="p-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="h-8 w-8" />
                  <FloatingElement className="text-2xl opacity-60"><Check className="h-6 w-6" /></FloatingElement>
                </div>
                <div className="text-3xl font-bold mb-1">
                  <AnimatedCounter value={readingStats.booksRead} />
                </div>
                <div className="text-green-100">Books Completed</div>
              </div>
            </StaggerItem>
            
            <StaggerItem>
              <div className="p-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="h-8 w-8" />
                  <FloatingElement className="text-2xl opacity-60"><BookOpen className="h-6 w-6" /></FloatingElement>
                </div>
                <div className="text-3xl font-bold mb-1">
                  <AnimatedCounter value={readingStats.currentlyReading} />
                </div>
                <div className="text-blue-100">Currently Reading</div>
              </div>
            </StaggerItem>
            
            <StaggerItem>
              <div className="p-6 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between mb-4">
                  <Target className="h-8 w-8" />
                  <FloatingElement className="text-2xl opacity-60">🔥</FloatingElement>
                </div>
                <div className="text-3xl font-bold mb-1">
                  <AnimatedCounter value={readingStats.currentStreak} /> days
                </div>
                <div className="text-purple-100">Reading Streak</div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Main Dashboard Sections */}
          <StaggerContainer className="space-y-8">
            {/* Currently Reading Section */}
            <StaggerItem>
              <CurrentlyReading />
            </StaggerItem>

            {/* Reading Analytics Section */}
            <StaggerItem>
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 font-serif">
                    Reading Analytics
                  </h2>
                </div>
                <ReadingAnalytics />
              </div>
            </StaggerItem>

            {/* Reading Goals Section */}
            <StaggerItem>
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Target className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 font-serif">
                    Reading Goals
                  </h2>
                </div>
                <ReadingGoals />
              </div>
            </StaggerItem>

            {/* Bottom Grid - Activity & Recommendations */}
            <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <StaggerItem>
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 font-serif">
                      Recent Activity
                    </h2>
                  </div>
                  <ActivityTimeline />
                </div>
              </StaggerItem>
              
              <StaggerItem>
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 font-serif">
                      Recommendations
                    </h2>
                  </div>
                  <RecommendationsGrid />
                </div>
              </StaggerItem>
            </StaggerContainer>
          </StaggerContainer>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton
          icon={<Plus className="h-6 w-6" />}
          onClick={() => {
            info("Add New Book", "Feature coming soon! You'll be able to add books to your library.");
          }}
        />

        {/* Preferences Modal */}
        <PreferencesModal
          isOpen={showPreferences}
          onClose={() => setShowPreferences(false)}
          onSave={() => {
            setShowPreferences(false);
            success("Preferences Saved", "Your reading preferences have been updated successfully!");
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

export default DashboardFeature;
