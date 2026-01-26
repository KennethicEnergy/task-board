'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { SettingsModal } from '../modals/SettingsModal';
import { HistoryModal } from '../modals/HistoryModal';
import { useBoard } from '@/context/BoardContext';

export const Header = () => {
  const { user, logout } = useAuth();
  const { updateHistory } = useBoard();
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate w-full sm:w-auto">{`${user?.displayName}'s Task Board`}</h1>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {user && (
              <>
                <span className="text-xs sm:text-sm text-gray-600 truncate hidden sm:inline">{user.email}</span>
                <button
                  onClick={() => setShowHistory(true)}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  History
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Settings
                </button>
                <button
                  onClick={logout}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {showSettings && (
        <SettingsModal
          key={user?.id || 'settings'}
          onClose={() => setShowSettings(false)}
        />
      )}
      {showHistory && (
        <HistoryModal history={updateHistory} onClose={() => setShowHistory(false)} />
      )}
    </>
  );
};
