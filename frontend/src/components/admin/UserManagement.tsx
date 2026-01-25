"use client";

import { useState } from "react";
import { Loader2, Shield, RefreshCw, AlertTriangle } from "lucide-react";
import { useUserManagement } from "@/hooks/data/useAdmin";
import { UserStatus } from "@/lib/admin-service";

export function UserManagement() {
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const { loading, error, updateUserStatus, resetUserPreferences } = useUserManagement();

  const handleStatusUpdate = async () => {
    if (!userId || !status) {
      alert("Please enter a user ID and select a status");
      return;
    }
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this user?`)) {
      return;
    }
    try {
      await updateUserStatus(userId, status as UserStatus);
      alert(`User status updated to ${status}`);
      setUserId("");
      setStatus("");
    } catch (err: any) {
      alert(err.message || "Failed to update user status");
    }
  };

  const handleResetPrefs = async () => {
    if (!userId) {
      alert("Please enter a user ID");
      return;
    }
    if (!confirm("Are you sure you want to reset this user's preferences? This action cannot be undone.")) {
      return;
    }
    try {
      await resetUserPreferences(userId);
      alert("User preferences reset successfully");
      setUserId("");
    } catch (err: any) {
      alert(err.message || "Failed to reset user preferences");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">User Management</h2>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* User ID Input */}
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

      {/* Update User Status */}
      <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Update User Status</h3>
        </div>

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
            disabled={loading || !userId || !status}
            className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
            Update Status
          </button>
        </div>
      </div>

      {/* Reset User Preferences */}
      <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Reset User Preferences</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
          This will reset all preferences for the specified user to default values. This action cannot be undone.
        </p>
        <button
          onClick={handleResetPrefs}
          disabled={loading || !userId}
          className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Reset Preferences
        </button>
      </div>

      {/* Status Descriptions */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-slate-100 mb-2">Status Descriptions:</h4>
        <ul className="text-sm text-gray-600 dark:text-slate-400 space-y-1">
          <li>
            <strong>Active:</strong> User has full access to the platform
          </li>
          <li>
            <strong>Suspended:</strong> User access is temporarily restricted
          </li>
          <li>
            <strong>Banned:</strong> User is permanently banned from the platform
          </li>
          <li>
            <strong>Deactivated:</strong> User account is deactivated
          </li>
        </ul>
      </div>
    </div>
  );
}

