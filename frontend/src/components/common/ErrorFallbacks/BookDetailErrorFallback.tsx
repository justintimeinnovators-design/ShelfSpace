"use client";

import { ErrorFallbackProps } from "@/components/common/ErrorBoundary";
import { BookOpen, RefreshCw } from "lucide-react";

/**
 * Book Detail Error Fallback.
 * @param { error, retry } - { error, retry } value.
 */
export function BookDetailErrorFallback({ error, retry }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6">
          <BookOpen className="h-10 w-10 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3 font-serif">
          Something went wrong
        </h1>

        <p className="text-gray-600 dark:text-slate-300 mb-6">
          We're having trouble loading this book. This might be a temporary issue.
        </p>

        {process.env['NODE_ENV'] === "development" && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-slate-400 mb-2">
              Error Details (Development)
            </summary>
            <pre className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded overflow-auto">
              {error?.message || "Unknown error"}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={retry}
            className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
