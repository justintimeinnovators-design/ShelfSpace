"use client";

import React from "react";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  hover?: boolean;
  glow?: boolean;
  variant?: "default" | "elevated" | "glass" | "gradient";
}

/**
 * Animated Card.
 * @param {
  children,
  className = "",
  delay: _delay = 0,
  direction: _direction = "up",
  hover: _hover = true,
  glow: _glow = false,
  variant: _variant = "default"
} - { children, class Name = "", delay: delay = 0, direction: direction = "up", hover: hover = true, glow: glow = false, variant: variant = "default" } value.
 */
export function AnimatedCard({
  children,
  className = "",
  delay: _delay = 0,
  direction: _direction = "up",
  hover: _hover = true,
  glow: _glow = false,
  variant: _variant = "default"
}: AnimatedCardProps) {
  const baseClasses = "bg-white dark:bg-gray-800 rounded-lg shadow-md";

  const variantClasses = {
    default: "bg-white dark:bg-gray-800",
    elevated: "bg-white dark:bg-gray-800 shadow-lg",
    glass: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
    gradient: "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
  };

  const hoverClasses = _hover ? "hover:shadow-lg transition-shadow duration-200" : "";
  const glowClasses = _glow ? "ring-2 ring-amber-400/50" : "";

  return (
    <div className={`${baseClasses} ${variantClasses[_variant]} ${hoverClasses} ${glowClasses} ${className}`}>
      {children}
    </div>
  );
}

// Simple container components without animations (non-conflicting names)
/**
 * Stagger Item.
 * @param { children, className - { children, class Name value.
 */
export function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

/**
 * Floating Element.
 * @param { children, className - { children, class Name value.
 */
export function FloatingElement({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

/**
 * Pulse Element.
 * @param { children, className - { children, class Name value.
 */
export function PulseElement({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}