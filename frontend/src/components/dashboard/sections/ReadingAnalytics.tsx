"use client";

import React from 'react';
import { AnimatedCard, StaggerContainer, StaggerItem, AnimatedCounter } from '@/components/ui';
import { 
  ReadingTrendsChart, 
  GenreDistributionChart, 
  MonthlyReadingChart,
  RatingDistributionChart 
} from '../charts/ChartComponents';
import { TrendingUp, BookOpen, Clock, Star } from 'lucide-react';

// Mock data for analytics
const mockReadingTrends = [
  { month: 'Jan', books: 12, pages: 3200, hours: 45 },
  { month: 'Feb', books: 15, pages: 3800, hours: 52 },
  { month: 'Mar', books: 18, pages: 4200, hours: 58 },
  { month: 'Apr', books: 14, pages: 3600, hours: 48 },
  { month: 'May', books: 20, pages: 4800, hours: 65 },
  { month: 'Jun', books: 16, pages: 4000, hours: 55 }
];

const mockGenreData = [
  { name: 'Fantasy', value: 45, color: '#f59e0b' },
  { name: 'Science Fiction', value: 32, color: '#3b82f6' },
  { name: 'Mystery', value: 28, color: '#10b981' },
  { name: 'Romance', value: 22, color: '#ef4444' },
  { name: 'Non-Fiction', value: 18, color: '#8b5cf6' },
  { name: 'Thriller', value: 15, color: '#ec4899' }
];

const mockMonthlyData = [
  { month: 'Jan', books: 12, pages: 3200, hours: 45 },
  { month: 'Feb', books: 15, pages: 3800, hours: 52 },
  { month: 'Mar', books: 18, pages: 4200, hours: 58 },
  { month: 'Apr', books: 14, pages: 3600, hours: 48 },
  { month: 'May', books: 20, pages: 4800, hours: 65 },
  { month: 'Jun', books: 16, pages: 4000, hours: 55 }
];

const mockRatingData = [
  { rating: '5★', count: 45 },
  { rating: '4★', count: 38 },
  { rating: '3★', count: 22 },
  { rating: '2★', count: 8 },
  { rating: '1★', count: 3 }
];

const mockAnalyticsStats = {
  totalBooksThisYear: 95,
  averageBooksPerMonth: 15.8,
  totalPagesRead: 23600,
  averageRating: 4.2,
  readingTime: 323,
  favoriteGenre: 'Fantasy',
  longestStreak: 45,
  currentStreak: 12
};

export function ReadingAnalytics() {
  return (
    <div className="space-y-8">
      {/* Analytics Overview Cards */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StaggerItem>
          <AnimatedCard variant="gradient" hover glow className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  <AnimatedCounter value={mockAnalyticsStats.totalBooksThisYear} />
                </div>
                <div className="text-sm text-gray-600 dark:text-slate-300">Books This Year</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              +{mockAnalyticsStats.averageBooksPerMonth} avg/month
            </div>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard variant="gradient" hover glow className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  <AnimatedCounter value={mockAnalyticsStats.totalPagesRead} />
                </div>
                <div className="text-sm text-gray-600 dark:text-slate-300">Pages Read</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              📖 Literary journey
            </div>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard variant="gradient" hover glow className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  <AnimatedCounter value={mockAnalyticsStats.readingTime} />
                </div>
                <div className="text-sm text-gray-600 dark:text-slate-300">Hours Read</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              ⏰ Time well spent
            </div>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard variant="gradient" hover glow className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl shadow-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  <AnimatedCounter value={mockAnalyticsStats.averageRating} suffix="/5" />
                </div>
                <div className="text-sm text-gray-600 dark:text-slate-300">Avg Rating</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              ⭐ Quality reads
            </div>
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Charts Grid */}
      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StaggerItem>
          <ReadingTrendsChart data={mockReadingTrends} />
        </StaggerItem>

        <StaggerItem>
          <GenreDistributionChart data={mockGenreData} />
        </StaggerItem>

        <StaggerItem>
          <MonthlyReadingChart data={mockMonthlyData} />
        </StaggerItem>

        <StaggerItem>
          <RatingDistributionChart data={mockRatingData} />
        </StaggerItem>
      </StaggerContainer>

      {/* Additional Insights */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StaggerItem>
          <AnimatedCard variant="glass" hover className="p-6 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              <AnimatedCounter value={mockAnalyticsStats.longestStreak} />
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300">Longest Streak</div>
            <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">days</div>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard variant="glass" hover className="p-6 text-center">
            <div className="text-4xl mb-3">🔥</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              <AnimatedCounter value={mockAnalyticsStats.currentStreak} />
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300">Current Streak</div>
            <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">days</div>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard variant="glass" hover className="p-6 text-center">
            <div className="text-4xl mb-3">🎭</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              {mockAnalyticsStats.favoriteGenre}
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300">Favorite Genre</div>
            <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">most read</div>
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}
