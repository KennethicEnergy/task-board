'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { NOTIFICATION_METHODS, DEFAULT_NOTIFICATION_METHODS } from '@/types';
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
    methods: DEFAULT_NOTIFICATION_METHODS,
  };

  const [daysBefore, setDaysBefore] = useState(initialSettings.daysBefore);
  const [hoursBefore, setHoursBefore] = useState(initialSettings.hoursBefore);
  const [enabled, setEnabled] = useState(initialSettings.enabled);
  const [methods, setMethods] = useState(initialSettings.methods);

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

  const toggleMethod = (method: (typeof NOTIFICATION_METHODS)[number]) => {
    setMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = raw === '' ? 0 : parseInt(raw, 10);
    setDaysBefore(isNaN(num) ? 0 : Math.max(0, num));
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = raw === '' ? 0 : parseInt(raw, 10);
    setHoursBefore(isNaN(num) ? 0 : Math.min(23, Math.max(0, num)));
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Notification Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl cursor-pointer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Notifications</label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Days Before Expiry
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={daysBefore}
                  onChange={handleDaysChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hours Before Expiry
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={hoursBefore}
                  onChange={handleHoursChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notification Methods
                </label>
                <div className="space-y-2">
                  {NOTIFICATION_METHODS.map((method) => (
                    <label key={method} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={methods.includes(method)}
                        onChange={() => toggleMethod(method)}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{method}</span>
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
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors cursor-pointer w-full sm:w-auto"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
