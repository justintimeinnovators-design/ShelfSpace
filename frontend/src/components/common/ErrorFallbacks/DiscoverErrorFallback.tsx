import React from "react";
import { BookOpen, ArrowLeft } from "lucide-react";
import { ErrorFallbackProps } from "../../../../types/error";

export function DiscoverErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6">
          <BookOpen className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3 font-serif">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 dark:text-slate-300 mb-6">
          We encountered an error while loading the discover page. Please try again.
        </p>
        <div className="space-y-3">
          <button
            onClick={resetError}
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-slate-400">
              Error Details
            </summary>
            <pre className="mt-2 text-xs text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 p-3 rounded overflow-auto">
              {error?.message || "Unknown error"}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
