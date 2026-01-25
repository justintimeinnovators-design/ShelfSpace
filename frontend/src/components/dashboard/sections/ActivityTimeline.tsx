"use client";

import { useMemo } from 'react';
import { AnimatedCard, StaggerContainer, StaggerItem, FloatingElement } from '@/components/ui';
import { Clock, BookOpen, Star, Heart, Users, Trophy, BookMarked, Plus } from 'lucide-react';
import { useReadingLists } from '@/hooks/data/useReadingLists';

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

export function ActivityTimeline() {
  const { data: readingLists } = useReadingLists({ includeBooks: true });
  
  // Generate activities from reading lists and books
  const activities = useMemo(() => {
    const items: ActivityItem[] = [];
    
    if (!readingLists) return items;
    
    // Collect all books with their timestamps
    readingLists.forEach((list: any) => {
      const books = list.books || [];
      const listName = list.name.toLowerCase();
      
      books.forEach((book: any) => {
        if (!book.addedAt) return;
        
        const addedDate = new Date(book.addedAt);
        const isFinished = listName.includes('finished') || listName.includes('read') || listName.includes('completed');
        const isCurrentlyReading = listName.includes('currently') || listName.includes('reading');
        const isWantToRead = listName.includes('want') || listName.includes('wish');
        
        if (isFinished) {
          items.push({
            id: `read-${book.id}`,
            type: 'read',
            title: 'Finished Reading',
            description: `Completed "${book.title}"`,
            time: formatTimeAgo(addedDate),
            timestamp: addedDate,
            icon: 'check',
            color: 'from-green-400 to-emerald-500',
            book: {
              title: book.title || 'Unknown',
              author: book.author || 'Unknown',
              cover: book.coverImage || book.cover || '',
            },
            metadata: {
              pages: book.pages,
              genre: book.genres?.[0],
            },
          });
        } else if (isCurrentlyReading) {
          items.push({
            id: `started-${book.id}`,
            type: 'started',
            title: 'Started Reading',
            description: `Began "${book.title}"`,
            time: formatTimeAgo(addedDate),
            timestamp: addedDate,
            icon: 'book',
            color: 'from-blue-400 to-indigo-500',
            book: {
              title: book.title || 'Unknown',
              author: book.author || 'Unknown',
              cover: book.coverImage || book.cover || '',
            },
            metadata: {
              genre: book.genres?.[0],
            },
          });
        } else if (isWantToRead) {
          items.push({
            id: `added-${book.id}`,
            type: 'added',
            title: 'Added to Wishlist',
            description: `Added "${book.title}" to your reading list`,
            time: formatTimeAgo(addedDate),
            timestamp: addedDate,
            icon: 'heart',
            color: 'from-pink-400 to-rose-500',
            book: {
              title: book.title || 'Unknown',
              author: book.author || 'Unknown',
              cover: book.coverImage || book.cover || '',
            },
          });
        }
        
        // Add rating activity if book has rating
        if (book.rating && book.rating >= 1 && book.rating <= 5) {
          items.push({
            id: `rated-${book.id}`,
            type: 'rated',
            title: `Rated ${book.rating} Stars`,
            description: `Gave "${book.title}" a ${book.rating}-star rating`,
            time: formatTimeAgo(addedDate), // Using addedAt as proxy for rating time
            timestamp: addedDate,
            icon: 'star',
            color: 'from-yellow-400 to-amber-500',
            book: {
              title: book.title || 'Unknown',
              author: book.author || 'Unknown',
              cover: book.coverImage || book.cover || '',
            },
            metadata: {
              rating: book.rating,
            },
          });
        }
      });
    });
    
    // Sort by timestamp (newest first) and limit to most recent
    return items
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 20); // Show last 20 activities
  }, [readingLists]);

  // Note: For reviews created separately, we'd need to fetch reviews and add them
  // For now, we show activities from reading list changes

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
              <StaggerItem key={activity.id} className="delay-100">
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
