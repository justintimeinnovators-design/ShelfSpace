"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, FileText, BookOpen, Users, AlertCircle, ArrowLeft } from "lucide-react";
import { ModerationLogs } from "./ModerationLogs";
import { BookValidation } from "./BookValidation";
import { UserManagement } from "./UserManagement";

type TabType = "logs" | "books" | "users";

/**
 * Admin Dashboard.
 */
export function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("logs");

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-4">You must be logged in to access the admin panel.</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            Go to Login
          </button>
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 font-serif">Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-slate-400">Moderation, validation, and user management</p>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-2 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("logs")}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 ${
                activeTab === "logs"
                  ? "bg-amber-500 text-white"
                  : "text-gray-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
              }`}
            >
              <FileText className="h-4 w-4" />
              Moderation Logs
            </button>
            <button
              onClick={() => setActiveTab("books")}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 ${
                activeTab === "books"
                  ? "bg-amber-500 text-white"
                  : "text-gray-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Book Validation
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 ${
                activeTab === "users"
                  ? "bg-amber-500 text-white"
                  : "text-gray-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
              }`}
            >
              <Users className="h-4 w-4" />
              User Management
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6">
          {activeTab === "logs" && <ModerationLogs />}
          {activeTab === "books" && <BookValidation />}
          {activeTab === "users" && <UserManagement />}
        </div>
      </div>
    </div>
  );
}

