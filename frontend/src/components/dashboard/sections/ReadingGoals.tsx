"use client";

import React from 'react';
import { AnimatedCard, StaggerContainer, StaggerItem, AnimatedCounter, GradientProgressBar } from '@/components/ui';
import { ReadingGoalsChart } from '../charts/ChartComponents';
import { Target, Trophy, Calendar, TrendingUp, BookOpen, Clock, Star } from 'lucide-react';

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

const mockGoals: ReadingGoal[] = [
  {
    id: '1',
    title: 'Books This Year',
    description: 'Annual reading goal',
    current: 189,
    target: 200,
    unit: 'books',
    icon: <BookOpen className="h-5 w-5" />,
    color: 'from-amber-400 to-orange-500',
    deadline: 'Dec 31, 2024',
    category: 'books'
  },
  {
    id: '2',
    title: 'Pages This Month',
    description: 'Monthly page target',
    current: 2840,
    target: 3000,
    unit: 'pages',
    icon: <BookOpen className="h-5 w-5" />,
    color: 'from-blue-400 to-indigo-500',
    deadline: 'Jan 31, 2024',
    category: 'pages'
  },
  {
    id: '3',
    title: 'Reading Streak',
    description: 'Consecutive days of reading',
    current: 28,
    target: 30,
    unit: 'days',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'from-green-400 to-emerald-500',
    category: 'streak'
  },
  {
    id: '4',
    title: 'Average Rating',
    description: 'Maintain high quality reads',
    current: 4.3,
    target: 4.5,
    unit: 'stars',
    icon: <Star className="h-5 w-5" />,
    color: 'from-purple-400 to-violet-500',
    category: 'rating'
  },
  {
    id: '5',
    title: 'Reading Time',
    description: 'Hours spent reading this month',
    current: 45,
    target: 60,
    unit: 'hours',
    icon: <Clock className="h-5 w-5" />,
    color: 'from-cyan-400 to-teal-500',
    deadline: 'Jan 31, 2024',
    category: 'time'
  },
  {
    id: '6',
    title: 'Classic Literature',
    description: 'Read more classic books',
    current: 8,
    target: 12,
    unit: 'books',
    icon: <Trophy className="h-5 w-5" />,
    color: 'from-rose-400 to-pink-500',
    deadline: 'Dec 31, 2024',
    category: 'books'
  }
];

const chartData = mockGoals.map(goal => ({
  goal: goal.title,
  current: goal.current,
  target: goal.target,
  unit: goal.unit
}));

export function ReadingGoals() {
  const completedGoals = mockGoals.filter(goal => goal.current >= goal.target).length;
  const totalGoals = mockGoals.length;
  const completionRate = Math.round((completedGoals / totalGoals) * 100);

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
              <AnimatedCounter value={completionRate} suffix="%" />
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
        {mockGoals.map((goal, index) => {
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
                        ✅ Goal Achieved!
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
        })}
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
