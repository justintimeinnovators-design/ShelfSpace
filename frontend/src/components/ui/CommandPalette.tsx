"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, Clock } from "lucide-react";

interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  action: () => void;
  keywords?: string[];
  category?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands?: Command[];
}

const defaultCommands: Command[] = [
  {
    id: "dashboard",
    label: "Go to Dashboard",
    description: "View your reading overview",
    category: "Navigation",
    keywords: ["home", "overview"],
    action: () => (window.location.href = "/dashboard"),
  },
  {
    id: "library",
    label: "Go to Library",
    description: "Browse your book collection",
    category: "Navigation",
    keywords: ["books", "collection"],
    action: () => (window.location.href = "/library"),
  },
  {
    id: "discover",
    label: "Discover Books",
    description: "Find new books to read",
    category: "Navigation",
    keywords: ["search", "find", "explore"],
    action: () => (window.location.href = "/discover"),
  },
  {
    id: "groups",
    label: "Reading Groups",
    description: "Join or create reading groups",
    category: "Navigation",
    keywords: ["community", "discussion"],
    action: () => (window.location.href = "/groups"),
  },
  {
    id: "chat",
    label: "AI Chat",
    description: "Chat with AI about books",
    category: "Navigation",
    keywords: ["assistant", "help"],
    action: () => (window.location.href = "/chat"),
  },
  {
    id: "settings",
    label: "Settings",
    description: "Manage your preferences",
    category: "Navigation",
    keywords: ["preferences", "config"],
    action: () => (window.location.href = "/settings"),
  },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands = defaultCommands,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter commands based on query
  const filteredCommands = query
    ? commands.filter((cmd) => {
        const searchText = query.toLowerCase();
        return (
          cmd.label.toLowerCase().includes(searchText) ||
          cmd.description?.toLowerCase().includes(searchText) ||
          cmd.keywords?.some((kw) => kw.toLowerCase().includes(searchText))
        );
      })
    : commands;

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    const category = cmd.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const executeCommand = (command: Command) => {
    // Add to recent commands
    setRecentCommands((prev) => {
      const updated = [command.id, ...prev.filter((id) => id !== command.id)];
      return updated.slice(0, 5); // Keep only 5 recent
    });

    command.action();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            <kbd className="hidden sm:block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700 rounded">
              ESC
            </kbd>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto">
            {Object.keys(groupedCommands).length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <p>No commands found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, cmds]) => (
                <div key={category} className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {category}
                  </div>
                  {cmds.map((cmd) => {
                    const globalIndex = filteredCommands.indexOf(cmd);
                    const isSelected = globalIndex === selectedIndex;
                    const isRecent = recentCommands.includes(cmd.id);

                    return (
                      <button
                        key={cmd.id}
                        onClick={() => executeCommand(cmd)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                          isSelected
                            ? "bg-indigo-dye-50 dark:bg-indigo-dye-900/30"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        {cmd.icon && (
                          <div className="flex-shrink-0 text-gray-400">
                            {cmd.icon}
                          </div>
                        )}
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {cmd.label}
                            </span>
                            {isRecent && (
                              <Clock className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                          {cmd.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {cmd.description}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <ArrowRight className="w-4 h-4 text-indigo-dye-600 dark:text-indigo-dye-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                  ↑↓
                </kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                  ↵
                </kbd>
                Select
              </span>
            </div>
            <span>
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                Ctrl K
              </kbd>{" "}
              to open
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

// Hook to manage command palette
export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
};
