'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const StatsCard: React.FC<StatsCardProps & { cardIndex?: number }> = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor = '',
  iconBgColor = '',
  trend,
  className = '',
  cardIndex = 0,
}) => {
  const cardBg = cardIndex % 2 === 0 ? 'bg-secondary' : 'bg-tertiary';
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-verdigris-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-turkey-red-600" />;
      default:
        return null;
    }
  };

  const getChangeColor = () => {
    if (!change) return '';
    return change.type === 'increase' ? 'text-verdigris-600' : 'text-turkey-red-600';
  };

  return (
    <div className={`${cardBg} text-black border border-[var(--dashboard-card-border)] rounded-xl p-4 shadow-sm flex items-center space-x-4 ${className}`}>
      <div className="flex-1">
        <p className="text-body-sm text-gray-900 mb-1">{title}</p>
        <div className="flex items-baseline space-x-2">
          <p className="text-2xl font-bold text-gray-900">
            {formatValue(value)}
          </p>
          {getTrendIcon()}
        </div>
        
        {change && (
          <div className="flex items-center space-x-1 mt-2">
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
            </span>
            <span className="text-body-sm text-gray-500">
              vs {change.period}
            </span>
          </div>
        )}
      </div>
      
      <div className={`p-3 rounded-lg ${iconBgColor}`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
    </div>
  );
};

export default StatsCard;
