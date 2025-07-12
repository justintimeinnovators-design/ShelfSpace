'use client';

import React, { useState } from 'react';
import { Bell, Search, Settings, User, ChevronDown, Menu } from 'lucide-react';

interface HeaderProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onSearch?: (query: string) => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userName = 'Reader',
  userEmail = 'user@example.com',
  userAvatar,
  onSearch,
  onNotificationsClick,
  onSettingsClick,
  onProfileClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Greeting and Search */}
        <div className="flex items-center space-x-6 flex-1">
          <div className="hidden md:block">
            <h1 className="text-h5 text-gray-900 font-semibold">
              {getGreeting()}, {userName}!
            </h1>
            <p className="text-body-sm text-gray-600 mt-1">
              Ready to dive into your next chapter?
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search books, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10 w-full"
                aria-label="Search"
              />
            </form>
          </div>
        </div>

        {/* Right Section - Actions and Profile */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button
            onClick={onNotificationsClick}
            className="btn-ghost p-2 relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-turkey-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">3</span>
            </span>
          </button>

          {/* Settings */}
          <button
            onClick={onSettingsClick}
            className="btn-ghost p-2"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Profile menu"
              aria-expanded={isProfileMenuOpen}
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={`${userName}'s avatar`}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 bg-gradient-to-r from-indigo-dye-600 to-safety-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-sm text-gray-500">{userEmail}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      onProfileClick?.();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      onSettingsClick?.();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                </div>
                <div className="border-t border-gray-200 py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-turkey-red-600 hover:bg-turkey-red-50">
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden mt-4">
        <button className="btn-ghost p-2">
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;