
'use client';

import React from 'react';
import Navigation from '../layout/Navigation';
import Header from '../layout/Header';
import DashboardRouter from './DashboardRouter';
import { useShelfSpace } from '../../app/hooks/useShelfSpace';

const ShelfSpaceDashboard = () => {
  const {
    activeTab,
    setActiveTab,
    isNavigationCollapsed,
    setIsNavigationCollapsed,
    userSettings,
    handleSignOut
  } = useShelfSpace();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isNavigationCollapsed}
        onToggleCollapse={() => setIsNavigationCollapsed(!isNavigationCollapsed)}
        onSignOut={handleSignOut}
      />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isNavigationCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header 
          userName={userSettings.profile.name}
          userEmail={userSettings.profile.email}
          userAvatar={userSettings.profile.avatar}
          showGreeting={activeTab === 'dashboard'}
          pageTitle={
            activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
          }
        />
        <main>
          <DashboardRouter activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
};

export default ShelfSpaceDashboard;
