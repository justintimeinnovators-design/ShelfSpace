"use client";

import React from "react";
import { useState, useRef } from "react";

interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  ripple?: boolean;
}

/**
 * Enhanced Button.
 * @param {
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  ripple = true,
  className = "",
  onClick,
  disabled,
  ...props
} - { children, variant = "primary", size = "md", loading = false, icon, icon Position = "left", ripple = true, class Name = "", on Click, disabled, ...props } value.
 */
export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  ripple = true,
  className = "",
  onClick,
  disabled,
  ...props
}) => {
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

/**
 * Handle Click.
 * @param e - e value.
 */
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && buttonRef.current && !disabled && !loading) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, 600);
    }

    if (!disabled && !loading) {
      onClick?.(e);
    }
  };

  const variantClasses = {
    primary:
      "bg-indigo-dye-600 hover:bg-indigo-dye-700 text-white shadow-md hover:shadow-lg disabled:bg-indigo-dye-300",
    secondary:
      "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 shadow-sm hover:shadow-md",
    ghost:
      "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
    danger:
      "bg-turkey-red-600 hover:bg-turkey-red-700 text-white shadow-md hover:shadow-lg disabled:bg-turkey-red-300",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      ref={buttonRef}
      className={`
        relative overflow-hidden rounded-lg font-medium
        transition-all duration-200 ease-out
        hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        focus:outline-none focus:ring-4 focus:ring-indigo-dye-500/30
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-[ripple_0.6s_ease-out]"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
        />
      ))}

      {/* Button content */}
      <span className="relative flex items-center justify-center gap-2">
        {loading && (
          <div className="h-4 w-4 bg-current opacity-30 rounded animate-pulse" />
        )}
        {!loading && icon && iconPosition === "left" && icon}
        {children}
        {!loading && icon && iconPosition === "right" && icon}
      </span>
    </button>
  );
};
