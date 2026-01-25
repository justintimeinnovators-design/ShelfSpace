"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Shield,
  FileText,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { AdminService, ModerationLog, ModerationAction, ValidationStatus, UserStatus } from "@/lib/admin-service";

type TabType = "logs" | "books" | "users";

export function AdminPanel() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("logs");
  const [moderationLogs, setModerationLogs] = useState<ModerationLog[]>([]);
  const [_books, _setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === "logs") {
      loadModerationLogs();
    }
  }, [activeTab]);

  const loadModerationLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const logs = await AdminService.getModerationLogs({ limit: 50 });
      setModerationLogs(logs);
    } catch (err: any) {
      console.error("Failed to load moderation logs:", err);
      setError(err?.response?.data?.error || "Failed to load moderation logs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookValidation = async (bookId: string, status: ValidationStatus) => {
    try {
      setIsLoading(true);
      setError(null);
      await AdminService.updateBookValidation(bookId, { status });
      // Refresh book list if needed
      alert(`Book ${status.toLowerCase()} successfully`);
    } catch (err: any) {
      console.error("Failed to update book validation:", err);
      setError(err?.response?.data?.error || "Failed to update book validation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserStatusUpdate = async (userId: string, status: UserStatus) => {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this user?`)) {
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await AdminService.updateUserStatus(userId, status);
      alert(`User status updated to ${status}`);
    } catch (err: any) {
      console.error("Failed to update user status:", err);
      setError(err?.response?.data?.error || "Failed to update user status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPreferences = async (userId: string) => {
    if (!confirm("Are you sure you want to reset this user's preferences?")) {
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await AdminService.resetUserPreferences(userId);
      alert("User preferences reset successfully");
    } catch (err: any) {
      console.error("Failed to reset user preferences:", err);
      setError(err?.response?.data?.error || "Failed to reset user preferences");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-slate-400">You must be logged in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 font-serif">Admin Panel</h1>
                <p className="text-gray-600 dark:text-slate-400">Moderation and user management</p>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Back
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-2 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("logs")}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors font-medium ${
                activeTab === "logs"
                  ? "bg-amber-500 text-white"
                  : "text-gray-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Moderation Logs
            </button>
            <button
              onClick={() => setActiveTab("books")}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors font-medium ${
                activeTab === "books"
                  ? "bg-amber-500 text-white"
                  : "text-gray-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-2" />
              Book Validation
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors font-medium ${
                activeTab === "users"
                  ? "bg-amber-500 text-white"
                  : "text-gray-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              User Management
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6">
          {activeTab === "logs" && (
            <ModerationLogsTab logs={moderationLogs} isLoading={isLoading} onRefresh={loadModerationLogs} />
          )}
          {activeTab === "books" && (
            <BookValidationTab onValidate={handleBookValidation} isLoading={isLoading} />
          )}
          {activeTab === "users" && (
            <UserManagementTab
              onStatusUpdate={handleUserStatusUpdate}
              onResetPreferences={handleResetPreferences}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Moderation Logs Tab Component
function ModerationLogsTab({
  logs,
  isLoading,
  onRefresh,
}: {
  logs: ModerationLog[];
  isLoading: boolean;
  onRefresh: () => void;
}) {
  const getActionIcon = (action: ModerationAction) => {
    switch (action) {
      case "DELETE_REVIEW":
      case "DELETE_POST":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "SUSPEND_USER":
      case "BAN_USER":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "APPROVE_CONTENT":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Moderation Logs</h2>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-slate-400">No moderation logs found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-slate-100">Action</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-slate-100">Target ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-slate-100">Moderator</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-slate-100">Reason</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-slate-100">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 dark:border-slate-700 hover:bg-amber-50/50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span className="text-sm text-gray-900 dark:text-slate-100">{log.action.replace(/_/g, " ")}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-slate-400 font-mono">{log.targetId.slice(0, 8)}...</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-slate-400 font-mono">{log.moderatorId.slice(0, 8)}...</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-slate-400">{log.reason || "-"}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Book Validation Tab Component
function BookValidationTab({
  onValidate,
  isLoading,
}: {
  onValidate: (bookId: string, status: ValidationStatus) => void;
  isLoading: boolean;
}) {
  const [bookId, setBookId] = useState("");
  const [validationStatus, setValidationStatus] = useState<ValidationStatus | null>(null);

  const handleValidate = () => {
    if (!bookId || !validationStatus) {
      alert("Please enter a book ID and select a status");
      return;
    }
    onValidate(bookId, validationStatus);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">Book Validation</h2>
      <div className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Book ID</label>
          <input
            type="text"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            placeholder="Enter book ID"
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Validation Status</label>
          <select
            value={validationStatus || ""}
            onChange={(e) => setValidationStatus(e.target.value as ValidationStatus)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Select status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <button
          onClick={handleValidate}
          disabled={isLoading || !bookId || !validationStatus}
          className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : "Validate Book"}
        </button>
      </div>
    </div>
  );
}

// User Management Tab Component
function UserManagementTab({
  onStatusUpdate,
  onResetPreferences,
  isLoading,
}: {
  onStatusUpdate: (userId: string, status: UserStatus) => void;
  onResetPreferences: (userId: string) => void;
  isLoading: boolean;
}) {
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState<UserStatus | "">("");

  const handleStatusUpdate = () => {
    if (!userId || !status) {
      alert("Please enter a user ID and select a status");
      return;
    }
    onStatusUpdate(userId, status as UserStatus);
  };

  const handleResetPrefs = () => {
    if (!userId) {
      alert("Please enter a user ID");
      return;
    }
    onResetPreferences(userId);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">User Management</h2>
      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Update User Status</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus | "")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select status</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="BANNED">Banned</option>
                <option value="DEACTIVATED">Deactivated</option>
              </select>
            </div>
            <button
              onClick={handleStatusUpdate}
              disabled={isLoading || !userId || !status}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : "Update Status"}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Reset User Preferences</h3>
          <button
            onClick={handleResetPrefs}
            disabled={isLoading || !userId}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : "Reset Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}

