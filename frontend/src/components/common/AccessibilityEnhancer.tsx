"use client";

import React, { useEffect, useState } from "react";

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  focusVisible: boolean;
  screenReader: boolean;
}

export function AccessibilityEnhancer() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    focusVisible: false,
    screenReader: false
  });

  useEffect(() => {
    // Check for system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    setSettings(prev => ({
      ...prev,
      reducedMotion: prefersReducedMotion,
      highContrast: prefersHighContrast
    }));

    // Listen for system preference changes
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastMediaQuery = window.matchMedia('(prefers-contrast: high)');

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrast: e.matches }));
    };

    motionMediaQuery.addEventListener('change', handleMotionChange);
    contrastMediaQuery.addEventListener('change', handleContrastChange);

    return () => {
      motionMediaQuery.removeEventListener('change', handleMotionChange);
      contrastMediaQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  useEffect(() => {
    // Apply accessibility settings to document
    const root = document.documentElement;
    
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    if (settings.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }

    if (settings.screenReader) {
      root.classList.add('screen-reader');
    } else {
      root.classList.remove('screen-reader');
    }
  }, [settings]);

  // Keyboard navigation enhancement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip to main content
      if (e.key === 'Tab' && e.shiftKey && e.ctrlKey) {
        e.preventDefault();
        const main = document.querySelector('main');
        if (main) {
          main.focus();
          main.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Skip to navigation
      if (e.key === 'Tab' && e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        const nav = document.querySelector('nav');
        if (nav) {
          nav.focus();
          nav.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Escape key to close modals
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach(modal => {
          const closeButton = modal.querySelector('[aria-label="Close"]');
          if (closeButton) {
            (closeButton as HTMLElement).click();
          }
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus management for modals
  useEffect(() => {
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const modal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
        if (modal) {
          const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleFocusTrap);
    return () => document.removeEventListener('keydown', handleFocusTrap);
  }, []);

  // Screen reader announcements
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Expose announcement function globally for use in other components
  useEffect(() => {
    (window as any).announceToScreenReader = announceToScreenReader;
    return () => {
      delete (window as any).announceToScreenReader;
    };
  }, []);

  return null;
}

// Skip links component
export function SkipLinks() {
  return (
    <div className="skip-links">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-amber-600 text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>
      <a 
        href="#navigation" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 bg-amber-600 text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to navigation
      </a>
    </div>
  );
}

// Focus indicator component
export function FocusIndicator() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .focus-visible *:focus {
        outline: 3px solid #f59e0b !important;
        outline-offset: 2px !important;
      }
      
      .high-contrast {
        --tw-bg-opacity: 1;
        --tw-text-opacity: 1;
      }
      
      .high-contrast .bg-white {
        background-color: #ffffff !important;
        color: #000000 !important;
      }
      
      .high-contrast .bg-gray-50 {
        background-color: #f9fafb !important;
        color: #000000 !important;
      }
      
      .high-contrast .text-gray-600 {
        color: #000000 !important;
      }
      
      .large-text {
        font-size: 1.125rem;
      }
      
      .large-text h1 {
        font-size: 2.5rem;
      }
      
      .large-text h2 {
        font-size: 2rem;
      }
      
      .large-text h3 {
        font-size: 1.75rem;
      }
      
      .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      .screen-reader .sr-only {
        position: static !important;
        width: auto !important;
        height: auto !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: visible !important;
        clip: auto !important;
        white-space: normal !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}

// ARIA live region for dynamic content
export function AriaLiveRegion() {
  return (
    <div 
      id="aria-live-region" 
      aria-live="polite" 
      aria-atomic="true" 
      className="sr-only"
    >
      {/* Dynamic content will be announced here */}
    </div>
  );
}

// Accessibility settings panel
interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessibilityPanel({ isOpen, onClose }: AccessibilityPanelProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    focusVisible: false,
    screenReader: false
  });

  useEffect(() => {
    if (isOpen) {
      // Load current settings from localStorage
      const savedSettings = localStorage.getItem('accessibility-settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    }
  }, [isOpen]);

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
    
    // Apply settings immediately
    const root = document.documentElement;
    if (value) {
      root.classList.add(key.replace(/([A-Z])/g, '-$1').toLowerCase());
    } else {
      root.classList.remove(key.replace(/([A-Z])/g, '-$1').toLowerCase());
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="accessibility-panel-title"
        aria-modal="true"
      >
        <h2 id="accessibility-panel-title" className="text-xl font-semibold mb-4">
          Accessibility Settings
        </h2>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => updateSetting('highContrast', e.target.checked)}
              className="w-4 h-4 text-amber-600"
            />
            <span>High Contrast Mode</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
              className="w-4 h-4 text-amber-600"
            />
            <span>Reduce Motion</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.largeText}
              onChange={(e) => updateSetting('largeText', e.target.checked)}
              className="w-4 h-4 text-amber-600"
            />
            <span>Large Text</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.focusVisible}
              onChange={(e) => updateSetting('focusVisible', e.target.checked)}
              className="w-4 h-4 text-amber-600"
            />
            <span>Enhanced Focus Indicators</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.screenReader}
              onChange={(e) => updateSetting('screenReader', e.target.checked)}
              className="w-4 h-4 text-amber-600"
            />
            <span>Screen Reader Mode</span>
          </label>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
