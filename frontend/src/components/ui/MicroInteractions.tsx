"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import { Check, X, AlertCircle, Info } from "lucide-react";

// Ripple effect component
/**
 * Ripple.
 * @param {
  x,
  y,
  color = "rgba(255, 255, 255, 0.5)",
} - { x, y, color = "rgba(255, 255, 255, 0.5)", } value.
 */
export const Ripple: React.FC<{ x: number; y: number; color?: string }> = ({
  x,
  y,
  color = "rgba(255, 255, 255, 0.5)",
}) => {
  return (
    <span
      className="absolute rounded-full pointer-events-none animate-[ripple_0.6s_ease-out]"
      style={{
        left: x,
        top: y,
        width: 0,
        height: 0,
        backgroundColor: color,
      }}
    />
  );
};

// Button with ripple effect
/**
 * Ripple Button.
 * @param { children, className - { children, class Name value.
 */
export const RippleButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
  }
> = ({ children, className = "", variant = "primary", onClick, ...props }) => {
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

/**
 * Handle Click.
 * @param e - e value.
 */
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, 600);
    }

    onClick?.(e);
  };

  const variantClasses = {
    primary: "bg-indigo-dye-600 hover:bg-indigo-dye-700 text-white",
    secondary:
      "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200",
    ghost:
      "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
  };

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 ${variantClasses[variant]} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {ripples.map((ripple) => (
        <Ripple key={ripple.id} x={ripple.x} y={ripple.y} />
      ))}
      {children}
    </button>
  );
};

// Toast notification
export interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: () => void;
}

/**
 * Toast.
 * @param {
  message,
  type = "info",
  duration = 3000,
  onClose,
} - { message, type = "info", duration = 3000, on Close, } value.
 */
export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: "bg-verdigris-500 text-white",
    error: "bg-turkey-red-500 text-white",
    warning: "bg-safety-orange-500 text-white",
    info: "bg-indigo-dye-500 text-white",
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
        colors[type]
      } ${isVisible ? "animate-fade-in-right" : "opacity-0 translate-x-full"}`}
    >
      {icons[type]}
      <span className="font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        className="ml-2 hover:opacity-80 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Tooltip component
/**
 * Tooltip.
 * @param { children, content, position - { children, content, position value.
 */
export const Tooltip: React.FC<{
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}> = ({ children, content, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg whitespace-nowrap transition-all duration-200 ${
            positionClasses[position]
          } ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45 ${
              position === "top"
                ? "bottom-[-4px] left-1/2 -translate-x-1/2"
                : position === "bottom"
                ? "top-[-4px] left-1/2 -translate-x-1/2"
                : position === "left"
                ? "right-[-4px] top-1/2 -translate-y-1/2"
                : "left-[-4px] top-1/2 -translate-y-1/2"
            }`}
          />
        </div>
      )}
    </div>
  );
};

// Animated counter
/**
 * Animated Counter.
 * @param { value, duration - { value, duration value.
 */
export const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  className?: string;
}> = ({ value, duration = 1000, className = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

/**
 * Animate.
 * @param timestamp - timestamp value.
 */
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span className={className}>{count}</span>;
};

// Progress bar with animation
/**
 * Animated Progress Bar.
 * @param { progress, className - { progress, class Name value.
 */
export const AnimatedProgressBar: React.FC<{
  progress: number;
  className?: string;
  showLabel?: boolean;
}> = ({ progress, className = "", showLabel = false }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(progress), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className={`relative ${className}`}>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-dye-500 to-verdigris-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
      {showLabel && (
        <span className="absolute right-0 top-3 text-xs text-gray-600 dark:text-gray-400">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
};

// Skeleton loader with shimmer
/**
 * Shimmer Skeleton.
 * @param { className - { class Name value.
 */
export const ShimmerSkeleton: React.FC<{
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}> = ({ className = "", variant = "rectangular" }) => {
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-shimmer ${variantClasses[variant]} ${className}`}
    />
  );
};

// Floating action button
/**
 * Floating Action Button.
 * @param { icon, label, className - { icon, label, class Name value.
 */
export const FloatingActionButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: React.ReactNode;
    label?: string;
  }
> = ({ icon, label, className = "", ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-indigo-dye-600 hover:bg-indigo-dye-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <span className="p-4">{icon}</span>
      {label && (
        <span
          className={`pr-4 font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
            isHovered ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
          }`}
        >
          {label}
        </span>
      )}
    </button>
  );
};

// Card with hover effect
/**
 * Interactive Card.
 * @param { children, className - { children, class Name value.
 */
export const InteractiveCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = "", onClick }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Badge with pulse animation
/**
 * Pulse Badge.
 * @param { children, variant - { children, variant value.
 */
export const PulseBadge: React.FC<{
  children: React.ReactNode;
  variant?: "success" | "error" | "warning" | "info";
  pulse?: boolean;
}> = ({ children, variant = "info", pulse = false }) => {
  const colors = {
    success:
      "bg-verdigris-100 text-verdigris-800 dark:bg-verdigris-900 dark:text-verdigris-200",
    error:
      "bg-turkey-red-100 text-turkey-red-800 dark:bg-turkey-red-900 dark:text-turkey-red-200",
    warning:
      "bg-safety-orange-100 text-safety-orange-800 dark:bg-safety-orange-900 dark:text-safety-orange-200",
    info: "bg-indigo-dye-100 text-indigo-dye-800 dark:bg-indigo-dye-900 dark:text-indigo-dye-200",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        colors[variant]
      } ${pulse ? "animate-pulse-scale" : ""}`}
    >
      {children}
    </span>
  );
};

// Loading spinner
/**
 * Spinner.
 * @param { size - { size value.
 */
export const Spinner: React.FC<{
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={`animate-pulse bg-amber-100 dark:bg-slate-700 rounded-lg ${sizes[size]} ${className}`}
    />
  );
};
