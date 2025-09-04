
'use client';

import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';

interface NavigationHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse?: () => void;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ isCollapsed, onToggleCollapse }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[#f3f4f6] flex-shrink-0">
      {!isCollapsed && (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-white/30 to-white/10 rounded-lg flex items-center justify-center shadow-sm">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">ShelfSpace</span>
        </div>
      )}
      
      {isCollapsed && (
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 bg-gradient-to-br from-[#8b7355] to-[#a8a08c] rounded-lg flex items-center justify-center mx-auto hover:from-[#7a6344] hover:to-[#978f7b] transition-colors cursor-pointer shadow-sm"
          aria-label="Expand navigation"
        >
          <BookOpen className="h-4 w-4 text-white" />
        </button>
      )}
      
      {!isCollapsed && onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#374151] transition-colors"
          aria-label="Collapse navigation"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>
      )}
    </div>
  );
};

export default NavigationHeader;
