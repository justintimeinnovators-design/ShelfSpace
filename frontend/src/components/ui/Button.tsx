"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { ButtonProps } from "@/types/components";

/**
 * Button component variants configuration
 * Defines the visual styles for different button types and sizes
 */

const buttonVariants = {
  variant: {
    primary:
      "bg-indigo-dye-600 text-white hover:bg-indigo-dye-700 focus:ring-indigo-dye-500",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
    outline:
      "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800",
    link: "bg-transparent text-indigo-dye-600 hover:text-indigo-dye-700 underline-offset-4 hover:underline focus:ring-indigo-dye-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  },
  size: {
    xs: "h-7 px-2 text-xs",
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-6 text-base",
    xl: "h-12 px-8 text-lg",
  },
};

/**
 * Button Component
 *
 * A versatile button component with multiple variants, sizes, and states.
 * Supports loading states, icons, and full accessibility features.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button>Click me</Button>
 *
 * // With variant and size
 * <Button variant="secondary" size="lg">Large Secondary Button</Button>
 *
 * // With loading state
 * <Button isLoading loadingText="Saving...">Save</Button>
 *
 * // With icons
 * <Button leftIcon={Plus} rightIcon={ArrowRight}>Add Item</Button>
 *
 * // Full width
 * <Button fullWidth>Full Width Button</Button>
 * ```
 *
 * @param variant - Visual style variant (primary, secondary, outline, ghost, link, destructive)
 * @param size - Button size (xs, sm, md, lg, xl)
 * @param isLoading - Shows loading spinner and disables interaction
 * @param loadingText - Text to show during loading state
 * @param leftIcon - Icon component to display on the left
 * @param rightIcon - Icon component to display on the right
 * @param fullWidth - Makes button take full width of container
 * @param disabled - Disables the button
 * @param children - Button content (text or elements)
 * @param className - Additional CSS classes
 * @param data-testid - Test identifier for testing
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      fullWidth = false,
      disabled,
      children,
      "data-testid": testId,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
          "hover:shadow-sm active:scale-95 transition-all duration-150",

          // Variant styles
          buttonVariants.variant[variant],

          // Size styles
          buttonVariants.size[size],

          // Full width
          fullWidth && "w-full",

          className
        )}
        disabled={isDisabled}
        data-testid={testId}
        aria-label={typeof children === "string" ? children : undefined}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {loadingText || children}
          </>
        ) : (
          <>
            {LeftIcon && <LeftIcon className="h-4 w-4" aria-hidden="true" />}
            {children}
            {RightIcon && <RightIcon className="h-4 w-4" aria-hidden="true" />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
