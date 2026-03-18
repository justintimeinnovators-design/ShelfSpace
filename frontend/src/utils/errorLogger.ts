/**
 * Centralized error logging and diagnostics utilities.
 *
 * Capabilities:
 * - Normalizes unknown errors into a common `BaseError` shape.
 * - Tracks runtime breadcrumbs to reconstruct preceding user/system events.
 * - Supports both local console output and optional remote log shipping.
 * - Installs global listeners for unhandled errors in browser runtime.
 */

import { BaseError, ErrorBreadcrumb, ErrorReport } from "../../types/error";

// Environment detection
const isDevelopment = process.env['NODE_ENV'] === "development";
const isProduction = process.env['NODE_ENV'] === "production";

// Error logger configuration
interface ErrorLoggerConfig {
  enableConsoleLogging: boolean;
  enableRemoteLogging: boolean;
  enableBreadcrumbs: boolean;
  maxBreadcrumbs: number;
  apiEndpoint?: string | undefined;
  apiKey?: string | undefined;
}

const defaultConfig: ErrorLoggerConfig = {
  enableConsoleLogging: isDevelopment,
  enableRemoteLogging: isProduction,
  enableBreadcrumbs: true,
  maxBreadcrumbs: 50,
  ...(process.env['NEXT_PUBLIC_ERROR_LOGGING_ENDPOINT'] && {
    apiEndpoint: process.env['NEXT_PUBLIC_ERROR_LOGGING_ENDPOINT'],
  }),
  ...(process.env['NEXT_PUBLIC_ERROR_LOGGING_API_KEY'] && {
    apiKey: process.env['NEXT_PUBLIC_ERROR_LOGGING_API_KEY'],
  }),
};

class ErrorLogger {
  private config: ErrorLoggerConfig;
  private breadcrumbs: ErrorBreadcrumb[] = [];
  private sessionId: string;

  constructor(config: Partial<ErrorLoggerConfig> = {}) {
    // Runtime config overrides default environment-derived behavior.
    this.config = { ...defaultConfig, ...config };
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
  }

  /**
   * Logs an error event with normalized structure and contextual metadata.
   *
   * @param error Any runtime or domain error.
   * @param context Additional structured details useful for triage.
   */
  logError(
    error: Error | BaseError,
    context: Record<string, unknown> = {}
  ): void {
    // Build one normalized report so console/remote logs are always aligned.
    const errorReport = this.createErrorReport(error, context);

    // Console logging for development
    if (this.config.enableConsoleLogging) {
      this.logToConsole(errorReport);
    }

    // Remote logging for production
    if (this.config.enableRemoteLogging) {
      this.logToRemote(errorReport);
    }

    // Add to breadcrumbs for future errors
    this.addBreadcrumb({
      timestamp: new Date().toISOString(),
      category: "state-change",
      message: error.message,
      data: { ...context, stack: error.stack },
      level: "error",
    });
  }

  /**
   * Logs a warning and records a breadcrumb.
   */
  logWarning(message: string, context: Record<string, unknown> = {}): void {
    const warning = {
      message,
      level: "warning" as const,
      timestamp: new Date().toISOString(),
      context,
    };

    if (this.config.enableConsoleLogging) {
      console.warn("[WARNING]", message, context);
    }

    this.addBreadcrumb({
      timestamp: warning.timestamp,
      category: "user-action",
      message,
      data: context,
      level: "warning",
    });
  }

  /**
   * Logs informational diagnostics and records a breadcrumb.
   */
  logInfo(message: string, context: Record<string, unknown> = {}): void {
    const info = {
      message,
      level: "info" as const,
      timestamp: new Date().toISOString(),
      context,
    };

    if (this.config.enableConsoleLogging) {
      console.info("[INFO]", message, context);
    }

    this.addBreadcrumb({
      timestamp: info.timestamp,
      category: "user-action",
      message,
      data: context,
      level: "info",
    });
  }

  /**
   * Adds a breadcrumb event to the rolling in-memory trail.
   */
  addBreadcrumb(breadcrumb: ErrorBreadcrumb): void {
    if (!this.config.enableBreadcrumbs) return;

    this.breadcrumbs.push(breadcrumb);

    // Maintain bounded history to avoid unbounded memory growth.
    if (this.breadcrumbs.length > this.config.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.config.maxBreadcrumbs);
    }
  }

  /**
   * Returns a defensive copy of current breadcrumbs.
   */
  getBreadcrumbs(): ErrorBreadcrumb[] {
    return [...this.breadcrumbs];
  }

  /**
   * Clears breadcrumb history for the current logger session.
   */
  clearBreadcrumbs(): void {
    this.breadcrumbs = [];
  }

  /**
   * Builds the final transport/log payload for an error event.
   */
  private createErrorReport(
    error: Error | BaseError,
    context: Record<string, unknown>
  ): ErrorReport {
    const baseError: BaseError = this.normalizeError(error);

    return {
      error: baseError,
      context: {
        sessionId: this.sessionId,
        userAgent:
          typeof window !== "undefined" ? window.navigator.userAgent : "server",
        url: typeof window !== "undefined" ? window.location.href : "server",
        timestamp: new Date().toISOString(),
        buildVersion: process.env['NEXT_PUBLIC_BUILD_VERSION'] || "unknown",
        environment: process.env['NODE_ENV'] || "unknown",
        ...context,
      },
      breadcrumbs: this.getBreadcrumbs(),
    };
  }

  /**
   * Converts native errors to `BaseError` while preserving stack metadata.
   */
  private normalizeError(error: Error | BaseError): BaseError {
    if (this.isBaseError(error)) {
      // Preserve already-classified domain errors.
      return error;
    }

    const baseError: BaseError = {
      code: "UNKNOWN_ERROR",
      message: error.message,
      category: "unknown",
      severity: "medium",
      timestamp: new Date().toISOString(),
      details: {
        name: error.name,
        ...(error.stack && { stack: error.stack }),
      },
    };

    if (error.stack) {
      baseError.stack = error.stack;
    }

    return baseError;
  }

  /**
   * Runtime type-guard for existing `BaseError` values.
   */
  private isBaseError(error: Error | BaseError): error is BaseError {
    return "code" in error && "category" in error && "severity" in error;
  }

  /**
   * Emits a grouped, readable console representation of an error report.
   */
  private logToConsole(errorReport: ErrorReport): void {
    console.group(`🚨 Error: ${errorReport.error.message}`);
    console.error("Error Details:", errorReport.error);
    console.error("Context:", errorReport.context);

    if (errorReport.breadcrumbs.length > 0) {
      console.group("Breadcrumbs:");
      errorReport.breadcrumbs.forEach((breadcrumb, index) => {
        const icon =
          breadcrumb.level === "error"
            ? "[ERROR]"
            : breadcrumb.level === "warning"
            ? "[WARNING]"
            : "[INFO]";
        console.log(
          `${icon} ${index + 1}. [${breadcrumb.category}] ${
            breadcrumb.message
          }`,
          breadcrumb.data
        );
      });
      console.groupEnd();
    }

    console.groupEnd();
  }

  /**
   * Sends error reports to configured remote endpoint (best-effort).
   */
  private async logToRemote(errorReport: ErrorReport): Promise<void> {
    if (!this.config.apiEndpoint || !this.config.apiKey) {
      return;
    }

    try {
      await fetch(this.config.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(errorReport),
      });
    } catch (remoteError) {
      // Never throw from logger; failures should degrade gracefully.
      console.error("Failed to log error remotely:", remoteError);
      console.error("Original error:", errorReport);
    }
  }

  /**
   * Generates a pseudo-unique session key used to correlate error events.
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Registers global browser listeners for unhandled runtime failures.
   */
  private setupGlobalErrorHandlers(): void {
    if (typeof window === "undefined") return;

    // Capture async failures that otherwise bypass component error boundaries.
    window.addEventListener("unhandledrejection", (event) => {
      this.logError(new Error(event.reason), {
        type: "unhandledrejection",
        promise: event.promise,
      });
    });

    // Handle global errors
    window.addEventListener("error", (event) => {
      this.logError(event.error || new Error(event.message), {
        type: "global-error",
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });
  }
}

// Create singleton instance
export const errorLogger = new ErrorLogger();

// Convenience functions
/**
 * Log Error.
 * @param error - error value.
 * @param context - context value.
 */
export const logError = (
  error: Error | BaseError,
  context?: Record<string, unknown>
) => errorLogger.logError(error, context);

/**
 * Log Warning.
 * @param message - message value.
 * @param context - context value.
 */
export const logWarning = (
  message: string,
  context?: Record<string, unknown>
) => errorLogger.logWarning(message, context);

/**
 * Log Info.
 * @param message - message value.
 * @param context - context value.
 */
export const logInfo = (message: string, context?: Record<string, unknown>) =>
  errorLogger.logInfo(message, context);

/**
 * Add Breadcrumb.
 * @param breadcrumb - breadcrumb value.
 */
export const addBreadcrumb = (breadcrumb: ErrorBreadcrumb) =>
  errorLogger.addBreadcrumb(breadcrumb);

// Development debugging helpers
export const debugHelpers = {
  /**
   * Log component render information
   */
  logRender: (componentName: string, props: Record<string, unknown> = {}) => {
    if (isDevelopment) {
      console.log(`[RENDER] ${componentName}`, props);
      addBreadcrumb({
        timestamp: new Date().toISOString(),
        category: "state-change",
        message: `Component rendered: ${componentName}`,
        data: props,
        level: "info",
      });
    }
  },

  /**
   * Log state changes
   */
  logStateChange: (stateName: string, oldValue: unknown, newValue: unknown) => {
    if (isDevelopment) {
      console.log(`📊 State Change: ${stateName}`, {
        from: oldValue,
        to: newValue,
      });
      addBreadcrumb({
        timestamp: new Date().toISOString(),
        category: "state-change",
        message: `State changed: ${stateName}`,
        data: { oldValue, newValue },
        level: "info",
      });
    }
  },

  /**
   * Log API calls
   */
  logApiCall: (method: string, url: string, data?: unknown) => {
    if (isDevelopment) {
      console.log(`🌐 API Call: ${method} ${url}`, data);
    }
    addBreadcrumb({
      timestamp: new Date().toISOString(),
      category: "api-call",
      message: `API call: ${method} ${url}`,
      data: { method, url, data },
      level: "info",
    });
  },

  /**
   * Log user actions
   */
  logUserAction: (
    action: string,
    target?: string,
    data?: Record<string, unknown>
  ) => {
    if (isDevelopment) {
      console.log(
        `👤 User Action: ${action}${target ? ` on ${target}` : ""}`,
        data
      );
    }
    const breadcrumb: ErrorBreadcrumb = {
      timestamp: new Date().toISOString(),
      category: "user-action",
      message: `User ${action}${target ? ` on ${target}` : ""}`,
      level: "info",
    };
    if (data) {
      breadcrumb.data = data;
    }
    addBreadcrumb(breadcrumb);
  },

  /**
   * Performance timing helper
   */
  time: (label: string) => {
    if (isDevelopment) {
      console.time(label);
    }
  },

  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  },
};

export default errorLogger;
