'use client';

import React from 'react';
import { Plus, Search, ChevronRight, BookOpen, Bookmark, CheckCircle, Heart } from 'lucide-react';
import { Book, ReadingList } from '../../../types/library';

interface LibrarySidebarProps {
  readingLists: ReadingList[];
  selectedList: string;
  setSelectedList: (listId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const LibrarySidebar: React.FC<LibrarySidebarProps> = ({ 
  readingLists, 
  selectedList, 
  setSelectedList, 
  searchQuery, 
  setSearchQuery 
}) => {

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'indigo-dye': return 'bg-indigo-dye-50 text-indigo-dye-700 border-indigo-dye-200';
      case 'safety-orange': return 'bg-safety-orange-50 text-safety-orange-700 border-safety-orange-200';
      case 'verdigris': return 'bg-verdigris-50 text-verdigris-700 border-verdigris-200';
      case 'turkey-red': return 'bg-turkey-red-50 text-turkey-red-700 border-turkey-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <button className="bg-primary text-white h-10 px-5 py-2 rounded-lg flex items-center font-medium hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Book</span>
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-dye-500 focus:border-indigo-dye-500"
          />
        </div>
      </div>

      {/* Reading Lists */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Reading Lists</h2>
        <div className="space-y-2">
          {readingLists.map((list) => {
            const IconComponent = list.icon;
            return (
              <button
                key={list.id}
                onClick={() => setSelectedList(list.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                  selectedList === list.id
                    ? getColorClasses(list.color)
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`h-5 w-5 ${
                    selectedList === list.id ? '' : 'text-gray-400'
                  }`} />
                  <div className="text-left">
                    <p className="font-medium">{list.name}</p>
                    <p className="text-xs text-gray-500">{list.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded-full font-medium">
                    {list.bookCount}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LibrarySidebar;