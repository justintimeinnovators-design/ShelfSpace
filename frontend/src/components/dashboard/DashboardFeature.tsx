/**
 * Dashboard landing feature.
 *
 * Combines user setup state, analytics summary data, and presentational sections
 * into the main personalized dashboard screen.
 */
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
import { useDashboardSummary } from "@/hooks/data/useAnalytics";


export interface DashboardFeatureProps {
  className?: string;
}

/**
 * Renders the top-level dashboard experience.
 *
 * @param className Optional container className.
 */
export function DashboardFeature({ className }: DashboardFeatureProps) {
  const { needsPreferences, isLoading, isNewUser } = useUserSetup();
  const [showPreferences, setShowPreferences] = useState(false);
  const { success, info } = useToastNotifications();
  const { data: summary } = useDashboardSummary();
  const { data: session } = useSession();

  // Get user name from session
  const userName = session?.user?.name;

  // Deferred to avoid SSR/client hydration mismatch — both functions use
  // Date.now() / Math.random() which differ between server and client renders.
  const [personalizedGreeting, setPersonalizedGreeting] = useState("Hello, Reader");
  const [readingQuote, setReadingQuote] = useState("");
  useEffect(() => {
    setPersonalizedGreeting(getPersonalizedGreeting(userName));
    setReadingQuote(getReadingQuote());
  }, [userName]);

  const readingStats = summary || {
    totalBooks: 0,
    booksRead: 0,
    currentlyReading: 0,
    wantToRead: 0,
    readingGoal: 52,
    currentStreak: 0,
    averageRating: 0,
    totalPages: 0,
    readingTime: 0,
    favoriteGenre: "N/A",
  };

  // Auto-open preferences onboarding when user setup indicates missing preferences.
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
                  <BookOpen className="h-8 w-8" />
                  <FloatingElement className="text-2xl opacity-60"><BookOpen className="h-6 w-6" /></FloatingElement>
                </div>
                <div className="text-3xl font-bold mb-1">
                  <AnimatedCounter value={readingStats.wantToRead} />
                </div>
                <div className="text-amber-100">Want to Read</div>
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
