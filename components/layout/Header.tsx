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
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">{`${user?.displayName}'s Task Board`}</h1>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={() => setShowHistory(true)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  History
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Settings
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
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
