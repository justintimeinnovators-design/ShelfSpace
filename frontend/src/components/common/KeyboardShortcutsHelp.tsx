"use client";

import { useState, useEffect } from "react";
import { X, Keyboard } from "lucide-react";
import { KeyboardShortcut } from "@/hooks/useKeyboardNavigation";
import { Button } from "@/components/ui/Button";
import { focusManagement } from "@/utils/accessibility";

interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[];
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsHelp({
  shortcuts,
  isOpen,
  onClose,
}: KeyboardShortcutsHelpProps) {
  const [previousFocus, setPreviousFocus] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      setPreviousFocus(document.activeElement as HTMLElement);

      // Trap focus within the modal
      const modal = document.getElementById("keyboard-shortcuts-modal");
      if (modal) {
        const cleanup = focusManagement.trapFocus(modal);
        return cleanup;
      }
    } else if (previousFocus) {
      // Restore focus when modal closes
      focusManagement.restoreFocus(previousFocus);
    }
    return undefined;
  }, [isOpen, previousFocus]);

  const formatShortcut = (shortcut: KeyboardShortcut): string => {
    const keys: string[] = [];

    if (shortcut.ctrlKey) keys.push("Ctrl");
    if (shortcut.altKey) keys.push("Alt");
    if (shortcut.shiftKey) keys.push("Shift");
    if (shortcut.metaKey) keys.push("Cmd");

    keys.push(shortcut.key === " " ? "Space" : shortcut.key);

    return keys.join(" + ");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      aria-describedby="shortcuts-description"
    >
      <div
        id="keyboard-shortcuts-modal"
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Keyboard
              className="h-6 w-6 text-indigo-dye-600"
              aria-hidden="true"
            />
            <h2
              id="shortcuts-title"
              className="text-xl font-semibold text-gray-900"
            >
              Keyboard Shortcuts
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close keyboard shortcuts help"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <p id="shortcuts-description" className="text-gray-600 mb-6">
            Use these keyboard shortcuts to navigate and interact with the
            application more efficiently.
          </p>

          <div className="space-y-4">
            {shortcuts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No keyboard shortcuts available for this page.
              </p>
            ) : (
              shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50"
                >
                  <span className="text-gray-900">{shortcut.description}</span>
                  <kbd className="px-3 py-1 text-sm font-mono bg-gray-100 border border-gray-300 rounded-md text-gray-800">
                    {formatShortcut(shortcut)}
                  </kbd>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              General Navigation
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Navigate between elements</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-800">
                  Tab / Shift + Tab
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Activate buttons and links</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-800">
                  Enter / Space
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Navigate lists and grids</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-800">
                  Arrow Keys
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Close dialogs and menus</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-800">
                  Escape
                </kbd>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsHelp;
