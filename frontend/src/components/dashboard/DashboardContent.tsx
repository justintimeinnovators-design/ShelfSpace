'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import StatsSection from './StatsSection';
import RecommendationsSection from './RecommendationsSection';
import RecentBooksSection from './RecentBooksSection';
import DashboardSidebar from './DashboardSidebar';
import RecentActivitySection from './RecentActivitySection';
import { Book, Recommendation, ReadingGroup, Activity } from '../../../types/models';

interface DashboardContentProps {
  currentlyReading: Book[];
  recommendations: Recommendation[];
  readingGroups: ReadingGroup[];
  recentActivity: Activity[];
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  currentlyReading,
  recommendations,
  readingGroups,
  recentActivity   // ✅ add here
}) => {
  const statsData = {
    totalBooks: 47,
    readingTime: 23,
    readingGoal: 85,
    activeGroups: 3,
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-body-base text-gray-600 dark:text-gray-400 mt-1">
            Track your reading progress and discover new books
          </p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </button>
      </div>

      <StatsSection stats={statsData} />

      <RecommendationsSection recommendations={recommendations} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentBooksSection currentlyReading={currentlyReading} />
        <DashboardSidebar readingGroups={readingGroups} />
        <RecentActivitySection recentActivity={recentActivity} /> {/* ✅ works now */}
      </div>
    </div>
  );
};

export default DashboardContent;
