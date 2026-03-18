// src/utils/stateValidation.ts
import {
  LibraryState,
  DashboardState,
  ChatState,
  NavigationState,
} from "../../types/state";

export class StateValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "StateValidationError";
  }
}

/**
 * Validate Library State.
 * @param state - state value.
 */
export function validateLibraryState(state: Partial<LibraryState>): void {
  if (state.viewMode && !["grid", "list"].includes(state.viewMode)) {
    throw new StateValidationError("Invalid view mode", "viewMode");
  }

  if (
    state.filters?.sortOrder &&
    !["asc", "desc"].includes(state.filters.sortOrder)
  ) {
    throw new StateValidationError("Invalid sort order", "filters.sortOrder");
  }

  if (state.selectedBooks && !Array.isArray(state.selectedBooks)) {
    throw new StateValidationError(
      "Selected books must be an array",
      "selectedBooks"
    );
  }
}

/**
 * Validate Dashboard State.
 * @param state - state value.
 */
export function validateDashboardState(state: Partial<DashboardState>): void {
  if (
    state.refreshInterval &&
    (typeof state.refreshInterval !== "number" || state.refreshInterval < 0)
  ) {
    throw new StateValidationError(
      "Refresh interval must be a positive number",
      "refreshInterval"
    );
  }

  if (state.preferences) {
    const { preferences } = state;
    const booleanFields = [
      "showStats",
      "showRecentActivity",
      "showRecommendations",
      "compactView",
    ];

    for (const field of booleanFields) {
      if (
        field in preferences &&
        typeof preferences[field as keyof typeof preferences] !== "boolean"
      ) {
        throw new StateValidationError(
          `${field} must be a boolean`,
          `preferences.${field}`
        );
      }
    }
  }
}

/**
 * Validate Chat State.
 * @param state - state value.
 */
export function validateChatState(state: Partial<ChatState>): void {
  if (
    state.chatMode &&
    !["general", "recommendations", "discussion"].includes(state.chatMode)
  ) {
    throw new StateValidationError("Invalid chat mode", "chatMode");
  }

  if (state.messages && !Array.isArray(state.messages)) {
    throw new StateValidationError("Messages must be an array", "messages");
  }

  if (state.inputMessage && typeof state.inputMessage !== "string") {
    throw new StateValidationError(
      "Input message must be a string",
      "inputMessage"
    );
  }
}

/**
 * Validate Navigation State.
 * @param state - state value.
 */
export function validateNavigationState(state: Partial<NavigationState>): void {
  if (state.activeTab && typeof state.activeTab !== "string") {
    throw new StateValidationError("Active tab must be a string", "activeTab");
  }

  if (state.isCollapsed && typeof state.isCollapsed !== "boolean") {
    throw new StateValidationError(
      "isCollapsed must be a boolean",
      "isCollapsed"
    );
  }

  if (state.preferences) {
    const { preferences } = state;
    const booleanFields = ["showLabels", "compactMode"];

    for (const field of booleanFields) {
      if (
        field in preferences &&
        typeof preferences[field as keyof typeof preferences] !== "boolean"
      ) {
        throw new StateValidationError(
          `${field} must be a boolean`,
          `preferences.${field}`
        );
      }
    }
  }
}

/**
 * Validate State.
 * @param state - state value.
 * @param validator - validator value.
 */
export function validateState<T>(
  state: Partial<T>,
  validator: (state: Partial<T>) => void
): void {
  try {
    validator(state);
  } catch (error) {
    if (error instanceof StateValidationError) {
      console.error(`State validation error: ${error.message}`, {
        field: error.field,
        state,
      });
      throw error;
    }
    throw new StateValidationError("Unknown validation error");
  }
}
