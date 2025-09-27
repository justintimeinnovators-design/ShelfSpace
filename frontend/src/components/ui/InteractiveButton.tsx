"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  className?: string;
  ripple?: boolean;
  glow?: boolean;
  fullWidth?: boolean;
}

export function InteractiveButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = "left",
  className = "",
  ripple = false,
  glow = false,
  fullWidth = false
}: InteractiveButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-indigo-dye-600 hover:bg-indigo-dye-700 text-white focus:ring-indigo-dye-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    accent: "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500",
    outline: "border-2 border-indigo-dye-600 text-indigo-dye-600 hover:bg-indigo-dye-600 hover:text-white focus:ring-indigo-dye-500",
    ghost: "text-indigo-dye-600 hover:bg-indigo-dye-50 focus:ring-indigo-dye-500",
    gradient: "bg-gradient-to-r from-indigo-dye-600 to-purple-600 hover:from-indigo-dye-700 hover:to-purple-700 text-white focus:ring-indigo-dye-500"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  };

  const widthClasses = fullWidth ? "w-full" : "";
  const glowClasses = glow ? "shadow-lg" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${glowClasses} ${className}`}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      
      {Icon && iconPosition === "left" && !loading && (
        <Icon className="w-4 h-4 mr-2" />
      )}
      
      {children}
      
      {Icon && iconPosition === "right" && !loading && (
        <Icon className="w-4 h-4 ml-2" />
      )}
    </button>
  );
}

// Simple floating action button without animations
export function FloatingActionButton({
  icon: Icon,
  onClick,
  position = "bottom-right",
  className = ""
}: {
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  className?: string;
}) {
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6"
  };

  return (
    <button
      onClick={onClick}
      className={`fixed ${positionClasses[position]} w-14 h-14 bg-indigo-dye-600 hover:bg-indigo-dye-700 text-white rounded-full shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-dye-500 focus:ring-offset-2 z-50 ${className}`}
    >
      <Icon className="w-6 h-6 mx-auto" />
    </button>
  );
}

// Simple toggle button without animations
export function ToggleButton({
  isActive,
  onClick,
  children,
  className = ""
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isActive 
          ? "bg-indigo-dye-600 text-white focus:ring-indigo-dye-500" 
          : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500"
      } ${className}`}
    >
      {children}
    </button>
  );
}