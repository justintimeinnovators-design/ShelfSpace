'use client';
import React from 'react';
import { Activity } from '../../../types/models';

// ✅ Use interface and centralized type
interface RecentActivitySectionProps {
  recentActivity: Activity[];
}

const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({ recentActivity }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Recent Activity</h2>
      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
        {recentActivity.map((activity) => (
          <li key={activity.id} className="text-sm">
            {activity.action === "finished" && (
              <>📘 Finished <strong>{activity.book}</strong> ({activity.time})</>
            )}
            {activity.action === "reviewed" && (
              <>⭐ Reviewed <strong>{activity.book}</strong> ({activity.rating}/5) - {activity.time}</>
            )}
            {activity.action === "joined" && (
              <>👥 Joined group <strong>{activity.group}</strong> ({activity.time})</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivitySection;
