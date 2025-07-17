'use client';

import { useState } from "react";
import { UserSettings } from "./SettingsLayout";

interface Props {
  userSettings: UserSettings;
  handleSettingsUpdate: (section: keyof UserSettings, field: string, value: any) => void;
}

const AccountSettings = ({ userSettings, handleSettingsUpdate }: Props) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const connectedAccounts = [
    { name: "Goodreads", status: "connected", color: "green" },
    { name: "Amazon Kindle", status: "disconnected", color: "gray" },
    { name: "Apple Books", status: "disconnected", color: "gray" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Account Management</h3>

      <div className="space-y-6">
        {/* Change Password */}
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Change Password</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              disabled={!currentPassword || newPassword !== confirmPassword}
              className={`px-4 py-2 rounded-lg text-white transition-colors ${
                newPassword && newPassword === confirmPassword
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Connected Accounts */}
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Connected Accounts</h4>
          <div className="space-y-3">
            {connectedAccounts.map((account) => (
              <div
                key={account.name}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-${account.color}-500`} />
                  <span className="font-medium">{account.name}</span>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      account.status === "connected"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {account.status}
                  </span>
                </div>
                <button
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    account.status === "connected"
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  {account.status === "connected" ? "Disconnect" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <h4 className="font-medium text-red-800 mb-2">Danger Zone</h4>
          <p className="text-sm text-red-700 mb-4">These actions cannot be undone.</p>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Delete Account
            </button>
            <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
