'use client';

import { Priority } from '@/types';
import { useBoard } from '@/context/BoardContext';
import { TOAST_DURATION_SHORT } from '@/constants';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface PriorityDropZoneProps {
  priority: Priority;
}

export const PriorityDropZone = ({ priority }: PriorityDropZoneProps) => {
  const { changeTaskPriority } = useBoard();
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      className={`p-2 sm:p-3 rounded-lg border-2 border-dashed transition-colors cursor-pointer select-none relative z-10 touch-manipulation ${
        isOver
          ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500'
      }`}
      onDragEnter={(e) => {
        // Check if it's a task being dragged
        const hasTaskData = e.dataTransfer.types.includes('application/x-drag-type') ||
                           e.dataTransfer.types.includes('application/x-drag-id') ||
                           e.dataTransfer.types.includes('text/plain');

        if (hasTaskData) {
          e.preventDefault();
          e.stopPropagation();
          setIsOver(true);
        }
      }}
      onDragOver={(e) => {
        // Check if it's a task being dragged (can only check types in dragover, not data)
        const hasTaskData = e.dataTransfer.types.includes('application/x-drag-type') ||
                           e.dataTransfer.types.includes('application/x-drag-id') ||
                           e.dataTransfer.types.includes('text/plain');

        if (!hasTaskData) {
          e.dataTransfer.dropEffect = 'none';
          return;
        }

        // Required to allow drop and to show the "move" cursor
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        setIsOver(true);
      }}
      onDragLeave={(e) => {
        // Only reset if we're actually leaving the drop zone
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
          setIsOver(false);
        }
      }}
      onDrop={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOver(false);

        // Read the drag type and task ID (only available in drop event)
        // HTML5 Drag API: getData can only be called in drop event, and only once per MIME type
        const dragType = e.dataTransfer.getData('application/x-drag-type');
        let taskId = e.dataTransfer.getData('application/x-drag-id');

        // Fallback to text/plain if custom MIME type didn't work
        // Note: Some browsers may not preserve custom MIME types, so text/plain is our fallback
        if (!taskId) {
          taskId = e.dataTransfer.getData('text/plain');
        }

        // Proceed if we have a valid task ID
        // Accept if dragType is 'task' OR if dragType is empty/undefined (browser didn't preserve it)
        // We trust that if something is dropped on a priority zone, it's a task
        if (taskId && taskId.trim() !== '') {
          // Only proceed if it's a task (not a category)
          // If dragType is empty or null, we assume it's a task since it was dropped on priority zone
          const isTask = dragType === 'task' || !dragType;
          if (isTask) {
            try {
              const updated = await changeTaskPriority(taskId.trim(), priority.id);
              if (updated) {
                toast.success(`Priority updated to ${priority.label}`, { duration: TOAST_DURATION_SHORT });
              }
            } catch {
              toast.error('Failed to update priority');
            }
          }
        }
      }}
    >
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div
          className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0"
          style={{ backgroundColor: priority.color }}
        />
        <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{priority.label}</span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">Drop tasks here to change priority</p>
    </div>
  );
};
