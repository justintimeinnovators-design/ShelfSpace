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
    name: 'Chat',
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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  isCollapsed = false,
  onToggleCollapse,
  className = '',
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
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const isItemActive = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);

    return (
      <div key={item.name}>
        <Link
          href={item.href}
          className={`
            group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
            ${level > 0 ? 'ml-6' : ''}
            ${isItemActive
              ? 'bg-indigo-dye-50 text-indigo-dye-700 border-r-2 border-indigo-dye-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }
            ${isCollapsed ? 'justify-center px-2' : ''}
          `}
          aria-current={isItemActive ? 'page' : undefined}
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
        </Link>

        {/* Render children if expanded */}
        {hasChildren && !isCollapsed && isExpanded && (
          <div className="mt-1">
            {item.children!.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`bg-white border-r border-gray-200 h-full ${className}`}>
      {/* Navigation Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-dye-600 to-safety-orange-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">ShelfSpace</span>
          </div>
        )}
        
        <button
          onClick={onToggleCollapse}
          className="btn-ghost p-2 rounded-md"
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-600 rotate-180" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {navigationItems.map(item => renderNavigationItem(item))}
        </div>
      </div>

      {/* Navigation Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-r from-indigo-dye-600 to-safety-orange-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-white">P</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Premium Plan</p>
                <p className="text-xs text-gray-500">Unlimited access</p>
              </div>
            </div>
            <button className="w-full btn-primary text-xs py-1">
              Upgrade
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
