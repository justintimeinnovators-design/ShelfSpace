
'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface GroupFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterGenre: string;
  setFilterGenre: (genre: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: 'name' | 'members' | 'activity') => void;
}

const GroupFilters: React.FC<GroupFiltersProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  filterGenre, 
  setFilterGenre, 
  filterStatus, 
  setFilterStatus, 
  sortBy, 
  setSortBy 
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10 w-full"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <select
          value={filterGenre}
          onChange={(e) => setFilterGenre(e.target.value)}
          className="form-input w-32"
        >
          <option value="all">All Genres</option>
          <option value="Design">Design</option>
          <option value="Leadership">Leadership</option>
          <option value="Research">Research</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Science Fiction">Science Fiction</option>
          <option value="Business">Business</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="form-input w-32"
        >
          <option value="all">All Groups</option>
          <option value="joined">Joined</option>
          <option value="not-joined">Not Joined</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'members' | 'activity')}
          className="form-input w-32"
        >
          <option value="name">Sort by Name</option>
          <option value="members">Sort by Members</option>
          <option value="activity">Sort by Activity</option>
        </select>
      </div>
    </div>
  );
};

export default GroupFilters;
