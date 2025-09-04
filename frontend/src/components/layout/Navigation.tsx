'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Users,
  MessageCircle,
  Settings,
  Home,
  Search,
} from 'lucide-react';
import { colors } from '../../utils/colors';
import NavigationItem, { NavigationItemData } from './NavigationItem';
import NavigationHeader from './NavigationHeader';
import NavigationFooter from './NavigationFooter';

const navigationItems: NavigationItemData[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Chat',
    href: '/chat',
    icon: MessageCircle,
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
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleItemClick = (itemName: string) => {
    const item = navigationItems.find(navItem => navItem.name === itemName);
    if (item) {
      setActiveTab(item.href.replace('/', ''));
      if (item.children) {
        setExpandedItems(prev =>
          prev.includes(itemName)
            ? prev.filter(name => name !== itemName)
            : [...prev, itemName]
        );
      }
    }
  };

  const isActive = (href: string) => {
    const tabName = href.replace('/', '');
    return activeTab === tabName;
  };

  return (
    <nav className={`fixed left-0 top-0 ${isCollapsed ? 'w-16' : 'w-64'} h-screen ${colors.sidebar} border-r border-[var(--color-border)] z-50 flex flex-col transition-all duration-300 ease-in-out ${className}`}>
      <NavigationHeader isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} />

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-6 h-[calc(100vh-140px)]">
        <div className={`space-y-2 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {navigationItems.map(item => (
            <NavigationItem
              key={item.name}
              item={item}
              isActive={isActive(item.href)}
              isCollapsed={isCollapsed}
              isExpanded={expandedItems.includes(item.name)}
              onItemClick={handleItemClick}
            />
          ))}
        </div>
      </div>

      <NavigationFooter isCollapsed={isCollapsed} onSignOut={onSignOut} />
    </nav>
  );
};

export default Navigation;