// types/state.ts
import { User } from "./user";
import { Message } from "./chat";

export interface BaseState {
  isLoading: boolean;
  error: string | null;
}

export interface LibraryState extends BaseState {
  selectedList: string;
  viewMode: "grid" | "list";
  filters: {
    search: string;
    genre: string | null;
    status: string | null;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
  selectedBooks: string[];
}

export interface DashboardState extends BaseState {
  activeSection: string;
  preferences: {
    showStats: boolean;
    showRecentActivity: boolean;
    showRecommendations: boolean;
    compactView: boolean;
  };
  refreshInterval: number;
}

export interface ChatState extends BaseState {
  messages: Message[];
  inputMessage: string;
  isTyping: boolean;
  chatMode: "general" | "recommendations" | "discussion";
  activeConversation: string | null;
  sessionId: string | null;
}

export interface NavigationState extends BaseState {
  activeTab: string;
  isCollapsed: boolean;
  preferences: {
    showLabels: boolean;
    compactMode: boolean;
  };
}

export interface AppState extends BaseState {
  user: User | null;
  theme: "light" | "dark" | "system";
  isAuthenticated: boolean;
  globalPreferences: {
    notifications: boolean;
    autoSave: boolean;
    language: string;
  };
}

// Action types for each feature
export interface LibraryActions {
  setSelectedList: (listId: string) => void;
  setViewMode: (mode: "grid" | "list") => void;
  updateFilters: (filters: Partial<LibraryState["filters"]>) => void;
  toggleBookSelection: (bookId: string) => void;
  clearSelection: () => void;
  resetFilters: () => void;
}

export interface DashboardActions {
  setActiveSection: (section: string) => void;
  updatePreferences: (
    preferences: Partial<DashboardState["preferences"]>
  ) => void;
  setRefreshInterval: (interval: number) => void;
  refreshData: () => Promise<void>;
}

export interface ChatActions {
  sendMessage: (message: string) => Promise<void>;
  setInputMessage: (message: string) => void;
  setChatMode: (mode: ChatState["chatMode"]) => void;
  clearMessages: () => void;
  setActiveConversation: (id: string | null) => void;
}

export interface NavigationActions {
  setActiveTab: (tab: string) => void;
  toggleCollapsed: () => void;
  updatePreferences: (
    preferences: Partial<NavigationState["preferences"]>
  ) => void;
}

export interface AppActions {
  setTheme: (theme: AppState["theme"]) => void;
  updateGlobalPreferences: (
    preferences: Partial<AppState["globalPreferences"]>
  ) => void;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}
