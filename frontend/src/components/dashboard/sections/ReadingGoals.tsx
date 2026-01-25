"use client";

import React from "react";
import { useMemo } from 'react';
import { AnimatedCard, StaggerContainer, StaggerItem, AnimatedCounter, GradientProgressBar } from '@/components/ui';
import { ReadingGoalsChart } from '../charts/ChartComponents';
import { Target, Trophy, Calendar, TrendingUp, BookOpen, Clock, Star } from 'lucide-react';
import { useReadingLists } from '@/hooks/data/useReadingLists';

interface ReadingGoal {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  deadline?: string;
  isCompleted?: boolean;
  category: 'books' | 'pages' | 'time' | 'rating' | 'streak';
}

export function ReadingGoals() {
  const { data: readingLists } = useReadingLists({ includeBooks: true });
  
  // Calculate goals from reading lists data
  const goals = useMemo(() => {
    if (!readingLists) return [];
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Calculate stats from reading lists
    let totalBooks = 0;
    let booksThisYear = 0;
    let booksThisMonth = 0;
    let totalPages = 0;
    let pagesThisMonth = 0;
    let totalRating = 0;
    let ratingCount = 0;
    
    readingLists.forEach((list: any) => {
      const books = list.books || [];
      totalBooks += books.length;
      
      books.forEach((book: any) => {
        const addedDate = book.addedAt ? new Date(book.addedAt) : null;
        const isThisYear = addedDate && addedDate.getFullYear() === currentYear;
        const isThisMonth = addedDate && addedDate.getMonth() === currentMonth && addedDate.getFullYear() === currentYear;
        
        if (isThisYear) booksThisYear++;
        if (isThisMonth) booksThisMonth++;
        
        if (book.pages) {
          totalPages += book.pages;
          if (isThisMonth) pagesThisMonth += book.pages;
        }
        
        if (book.rating) {
          totalRating += book.rating;
          ratingCount++;
        }
      });
    });
    
    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;
    const estimatedHoursThisMonth = Math.round(pagesThisMonth * 2 / 60);
    
    // Default targets (these would ideally come from user settings/backend)
    const yearlyGoal = 52; // Default: 52 books per year
    const monthlyPagesGoal = 3000;
    const monthlyHoursGoal = 60;
    const targetRating = 4.5;
    
    const goalsArray: ReadingGoal[] = [
      {
        id: '1',
        title: 'Books This Year',
        description: 'Annual reading goal',
        current: booksThisYear,
        target: yearlyGoal,
        unit: 'books',
        icon: <BookOpen className="h-5 w-5" />,
        color: 'from-amber-400 to-orange-500',
        deadline: `Dec 31, ${currentYear}`,
        category: 'books',
        isCompleted: booksThisYear >= yearlyGoal,
      },
      {
        id: '2',
        title: 'Pages This Month',
        description: 'Monthly page target',
        current: pagesThisMonth,
        target: monthlyPagesGoal,
        unit: 'pages',
        icon: <BookOpen className="h-5 w-5" />,
        color: 'from-blue-400 to-indigo-500',
        deadline: `${now.toLocaleString('default', { month: 'long' })} ${daysInMonth}, ${currentYear}`,
        category: 'pages',
        isCompleted: pagesThisMonth >= monthlyPagesGoal,
      },
      {
        id: '3',
        title: 'Reading Time',
        description: 'Hours spent reading this month',
        current: estimatedHoursThisMonth,
        target: monthlyHoursGoal,
        unit: 'hours',
        icon: <Clock className="h-5 w-5" />,
        color: 'from-cyan-400 to-teal-500',
        deadline: `${now.toLocaleString('default', { month: 'long' })} ${daysInMonth}, ${currentYear}`,
        category: 'time',
        isCompleted: estimatedHoursThisMonth >= monthlyHoursGoal,
      },
      {
        id: '4',
        title: 'Average Rating',
        description: 'Maintain high quality reads',
        current: averageRating,
        target: targetRating,
        unit: 'stars',
        icon: <Star className="h-5 w-5" />,
        color: 'from-purple-400 to-violet-500',
        category: 'rating',
        isCompleted: averageRating >= targetRating,
      },
    ];
    
    return goalsArray;
  }, [readingLists]);
  
  const chartData = goals.map(goal => ({
    goal: goal.title,
    current: goal.current,
    target: goal.target,
    unit: goal.unit
  }));
  
  const completedGoals = goals.filter(goal => goal.isCompleted).length;
  const totalGoals = goals.length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Goals Overview */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StaggerItem>
          <AnimatedCard variant="gradient" hover glow className="p-6 text-center">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg mx-auto mb-4 w-fit">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              <AnimatedCounter value={totalGoals} />
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300">Total Goals</div>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard variant="gradient" hover glow className="p-6 text-center">
            <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg mx-auto mb-4 w-fit">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              <AnimatedCounter value={completedGoals} />
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300">Completed</div>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard variant="gradient" hover glow className="p-6 text-center">
            <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-lg mx-auto mb-4 w-fit">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              <AnimatedCounter value={completionRate} />%
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300">Success Rate</div>
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Goals Chart */}
      <StaggerItem>
        <ReadingGoalsChart data={chartData} />
      </StaggerItem>

      {/* Individual Goals */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Target className="h-12 w-12 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-slate-400">No reading goals set yet. Start adding books to your library!</p>
          </div>
        ) : (
          goals.map((goal, index) => {
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          const isCompleted = goal.current >= goal.target;
          const isNearCompletion = progress >= 80 && !isCompleted;

          return (
            <StaggerItem key={goal.id} className="delay-100">
              <AnimatedCard 
                variant="glass" 
                hover 
                delay={index * 0.1}
                className={`p-6 ${isCompleted ? 'ring-2 ring-green-400' : ''} ${isNearCompletion ? 'ring-2 ring-amber-400' : ''}`}
              >
                {/* Goal header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 bg-gradient-to-br ${goal.color} rounded-lg`}>
                    {goal.icon}
                  </div>
                  {isCompleted && (
                    <div className="text-green-500">
                      <Trophy className="h-5 w-5" />
                    </div>
                  )}
                  {isNearCompletion && !isCompleted && (
                    <div className="text-amber-500">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  )}
                </div>

                {/* Goal info */}
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 font-serif mb-1">
                    {goal.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-slate-300 mb-2">
                    {goal.description}
                  </p>
                  {goal.deadline && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-slate-400">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {goal.deadline}</span>
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-slate-300">Progress</span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      <AnimatedCounter value={goal.current} /> / <AnimatedCounter value={goal.target} /> {goal.unit}
                    </span>
                  </div>
                  <GradientProgressBar 
                    progress={progress} 
                    height={8}
                    animated={true}
                    showPercentage={true}
                  />
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 dark:text-slate-400">
                    {isCompleted ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        Goal Achieved!
                      </span>
                    ) : isNearCompletion ? (
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        🔥 Almost there!
                      </span>
                    ) : (
                      <span>
                        {Math.round(goal.target - goal.current)} {goal.unit} remaining
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-gray-900 dark:text-slate-100">
                    {Math.round(progress)}%
                  </div>
                </div>
              </AnimatedCard>
            </StaggerItem>
          );
        }))}
      </StaggerContainer>

      {/* Add new goal button */}
      <div className="text-center">
        <button className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg">
          <Target className="h-4 w-4" />
          <span>Set New Goal</span>
        </button>
      </div>
    </div>
  );
}
