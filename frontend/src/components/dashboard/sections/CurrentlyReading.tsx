"use client";

import React from 'react';
import { AnimatedCard, StaggerContainer, StaggerItem, FloatingElement, GradientProgressBar } from '@/components/ui';
import { BookOpen, Clock, Star, Play, Pause, BookMarked } from 'lucide-react';

interface CurrentlyReadingBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  progress: number;
  currentPage: number;
  totalPages: number;
  rating: number;
  genre: string;
  startDate: string;
  estimatedFinish?: string;
  readingSpeed?: number; // pages per day
}

const mockCurrentlyReading: CurrentlyReadingBook[] = [
  {
    id: '1',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    cover: '📖',
    progress: 78,
    currentPage: 312,
    totalPages: 400,
    rating: 4.6,
    genre: 'Historical Fiction',
    startDate: '2024-01-15',
    estimatedFinish: '2024-01-25',
    readingSpeed: 15
  },
  {
    id: '2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    cover: '🚀',
    progress: 45,
    currentPage: 223,
    totalPages: 496,
    rating: 4.8,
    genre: 'Science Fiction',
    startDate: '2024-01-10',
    estimatedFinish: '2024-02-05',
    readingSpeed: 12
  },
  {
    id: '3',
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: '⚛️',
    progress: 92,
    currentPage: 294,
    totalPages: 320,
    rating: 4.7,
    genre: 'Self-Help',
    startDate: '2024-01-05',
    estimatedFinish: '2024-01-20',
    readingSpeed: 8
  }
];

export function CurrentlyReading() {
  const totalBooks = mockCurrentlyReading.length;
  const averageProgress = Math.round(
    mockCurrentlyReading.reduce((sum, book) => sum + book.progress, 0) / totalBooks
  );

  return (
    <AnimatedCard variant="glass" hover className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 font-serif">
            Currently Reading
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-300 italic">
            Your active literary journey ({totalBooks} books)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <FloatingElement intensity="low" className="text-2xl opacity-60">📚</FloatingElement>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
            Overall Progress
          </span>
          <span className="text-sm text-gray-600 dark:text-slate-300">
            {averageProgress}% average
          </span>
        </div>
        <GradientProgressBar 
          progress={averageProgress} 
          height={6}
          animated={true}
          showPercentage={false}
        />
      </div>

      {/* Books List */}
      <StaggerContainer className="space-y-4">
        {mockCurrentlyReading.map((book, index) => (
          <StaggerItem key={book.id} className="delay-100">
            <AnimatedCard 
              variant="default" 
              hover 
              delay={index * 0.1}
              className="p-4"
            >
              <div className="flex items-start space-x-4">
                {/* Book Cover */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-20 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg flex items-center justify-center">
                    <FloatingElement intensity="low" className="text-2xl">
                      {book.cover}
                    </FloatingElement>
                  </div>
                </div>

                {/* Book Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 font-serif truncate">
                        {book.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-slate-300 italic truncate">
                        by {book.author}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                        {book.rating}
                      </span>
                    </div>
                  </div>

                  {/* Genre and Progress */}
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full">
                      {book.genre}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{book.readingSpeed} pages/day</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-slate-300 mb-1">
                      <span>Progress</span>
                      <span>{book.currentPage}/{book.totalPages} pages</span>
                    </div>
                    <GradientProgressBar 
                      progress={book.progress} 
                      height={6}
                      animated={true}
                      showPercentage={false}
                    />
                    <div className="text-right text-xs text-gray-500 dark:text-slate-400 mt-1">
                      {book.progress}% complete
                    </div>
                  </div>

                  {/* Estimated Finish */}
                  {book.estimatedFinish && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-slate-400 mb-3">
                      <BookMarked className="h-3 w-3" />
                      <span>Est. finish: {book.estimatedFinish}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors">
                      <Play className="h-3 w-3" />
                      <span>Continue</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition-colors">
                      <Pause className="h-3 w-3" />
                      <span>Pause</span>
                    </button>
                    <button className="px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs font-medium transition-colors">
                      Update Progress
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Add new book button */}
      <div className="mt-6 text-center">
        <button className="inline-flex items-center space-x-2 px-4 py-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
          <BookOpen className="h-4 w-4" />
          <span>Start Reading New Book</span>
        </button>
      </div>
    </AnimatedCard>
  );
}
