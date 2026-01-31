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
    category_deleted: 'Category Deleted',
    task_created: 'Task Created',
    task_moved: 'Task Moved',
    task_updated: 'Task Updated',
    task_deleted: 'Task Deleted',
    priority_changed: 'Priority Changed',
    expiry_changed: 'Expiry Date Changed',
  };
  return labels[action] || action;
};

export const HistoryModal = ({ history, onClose }: HistoryModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Update History</h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No history available</p>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-2 sm:gap-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        {getActionLabel(entry.action)}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
                          entry.type === 'board'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        }`}
                      >
                        {entry.type === 'board' ? 'Board' : 'Card'}
                      </span>
                    </div>
                    {entry.previousValue && entry.newValue && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Changed from &ldquo;{entry.previousValue}&rdquo; to &ldquo;{entry.newValue}&rdquo;
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
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                          {changedFields && changedFields.length > 0 && (
                            <div>
                              <span className="font-medium">Fields changed:</span>{' '}
                              {changedFields.join(', ')}
                            </div>
                          )}
                          {previousTitle && newTitle && previousTitle !== newTitle && (
                            <div>
                              <span className="font-medium">Title:</span> &ldquo;{previousTitle}&rdquo; → &ldquo;{newTitle}&rdquo;
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
                    {entry.action === 'category_deleted' && entry.metadata && (() => {
                      const metadata = entry.metadata;
                      const title = metadata.title ? String(metadata.title) : null;
                      const taskCount = typeof metadata.taskCount === 'number' ? metadata.taskCount : null;
                      if (!title && taskCount === null) return null;
                      return (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {title && <span>Category &ldquo;{title}&rdquo;</span>}
                          {taskCount !== null && taskCount > 0 && (
                            <span> ({taskCount} task{taskCount === 1 ? '' : 's'} removed)</span>
                          )}
                        </div>
                      );
                    })()}
                    {entry.action === 'task_deleted' && entry.metadata && (() => {
                      const title = entry.metadata.title ? String(entry.metadata.title) : null;
                      if (!title) return null;
                      return (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Task &ldquo;{title}&rdquo;
                        </div>
                      );
                    })()}
                    {entry.metadata && entry.action !== 'task_updated' && entry.action !== 'category_deleted' && entry.action !== 'task_deleted' && Object.keys(entry.metadata).length > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {JSON.stringify(entry.metadata)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 sm:ml-4 flex-shrink-0">
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
