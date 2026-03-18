"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, X, Check, AlertCircle } from "lucide-react";

interface EnhancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  icon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  showPasswordToggle?: boolean;
}

/**
 * Enhanced Input.
 * @param {
  label,
  error,
  success,
  hint,
  icon,
  clearable = false,
  onClear,
  showPasswordToggle = false,
  type = "text",
  className = "",
  value,
  onChange,
  ...props
} - { label, error, success, hint, icon, clearable = false, on Clear, show Password Toggle = false, type = "text", class Name = "", value, on Change, ...props } value.
 */
export const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  error,
  success,
  hint,
  icon,
  clearable = false,
  onClear,
  showPasswordToggle = false,
  type = "text",
  className = "",
  value,
  onChange,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

/**
 * Handle Clear.
 */
  const handleClear = () => {
    if (inputRef.current) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;
      nativeInputValueSetter?.call(inputRef.current, "");
      const event = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
    onClear?.();
  };

  const inputType = showPasswordToggle && showPassword ? "text" : type;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          className={`block text-sm font-medium transition-colors duration-200 ${
            isFocused
              ? "text-indigo-dye-600 dark:text-indigo-dye-400"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-white dark:bg-gray-800
            border-2 transition-all duration-200
            ${icon ? "pl-10" : ""}
            ${clearable || showPasswordToggle ? "pr-10" : ""}
            ${
              error
                ? "border-turkey-red-500 focus:border-turkey-red-600 focus:ring-4 focus:ring-turkey-red-500/20"
                : success
                ? "border-verdigris-500 focus:border-verdigris-600 focus:ring-4 focus:ring-verdigris-500/20"
                : isFocused
                ? "border-indigo-dye-500 ring-4 ring-indigo-dye-500/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          {...props}
        />

        {/* Clear button */}
        {clearable && hasValue && !props.disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:scale-110 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Password toggle */}
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:scale-110 active:scale-95"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Status icons */}
        {!clearable && !showPasswordToggle && (error || success) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {error && (
              <AlertCircle className="w-5 h-5 text-turkey-red-500 animate-shake" />
            )}
            {success && (
              <Check className="w-5 h-5 text-verdigris-500 animate-bounce-in" />
            )}
          </div>
        )}
      </div>

      {/* Helper text */}
      {(error || success || hint) && (
        <div className="flex items-start gap-1 text-sm animate-fade-in">
          {error && (
            <p className="text-turkey-red-600 dark:text-turkey-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
          )}
          {success && !error && (
            <p className="text-verdigris-600 dark:text-verdigris-400 flex items-center gap-1">
              <Check className="w-4 h-4 flex-shrink-0" />
              {success}
            </p>
          )}
          {hint && !error && !success && (
            <p className="text-gray-500 dark:text-gray-400">{hint}</p>
          )}
        </div>
      )}
    </div>
  );
};

// Textarea variant
interface EnhancedTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  showCount?: boolean;
  maxLength?: number;
}

/**
 * Enhanced Textarea.
 * @param {
  label,
  error,
  success,
  hint,
  showCount = false,
  maxLength,
  className = "",
  value,
  ...props
} - { label, error, success, hint, show Count = false, max Length, class Name = "", value, ...props } value.
 */
export const EnhancedTextarea: React.FC<EnhancedTextareaProps> = ({
  label,
  error,
  success,
  hint,
  showCount = false,
  maxLength,
  className = "",
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const currentLength = value?.toString().length || 0;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          className={`block text-sm font-medium transition-colors duration-200 ${
            isFocused
              ? "text-indigo-dye-600 dark:text-indigo-dye-400"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <textarea
          value={value}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-white dark:bg-gray-800
            border-2 transition-all duration-200
            ${
              error
                ? "border-turkey-red-500 focus:border-turkey-red-600 focus:ring-4 focus:ring-turkey-red-500/20"
                : success
                ? "border-verdigris-500 focus:border-verdigris-600 focus:ring-4 focus:ring-verdigris-500/20"
                : isFocused
                ? "border-indigo-dye-500 ring-4 ring-indigo-dye-500/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
          `}
          {...props}
        />

        {showCount && maxLength && (
          <div
            className={`absolute bottom-2 right-2 text-xs transition-colors duration-200 ${
              currentLength > maxLength * 0.9
                ? "text-safety-orange-600 dark:text-safety-orange-400"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {currentLength}/{maxLength}
          </div>
        )}
      </div>

      {/* Helper text */}
      {(error || success || hint) && (
        <div className="flex items-start gap-1 text-sm animate-fade-in">
          {error && (
            <p className="text-turkey-red-600 dark:text-turkey-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
          )}
          {success && !error && (
            <p className="text-verdigris-600 dark:text-verdigris-400 flex items-center gap-1">
              <Check className="w-4 h-4 flex-shrink-0" />
              {success}
            </p>
          )}
          {hint && !error && !success && (
            <p className="text-gray-500 dark:text-gray-400">{hint}</p>
          )}
        </div>
      )}
    </div>
  );
};
