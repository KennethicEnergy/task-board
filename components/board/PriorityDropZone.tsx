'use client';

import { Priority } from '@/types';
import { useBoard } from '@/context/BoardContext';
import { useState } from 'react';

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
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400'
      }`}
      onDragEnter={(e) => {
        // Check if it's a task being dragged
        const hasTaskData = e.dataTransfer.types.includes('application/x-drag-type') ||
                           e.dataTransfer.types.includes('application/x-drag-id') ||
                           e.dataTransfer.types.includes('text/plain');
        
        console.log('[PriorityDropZone] onDragEnter:', {
          priority: priority.label,
          priorityId: priority.id,
          hasTaskData,
          types: Array.from(e.dataTransfer.types),
        });
        
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

        console.log('[PriorityDropZone] onDrop triggered:', {
          priority: priority.label,
          priorityId: priority.id,
          types: Array.from(e.dataTransfer.types),
        });

        // Read the drag type and task ID (only available in drop event)
        // HTML5 Drag API: getData can only be called in drop event, and only once per MIME type
        const dragType = e.dataTransfer.getData('application/x-drag-type');
        let taskId = e.dataTransfer.getData('application/x-drag-id');
        
        console.log('[PriorityDropZone] After reading custom MIME types:', {
          dragType,
          taskId,
        });
        
        // Fallback to text/plain if custom MIME type didn't work
        // Note: Some browsers may not preserve custom MIME types, so text/plain is our fallback
        if (!taskId) {
          taskId = e.dataTransfer.getData('text/plain');
          console.log('[PriorityDropZone] After reading text/plain fallback:', {
            taskId,
          });
        }
        
        console.log('[PriorityDropZone] Final values before check:', {
          taskId,
          taskIdTrimmed: taskId?.trim(),
          dragType,
          isTask: dragType === 'task' || !dragType,
        });
        
        // Proceed if we have a valid task ID
        // Accept if dragType is 'task' OR if dragType is empty/undefined (browser didn't preserve it)
        // We trust that if something is dropped on a priority zone, it's a task
        if (taskId && taskId.trim() !== '') {
          // Only proceed if it's a task (not a category)
          // If dragType is empty or null, we assume it's a task since it was dropped on priority zone
          const isTask = dragType === 'task' || !dragType;
          console.log('[PriorityDropZone] Calling changeTaskPriority:', {
            taskId: taskId.trim(),
            priorityId: priority.id,
            isTask,
          });
          if (isTask) {
            changeTaskPriority(taskId.trim(), priority.id);
          } else {
            console.warn('[PriorityDropZone] Not a task, skipping:', { dragType });
          }
        } else {
          console.warn('[PriorityDropZone] No valid task ID found:', { taskId });
        }
      }}
    >
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div
          className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0"
          style={{ backgroundColor: priority.color }}
        />
        <span className="text-xs sm:text-sm font-medium text-gray-700">{priority.label}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1 hidden sm:block">Drop tasks here to change priority</p>
    </div>
  );
};
