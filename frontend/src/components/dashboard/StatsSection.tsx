'use client';

import React from 'react';
import { BookOpen, Clock, Target, Users } from 'lucide-react';
import StatsCard from './StatsCard';


interface StatsData {
  totalBooks: number;
  readingTime: number;
  readingGoal: number;
  activeGroups: number;
}

interface StatsSectionProps {
  stats: StatsData;
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const statDetails = {
    totalBooks: { icon: BookOpen, iconColor: 'text-indigo-dye-600', iconBgColor: 'bg-indigo-dye-50' },
    readingTime: { icon: Clock, iconColor: 'text-safety-orange-600', iconBgColor: 'bg-safety-orange-50' },
    readingGoal: { icon: Target, iconColor: 'text-verdigris-600', iconBgColor: 'bg-verdigris-50' },
    activeGroups: { icon: Users, iconColor: 'text-indigo-dye-600', iconBgColor: 'bg-indigo-dye-50' }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(stats).map(([key, value], idx) => {
        const details = statDetails[key as keyof StatsData];
        return (
          <StatsCard
            key={key}
            title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            value={value}
            cardIndex={idx}
            icon={details.icon}
            iconColor={details.iconColor}
            iconBgColor={details.iconBgColor}
            // Dummy data for now, will come from backend later
            change={{ value: 12, type: 'increase', period: 'last month' }} 
            trend="up"
          />
        );
      })}
    </div>
  );
};

export default StatsSection;