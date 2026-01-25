"use client";

import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { CardProps } from "@/types/components";

/**
 * Card component variants configuration
 * Defines the visual styles for different card types, padding, radius, and shadow options
 */

const cardVariants = {
  variant: {
    default:
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    outlined:
      "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600",
    elevated:
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg",
    filled:
      "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
  },
  padding: {
    xs: "p-2",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  },
  radius: {
    xs: "rounded",
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
  },
  shadow: {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  },
};

/**
 * Card Component
 *
 * A flexible container component with various styling options.
 * Supports different variants, padding, radius, shadow, and interactive states.
 *
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Card content goes here
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 *
 * // Interactive card with hover effects
 * <Card interactive hover variant="elevated">
 *   Clickable card content
 * </Card>
 *
 * // Custom styling
 * <Card variant="outlined" padding="lg" radius="xl" shadow="lg">
 *   Custom styled card
 * </Card>
 * ```
 *
 * @param variant - Visual style variant (default, outlined, elevated, filled)
 * @param padding - Internal padding size (xs, sm, md, lg, xl)
 * @param radius - Border radius size (xs, sm, md, lg, xl)
 * @param shadow - Drop shadow intensity (none, sm, md, lg, xl)
 * @param hover - Enables hover effects
 * @param interactive - Makes card focusable and clickable
 * @param children - Card content
 * @param className - Additional CSS classes
 * @param data-testid - Test identifier for testing
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      radius = "md",
      shadow = "sm",
      hover = false,
      interactive = false,
      children,
      "data-testid": testId,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "transition-colors duration-200",

          // Variant styles
          cardVariants.variant[variant],

          // Padding styles
          cardVariants.padding[padding],

          // Radius styles
          cardVariants.radius[radius],

          // Shadow styles
          cardVariants.shadow[shadow],

          // Interactive states
          hover &&
            "hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600",
          interactive &&
            "cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-dye-500 focus:ring-offset-2",

          className
        )}
        data-testid={testId}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? "button" : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

/**
 * CardHeader Component
 *
 * Container for card title and description with proper spacing.
 *
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>Title</CardTitle>
 *   <CardDescription>Description</CardDescription>
 * </CardHeader>
 * ```
 */
const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * CardTitle Component
 *
 * Semantic heading element for card titles with consistent styling.
 *
 * @example
 * ```tsx
 * <CardTitle>My Card Title</CardTitle>
 * ```
 */
const CardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/**
 * CardDescription Component
 *
 * Subtitle or description text for cards with muted styling.
 *
 * @example
 * ```tsx
 * <CardDescription>This is a card description</CardDescription>
 * ```
 */
const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 dark:text-gray-400", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * CardContent Component
 *
 * Main content area of the card with appropriate spacing.
 *
 * @example
 * ```tsx
 * <CardContent>
 *   <p>Main card content goes here</p>
 * </CardContent>
 * ```
 */
const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

/**
 * CardFooter Component
 *
 * Footer area for actions and additional information.
 *
 * @example
 * ```tsx
 * <CardFooter>
 *   <Button>Primary Action</Button>
 *   <Button variant="outline">Secondary Action</Button>
 * </CardFooter>
 * ```
 */
const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
};
