"use client";

import { useState } from 'react';
import { AnimatedCard, StaggerContainer, StaggerItem, FloatingElement, GradientProgressBar } from '@/components/ui';
import {
  Star,
  Heart,
  BookOpen,
  Plus,
  Sparkles
} from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  genre: string;
  pages: number;
  description: string;
  reason: string;
  matchScore: number;
  isNewRelease?: boolean;
  isTrending?: boolean;
  isBookClubPick?: boolean;
}

/**
 * Recommendations Grid.
 */
export function RecommendationsGrid() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [recommendations] = useState<Recommendation[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

/**
 * Toggle Favorite.
 * @param id - id value.
 */
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <AnimatedCard variant="glass" hover className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 font-serif">
            Personalized Recommendations
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-300 italic">
            Personalized recommendations coming soon.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <FloatingElement className="text-2xl opacity-60"><Sparkles className="h-6 w-6" /></FloatingElement>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-600 dark:text-slate-400">
          Loading recommendations...
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && recommendations.length === 0 && (
        <div className="text-center py-8 text-gray-600 dark:text-slate-400">
          Personalized recommendations coming soon.
        </div>
      )}

      {!loading && !error && recommendations.length > 0 && (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((book, index) => (
          <StaggerItem key={book.id} className="delay-100">
            <AnimatedCard 
              variant="default" 
              hover 
              delay={index * 0.1}
              className="p-4 h-full flex flex-col"
            >
              {/* Book cover and badges */}
              <div className="relative mb-4">
                <div className="flex items-center justify-center w-16 h-20 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg mx-auto overflow-hidden">
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={`Cover of ${book.title}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <FloatingElement className="text-3xl">
                      <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-300" />
                    </FloatingElement>
                  )}
                </div>
                
                {/* Badges */}
                <div className="absolute -top-2 -right-2 flex flex-col space-y-1">
                  {book.isNewRelease && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      NEW
                    </span>
                  )}
                  {book.isTrending && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      TRENDING
                    </span>
                  )}
                  {book.isBookClubPick && (
                    <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      CLUB PICK
                    </span>
                  )}
                </div>
              </div>

              {/* Book info */}
              <div className="flex-1 flex flex-col">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 font-serif mb-1 line-clamp-2">
                  {book.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-slate-300 italic mb-2">
                  by {book.author}
                </p>
                
                <p className="text-xs text-gray-600 dark:text-slate-300 mb-3 line-clamp-2">
                  {book.description}
                </p>

                {/* Match score */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-300 mb-1">
                    <span>Match Score</span>
                    <span className="font-medium">{book.matchScore}%</span>
                  </div>
                  <GradientProgressBar 
                    progress={book.matchScore} 
                    height={4}
                    animated={true}
                    showPercentage={false}
                  />
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span>{book.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{book.pages} pages</span>
                  </div>
                  <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full">
                    {book.genre}
                  </span>
                </div>

                {/* Reason */}
                <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <Sparkles className="h-3 w-3 inline mr-1" />
                    {book.reason}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-auto">
                  <button 
                    onClick={() => toggleFavorite(book.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      favorites.has(book.id)
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${favorites.has(book.id) ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button className="flex items-center space-x-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
                    <Plus className="h-4 w-4" />
                    <span>Add to Library</span>
                  </button>
                </div>
              </div>
            </AnimatedCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
      )}

      {recommendations.length > 0 && (
        <div className="mt-6 text-center">
          <button className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg">
            <Sparkles className="h-4 w-4" />
            <span>Get More Recommendations</span>
          </button>
        </div>
      )}
    </AnimatedCard>
  );
}
