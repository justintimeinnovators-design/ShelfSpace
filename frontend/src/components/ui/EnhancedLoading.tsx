"use client";

import { BookOpen } from "lucide-react";

interface EnhancedLoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse" | "book" | "skeleton";
  text?: string;
  className?: string;
}

export function EnhancedLoading({
  size = "md",
  variant = "spinner",
  text,
  className = ""
}: EnhancedLoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  };

  const renderSpinner = () => (
    <div className={`${sizeClasses[size]} border-2 border-gray-300 border-t-indigo-dye-600 rounded-full animate-spin`} />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${size === "sm" ? "w-1 h-1" : size === "md" ? "w-2 h-2" : "w-3 h-3"} bg-indigo-dye-600 rounded-full animate-pulse`}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className={`${sizeClasses[size]} bg-indigo-dye-600 rounded-full animate-pulse`} />
  );

  const renderBook = () => (
    <div className={`${sizeClasses[size]} flex items-center justify-center`}>
      <div className="text-indigo-dye-600 animate-pulse"><BookOpen className="h-8 w-8" /></div>
    </div>
  );

  const renderSkeleton = () => (
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case "dots":
        return renderDots();
      case "pulse":
        return renderPulse();
      case "book":
        return renderBook();
      case "skeleton":
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      {renderVariant()}
      {text && (
        <p className={`text-gray-600 dark:text-gray-400 ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
}

export function PageLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <EnhancedLoading variant="spinner" size="lg" text={text} />
    </div>
  );
}

export function InlineLoading({ text, size = "sm" }: { text?: string; size?: "sm" | "md" | "lg" }) {
  return <EnhancedLoading variant="spinner" size={size} {...(text && { text })} />;
}

export function ButtonLoading({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  return <EnhancedLoading variant="spinner" size={size} />;
}