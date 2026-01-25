"use client";

import { useMemo } from 'react';
import { AnimatedCard, StaggerContainer, StaggerItem, AnimatedCounter } from '@/components/ui';
import { 
  ReadingTrendsChart, 
  GenreDistributionChart, 
  MonthlyReadingChart,
  RatingDistributionChart 
} from '../charts/ChartComponents';
import { TrendingUp, BookOpen, Clock, Star } from 'lucide-react';
import { useReadingLists } from '@/hooks/data/useReadingLists';

export function ReadingAnalytics() {
  const { data: readingLists } = useReadingLists({ includeBooks: true });
  
  // Calculate analytics from reading lists data
  const analytics = useMemo(() => {
    if (!readingLists) {
      return {
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
    }
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize monthly data
    const monthlyStats: Record<string, { books: number; pages: number; hours: number }> = {};
    months.forEach(month => {
      monthlyStats[month] = { books: 0, pages: 0, hours: 0 };
    });
    
    const genreCounts: Record<string, number> = {};
    const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    let totalBooksThisYear = 0;
    let totalPagesRead = 0;
    let totalRating = 0;
    let ratingCount = 0;
    
    readingLists.forEach((list: any) => {
      const books = list.books || [];
      
      books.forEach((book: any) => {
        const addedDate = book.addedAt ? new Date(book.addedAt) : null;
        const isThisYear = addedDate && addedDate.getFullYear() === currentYear;
        const monthIndex = addedDate ? addedDate.getMonth() : -1;
        
        if (isThisYear && monthIndex >= 0 && monthIndex < 12) {
          const monthName = months[monthIndex];
          if (monthName && monthlyStats[monthName]) {
            monthlyStats[monthName].books++;
            totalBooksThisYear++;

            if (book.pages) {
              monthlyStats[monthName].pages += book.pages;
              totalPagesRead += book.pages;
              // Estimate hours (2 minutes per page)
              monthlyStats[monthName].hours += Math.round(book.pages * 2 / 60);
            }
          }
        }
        
        // Genre distribution
        if (book.genres && Array.isArray(book.genres)) {
          book.genres.forEach((genre: string) => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          });
        }
        
        // Rating distribution
        if (book.rating && book.rating >= 1 && book.rating <= 5) {
          const rating = Math.round(book.rating);
          ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
          totalRating += book.rating;
          ratingCount++;
        }
      });
    });
    
    // Convert to chart formats
    const readingTrends = months.slice(0, 6).map(month => ({
      month,
      books: monthlyStats[month]?.books ?? 0,
      pages: monthlyStats[month]?.pages ?? 0,
      hours: monthlyStats[month]?.hours ?? 0,
    }));
    
    const monthlyData = readingTrends;
    
    // Genre data (top 6)
    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];
    const genreData = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length] as string,
      }));
    
    // Rating distribution
    const ratingData = [
      { rating: '5★', count: ratingCounts[5] || 0 },
      { rating: '4★', count: ratingCounts[4] || 0 },
      { rating: '3★', count: ratingCounts[3] || 0 },
      { rating: '2★', count: ratingCounts[2] || 0 },
      { rating: '1★', count: ratingCounts[1] || 0 },
    ];
    
    // Calculate stats
    const averageBooksPerMonth = totalBooksThisYear / 6; // Last 6 months
    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;
    const readingTime = Math.round(totalPagesRead * 2 / 60); // hours
    const favoriteGenre = Object.keys(genreCounts).length > 0
      ? (Object.entries(genreCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? 'N/A')
      : 'N/A';
    
    return {
      readingTrends,
      genreData,
      monthlyData,
      ratingData,
      stats: {
        totalBooksThisYear,
        averageBooksPerMonth: Math.round(averageBooksPerMonth * 10) / 10,
        totalPagesRead,
        averageRating: Math.round(averageRating * 10) / 10,
        readingTime,
        favoriteGenre,
        longestStreak: 0, // Would need additional tracking
        currentStreak: 0, // Would need additional tracking
      },
    };
  }, [readingLists]);
  
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
