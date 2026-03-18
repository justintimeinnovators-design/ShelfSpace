"use client";

import React from "react";
import { MessageSquare, RefreshCw, Home, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorFallbackProps } from "@/components/common/ErrorBoundary";

/**
 * Chat Error Fallback.
 * @param {
  retry,
  errorId,
} - { retry, error Id, } value.
 */
export const ChatErrorFallback: React.FC<ErrorFallbackProps> = ({
  retry,
  errorId,
}) => {
  return (
    <div className="min-h-[600px] flex items-center justify-center p-6">
      <Card className="max-w-lg w-full text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-red-900 dark:text-red-100">
            Chat temporarily unavailable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            We&apos;re having trouble connecting to our AI assistant. This might
            be a temporary issue with our chat service.
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-left">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
              While you wait:
            </h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/library")}
                leftIcon={BookOpen}
                className="w-full justify-start"
              >
                Browse Your Library
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/forums")}
                leftIcon={Users}
                className="w-full justify-start"
              >
                Join Reading Groups
              </Button>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button onClick={retry} leftIcon={RefreshCw}>
              Retry Chat
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
