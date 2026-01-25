"use client";

import React from "react";
import { useState } from "react";

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  animated?: boolean;
  delay?: number;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  className = "",
  onClick,
  hoverable = true,
  animated = true,
  delay = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6
        transition-all duration-300 ease-out
        ${
          hoverable
            ? "hover:shadow-xl hover:-translate-y-2 cursor-pointer"
            : "shadow-md"
        }
        ${animated ? "animate-fade-in-up" : ""}
        ${onClick ? "active:scale-95" : ""}
        ${className}
      `}
      style={animated ? { animationDelay: `${delay}ms` } : undefined}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`transition-transform duration-300 ${
          isHovered && hoverable ? "scale-[1.02]" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = "",
}) => {
  return <div className={`${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
};
