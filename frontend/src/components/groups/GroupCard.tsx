
'use client';

import React from 'react';
import { Users, Clock, ChevronRight } from 'lucide-react';

export interface Group {
  id: string;
  name: string;
  memberCount: number;
  lastActivity: string;
  currentBook?: string;
  coverImage?: string;
  description?: string;
  genre?: string;
  isPrivate?: boolean;
  isJoined?: boolean;
}

interface GroupCardProps {
  group: Group;
  onGroupClick: (groupId: string) => void;
  onJoinGroup: (groupId: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onGroupClick, onJoinGroup }) => (
  <div className="card p-6 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => onGroupClick(group.id)}>
    <div className="flex items-start space-x-4">
      {/* Group Avatar */}
      <div className="flex-shrink-0">
        {group.coverImage ? (
          <img
            src={group.coverImage}
            alt={`${group.name} group cover`}
            className="w-16 h-16 object-cover rounded-lg"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-dye-100 to-safety-orange-100 rounded-lg flex items-center justify-center">
            <Users className="h-8 w-8 text-indigo-dye-600" />
          </div>
        )}
      </div>

      {/* Group Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {group.name}
              </h3>
              {group.isPrivate && (
                <span className="badge-warning text-xs">Private</span>
              )}
              {group.isJoined && (
                <span className="badge-success text-xs">Joined</span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {group.description}
            </p>

            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {group.memberCount} members
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {group.lastActivity}
              </div>
              {group.genre && (
                <span className="badge-primary text-xs">{group.genre}</span>
              )}
            </div>

            {group.currentBook && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Currently reading:</span> {group.currentBook}
              </p>
            )}
          </div>
          
          <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
        </div>
      </div>
    </div>

    {/* Action Button */}
    {!group.isJoined && (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onJoinGroup(group.id);
          }}
          className="btn-primary w-full"
        >
          Join Group
        </button>
      </div>
    )}
  </div>
);

export default GroupCard;
