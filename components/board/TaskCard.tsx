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
    return '';
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        console.log('[TaskCard] onDragStart:', {
          taskId: task.id,
          taskTitle: task.title,
          types: Array.from(e.dataTransfer.types),
        });
        // Stop propagation to prevent parent category drag handler from interfering
        e.stopPropagation();
        onDragStart(e, task);
        // Prevent click event from firing after drag
        e.dataTransfer.effectAllowed = 'move';
        console.log('[TaskCard] onDragStart: After calling onDragStart, types:', Array.from(e.dataTransfer.types));
      }}
      onDragEnd={onDragEnd}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-move hover:shadow-md transition-shadow ${
        isDraggedOver ? 'ring-2 ring-indigo-500' : ''
      }`}
      onClick={(e) => {
        // Only edit if not dragging
        if (!e.defaultPrevented) {
          onEdit(task);
        }
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-sm flex-1">{task.title}</h3>
        {priority && (
          <span
            className="ml-2 px-2 py-1 text-xs font-medium rounded"
            style={{ backgroundColor: `${priority.color}20`, color: priority.color }}
          >
            {priority.label}
          </span>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
      )}

      {task.expiryDate && (
        <div className={`mt-2 px-2 py-1 rounded text-xs border ${getExpiryBadgeClass()}`}>
          <span className="font-medium">
            {isExpired(task.expiryDate) ? 'Expired' : 'Expires'} {formatRelativeTime(task.expiryDate)}
          </span>
        </div>
      )}

      {task.draft && (
        <div className="mt-2 text-xs text-blue-600 italic">Draft saved</div>
      )}
    </div>
  );
};
