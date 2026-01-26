'use client';

import { UpdateHistoryEntry } from '@/types';
import { formatDateTime } from '@/utils/dateUtils';

interface HistoryModalProps {
  history: UpdateHistoryEntry[];
  onClose: () => void;
}

const getActionLabel = (action: UpdateHistoryEntry['action']): string => {
  const labels: Record<UpdateHistoryEntry['action'], string> = {
    category_created: 'Category Created',
    category_moved: 'Category Moved',
    task_created: 'Task Created',
    task_moved: 'Task Moved',
    task_updated: 'Task Updated',
    priority_changed: 'Priority Changed',
    expiry_changed: 'Expiry Date Changed',
  };
  return labels[action] || action;
};

export const HistoryModal = ({ history, onClose }: HistoryModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Update History</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No history available</p>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {getActionLabel(entry.action)}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          entry.type === 'board'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {entry.type === 'board' ? 'Board' : 'Card'}
                      </span>
                    </div>
                    {entry.previousValue && entry.newValue && (
                      <div className="text-xs text-gray-600 mt-1">
                        Changed from "{entry.previousValue}" to "{entry.newValue}"
                      </div>
                    )}
                    {entry.action === 'task_updated' && entry.metadata && (() => {
                      const metadata = entry.metadata;
                      const changedFields = Array.isArray(metadata.changedFields) ? metadata.changedFields as string[] : null;
                      const previousTitle = metadata.previousTitle ? String(metadata.previousTitle) : null;
                      const newTitle = metadata.newTitle ? String(metadata.newTitle) : null;
                      const previousCategoryId = metadata.previousCategoryId ? String(metadata.previousCategoryId) : null;
                      const newCategoryId = metadata.newCategoryId ? String(metadata.newCategoryId) : null;
                      
                      if (!changedFields && !previousTitle && !newTitle && !previousCategoryId && !newCategoryId) {
                        return null;
                      }
                      
                      return (
                        <div className="text-xs text-gray-600 mt-1 space-y-1">
                          {changedFields && changedFields.length > 0 && (
                            <div>
                              <span className="font-medium">Fields changed:</span>{' '}
                              {changedFields.join(', ')}
                            </div>
                          )}
                          {previousTitle && newTitle && previousTitle !== newTitle && (
                            <div>
                              <span className="font-medium">Title:</span> "{previousTitle}" → "{newTitle}"
                            </div>
                          )}
                          {previousCategoryId && newCategoryId && previousCategoryId !== newCategoryId && (
                            <div>
                              <span className="font-medium">Category changed</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    {entry.metadata && entry.action !== 'task_updated' && Object.keys(entry.metadata).length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {JSON.stringify(entry.metadata)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 ml-4">
                    {formatDateTime(entry.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
