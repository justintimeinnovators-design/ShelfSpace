"use client";

import { AnimatedCard, StaggerContainer, StaggerItem, AnimatedCounter } from '@/components/ui';
import { 
  ReadingTrendsChart, 
  GenreDistributionChart, 
  MonthlyReadingChart,
  RatingDistributionChart 
} from '../charts/ChartComponents';
import { TrendingUp, BookOpen, Clock, Star } from 'lucide-react';
import { useReadingAnalyticsData } from '@/hooks/data/useAnalytics';

/**
 * Reading Analytics.
 */
export function ReadingAnalytics() {
  const { data } = useReadingAnalyticsData();
  const analytics = data || {
    readingTrends: [],
    genreData: [],
    monthlyData: [],
    ratingData: [],
    stats: {
      totalBooksThisYear: 0,
      averageBooksPerMonth: 0,
      totalPagesRead: 0,
      averageRating: 0,
      readingTime: 0,
      favoriteGenre: 'N/A',
      longestStreak: 0,
      currentStreak: 0,
    },
  };
  const { readingTrends, genreData, monthlyData, ratingData, stats } = analytics;
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
                  <AnimatedCounter value={stats.totalBooksThisYear} />
                </div>
                <div className="text-sm text-gray-600 dark:text-slate-300">Books This Year</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              +{stats.averageBooksPerMonth} avg/month
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
                <AnimatedCounter value={stats.totalPagesRead} />
              </div>
                <div className="text-sm text-gray-600 dark:text-slate-300">Pages Read</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-slate-400">
              Literary journey
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
                <AnimatedCounter value={stats.readingTime} />
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
                <AnimatedCounter value={stats.averageRating} />/5
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
          <ReadingTrendsChart data={readingTrends} />
        </StaggerItem>

        <StaggerItem>
          <GenreDistributionChart data={genreData} />
        </StaggerItem>

        <StaggerItem>
          <MonthlyReadingChart data={monthlyData} />
        </StaggerItem>

        <StaggerItem>
          <RatingDistributionChart data={ratingData} />
        </StaggerItem>
      </StaggerContainer>

      {/* Additional Insights */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StaggerItem>
          <AnimatedCard variant="glass" hover className="p-6 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              <AnimatedCounter value={stats.longestStreak} />
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300">Longest Streak</div>
            <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">days</div>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard variant="glass" hover className="p-6 text-center">
            <div className="text-4xl mb-3">🔥</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              <AnimatedCounter value={stats.currentStreak} />
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300">Current Streak</div>
            <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">days</div>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard variant="glass" hover className="p-6 text-center">
            <div className="text-4xl mb-3">🎭</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              {stats.favoriteGenre}
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300">Favorite Genre</div>
            <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">most read</div>
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}
