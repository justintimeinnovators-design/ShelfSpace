"use client";

import React from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Page Transition.
 * @param { children } - { children } value.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {children}
    </div>
  );
};

// Fade transition
/**
 * Fade Transition.
 * @param { children } - { children } value.
 */
export const FadeTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

// Scale transition
/**
 * Scale Transition.
 * @param {
  children,
} - { children, } value.
 */
export const ScaleTransition: React.FC<PageTransitionProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-all duration-300 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      {children}
    </div>
  );
};

// Slide transition
/**
 * Slide Transition.
 * @param { children, direction - { children, direction value.
 */
export const SlideTransition: React.FC<
  PageTransitionProps & { direction?: "left" | "right" | "up" | "down" }
> = ({ children, direction = "up" }) => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [pathname]);

/**
 * Get Transform.
 */
  const getTransform = () => {
    if (isVisible) return "translate-x-0 translate-y-0";
    switch (direction) {
      case "left":
        return "-translate-x-8";
      case "right":
        return "translate-x-8";
      case "up":
        return "-translate-y-8";
      case "down":
        return "translate-y-8";
      default:
        return "translate-y-8";
    }
  };

  return (
    <div
      className={`transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${getTransform()}`}
    >
      {children}
    </div>
  );
};
