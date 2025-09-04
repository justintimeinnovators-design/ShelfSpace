
'use client';

import React from 'react';

const tabs = ["profile", "preferences", "notifications", "privacy", "account"] as const;

interface SettingsSidebarProps {
  settingsTab: string;
  setSettingsTab: (tab: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ settingsTab, setSettingsTab }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 space-y-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Settings</h2>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setSettingsTab(tab)}
          className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
            settingsTab === tab
              ? "bg-indigo-dye-100 text-indigo-dye-700 font-semibold"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </aside>
  );
};

export default SettingsSidebar;
