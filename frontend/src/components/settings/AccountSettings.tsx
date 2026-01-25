"use client";

import { useState } from "react";
import {
  Lock,
  Key,
  Shield,
  Trash2,
  Download,
  AlertTriangle,
  Eye,
  EyeOff,
  Save,
  Check,
} from "lucide-react";

export function AccountSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    
    console.log("Changing password...");
    setIsChangingPassword(true);
    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password changed successfully!");
    }, 2000);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost."
    );
    if (confirmed) {
      console.log("Deleting account...");
      // Handle account deletion
    }
  };

  const handleExportData = () => {
    console.log("Exporting data...");
    // Handle data export
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 font-serif mb-2">
          Account Security
        </h2>
        <p className="text-gray-600 dark:text-slate-400">
          Manage your account security and data.
        </p>
      </div>

      {/* Change Password */}
      <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl border border-amber-200 dark:border-slate-600 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
            <Key className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              Change Password
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Update your account password for better security
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
              >
                {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
              >
                {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
              Password must be at least 8 characters long
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
              >
                {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handlePasswordChange}
              disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {isChangingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Change Password
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl border border-amber-200 dark:border-slate-600 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              Two-Factor Authentication
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Add an extra layer of security to your account
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-slate-100">SMS Authentication</h4>
              <p className="text-sm text-gray-600 dark:text-slate-400">Receive codes via text message</p>
            </div>
            <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-slate-100">Authenticator App</h4>
              <p className="text-sm text-gray-600 dark:text-slate-400">Use Google Authenticator or similar app</p>
            </div>
            <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm">
              Enable
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl border border-amber-200 dark:border-slate-600 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
            <Download className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              Data Management
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Export or delete your account data
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-slate-100">Export Data</h4>
              <p className="text-sm text-gray-600 dark:text-slate-400">Download a copy of all your data</p>
            </div>
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div>
              <h4 className="font-medium text-red-800 dark:text-red-200">Delete Account</h4>
              <p className="text-sm text-red-600 dark:text-red-400">Permanently delete your account and all data</p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl border border-amber-200 dark:border-slate-600 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              Account Information
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Your account details and security status
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-slate-100 mb-2">Account Created</h4>
              <p className="text-sm text-gray-600 dark:text-slate-400">January 15, 2024</p>
            </div>
            <div className="p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-slate-100 mb-2">Last Login</h4>
              <p className="text-sm text-gray-600 dark:text-slate-400">Today at 2:30 PM</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-slate-100 mb-2">Security Status</h4>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">Secure</span>
              </div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-slate-600/50 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-slate-100 mb-2">Two-Factor Auth</h4>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-600 dark:text-yellow-400">Not Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}