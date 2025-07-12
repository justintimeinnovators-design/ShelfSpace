'use client';

import React, { useState } from 'react';
import Header from '../layout/Header';
import Navigation from '../layout/Navigation';
import DashboardContent from './DashboardContent';

const ShelfSpaceDashboard = () => {
  const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(false);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement search functionality
  };

  const handleNotificationsClick = () => {
    console.log('Notifications clicked');
    // Navigate to notifications or show notifications panel
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
    // Navigate to settings
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
    // Navigate to profile
  };

  const toggleNavigation = () => {
    setIsNavigationCollapsed(!isNavigationCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Navigation Sidebar */}
      <div className={`${isNavigationCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out`}>
        <Navigation
          isCollapsed={isNavigationCollapsed}
          onToggleCollapse={toggleNavigation}
          className="h-full"
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          userName="Alex"
          userEmail="alex@example.com"
          onSearch={handleSearch}
          onNotificationsClick={handleNotificationsClick}
          onSettingsClick={handleSettingsClick}
          onProfileClick={handleProfileClick}
        />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto">
          <DashboardContent />
        </main>
      </div>
    </div>
  );
};

export default ShelfSpaceDashboard;