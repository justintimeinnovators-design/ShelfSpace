"use client";

import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { InputProps } from "@/types/components";

const inputVariants = {
  variant: {
    default:
      "border-gray-300 focus:border-indigo-dye-500 focus:ring-indigo-dye-500",
    filled:
      "border-transparent bg-gray-100 focus:bg-white focus:border-indigo-dye-500 focus:ring-indigo-dye-500",
    outline:
      "border-2 border-gray-300 focus:border-indigo-dye-500 focus:ring-0",
  },
  size: {
    xs: "h-7 px-2 text-xs",
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-3 text-sm",
    lg: "h-11 px-4 text-base",
    xl: "h-12 px-4 text-lg",
  },
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      size = "md",
      variant = "default",
      isRequired = false,
      isInvalid = false,
      disabled,
      "data-testid": testId,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = error || isInvalid;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
              isRequired && "after:content-['*'] after:text-red-500 after:ml-1"
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LeftIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
          )}

          <input
            ref={ref}
            type={type}
            id={inputId}
            className={cn(
              // Base styles
              "block w-full rounded-lg border shadow-sm transition-colors",
              "placeholder:text-gray-400 focus:outline-none focus:ring-1 focus-visible:ring-2",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
              "dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500",
              "hover:border-gray-400 focus:border-indigo-dye-500",

              // Variant styles
              inputVariants.variant[variant],

              // Size styles
              inputVariants.size[size],

              // Icon padding
              LeftIcon && "pl-10",
              RightIcon && "pr-10",

              // Error state
              hasError &&
                "border-red-500 focus:border-red-500 focus:ring-red-500",

              className
            )}
            disabled={disabled}
            data-testid={testId}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {RightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <RightIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
