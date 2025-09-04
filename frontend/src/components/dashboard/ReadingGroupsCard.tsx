'use client';

import React from 'react';
import { ReadingGroup } from '../../../types/models';

interface ReadingGroupsCardProps {
  readingGroups: ReadingGroup[];
}

const ReadingGroupsCard: React.FC<ReadingGroupsCardProps> = ({ readingGroups }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Your Reading Groups</h2>
      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
        {readingGroups.map((group) => (
          <li key={group.id} className="flex justify-between items-center p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700">
            <span>{group.name} ({group.members} members)</span>
            <span className="text-sm text-gray-400 dark:text-gray-500">{group.currentBook}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReadingGroupsCard;
