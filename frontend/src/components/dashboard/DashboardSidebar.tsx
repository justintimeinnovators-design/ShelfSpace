'use client';

import React from 'react';
import ReadingGroupsCard from './ReadingGroupsCard';
import QuickActionsCard from './QuickActionsCard';
import { ReadingGroup } from '../../../types/models';

interface DashboardSidebarProps {
  readingGroups: ReadingGroup[];
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ readingGroups }) => {
  return (
    <div className="space-y-6">
      <ReadingGroupsCard readingGroups={readingGroups} />
      <QuickActionsCard />
    </div>
  );
};

export default DashboardSidebar;
