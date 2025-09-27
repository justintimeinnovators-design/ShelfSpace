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

export function AnimatedCard({
  children,
  className = "",
  delay = 0,
  direction = "up",
  hover = true,
  glow = false,
  variant = "default"
}: AnimatedCardProps) {
  const baseClasses = "bg-white dark:bg-gray-800 rounded-lg shadow-md";
  
  const variantClasses = {
    default: "bg-white dark:bg-gray-800",
    elevated: "bg-white dark:bg-gray-800 shadow-lg",
    glass: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
    gradient: "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
  };

  const hoverClasses = hover ? "hover:shadow-lg transition-shadow duration-200" : "";
  const glowClasses = glow ? "ring-2 ring-amber-400/50" : "";

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${glowClasses} ${className}`}>
      {children}
    </div>
  );
}

// Simple container components without animations
export function StaggerContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function FloatingElement({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function PulseElement({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}