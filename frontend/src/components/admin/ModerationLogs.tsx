"use client";

import { FileText, RefreshCw, XCircle, AlertCircle, CheckCircle } from "lucide-react";
import { useModerationLogs } from "@/hooks/data/useAdmin";
import { ModerationAction } from "@/lib/admin-service";

/**
 * Moderation Logs.
 */
export function ModerationLogs() {
  const { logs, loading, error, fetchLogs } = useModerationLogs({ autoFetch: true });

/**
 * Get Action Icon.
 * @param action - action value.
 */
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
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="py-12 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-4 bg-amber-100 dark:bg-slate-700 rounded w-1/4" />
              <div className="h-4 bg-amber-100 dark:bg-slate-700 rounded w-1/5" />
              <div className="h-4 bg-amber-100 dark:bg-slate-700 rounded w-1/5" />
              <div className="h-4 bg-amber-100 dark:bg-slate-700 rounded flex-1" />
            </div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 dark:text-slate-600 mx-auto mb-4" />
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
                <tr
                  key={log.id}
                  className="border-b border-gray-100 dark:border-slate-700 hover:bg-amber-50/50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span className="text-sm text-gray-900 dark:text-slate-100">{log.action.replace(/_/g, " ")}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-slate-400 font-mono">
                    {log.targetId.slice(0, 8)}...
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-slate-400 font-mono">
                    {log.moderatorId.slice(0, 8)}...
                  </td>
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

