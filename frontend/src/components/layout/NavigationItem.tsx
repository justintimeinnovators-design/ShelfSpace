
'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface NavigationItemData {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavigationItemData[];
}

interface NavigationItemProps {
  item: NavigationItemData;
  isActive: boolean;
  isCollapsed: boolean;
  isExpanded: boolean;
  onItemClick: (itemName: string) => void;
  level?: number;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ 
  item, 
  isActive, 
  isCollapsed, 
  isExpanded, 
  onItemClick,
  level = 0 
}) => {
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div key={item.name}>
      <button
        onClick={() => onItemClick(item.name)}
        className={`
          group flex items-center w-full transition-all duration-200 ease-in-out
          ${level > 0 ? 'ml-6' : ''}
          ${isCollapsed ? 'justify-center items-center px-3 py-3' : 'px-4 py-3'}
          ${isActive
            ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-xl mx-2 shadow-sm'
            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-secondary-light)] hover:text-[var(--color-secondary)] rounded-xl mx-2'}
        `}
        aria-current={isActive ? 'page' : undefined}
        title={isCollapsed ? item.name : undefined}
      >
        <span className={`${isCollapsed ? 'flex justify-center items-center w-full' : ''}`}> 
          <item.icon
            className={`
              flex-shrink-0 transition-colors duration-200
              ${isCollapsed ? 'h-5 w-5 mx-auto' : 'h-5 w-5 mr-3'}
              text-text_light
            `}
            aria-hidden="true"
          />
        </span>
        
        {!isCollapsed && (
          <>
            <span className="flex-1 text-sm font-medium">{item.name}</span>
            
            <div className="flex items-center space-x-2">
              {item.badge && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-[var(--color-accent-light)] text-[var(--color-accent)] rounded-full min-w-[20px]">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <ChevronRight
                  className={`
                    h-4 w-4 transition-transform duration-200
                    ${isExpanded ? 'rotate-90' : ''}
                    ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-border)]'}
                  `}
                />
              )}
            </div>
          </>
        )}
      </button>

      {/* Render children if expanded */}
      {hasChildren && !isCollapsed && isExpanded && (
        <div className="mt-1 ml-4">
          {item.children!.map(child => (
            <NavigationItem 
              key={child.name}
              item={child} 
              isActive={false} // Child active state needs to be handled separately
              isCollapsed={isCollapsed} 
              isExpanded={false} // Child expansion needs to be handled separately
              onItemClick={onItemClick} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NavigationItem;
