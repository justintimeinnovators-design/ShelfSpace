
'use client';

import React from 'react';
import { LogOut } from 'lucide-react';

interface NavigationFooterProps {
  isCollapsed: boolean;
  onSignOut?: () => void;
}

const NavigationFooter: React.FC<NavigationFooterProps> = ({ isCollapsed, onSignOut }) => {
  return (
    <>
      {!isCollapsed && (
        <div className="p-4 border-t border-[var(--color-border)] flex-shrink-0">
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium  text-white hover:bg-gray-100 hover:text-black rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
      
      {isCollapsed && (
        <div className="p-4 border-t border-[#f3f4f6] flex-shrink-0 flex justify-center">
          <button
            onClick={onSignOut}
            className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:text-[#374151] hover:bg-[#f9fafb] rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
};

export default NavigationFooter;
