
'use client';

import React, { useState } from 'react';
import { User, Settings, ChevronDown } from 'lucide-react';

interface UserProfileMenuProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ 
  userName = 'Reader',
  userEmail = 'user@example.com',
  userAvatar,
  onProfileClick,
  onSettingsClick,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[var(--color-bg)] transition-colors duration-200"
        aria-label="Profile menu"
        aria-expanded={isProfileMenuOpen}
      >
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={`${userName}'s avatar`}
            className="h-9 w-9 rounded-full object-cover border-2 border-[var(--color-border)]"
          />
        ) : (
          <div className="h-9 w-9 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-[var(--color-border)]">
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-black">{userName}</p>
          <p className="text-xs text-black">{userEmail}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-black" />
      </button>

      {/* Profile Dropdown */}
      {isProfileMenuOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-[var(--color-surface)] rounded-xl shadow-lg border border-[var(--color-border)] py-2 z-50">
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <p className="text-sm font-medium text-[var(--color-text)]">{userName}</p>
            <p className-="text-sm text-[var(--color-text-muted)]">{userEmail}</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => {
                onProfileClick?.();
                setIsProfileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] flex items-center space-x-3 transition-colors duration-200"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => {
                onSettingsClick?.();
                setIsProfileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] flex items-center space-x-3 transition-colors duration-200"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
          <div className="border-t border-[var(--color-border)] py-1">
            <button className="w-full text-left px-4 py-3 text-sm text-[var(--color-error)] hover:bg-[var(--color-error)]/[.08] transition-colors duration-200">
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
