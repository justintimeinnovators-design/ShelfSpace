"use client";

import { useEffect, useCallback, useRef } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  preventDefault?: boolean;
}

export interface UseKeyboardNavigationOptions {
  shortcuts?: KeyboardShortcut[];
  enableArrowNavigation?: boolean;
  enableTabTrapping?: boolean;
  containerRef?: React.RefObject<HTMLElement>;
}

/**
 * Use Keyboard Navigation.
 * @param {
  shortcuts = [],
  enableArrowNavigation = false,
  enableTabTrapping = false,
  containerRef,
} - { shortcuts = [], enable Arrow Navigation = false, enable Tab Trapping = false, container Ref, } value.
 */
export function useKeyboardNavigation({
  shortcuts = [],
  enableArrowNavigation = false,
  enableTabTrapping = false,
  containerRef,
}: UseKeyboardNavigationOptions = {}) {
  const activeShortcuts = useRef<KeyboardShortcut[]>(shortcuts);

  // Update shortcuts when they change
  useEffect(() => {
    activeShortcuts.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check for keyboard shortcuts
      for (const shortcut of activeShortcuts.current) {
        const keyMatches = event.key === shortcut.key;
        const ctrlMatches = (shortcut.ctrlKey ?? false) === event.ctrlKey;
        const altMatches = (shortcut.altKey ?? false) === event.altKey;
        const shiftMatches = (shortcut.shiftKey ?? false) === event.shiftKey;
        const metaMatches = (shortcut.metaKey ?? false) === event.metaKey;

        if (
          keyMatches &&
          ctrlMatches &&
          altMatches &&
          shiftMatches &&
          metaMatches
        ) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.action();
          return;
        }
      }

      // Handle arrow navigation
      if (
        enableArrowNavigation &&
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        handleArrowNavigation(event);
      }

      // Handle tab trapping
      if (enableTabTrapping && event.key === "Tab" && containerRef?.current) {
        handleTabTrapping(event, containerRef.current);
      }
    },
    [enableArrowNavigation, enableTabTrapping, containerRef]
  );

  const handleArrowNavigation = useCallback((event: KeyboardEvent) => {
    const focusableElements = getFocusableElements();
    const currentIndex = focusableElements.indexOf(
      document.activeElement as HTMLElement
    );

    if (currentIndex === -1) return;

    let nextIndex: number;

    switch (event.key) {
      case "ArrowUp":
        nextIndex = Math.max(0, currentIndex - 1);
        break;
      case "ArrowDown":
        nextIndex = Math.min(focusableElements.length - 1, currentIndex + 1);
        break;
      case "ArrowLeft":
        nextIndex = Math.max(0, currentIndex - 1);
        break;
      case "ArrowRight":
        nextIndex = Math.min(focusableElements.length - 1, currentIndex + 1);
        break;
      default:
        return;
    }

    event.preventDefault();
    focusableElements[nextIndex]?.focus();
  }, []);

  const handleTabTrapping = useCallback(
    (event: KeyboardEvent, container: HTMLElement) => {
      const focusableElements = getFocusableElements(container);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    },
    []
  );

  const getFocusableElements = useCallback(
    (container: HTMLElement = document.body): HTMLElement[] => {
      const selector = [
        "button:not([disabled])",
        "[href]",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
      ].join(", ");

      return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
    },
    []
  );

  // Set up global keyboard event listener
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Utility functions
  const focusFirst = useCallback(
    (container?: HTMLElement) => {
      const focusableElements = getFocusableElements(container);
      focusableElements[0]?.focus();
    },
    [getFocusableElements]
  );

  const focusLast = useCallback(
    (container?: HTMLElement) => {
      const focusableElements = getFocusableElements(container);
      focusableElements[focusableElements.length - 1]?.focus();
    },
    [getFocusableElements]
  );

  const focusNext = useCallback(
    (container?: HTMLElement) => {
      const focusableElements = getFocusableElements(container);
      const currentIndex = focusableElements.indexOf(
        document.activeElement as HTMLElement
      );
      const nextIndex = (currentIndex + 1) % focusableElements.length;
      focusableElements[nextIndex]?.focus();
    },
    [getFocusableElements]
  );

  const focusPrevious = useCallback(
    (container?: HTMLElement) => {
      const focusableElements = getFocusableElements(container);
      const currentIndex = focusableElements.indexOf(
        document.activeElement as HTMLElement
      );
      const previousIndex =
        (currentIndex - 1 + focusableElements.length) %
        focusableElements.length;
      focusableElements[previousIndex]?.focus();
    },
    [getFocusableElements]
  );

  return {
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    getFocusableElements,
  };
}

// Common keyboard shortcuts
export const commonShortcuts = {
  search: (action: () => void): KeyboardShortcut => ({
    key: "k",
    ctrlKey: true,
    action,
    description: "Open search",
  }),

  escape: (action: () => void): KeyboardShortcut => ({
    key: "Escape",
    action,
    description: "Close modal or cancel action",
  }),

  help: (action: () => void): KeyboardShortcut => ({
    key: "?",
    shiftKey: true,
    action,
    description: "Show keyboard shortcuts",
  }),

  refresh: (action: () => void): KeyboardShortcut => ({
    key: "r",
    ctrlKey: true,
    action,
    description: "Refresh data",
  }),

  newItem: (action: () => void): KeyboardShortcut => ({
    key: "n",
    ctrlKey: true,
    action,
    description: "Create new item",
  }),

  save: (action: () => void): KeyboardShortcut => ({
    key: "s",
    ctrlKey: true,
    action,
    description: "Save changes",
  }),

  undo: (action: () => void): KeyboardShortcut => ({
    key: "z",
    ctrlKey: true,
    action,
    description: "Undo last action",
  }),

  redo: (action: () => void): KeyboardShortcut => ({
    key: "y",
    ctrlKey: true,
    action,
    description: "Redo last action",
  }),
};
