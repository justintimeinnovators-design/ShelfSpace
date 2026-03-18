"use client";

import React from "react";
import { BookOpen, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorFallbackProps } from "@/components/common/ErrorBoundary";

/**
 * Library Error Fallback.
 * @param {
  error: _error,
  retry,
  errorId,
} - { error: error, retry, error Id, } value.
 */
export const LibraryErrorFallback: React.FC<ErrorFallbackProps> = ({
  error: _error,
  retry,
  errorId,
}) => {
  return (
    <div className="min-h-[600px] flex items-center justify-center p-6">
      <Card className="max-w-lg w-full text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-red-900 dark:text-red-100">
            Unable to load your library
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            We&apos;re having trouble loading your book collection. This might
            be a temporary issue with our servers.
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-left">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              What you can try:
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Check your internet connection</li>
              <li>• Refresh the page</li>
              <li>• Try again in a few minutes</li>
            </ul>
          </div>

          <div className="flex gap-2 justify-center">
            <Button onClick={retry} leftIcon={RefreshCw}>
              Reload Library
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/dashboard")}
              leftIcon={Home}
            >
              Go to Dashboard
            </Button>
          </div>

          {errorId && (
            <p className="text-xs text-gray-400">Error ID: {errorId}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
