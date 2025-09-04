
'use client';

import React from 'react';
import { Bell, Settings } from 'lucide-react';

interface HeaderActionsProps {
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ onNotificationsClick, onSettingsClick }) => {
  return (
    <div className="flex items-center space-x-4">
      {/* Notifications */}
      <button
        onClick={onNotificationsClick}
        className="relative p-3 rounded-xl hover:bg-[var(--color-bg)] transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-black" />
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-[var(--color-error)] rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-medium">3</span>
        </span>
      </button>

      {/* Settings */}
      <button
        onClick={onSettingsClick}
        className="p-3 rounded-xl hover:bg-[var(--color-bg)] transition-colors duration-200"
        aria-label="Settings"
      >
        <Settings className="h-5 w-5 text-black" />
      </button>
    </div>
  );
};

export default HeaderActions;
