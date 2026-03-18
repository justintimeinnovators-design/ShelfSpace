"use client";

import React from "react";
import { useState } from "react";
import { HelpCircle, X, ChevronRight } from "lucide-react";

interface HelpItem {
  id: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ContextualHelpProps {
  items: HelpItem[];
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

/**
 * Contextual Help.
 * @param {
  items,
  position = "top-right",
} - { items, position = "top right", } value.
 */
export const ContextualHelp: React.FC<ContextualHelpProps> = ({
  items,
  position = "top-right",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-40`}>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-dye-600 hover:bg-indigo-dye-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-dye-500/30"
        aria-label="Help"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Help Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute top-16 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 animate-fade-in-down overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-dye-600 to-verdigris-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Quick Help</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-1 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Help Items */}
            <div className="max-h-96 overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {item.description}
                  </p>
                  {item.action && (
                    <button
                      onClick={item.action.onClick}
                      className="text-sm text-indigo-dye-600 dark:text-indigo-dye-400 hover:underline flex items-center gap-1 group"
                    >
                      {item.action.label}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <a
                href="/help"
                className="text-sm text-indigo-dye-600 dark:text-indigo-dye-400 hover:underline flex items-center justify-center gap-1"
              >
                View Full Documentation
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Inline help tooltip
interface InlineHelpProps {
  content: string;
  title?: string;
}

/**
 * Inline Help.
 * @param { content, title } - { content, title } value.
 */
export const InlineHelp: React.FC<InlineHelpProps> = ({ content, title }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-gray-400 hover:text-indigo-dye-600 dark:hover:text-indigo-dye-400 transition-colors ml-1"
        aria-label="Help"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-xl animate-fade-in">
          {title && <div className="font-semibold mb-1">{title}</div>}
          <div className="text-gray-200">{content}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45" />
        </div>
      )}
    </div>
  );
};
