'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal = ({ onClose }: SettingsModalProps) => {
  const { user, updateNotificationSettings } = useAuth();
  
  // Initialize state from user settings - derive directly from user prop
  const initialSettings = user?.notificationSettings || {
    daysBefore: 1,
    hoursBefore: 0,
    enabled: true,
    methods: ['visual', 'toast'] as ('visual' | 'toast' | 'email' | 'push')[],
  };

  const [daysBefore, setDaysBefore] = useState(initialSettings.daysBefore);
  const [hoursBefore, setHoursBefore] = useState(initialSettings.hoursBefore);
  const [enabled, setEnabled] = useState(initialSettings.enabled);
  const [methods, setMethods] = useState<('visual' | 'toast' | 'email' | 'push')[]>(initialSettings.methods);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateNotificationSettings({
        enabled,
        daysBefore,
        hoursBefore,
        methods,
      });
      toast.success('Settings updated');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update settings');
    }
  };

  const toggleMethod = (method: 'visual' | 'toast' | 'email' | 'push') => {
    setMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Notification Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Enable Notifications</label>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
          </div>

          {enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days Before Expiry
                </label>
                <input
                  type="number"
                  min="0"
                  value={daysBefore}
                  onChange={(e) => setDaysBefore(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours Before Expiry
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hoursBefore}
                  onChange={(e) => setHoursBefore(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Methods
                </label>
                <div className="space-y-2">
                  {(['visual', 'toast', 'email', 'push'] as const).map((method) => (
                    <label key={method} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={methods.includes(method)}
                        onChange={() => toggleMethod(method)}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 mr-2"
                      />
                      <span className="text-sm text-gray-700 capitalize">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer w-full sm:w-auto"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
