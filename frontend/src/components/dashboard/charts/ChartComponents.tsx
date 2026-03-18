"use client";

import React from 'react';
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { AnimatedCard } from '@/components/ui';

// Color palette for charts
const CHART_COLORS = {
  primary: '#f59e0b',
  secondary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',
  purple: '#8b5cf6',
  pink: '#ec4899',
  gradient: {
    from: '#f59e0b',
    to: '#d97706'
  }
};

const PIE_COLORS = [
  '#f59e0b', '#3b82f6', '#10b981', '#ef4444', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
];

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

/**
 * Chart Container.
 * @param { title, subtitle, children, className - { title, subtitle, children, class Name value.
 */
export function ChartContainer({ title, subtitle, children, className = "", icon }: ChartContainerProps) {
  return (
    <AnimatedCard variant="glass" hover className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 font-serif">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-slate-300 italic">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      <div className="h-64 w-full">
        {children}
      </div>
    </AnimatedCard>
  );
}

interface ReadingTrendsChartProps {
  data: Array<{
    month: string;
    books: number;
    pages: number;
    hours: number;
  }>;
}

/**
 * Reading Trends Chart.
 * @param { data } - { data } value.
 */
export function ReadingTrendsChart({ data }: ReadingTrendsChartProps) {
  return (
    <ChartContainer 
      title="Reading Trends" 
      subtitle="Your reading activity over time"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            yAxisId="books"
            orientation="left"
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            yAxisId="pages"
            orientation="right"
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Bar 
            yAxisId="books"
            dataKey="books" 
            fill={CHART_COLORS.primary}
            radius={[4, 4, 0, 0]}
            name="Books Read"
          />
          <Line 
            yAxisId="pages"
            type="monotone" 
            dataKey="pages" 
            stroke={CHART_COLORS.secondary}
            strokeWidth={3}
            dot={{ fill: CHART_COLORS.secondary, strokeWidth: 2, r: 4 }}
            name="Pages Read"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

interface GenreDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
}

/**
 * Genre Distribution Chart.
 * @param { data } - { data } value.
 */
export function GenreDistributionChart({ data }: GenreDistributionChartProps) {
/**
 * Render Customized Label.
 * @param { cx, cy, midAngle, innerRadius, outerRadius, percent } - { cx, cy, mid Angle, inner Radius, outer Radius, percent } value.
 */
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices < 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ChartContainer 
      title="Genre Distribution" 
      subtitle="Your reading preferences"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: any, _name: any, props: any) => [
              `${value} books`,
              props.payload.name
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

interface ReadingGoalsChartProps {
  data: Array<{
    goal: string;
    current: number;
    target: number;
    unit: string;
  }>;
}

/**
 * Reading Goals Chart.
 * @param { data } - { data } value.
 */
export function ReadingGoalsChart({ data }: ReadingGoalsChartProps) {
  const chartData = data.map(item => ({
    ...item,
    progress: Math.min((item.current / item.target) * 100, 100),
    remaining: Math.max(item.target - item.current, 0)
  }));

  return (
    <ChartContainer 
      title="Reading Goals Progress" 
      subtitle="Track your literary achievements"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number"
            domain={[0, 100]}
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            dataKey="goal"
            type="category"
            stroke="#6b7280"
            fontSize={12}
            width={80}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: any, _name: any, _props: any) => [
              `${value.toFixed(1)}%`,
              'Progress'
            ]}
            labelFormatter={(label) => `Goal: ${label}`}
          />
          <Bar 
            dataKey="progress" 
            fill={CHART_COLORS.primary}
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

interface ReadingStreakChartProps {
  data: Array<{
    day: string;
    streak: number;
    books: number;
  }>;
}

/**
 * Reading Streak Chart.
 * @param { data } - { data } value.
 */
export function ReadingStreakChart({ data }: ReadingStreakChartProps) {
  return (
    <ChartContainer 
      title="Reading Streak" 
      subtitle="Your daily reading consistency"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="streakGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="day" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="streak" 
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            fill="url(#streakGradient)"
            name="Streak Days"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

interface MonthlyReadingChartProps {
  data: Array<{
    month: string;
    books: number;
    pages: number;
    hours: number;
  }>;
}

/**
 * Monthly Reading Chart.
 * @param { data } - { data } value.
 */
export function MonthlyReadingChart({ data }: MonthlyReadingChartProps) {
  return (
    <ChartContainer 
      title="Monthly Reading Stats" 
      subtitle="Books, pages, and hours per month"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Bar 
            dataKey="books" 
            fill={CHART_COLORS.primary}
            radius={[4, 4, 0, 0]}
            name="Books"
          />
          <Bar 
            dataKey="pages" 
            fill={CHART_COLORS.secondary}
            radius={[4, 4, 0, 0]}
            name="Pages"
          />
          <Bar 
            dataKey="hours" 
            fill={CHART_COLORS.success}
            radius={[4, 4, 0, 0]}
            name="Hours"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

interface RatingDistributionChartProps {
  data: Array<{
    rating: string;
    count: number;
  }>;
}

/**
 * Rating Distribution Chart.
 * @param { data } - { data } value.
 */
export function RatingDistributionChart({ data }: RatingDistributionChartProps) {
  return (
    <ChartContainer 
      title="Rating Distribution" 
      subtitle="Your book ratings over time"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="rating" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: any) => [`${value} books`, 'Count']}
          />
          <Bar 
            dataKey="count" 
            fill={CHART_COLORS.warning}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
