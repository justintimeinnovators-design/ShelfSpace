"use client";

import React from "react";
import { Component } from "react";
import { AlertTriangle, RefreshCw, Home, Copy, Bug } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  ErrorBoundaryProps,
  ErrorBoundaryState,
  ErrorFallbackProps,
} from "../../../types/error";
import { errorLogger } from "@/utils/errorLogger";

// Default error fallback component with enhanced debugging
/**
 * Default Error Fallback.
 * @param {
  error,
  retry,
  errorId,
  errorInfo,
} - { error, retry, error Id, error Info, } value.
 */
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  retry,
  errorId,
  errorInfo,
}) => {
/**
 * Copy Error Details.
 */
  const copyErrorDetails = () => {
    if (!errorId) return;

    const errorDetails = {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      breadcrumbs: [], // Simplified for now
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
    console.log("Error details copied to clipboard");
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-red-900 dark:text-red-100">
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            We encountered an unexpected error. Please try again or contact
            support if the problem persists.
          </p>

          {errorId && (
            <p className="text-xs text-gray-400 font-mono">
              Error ID: {errorId}
            </p>
          )}

          <div className="flex gap-2 justify-center">
            <Button onClick={retry} leftIcon={RefreshCw}>
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/dashboard")}
              leftIcon={Home}
            >
              Go Home
            </Button>
            {process.env.NODE_ENV === "development" && (
              <Button
                variant="outline"
                onClick={copyErrorDetails}
                leftIcon={Copy}
                size="sm"
              >
                Copy Details
              </Button>
            )}
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center">
                <Bug className="h-4 w-4 mr-1" />
                Error Details (Development)
              </summary>
              <div className="mt-2 space-y-2">
                <div>
                  <h4 className="text-xs font-semibold text-gray-700">
                    Error Message:
                  </h4>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                    {error.message}
                  </pre>
                </div>

                {error.stack && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-700">
                      Stack Trace:
                    </h4>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-32">
                      {error.stack}
                    </pre>
                  </div>
                )}

                {errorInfo?.componentStack && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-700">
                      Component Stack:
                    </h4>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-32">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-semibold text-gray-700">
                    Recent Breadcrumbs:
                  </h4>
                  <div className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded max-h-32 overflow-auto">
                    {errorLogger
                      .getBreadcrumbs()
                      .slice(-5)
                      .map((breadcrumb, index) => (
                        <div key={index} className="mb-1">
                          <span className="text-gray-500">
                            [{breadcrumb.level}]
                          </span>{" "}
                          <span className="font-medium">
                            {breadcrumb.message}
                          </span>
                          {breadcrumb.data &&
                            Object.keys(breadcrumb.data).length > 0 && (
                              <pre className="text-xs text-gray-600 ml-2 mt-1">
                                {JSON.stringify(breadcrumb.data, null, 2)}
                              </pre>
                            )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

/**
 * Get Derived State From Error.
 * @param error - error value.
 * @returns Partial<ErrorBoundaryState>.
 */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

/**
 * Component Did Catch.
 * @param error - error value.
 * @param errorInfo - error Info value.
 */
  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      errorInfo,
    });

    // Create enhanced error with boundary context
    // const enhancedError = new AppError(
    //   error.message,
    //   "COMPONENT_ERROR",
    //   "client",
    //   "high",
    //   {
    //     level: this.props.level || "component",
    //     componentStack: errorInfo.componentStack,
    //     errorBoundary: true,
    //     isolate: this.props.isolate,
    //     originalError: error.name,
    //   }
    // );

    // Log error with comprehensive context using our error logger
    // logError(enhancedError, {
    //   errorBoundaryLevel: this.props.level,
    //   componentStack: errorInfo.componentStack,
    //   errorId: this.state.errorId,
    //   timestamp: new Date().toISOString(),
    //   url: typeof window !== "undefined" ? window.location.href : "server",
    //   userAgent:
    //     typeof window !== "undefined" ? window.navigator.userAgent : "server",
    // });

    // Add breadcrumb for error boundary activation
    // errorLogger.addBreadcrumb({
    //   timestamp: new Date().toISOString(),
    //   category: "error",
    //   message: `Error boundary activated at ${
    //     this.props.level || "component"
    //   } level`,
    //   data: {
    //     errorMessage: error.message,
    //     errorId: this.state.errorId,
    //     componentStack: errorInfo.componentStack.split("\n")[1]?.trim(), // First component in stack
    //   },
    //   level: "error",
    // });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report error to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      this.reportError(error, errorInfo);
    }
  }

/**
 * Component Will Unmount.
 */
  override componentWillUnmount() {
    if (this.retryTimeoutId) {
      window.clearTimeout(this.retryTimeoutId);
    }
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // In a real app, you would send this to your error reporting service
    // like Sentry, Bugsnag, or your own logging service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: null, // Would get from auth context
    };

    console.error("Error Report:", errorReport);

    // Example: Send to monitoring service
    // errorReportingService.captureException(error, {
    //   extra: errorReport,
    //   tags: {
    //     component: 'ErrorBoundary',
    //     level: this.props.level || 'component',
    //   },
    // });
  };

  private handleRetry = () => {
    // Log retry attempt
    errorLogger.addBreadcrumb({
      timestamp: new Date().toISOString(),
      category: "user-action",
      message: "User attempted error recovery",
      data: {
        errorId: this.state.errorId,
        level: this.props.level,
        previousError: this.state.error?.message,
      },
      level: "info",
    });

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });

    // Add a small delay to prevent immediate re-error
    this.retryTimeoutId = window.setTimeout(() => {
      // Force a re-render of children
      this.forceUpdate();
    }, 100);
  };

/**
 * Render.
 */
  override render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          {...(this.state.errorInfo && { errorInfo: this.state.errorInfo })}
          retry={this.handleRetry}
          {...(this.state.errorId && { errorId: this.state.errorId })}
        />
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary, DefaultErrorFallback, type ErrorFallbackProps };
