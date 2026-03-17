"use client";

import { AnimatedCard, StaggerContainer, StaggerItem, FloatingElement } from '@/components/ui';
import { Clock, BookOpen, Star, Heart, Users, Trophy, BookMarked } from 'lucide-react';
import { useActivityTimelineData } from '@/hooks/data/useAnalytics';

interface ActivityItem {
  id: string;
  type: 'read' | 'rated' | 'added' | 'joined' | 'achievement' | 'started';
  title: string;
  description: string;
  time: string;
  timestamp: Date;
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

/**
 * Format Time Ago.
 * @param date - date value.
 * @returns string.
 */
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

/**
 * Activity Timeline.
 */
export function ActivityTimeline() {
  const { data } = useActivityTimelineData();
  const activities: ActivityItem[] = (data?.activity || []).slice(0, 3).map((item: any) => {
    const baseActivity = {
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      time: formatTimeAgo(new Date(item.timestamp)),
      timestamp: new Date(item.timestamp),
      icon: item.type,
      color: '',
      metadata: item.metadata,
    };

    if (item.metadata?.title || item.metadata?.author) {
      return {
        ...baseActivity,
        book: {
          title: item.metadata?.title || 'Unknown',
          author: item.metadata?.author || 'Unknown',
          cover: '',
        },
      };
    }

    return baseActivity;
  });

/**
 * Get Activity Icon.
 * @param type - type value.
 */
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

/**
 * Get Activity Color.
 * @param type - type value.
 */
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
          <FloatingElement className="text-2xl opacity-60"><Clock className="h-6 w-6" /></FloatingElement>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-200 via-amber-300 to-transparent dark:from-amber-800 dark:via-amber-700"></div>

        <StaggerContainer className="space-y-6">
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-slate-400">No recent activity. Start adding books to your library!</p>
            </div>
          ) : (
            activities.map((activity, index) => {
            const IconComponent = getActivityIcon(activity.type);
            const iconColor = getActivityColor(activity.type);

            return (
              <StaggerItem key={`${activity.id}-${index}`} className="delay-100">
                <div className="relative flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${activity.color} shadow-lg flex items-center justify-center`}>
                    <FloatingElement className="text-lg">
                      <IconComponent className="h-5 w-5 text-white" />
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
                              <FloatingElement className="text-2xl flex-shrink-0">
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
          }))}
        </StaggerContainer>

      </div>
    </AnimatedCard>
  );
}
