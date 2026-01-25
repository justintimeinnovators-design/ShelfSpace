"use client";

import { Fragment, useEffect, useState } from "react";
import { X, Keyboard } from "lucide-react";

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts?: Shortcut[];
}

const defaultShortcuts: Shortcut[] = [
  // Navigation
  { keys: ["G", "D"], description: "Go to Dashboard", category: "Navigation" },
  { keys: ["G", "L"], description: "Go to Library", category: "Navigation" },
  { keys: ["G", "S"], description: "Go to Search", category: "Navigation" },
  { keys: ["G", "C"], description: "Go to Chat", category: "Navigation" },
  { keys: ["G", "G"], description: "Go to Groups", category: "Navigation" },
  { keys: ["G", "P"], description: "Go to Profile", category: "Navigation" },

  // Actions
  { keys: ["N"], description: "New Book", category: "Actions" },
  { keys: ["Ctrl", "K"], description: "Quick Search", category: "Actions" },
  { keys: ["/"], description: "Focus Search", category: "Actions" },
  { keys: ["?"], description: "Show Shortcuts", category: "Actions" },
  { keys: ["Esc"], description: "Close Modal/Dialog", category: "Actions" },

  // Reading
  { keys: ["R"], description: "Mark as Reading", category: "Reading" },
  { keys: ["F"], description: "Mark as Finished", category: "Reading" },
  { keys: ["W"], description: "Add to Want to Read", category: "Reading" },

  // UI
  { keys: ["T"], description: "Toggle Theme", category: "UI" },
  { keys: ["["], description: "Collapse Sidebar", category: "UI" },
  { keys: ["]"], description: "Expand Sidebar", category: "UI" },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  shortcuts = defaultShortcuts,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category]!.push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-3xl max-h-[80vh] overflow-hidden pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-dye-600 to-verdigris-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Keyboard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
                  <p className="text-indigo-dye-100 text-sm">
                    Boost your productivity with these shortcuts
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(groupedShortcuts).map(([category, items]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {items.map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {shortcut.description}
                        </span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <Fragment key={keyIndex}>
                              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                                {key}
                              </kbd>
                              {keyIndex < shortcut.keys.length - 1 && (
                                <span className="text-gray-400 text-xs">+</span>
                              )}
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Press{" "}
              <kbd className="px-2 py-1 text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded">
                ?
              </kbd>{" "}
              anytime to view shortcuts
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-dye-600 hover:bg-indigo-dye-700 text-white rounded-lg transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Hook to trigger shortcuts modal
export const useKeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Show shortcuts on "?"
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        // Don't trigger if user is typing in an input
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
          setIsOpen(true);
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
};
