
'use client';

import React from 'react';
import { Grid, List } from 'lucide-react';

interface LibraryHeaderProps {
  currentList: any; // Replace with a proper type
  viewMode: 'grid' | 'list';
  setViewMode: (viewMode: 'grid' | 'list') => void;
  filterGenre: string;
  setFilterGenre: (genre: string) => void;
  sortBy: string;
  setSortBy: (sort: any) => void; // Replace with a proper type
  genres: string[];
  filteredBooksCount: number;
}

const LibraryHeader: React.FC<LibraryHeaderProps> = ({ 
  currentList, 
  viewMode, 
  setViewMode, 
  filterGenre, 
  setFilterGenre, 
  sortBy, 
  setSortBy, 
  genres, 
  filteredBooksCount 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{currentList?.name}</h2>
          <p className="text-gray-600">{currentList?.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' 
                ? 'bg-indigo-dye-100 text-indigo-dye-700' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' 
                ? 'bg-indigo-dye-100 text-indigo-dye-700' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <select
          value={filterGenre}
          onChange={(e) => setFilterGenre(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-dye-500 focus:border-indigo-dye-500"
        >
          <option value="all">All Genres</option>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-dye-500 focus:border-indigo-dye-500"
        >
          <option value="title">Sort by Title</option>
          <option value="author">Sort by Author</option>
          <option value="dateAdded">Sort by Date Added</option>
          <option value="rating">Sort by Rating</option>
        </select>

        <span className="text-sm text-gray-600">
          {filteredBooksCount} book{filteredBooksCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

export default LibraryHeader;
