
'use client';

import React from 'react';
import { Users, Plus } from 'lucide-react';
import GroupCard, { Group } from './GroupCard';

interface GroupListProps {
  groups: Group[];
  onGroupClick: (groupId: string) => void;
  onJoinGroup: (groupId: string) => void;
  searchQuery: string;
  filterGenre: string;
  filterStatus: string;
}

const GroupList: React.FC<GroupListProps> = ({ 
  groups, 
  onGroupClick, 
  onJoinGroup,
  searchQuery,
  filterGenre,
  filterStatus
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.length > 0 ? (
        groups.map((group) => (
          <GroupCard 
            key={group.id} 
            group={group} 
            onGroupClick={onGroupClick} 
            onJoinGroup={onJoinGroup} 
          />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No groups found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || filterGenre !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No reading groups available at the moment'}
          </p>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create the First Group
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupList;
