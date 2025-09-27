"use client";

import React from 'react';
import { AnimatedCard, StaggerContainer, StaggerItem, FloatingElement } from '@/components/ui';
import { Clock, BookOpen, Star, Heart, Users, Trophy, BookMarked, Plus } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'read' | 'rated' | 'added' | 'joined' | 'achievement' | 'started';
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
  book?: {
    title: string;
    author: string;
    cover: string;
  };
  metadata?: {
    rating?: number;
    pages?: number;
    genre?: string;
  };
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'read',
    title: 'Finished Reading',
    description: 'Completed "The Seven Husbands of Evelyn Hugo"',
    time: '2 hours ago',
    icon: '📚',
    color: 'from-green-400 to-emerald-500',
    book: {
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      cover: '📖'
    },
    metadata: {
      pages: 400,
      genre: 'Historical Fiction'
    }
  },
  {
    id: '2',
    type: 'rated',
    title: 'Rated 5 Stars',
    description: 'Gave "Project Hail Mary" a perfect rating',
    time: '1 day ago',
    icon: '⭐',
    color: 'from-yellow-400 to-amber-500',
    book: {
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      cover: '🚀'
    },
    metadata: {
      rating: 5
    }
  },
  {
    id: '3',
    type: 'added',
    title: 'Added to Wishlist',
    description: 'Added "Dune" to your reading list',
    time: '3 days ago',
    icon: '❤️',
    color: 'from-pink-400 to-rose-500',
    book: {
      title: 'Dune',
      author: 'Frank Herbert',
      cover: '🏜️'
    }
  },
  {
    id: '4',
    type: 'started',
    title: 'Started Reading',
    description: 'Began "Atomic Habits"',
    time: '1 week ago',
    icon: '📖',
    color: 'from-blue-400 to-indigo-500',
    book: {
      title: 'Atomic Habits',
      author: 'James Clear',
      cover: '⚛️'
    },
    metadata: {
      genre: 'Self-Help'
    }
  },
  {
    id: '5',
    type: 'achievement',
    title: 'Achievement Unlocked',
    description: 'Completed 7-day reading streak!',
    time: '1 week ago',
    icon: '🏆',
    color: 'from-purple-400 to-violet-500'
  },
  {
    id: '6',
    type: 'joined',
    title: 'Joined Book Club',
    description: 'Joined "Fantasy Readers" book club',
    time: '2 weeks ago',
    icon: '👥',
    color: 'from-cyan-400 to-teal-500'
  }
];

const getActivityIcon = (type: ActivityItem['type']) => {
  const icons = {
    read: BookOpen,
    rated: Star,
    added: Heart,
    joined: Users,
    achievement: Trophy,
    started: BookMarked
  };
  return icons[type] || Clock;
};

const getActivityColor = (type: ActivityItem['type']) => {
  const colors = {
    read: 'text-green-600 dark:text-green-400',
    rated: 'text-yellow-600 dark:text-yellow-400',
    added: 'text-pink-600 dark:text-pink-400',
    joined: 'text-cyan-600 dark:text-cyan-400',
    achievement: 'text-purple-600 dark:text-purple-400',
    started: 'text-blue-600 dark:text-blue-400'
  };
  return colors[type] || 'text-gray-600 dark:text-gray-400';
};

export function ActivityTimeline() {
  return (
    <AnimatedCard variant="glass" hover className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 font-serif">
            Recent Activity
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-300 italic">
            Your latest literary adventures
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <FloatingElement intensity="low" className="text-2xl opacity-60">📚</FloatingElement>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-200 via-amber-300 to-transparent dark:from-amber-800 dark:via-amber-700"></div>

        <StaggerContainer className="space-y-6">
          {mockActivities.map((activity, index) => {
            const IconComponent = getActivityIcon(activity.type);
            const iconColor = getActivityColor(activity.type);

            return (
              <StaggerItem key={activity.id} className="delay-100">
                <div className="relative flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${activity.color} shadow-lg flex items-center justify-center`}>
                    <FloatingElement intensity="low" className="text-lg">
                      {activity.icon}
                    </FloatingElement>
                  </div>

                  {/* Activity content */}
                  <div className="flex-1 min-w-0">
                    <AnimatedCard 
                      variant="default" 
                      hover 
                      delay={index * 0.1}
                      className="p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <IconComponent className={`h-4 w-4 ${iconColor}`} />
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                              {activity.title}
                            </h4>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-slate-300 mb-3">
                            {activity.description}
                          </p>

                          {/* Book details */}
                          {activity.book && (
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-3">
                              <FloatingElement intensity="low" className="text-2xl flex-shrink-0">
                                {activity.book.cover}
                              </FloatingElement>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">
                                  "{activity.book.title}"
                                </h5>
                                <p className="text-xs text-gray-600 dark:text-slate-300 italic">
                                  by {activity.book.author}
                                </p>
                                {activity.metadata?.genre && (
                                  <span className="inline-block mt-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full">
                                    {activity.metadata.genre}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Metadata */}
                          {activity.metadata && (
                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-slate-400">
                              {activity.metadata.rating && (
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span>{activity.metadata.rating}/5</span>
                                </div>
                              )}
                              {activity.metadata.pages && (
                                <div className="flex items-center space-x-1">
                                  <BookOpen className="h-3 w-3" />
                                  <span>{activity.metadata.pages} pages</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex-shrink-0 text-right">
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </AnimatedCard>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Load more button */}
        <div className="mt-6 text-center">
          <button className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Load More Activity</span>
          </button>
        </div>
      </div>
    </AnimatedCard>
  );
}
