"use client";

import { useState } from "react";
import { Trash2, Download, AlertTriangle, Info } from "lucide-react";
import { signOut } from "next-auth/react";
import apiClient from "@/lib/api";

export function AccountSettings() {
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExportData = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      const [profileRes, prefsRes] = await Promise.allSettled([
        apiClient.get("/api/user/me"),
        apiClient.get("/api/user/preferences"),
      ]);

      const profile = profileRes.status === "fulfilled" ? profileRes.value.data : null;
      const preferences = prefsRes.status === "fulfilled" ? prefsRes.value.data : null;

      const exportData = {
        exportedAt: new Date().toISOString(),
        profile,
        preferences,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `shelfspace-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setExportError(err?.message || "Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await apiClient.delete("/api/user/me");
      await signOut({ callbackUrl: "/login" });
    } catch (err: any) {
      setDeleteError(err?.response?.data?.error || err?.message || "Failed to delete account");
      setIsDeleting(false);
    }
  };

  return (
    <div className="divide-y divide-amber-100 dark:divide-slate-700">

      {/* OAuth notice */}
      <div className="pb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold mb-5">
          Password
        </p>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/70 dark:bg-slate-700/50 border border-amber-200/60 dark:border-slate-600 max-w-lg">
          <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-slate-300">
            ShelfSpace uses OAuth to sign you in. Passwords are managed by your identity provider (Google, GitHub, etc.) — visit your provider&apos;s account settings to change your password.
          </p>
        </div>
      </div>

      {/* Data export */}
      <div className="py-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold mb-5">
          Your Data
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100">Export data</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Download a copy of your profile and preferences as JSON
            </p>
            {exportError && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{exportError}</p>
            )}
          </div>
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 border border-amber-300 dark:border-slate-600 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm flex-shrink-0"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting…" : "Export"}
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="py-8">
        <p className="text-xs uppercase tracking-[0.2em] text-red-600/80 dark:text-red-400/80 font-semibold mb-5">
          Danger Zone
        </p>
        <div className="p-5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">Delete account</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
            </div>
          </div>

          <div className="space-y-2 max-w-sm">
            <label className="block text-xs text-red-700 dark:text-red-300">
              Type <span className="font-mono font-bold">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="w-full px-3 py-2 border border-red-300 dark:border-red-800 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="DELETE"
            />
            {deleteError && (
              <p className="text-xs text-red-600 dark:text-red-400">{deleteError}</p>
            )}
          </div>

          <button
            onClick={handleDeleteAccount}
            disabled={deleteConfirm !== "DELETE" || isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting…" : "Delete my account"}
          </button>
        </div>
      </div>
    </div>
  );
}
