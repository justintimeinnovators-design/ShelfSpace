
'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import SearchBar from './SearchBar';
import HeaderActions from './HeaderActions';
import UserProfileMenu from './UserProfileMenu';

interface HeaderProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onSearch?: (query: string) => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  pageTitle?: string;
  showGreeting?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  userName,
  userEmail,
  userAvatar,
  onSearch,
  onNotificationsClick,
  onSettingsClick,
  onProfileClick,
  pageTitle,
  showGreeting = true,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-8 py-6">
      <div className="flex items-center justify-between">
        {/* Left Section - Greeting or Page Title and Search */}
        <div className="flex items-center space-x-8 flex-1">
          <div className="hidden md:block">
            {showGreeting ? (
              <>
                <h1 className="text-xl font-semibold text-[var(--color-text)]">
                  {getGreeting()}, {userName}!
                </h1>
                <p className="text-sm text-black mt-1">
                  Ready to dive into your next chapter?
                </p>
              </>
            ) : pageTitle ? (
              <h1 className="text-xl font-semibold text-[var(--color-text)]">{pageTitle}</h1>
            ) : null}
          </div>
          <SearchBar onSearch={onSearch} />
        </div>

        {/* Right Section - Actions and Profile */}
        <div className="flex items-center space-x-4">
          <HeaderActions 
            onNotificationsClick={onNotificationsClick} 
            onSettingsClick={onSettingsClick} 
          />
          <UserProfileMenu 
            userName={userName}
            userEmail={userEmail}
            userAvatar={userAvatar}
            onProfileClick={onProfileClick}
            onSettingsClick={onSettingsClick}
          />
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden mt-4">
        <button className="p-3 rounded-xl hover:bg-[var(--color-bg)] transition-colors duration-200">
          <Menu className="h-5 w-5 text-black" />
        </button>
      </div>
    </header>
  );
};

export default Header;
