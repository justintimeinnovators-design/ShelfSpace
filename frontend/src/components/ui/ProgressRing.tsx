"use client";

import React from "react";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  showPercentage?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Progress Ring.
 * @param {
  progress,
  size = 120,
  strokeWidth = 8,
  color = "#f59e0b",
  backgroundColor = "#e5e7eb",
  animated: _animated = true,
  showPercentage = true,
  className = "",
  children
} - { progress, size = 120, stroke Width = 8, color = "#f59e0b", background Color = "#e5e7eb", animated: animated = true, show Percentage = true, class Name = "", children } value.
 */
export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = "#f59e0b",
  backgroundColor = "#e5e7eb",
  animated: _animated = true,
  showPercentage = true,
  className = "",
  children
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {Math.round(progress)}%
          </span>
        ))}
      </div>
    </div>
  );
}

// Simple progress bar without animations
/**
 * Gradient Progress Bar.
 * @param {
  progress,
  height = 8,
  animated: _animated = true,
  showPercentage = false,
  className = ""
} - { progress, height = 8, animated: animated = true, show Percentage = false, class Name = "" } value.
 */
export function GradientProgressBar({
  progress,
  height = 8,
  animated: _animated = true,
  showPercentage = false,
  className = ""
}: {
  progress: number;
  height?: number;
  animated?: boolean;
  showPercentage?: boolean;
  className?: string;
}) {
  return (
    <div className={`w-full ${className}`}>
      <div 
        className="bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-right">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
}