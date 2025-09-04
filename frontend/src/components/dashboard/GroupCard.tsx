'use client';

import React from 'react';
import { Users, Clock, ChevronRight } from 'lucide-react';
import { colors } from '../../utils/colors';

interface GroupCardProps {
  id: string;
  name: string;
  memberCount: number;
  lastActivity: string;
  coverImage?: string;
  currentBook?: string;
  onClick?: (id: string) => void;
  className?: string;
  cardIndex?: number; // Add this prop to alternate card colors
}

const GroupCard: React.FC<GroupCardProps> = ({
  id,
  name,
  memberCount,
  lastActivity,
  coverImage,
  currentBook,
  onClick,
  className = '',
  cardIndex = 0, // Add this prop to alternate card colors
}) => {
  const handleClick = () => {
    onClick?.(id);
  };

  const cardBg = cardIndex % 2 === 0 ? colors.cardAlt1 : colors.cardAlt2;
  return (
    <div
      className={`rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 bg-white text-black border border-[var(--dashboard-card-border)] ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        {/* Group Avatar */}
        <div className="flex-shrink-0">
          {coverImage ? (
            <img
              src={coverImage}
              alt={`${name} group cover`}
              className="w-12 h-12 object-cover rounded-lg"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-dye-100 to-safety-orange-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-indigo-dye-600" />
            </div>
          )}
        </div>

        {/* Group Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 truncate">
                {name}
              </h4>
              
              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {memberCount} members
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {lastActivity}
                </div>
              </div>

              {currentBook && (
                <p className="text-xs text-gray-600 mt-2 truncate">
                  Currently reading: <span className="font-medium">{currentBook}</span>
                </p>
              )}
            </div>
            
            <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
