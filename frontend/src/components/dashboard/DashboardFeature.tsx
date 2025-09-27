"use client";

import React, { useState } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { DashboardErrorFallback } from "@/components/common/ErrorFallbacks/DashboardErrorFallback";
import { PreferencesModal } from "@/components/modals/PreferencesModal";
import { useUserSetup } from "@/hooks/useUserSetup";
import {
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
  FloatingElement,
  FloatingActionButton,
  useToastNotifications
} from "@/components/ui";
import {
  BookOpen, 
  Library,
  Plus,
  BarChart3,
  Target,
  Sparkles,
  Clock
} from "lucide-react";
import {
  ReadingAnalytics,
  ActivityTimeline,
  RecommendationsGrid,
  ReadingGoals,
  CurrentlyReading
} from "./sections";

// Mock data for the modern dashboard
const mockReadingStats = {
  totalBooks: 247,
  booksRead: 189,
  currentlyReading: 3,
  wantToRead: 45,
  readingGoal: 200,
  currentStreak: 28,
  averageRating: 4.3,
  totalPages: 45670,
  readingTime: 342,
  favoriteGenre: "Fantasy",
  longestBook: "The Count of Monte Cristo",
  shortestBook: "The Old Man and the Sea"
};

export interface DashboardFeatureProps {
  className?: string;
}

export function DashboardFeature({ className }: DashboardFeatureProps) {
  const { needsPreferences, isLoading, isNewUser } = useUserSetup();
  const [showPreferences, setShowPreferences] = useState(false);
  const { success, info } = useToastNotifications();

  // Show preferences modal for new users or users without preferences
  React.useEffect(() => {
    if (!isLoading && needsPreferences) {
      setShowPreferences(true);
    }
  }, [needsPreferences, isLoading]);

  return (
    <ErrorBoundary fallback={DashboardErrorFallback}>
      <div className={`min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative z-10 ${className || ""}`}>
        {/* Decorative book-themed background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl opacity-5 dark:opacity-10">📚</div>
          <div className="absolute top-40 right-20 text-4xl opacity-5 dark:opacity-10">📖</div>
          <div className="absolute bottom-20 left-1/4 text-5xl opacity-5 dark:opacity-10">📝</div>
          <div className="absolute bottom-40 right-1/3 text-3xl opacity-5 dark:opacity-10">✍️</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Modern Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-slate-100 font-serif">
                  {isNewUser ? `Welcome to ShelfSpace, Reader!` : 'Your Reading Dashboard'}
                </h1>
                <p className="text-base lg:text-lg text-gray-600 dark:text-slate-300 italic">
                  {isNewUser 
                    ? "Let's set up your reading preferences to get personalized recommendations!"
                    : '"A room without books is like a body without a soul." - Cicero'
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
                  <FloatingElement className="text-2xl opacity-60">📚</FloatingElement>
                </div>
                <div className="text-3xl font-bold mb-1">
                  <AnimatedCounter value={mockReadingStats.totalBooks} />
                </div>
                <div className="text-amber-100">Library Collection</div>
              </div>
            </StaggerItem>
            
            <StaggerItem>
              <div className="p-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="h-8 w-8" />
                  <FloatingElement className="text-2xl opacity-60">✅</FloatingElement>
                </div>
                <div className="text-3xl font-bold mb-1">
                  <AnimatedCounter value={mockReadingStats.booksRead} />
                </div>
                <div className="text-green-100">Books Completed</div>
              </div>
            </StaggerItem>
            
            <StaggerItem>
              <div className="p-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="h-8 w-8" />
                  <FloatingElement className="text-2xl opacity-60">📖</FloatingElement>
                </div>
                <div className="text-3xl font-bold mb-1">
                  <AnimatedCounter value={mockReadingStats.currentlyReading} />
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
                  <AnimatedCounter value={mockReadingStats.currentStreak} /> days
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
          icon={Plus}
          onClick={() => {
            info("Add New Book", "Feature coming soon! You'll be able to add books to your library.");
          }}
          position="bottom-right"
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
