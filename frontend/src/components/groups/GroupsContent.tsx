'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import GroupFilters from './GroupFilters';
import GroupList from './GroupList';
import { Group } from './GroupCard';

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Product Design Book Club',
    memberCount: 24,
    lastActivity: '2 hours ago',
    currentBook: 'The Design of Everyday Things',
    description: 'A community for designers and design enthusiasts to discuss books about design, UX, and creativity.',
    genre: 'Design',
    isPrivate: false,
    isJoined: true,
  },
  {
    id: '2',
    name: 'Tech Leadership Reads',
    memberCount: 18,
    lastActivity: '1 day ago',
    currentBook: 'Atomic Habits',
    description: 'For tech leaders and managers to discuss leadership, management, and personal development books.',
    genre: 'Leadership',
    isPrivate: false,
    isJoined: true,
  },
  {
    id: '3',
    name: 'UX Research Community',
    memberCount: 31,
    lastActivity: '3 days ago',
    currentBook: 'Sapiens: A Brief History of Humankind',
    description: 'UX researchers and designers exploring books about human behavior, psychology, and research methods.',
    genre: 'Research',
    isPrivate: false,
    isJoined: false,
  },
  {
    id: '4',
    name: 'Fantasy Realm',
    memberCount: 32,
    lastActivity: '5 hours ago',
    currentBook: 'The Name of the Wind',
    description: 'Fantasy book lovers discussing epic tales, magical worlds, and legendary adventures.',
    genre: 'Fantasy',
    isPrivate: false,
    isJoined: false,
  },
  {
    id: '5',
    name: 'Science Fiction Explorers',
    memberCount: 28,
    lastActivity: '1 hour ago',
    currentBook: 'Project Hail Mary',
    description: 'Sci-fi enthusiasts exploring futuristic worlds, space exploration, and technological possibilities.',
    genre: 'Science Fiction',
    isPrivate: false,
    isJoined: true,
  },
  {
    id: '6',
    name: 'Business Strategy Circle',
    memberCount: 15,
    lastActivity: '4 days ago',
    currentBook: 'The Lean Startup',
    description: 'Entrepreneurs and business professionals discussing strategy, innovation, and business books.',
    genre: 'Business',
    isPrivate: true,
    isJoined: false,
  },
];

const GroupsContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'members' | 'activity'>('name');

  const filteredGroups = mockGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = filterGenre === 'all' || group.genre === filterGenre;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'joined' && group.isJoined) ||
                         (filterStatus === 'not-joined' && !group.isJoined);
    
    return matchesSearch && matchesGenre && matchesStatus;
  });

  const sortedGroups = [...filteredGroups].sort((a, b) => {
    switch (sortBy) {
      case 'members':
        return b.memberCount - a.memberCount;
      case 'activity':
        // Simple sorting by activity (in real app, you'd parse the time)
        return a.lastActivity.localeCompare(b.lastActivity);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleGroupClick = (groupId: string) => {
    console.log('Group clicked:', groupId);
    // Navigate to group detail page
  };

  const handleJoinGroup = (groupId: string) => {
    console.log('Join group:', groupId);
    // Handle join group logic
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 text-gray-900">Reading Groups</h1>
          <p className="text-body-base text-gray-600 mt-1">
            Join a community, discuss books, and read together
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </button>
      </div>

      <GroupFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterGenre={filterGenre}
        setFilterGenre={setFilterGenre}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <GroupList 
        groups={sortedGroups} 
        onGroupClick={handleGroupClick} 
        onJoinGroup={handleJoinGroup}
        searchQuery={searchQuery}
        filterGenre={filterGenre}
        filterStatus={filterStatus}
      />

      {/* Stats */}
      {sortedGroups.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Showing {sortedGroups.length} of {mockGroups.length} groups
          </p>
        </div>
      )}
    </div>
  );
};

export default GroupsContent;