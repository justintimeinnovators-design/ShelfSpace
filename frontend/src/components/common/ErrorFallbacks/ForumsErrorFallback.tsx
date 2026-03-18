import React from "react";

interface ForumsErrorFallbackProps {
  error?: unknown;
  resetErrorBoundary?: () => void;
}

/**
 * Forums Error Fallback.
 * @param {
  error,
  resetErrorBoundary,
} - { error, reset Error Boundary, } value.
 */
export const ForumsErrorFallback: React.FC<ForumsErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const errorMessage =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : "We're having trouble loading your forums. Please try again.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
          Forums Error
        </h2>
        <p className="text-gray-600 dark:text-slate-300 mb-6">
          {errorMessage}
        </p>
        <div className="flex justify-center gap-4">
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          )}
          <button
            onClick={() => (window.location.href = "/forums")}
            className="px-4 py-2 border border-amber-500 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
          >
            Browse Forums
          </button>
        </div>
      </div>
    </div>
  );
};
