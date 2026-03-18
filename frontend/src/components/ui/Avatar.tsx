"use client";

import { forwardRef, useState } from "react";
import { User } from "lucide-react";
import { cn } from "@/utils/cn";
import { AvatarProps } from "@/types/components";
import Image from "next/image";

const avatarVariants = {
  size: {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
  },
  shape: {
    circle: "rounded-full",
    square: "rounded-lg",
  },
};

const statusVariants = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
  busy: "bg-red-500",
};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt,
      name,
      size = "md",
      shape = "circle",
      fallbackIcon: FallbackIcon = User,
      status,
      showStatus = false,
      "data-testid": testId,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);

/**
 * Get Initials.
 * @param name - name value.
 */
    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const sizeClasses = avatarVariants.size[size];
    const shapeClasses = avatarVariants.shape[shape];

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800",
          sizeClasses,
          shapeClasses,
          className
        )}
        data-testid={testId}
        {...props}
      >
        {src && !imageError ? (
          <Image
            src={src}
            alt={alt || name || "Avatar"}
            fill
            className={cn("object-cover", shapeClasses)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : name ? (
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {getInitials(name)}
          </span>
        ) : (
          <FallbackIcon
            className="h-1/2 w-1/2 text-gray-400 dark:text-gray-500"
            aria-hidden="true"
          />
        )}

        {showStatus && status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-800",
              statusVariants[status],
              // Status indicator size based on avatar size
              size === "xs" && "h-1.5 w-1.5",
              size === "sm" && "h-2 w-2",
              size === "md" && "h-2.5 w-2.5",
              size === "lg" && "h-3 w-3",
              size === "xl" && "h-4 w-4"
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
