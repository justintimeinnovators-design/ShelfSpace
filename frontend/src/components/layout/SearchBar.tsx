
'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="flex-1 max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-black" />
        </div>
        <input
          type="text"
          placeholder="Search books, authors, or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-400 rounded-xl bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all duration-200"
          aria-label="Search"
        />
      </form>
    </div>
  );
};

export default SearchBar;
