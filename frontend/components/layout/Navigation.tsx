'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Users,
  MessageCircle,
  BarChart3,
  Settings,
  Home,
  Search,
  Bookmark,
  TrendingUp,
  Calendar,
  Target,
  Award,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Library',
    href: '/library',
    icon: BookOpen,
    badge: 12,
  },
  {
    name: 'Discover',
    href: '/discover',
    icon: Search,
  },
  {
    name: 'Groups',
    href: '/groups',
    icon: Users,
    badge: 3,
  },
  {
    name: 'AI Assistant',
    href: '/chat',
    icon: MessageCircle,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    children: [
      { name: 'Reading Stats', href: '/analytics/stats', icon: TrendingUp },
      { name: 'Goals', href: '/analytics/goals', icon: Target },
      { name: 'Achievements', href: '/analytics/achievements', icon: Award },
    ],
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: Calendar,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
  onSignOut?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed = false,
  onToggleCollapse,
  className = '',
  onSignOut,
}) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    const tabName = href.replace('/', '');
    return activeTab === tabName;
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const isItemActive = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);

    return (
      <div key={item.name}>
        <button
          onClick={() => setActiveTab(item.href.replace('/', ''))}
          className={`
            group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 w-full
            ${level > 0 ? 'ml-6' : ''}
            ${isItemActive
              ? 'bg-indigo-dye-50 text-indigo-dye-700 border-r-2 border-indigo-dye-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }
            ${isCollapsed ? 'justify-center px-2' : ''}
          `}
          aria-current={isItemActive ? 'page' : undefined}
          title={isCollapsed ? item.name : undefined}
        >
          <item.icon
            className={`
              flex-shrink-0 h-5 w-5 transition-colors duration-200
              ${isItemActive ? 'text-indigo-dye-700' : 'text-gray-400 group-hover:text-gray-500'}
              ${isCollapsed ? 'mx-auto' : 'mr-3'}
            `}
            aria-hidden="true"
          />
          
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.name}</span>
              
              <div className="flex items-center space-x-2">
                {item.badge && (
                  <span className="badge-primary">
                    {item.badge}
                  </span>
                )}
                {hasChildren && (
                  <ChevronRight
                    className={`
                      h-4 w-4 transition-transform duration-200
                      ${isExpanded ? 'rotate-90' : ''}
                      ${isItemActive ? 'text-indigo-dye-700' : 'text-gray-400'}
                    `}
                  />
                )}
              </div>
            </>
          )}
        </button>

        {/* Render children if expanded */}
        {hasChildren && !isCollapsed && isExpanded && (
          <div className="mt-1">
            {item.children!.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
        
        {/* Show tooltip for items with children when collapsed */}
        {hasChildren && isCollapsed && (
          <div className="mt-1">
            <div className="w-2 h-2 bg-indigo-dye-400 rounded-full mx-auto"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`fixed left-0 top-0 ${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-white border-r border-gray-200 z-50 flex flex-col transition-all duration-300 ease-in-out ${className}`}>
      {/* Navigation Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-dye-600 to-safety-orange-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">ShelfSpace</span>
          </div>
        )}
        
        {isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 bg-gradient-to-r from-indigo-dye-600 to-safety-orange-600 rounded-lg flex items-center justify-center mx-auto hover:from-indigo-dye-700 hover:to-safety-orange-700 transition-colors cursor-pointer"
            aria-label="Expand navigation"
          >
            <BookOpen className="h-5 w-5 text-white" />
          </button>
        )}
        
        {!isCollapsed && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="btn-ghost p-2 rounded-md"
            aria-label="Collapse navigation"
          >
            <ChevronRight className="h-4 w-4 text-gray-600 rotate-180" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 h-[calc(100vh-140px)]">
        <div className={`space-y-1 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {navigationItems.map(item => renderNavigationItem(item))}
        </div>
      </div>

      {/* Navigation Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
            </button>
        </div>
      )}
      
      {/* Collapsed Footer - Just Sign Out Icon */}
      {isCollapsed && (
        <div className="p-4 border-t border-gray-200 flex-shrink-0 flex justify-center">
          <button
            onClick={onSignOut}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
