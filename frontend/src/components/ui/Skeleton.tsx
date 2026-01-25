"use client";

import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { SkeletonProps } from "@/types/components";

const skeletonVariants = {
  variant: {
    text: "h-4 rounded",
    rectangular: "rounded-lg",
    circular: "rounded-full",
  },
  animation: {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  },
};

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      width,
      height,
      variant = "rectangular",
      animation = "pulse",
      lines = 1,
      "data-testid": testId,
      ...props
    },
    ref
  ) => {
    // For text variant with multiple lines
    if (variant === "text" && lines > 1) {
      return (
        <div
          ref={ref}
          className={cn("space-y-2", className)}
          data-testid={testId}
          {...props}
        >
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "bg-gray-200 dark:bg-gray-700",
                skeletonVariants.variant[variant],
                skeletonVariants.animation[animation],
                // Make last line shorter for more realistic text appearance
                index === lines - 1 && "w-3/4"
              )}
              style={{
                width: index === lines - 1 ? "75%" : width,
                height: height || undefined,
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "bg-gray-200 dark:bg-gray-700",
          skeletonVariants.variant[variant],
          skeletonVariants.animation[animation],
          className
        )}
        style={{
          width: width || undefined,
          height: height || undefined,
        }}
        data-testid={testId}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

// Predefined skeleton components for common use cases
const SkeletonText = forwardRef<HTMLDivElement, Omit<SkeletonProps, "variant">>(
  (props, ref) => <Skeleton ref={ref} variant="text" {...props} />
);
SkeletonText.displayName = "SkeletonText";

const SkeletonAvatar = forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, "variant" | "width" | "height"> & { size?: "xs" | "sm" | "md" | "lg" | "xl" }
>(({ size = "md", ...props }, ref) => {
  const sizeMap = {
    xs: { width: 24, height: 24 },
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 48, height: 48 },
    xl: { width: 64, height: 64 },
  };

  const dimensions = sizeMap[size as keyof typeof sizeMap] || sizeMap.md;

  return (
    <Skeleton
      ref={ref}
      variant="circular"
      width={dimensions.width}
      height={dimensions.height}
      {...props}
    />
  );
});
SkeletonAvatar.displayName = "SkeletonAvatar";

const SkeletonCard = forwardRef<HTMLDivElement, Omit<SkeletonProps, "variant">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-4 p-4", className)} {...props}>
      <div className="flex items-center space-x-3">
        <SkeletonAvatar size="sm" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="rectangular" height={200} />
      <div className="space-y-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  )
);
SkeletonCard.displayName = "SkeletonCard";

export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  skeletonVariants,
};
