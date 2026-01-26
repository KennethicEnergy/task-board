'use client';

import { Task, Priority } from '@/types';
import { formatRelativeTime, isExpired, isExpiringSoon } from '@/utils/dateUtils';
import { useAuth } from '@/context/AuthContext';

interface TaskCardProps {
  task: Task;
  priority: Priority | undefined;
  onEdit: (task: Task) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragEnd: () => void;
  isDraggedOver?: boolean;
}

export const TaskCard = ({ task, priority, onEdit, onDragStart, onDragEnd, isDraggedOver }: TaskCardProps) => {
  const { user } = useAuth();

  const getExpiryStatus = (): 'expired' | 'expiring' | 'normal' => {
    if (!task.expiryDate) return 'normal';
    if (isExpired(task.expiryDate)) return 'expired';
    if (user?.notificationSettings.enabled) {
      const { daysBefore, hoursBefore } = user.notificationSettings;
      if (isExpiringSoon(task.expiryDate, daysBefore, hoursBefore)) {
        return 'expiring';
      }
    }
    return 'normal';
  };

  const expiryStatus = getExpiryStatus();

  const getExpiryBadgeClass = () => {
    if (expiryStatus === 'expired') return 'bg-red-100 text-red-800 border-red-300';
    if (expiryStatus === 'expiring') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        // Stop propagation to prevent parent category drag handler from interfering
        e.stopPropagation();
        onDragStart(e, task);
        // Prevent click event from firing after drag
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragEnd={onDragEnd}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 cursor-move hover:shadow-md dark:hover:shadow-lg transition-shadow touch-manipulation ${
        isDraggedOver ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''
      }`}
      onClick={(e) => {
        // Only edit if not dragging
        if (!e.defaultPrevented) {
          onEdit(task);
        }
      }}
    >
      <div className="flex items-start justify-between mb-2 gap-2">
        <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm flex-1 break-words">{task.title}</h3>
        {priority && (
          <span
            className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium rounded flex-shrink-0"
            style={{ backgroundColor: `${priority.color}20`, color: priority.color }}
          >
            {priority.label}
          </span>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{task.description}</p>
      )}

      {task.expiryDate && (
        <div className={`mt-2 px-2 py-1 rounded text-xs border ${getExpiryBadgeClass()}`}>
          <span className="font-medium">
            {isExpired(task.expiryDate) ? 'Expired' : 'Expires'} {formatRelativeTime(task.expiryDate)}
          </span>
        </div>
      )}

      {task.draft && (
        <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 italic">Draft saved</div>
      )}
    </div>
  );
};
