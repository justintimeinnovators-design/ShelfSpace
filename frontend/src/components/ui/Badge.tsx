"use client";

import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { BadgeProps } from "@/types/components";

const badgeVariants = {
  variant: {
    primary:
      "bg-indigo-dye-100 text-indigo-dye-800 dark:bg-indigo-dye-900 dark:text-indigo-dye-200",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    neutral: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  },
  size: {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-sm",
    xl: "px-3.5 py-1 text-base",
  },
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "primary",
      size = "sm",
      rounded = true,
      dot = false,
      children,
      "data-testid": testId,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center font-medium",

          // Variant styles
          badgeVariants.variant[variant],

          // Size styles
          badgeVariants.size[size],

          // Shape styles
          rounded ? "rounded-full" : "rounded",

          // Dot variant
          dot && "w-2 h-2 p-0 rounded-full",

          className
        )}
        data-testid={testId}
        {...props}
      >
        {!dot && children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
