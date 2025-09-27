"use client";

import React from "react";
import { LayoutDashboard, RefreshCw, Home, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorFallbackProps } from "../../../types/error";

export const DashboardErrorFallback: React.FC<ErrorFallbackProps> = ({
  retry,
  errorId,
}) => {
  return (
    <div className="min-h-[600px] flex items-center justify-center p-6">
      <Card className="max-w-lg w-full text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
            <LayoutDashboard className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-red-900 dark:text-red-100">
            Dashboard temporarily unavailable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            We&apos;re experiencing issues loading your dashboard. Your data is
            safe, and we&apos;re working to resolve this quickly.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-left">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Alternative actions:
            </h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/library")}
                leftIcon={Search}
                className="w-full justify-start"
              >
                Browse Library
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/groups")}
                leftIcon={Users}
                className="w-full justify-start"
              >
                View Groups
              </Button>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button onClick={retry} leftIcon={RefreshCw}>
              Retry Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/library")}
              leftIcon={Home}
            >
              Go to Library
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
