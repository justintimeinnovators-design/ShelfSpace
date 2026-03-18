"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ReadingList } from "@/types/library";
import { ReadingListItem } from "@/components/library/components/ReadingListItem";
import { SearchInput } from "@/components/library/components/SearchInput";
import { useRouter } from "next/navigation";

interface LibrarySidebarProps {
  readingLists: ReadingList[];
  selectedList: string;
  setSelectedList: (listId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCreateList: (name: string) => Promise<void>;
}

/**
 * Library Sidebar.
 * @param {
  readingLists,
  selectedList,
  setSelectedList,
  searchQuery,
  setSearchQuery,
  onCreateList,
} - { reading Lists, selected List, set Selected List, search Query, set Search Query, on Create List, } value.
 */
const LibrarySidebar: React.FC<LibrarySidebarProps> = ({
  readingLists,
  selectedList,
  setSelectedList,
  searchQuery,
  setSearchQuery,
  onCreateList,
}) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

/**
 * Handle Add Book.
 */
  const handleAddBook = () => {
    router.push("/discover");
  };

/**
 * Handle Add Book Key Down.
 * @param event - event value.
 */
  const handleAddBookKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleAddBook();
    }
  };

/**
 * Handle Create List.
 */
  const handleCreateList = () => {
    setError(null);
    setListName("");
    setIsModalOpen(true);
  };

/**
 * Submit Create List.
 */
  const submitCreateList = async () => {
    const name = listName.trim();
    if (!name) {
      setError("Please enter a list name.");
      return;
    }
    setIsCreating(true);
    try {
      await onCreateList(name);
      setIsModalOpen(false);
      setListName("");
    } catch (err: any) {
      setError(err?.message || "Failed to create reading list");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-80 bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm border-r border-amber-200 dark:border-slate-700 flex flex-col shadow-lg">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-amber-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={handleAddBook}
            onKeyDown={handleAddBookKeyDown}
            variant="primary"
            size="md"
            leftIcon={Plus}
            aria-label="Add new book to library"
          >
            Add Book
          </Button>
          <Button
            onClick={handleCreateList}
            variant="secondary"
            size="sm"
            aria-label="Create new reading list"
          >
            New List
          </Button>
        </div>

        {/* Search */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search books..."
        />
      </div>

      {/* Reading Lists */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2
          className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3 uppercase tracking-wide"
          id="reading-lists-heading"
        >
          Reading Lists
        </h2>
        <div
          className="space-y-2"
          role="list"
          aria-labelledby="reading-lists-heading"
        >
          {readingLists.map((list) => (
            <div key={list.id} role="listitem">
              <ReadingListItem
                list={list}
                isSelected={selectedList === list.id}
                onSelect={setSelectedList}
              />
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 shadow-xl">
            <div className="p-5 border-b border-amber-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                Create Reading List
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label htmlFor="new-list-name" className="block text-sm text-gray-600 dark:text-slate-300 mb-1">
                  List name
                </label>
                <input
                  id="new-list-name"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                  placeholder="e.g., Favorites"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <div className="p-5 border-t border-amber-200 dark:border-slate-700 flex items-center justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={submitCreateList} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibrarySidebar;
