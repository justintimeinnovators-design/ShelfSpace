'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Target,
  TrendingUp,
  Calendar,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import StatsCard from './StatsCard';
import BookCard from './BookCard';
import GroupCard from './GroupCard';
import RecommendationCard from './RecommendationCard';

interface DashboardData {
  stats: {
    totalBooks: number;
    readingTime: number;
    readingGoal: number;
    activeGroups: number;
  };
  recentBooks: Array<{
    id: string;
    title: string;
    author: string;
    coverImage?: string;
    rating: number;
    readingProgress: number;
    timeToRead: string;
    genre: string;
    isCurrentlyReading: boolean;
  }>;
  groups: Array<{
    id: string;
    name: string;
    memberCount: number;
    lastActivity: string;
    coverImage?: string;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    author: string;
    coverImage?: string;
    rating: number;
    reason: string;
  }>;
}

const mockData: DashboardData = {
  stats: {
    totalBooks: 47,
    readingTime: 23,
    readingGoal: 85,
    activeGroups: 3,
  },
  recentBooks: [
    {
      id: '1',
      title: 'The Design of Everyday Things',
      author: 'Don Norman',
      rating: 4.5,
      readingProgress: 75,
      timeToRead: '2h 30m',
      genre: 'Design',
      isCurrentlyReading: true,
    },
    {
      id: '2',
      title: 'Atomic Habits',
      author: 'James Clear',
      rating: 4.8,
      readingProgress: 45,
      timeToRead: '1h 45m',
      genre: 'Self-Help',
      isCurrentlyReading: false,
    },
    {
      id: '3',
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      rating: 4.6,
      readingProgress: 90,
      timeToRead: '3h 15m',
      genre: 'History',
      isCurrentlyReading: false,
    },
  ],
  groups: [
    {
      id: '1',
      name: 'Product Design Book Club',
      memberCount: 24,
      lastActivity: '2 hours ago',
    },
    {
      id: '2',
      name: 'Tech Leadership Reads',
      memberCount: 18,
      lastActivity: '1 day ago',
    },
    {
      id: '3',
      name: 'UX Research Community',
      memberCount: 31,
      lastActivity: '3 days ago',
    },
  ],
  recommendations: [
    {
      id: '1',
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      rating: 4.7,
      reason: 'Based on your interest in psychology',
    },
    {
      id: '2',
      title: 'The Lean Startup',
      author: 'Eric Ries',
      rating: 4.4,
      reason: 'Popular in your groups',
    },
  ],
};

const DashboardContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const handleBookClick = (id: string) => {
    console.log('Book clicked:', id);
    // Navigate to book detail page
  };

  const handleBookMoreClick = (id: string) => {
    console.log('Book more options:', id);
    // Show book options menu
  };

  const handleGroupClick = (id: string) => {
    console.log('Group clicked:', id);
    // Navigate to group page
  };

  const handleRecommendationClick = (id: string) => {
    console.log('Recommendation clicked:', id);
    // Add book to library or show details
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 text-gray-900">Dashboard</h1>
          <p className="text-body-base text-gray-600 mt-1">
            Track your reading progress and discover new books
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Books"
          value={mockData.stats.totalBooks}
          icon={BookOpen}
          iconColor="text-indigo-dye-600"
          iconBgColor="bg-indigo-dye-50"
          change={{ value: 12, type: 'increase', period: 'last month' }}
          trend="up"
        />
        <StatsCard
          title="Reading Time"
          value={`${mockData.stats.readingTime}h`}
          icon={Clock}
          iconColor="text-safety-orange-600"
          iconBgColor="bg-safety-orange-50"
          change={{ value: 8, type: 'increase', period: 'last week' }}
          trend="up"
        />
        <StatsCard
          title="Goal Progress"
          value={`${mockData.stats.readingGoal}%`}
          icon={Target}
          iconColor="text-verdigris-600"
          iconBgColor="bg-verdigris-50"
          change={{ value: 5, type: 'increase', period: 'last week' }}
          trend="up"
        />
        <StatsCard
          title="Active Groups"
          value={mockData.stats.activeGroups}
          icon={Users}
          iconColor="text-indigo-dye-600"
          iconBgColor="bg-indigo-dye-50"
          change={{ value: 2, type: 'increase', period: 'last month' }}
          trend="up"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Books */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-h5 text-gray-900">Recent Books</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search books..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-input pl-10 w-64"
                    />
                  </div>
                  <button className="btn-outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {mockData.recentBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    {...book}
                    onBookClick={handleBookClick}
                    onMoreClick={handleBookMoreClick}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reading Groups */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-h5 text-gray-900">Reading Groups</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                {mockData.groups.map((group) => (
                  <GroupCard
                    key={group.id}
                    {...group}
                    onClick={handleGroupClick}
                  />
                ))}
              </div>
              <button className="w-full btn-outline mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Join New Group
              </button>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-h5 text-gray-900">Recommended for You</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                {mockData.recommendations.map((book) => (
                  <RecommendationCard
                    key={book.id}
                    {...book}
                    onClick={handleRecommendationClick}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-h5 text-gray-900">Quick Actions</h3>
            </div>
            <div className="card-body">
              <div className="space-y-2">
                <button className="w-full btn-outline justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Reading Time
                </button>
                <button className="w-full btn-outline justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Set Reading Goal
                </button>
                <button className="w-full btn-outline justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
