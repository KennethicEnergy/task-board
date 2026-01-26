'use client';

import { Category, Task, Priority } from '@/types';
import { TaskCard } from './TaskCard';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useBoard } from '@/context/BoardContext';
import { useState } from 'react';

interface CategoryColumnProps {
  category: Category;
  tasks: Task[];
  priorities: Priority[];
  onTaskEdit: (task: Task) => void;
}

export const CategoryColumn = ({
  category,
  tasks,
  priorities,
  onTaskEdit,
}: CategoryColumnProps) => {
  const { moveTask, deleteCategory } = useBoard();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { handleDragStart, handleDragOver, handleDragEnd, draggedOver } =
    useDragAndDrop({
      onTaskDrop: (taskId, categoryId, order) => {
        moveTask(taskId, categoryId, order);
      },
    });

  const categoryTasks = tasks
    .filter((t) => t.categoryId === category.id)
    .sort((a, b) => a.order - b.order);

  const handleDelete = () => {
    deleteCategory(category.id);
    setShowDeleteConfirm(false);
  };

  const handleTaskDragStart = (e: React.DragEvent, task: Task) => {
    // Stop propagation to prevent parent category drag handler from interfering
    e.stopPropagation();
    handleDragStart(e, 'task', task.id, task);
  };

  const handleCategoryDragEnter = (e: React.DragEvent) => {
    // Check if it's a task being dragged
    const isTask = e.dataTransfer.types.includes('application/x-drag-type') ||
                   e.dataTransfer.types.includes('application/x-drag-id') ||
                   e.dataTransfer.types.includes('text/plain');

    if (isTask) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
    }
  };

  const handleCategoryDragOver = (e: React.DragEvent) => {
    // Check if it's a task being dragged (can only check types in dragover, not data)
    const isTask = e.dataTransfer.types.includes('application/x-drag-type') ||
                   e.dataTransfer.types.includes('application/x-drag-id') ||
                   e.dataTransfer.types.includes('text/plain');

    if (isTask) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';
      setIsDragOver(true);
      handleDragOver(e, category.id);
    } else {
      // If it's a category being dragged, let the parent handle it
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const handleCategoryDragLeave = (e: React.DragEvent) => {
    // Only reset if we're actually leaving the category column
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleCategoryDrop = (e: React.DragEvent) => {
    // Read drag type and task ID from dataTransfer (only available in drop event)
    const dragType = e.dataTransfer.getData('application/x-drag-type');
    const taskId = e.dataTransfer.getData('application/x-drag-id') ||
                   e.dataTransfer.getData('text/plain');

    // Only handle task drops here (category drops are handled by parent)
    if (dragType === 'task' && taskId) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      // Check if the task is already in this category
      const existingTask = categoryTasks.find(t => t.id === taskId);

      // If task is already in this category, don't move it
      if (existingTask) {
        return;
      }

      // Move task to the end of this category
      moveTask(taskId, category.id, categoryTasks.length);
    }
  };

  return (
    <div
      className={`flex-shrink-0 w-full sm:w-72 md:w-80 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4 transition-all ${
        isDragOver || draggedOver === category.id
          ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-300 dark:border-indigo-500'
          : ''
      }`}
      onDragEnter={handleCategoryDragEnter}
      onDragOver={handleCategoryDragOver}
      onDragLeave={handleCategoryDragLeave}
      onDrop={handleCategoryDrop}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div
            className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0"
            style={{ backgroundColor: category.color || '#6366f1' }}
          />
          <h2 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{category.title}</h2>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">({categoryTasks.length})</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 text-sm cursor-pointer"
          >
            ×
          </button>
          {showDeleteConfirm && (
            <div className="absolute right-0 top-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg p-2 z-10">
              <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">Delete category?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  className="text-xs px-2 py-1 bg-red-600 dark:bg-red-500 text-white rounded hover:bg-red-700 dark:hover:bg-red-600 cursor-pointer"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-xs text-gray-900 dark:text-gray-200 px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className="space-y-2 sm:space-y-3 min-h-[100px]"
        onDragOver={(e) => {
          // Allow dropping tasks in the empty space
          const isTask = e.dataTransfer.types.includes('application/x-drag-type') ||
                         e.dataTransfer.types.includes('application/x-drag-id') ||
                         e.dataTransfer.types.includes('text/plain');
          if (isTask) {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'move';
            setIsDragOver(true);
          }
        }}
        onDrop={(e) => {
          // Handle drops in empty space (append to end)
          const dragType = e.dataTransfer.getData('application/x-drag-type');
          const taskId = e.dataTransfer.getData('application/x-drag-id') ||
                         e.dataTransfer.getData('text/plain');

          if (dragType === 'task' && taskId) {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);
            const existingTask = categoryTasks.find(t => t.id === taskId);
            if (!existingTask) {
              moveTask(taskId, category.id, categoryTasks.length);
            }
          }
        }}
      >
        {categoryTasks.map((task) => {
          const priority = priorities.find((p) => p.id === task.priorityId);
          return (
            <TaskCard
              key={task.id}
              task={task}
              priority={priority}
              onEdit={onTaskEdit}
              onDragStart={handleTaskDragStart}
              onDragEnd={handleDragEnd}
              isDraggedOver={draggedOver === task.id}
            />
          );
        })}
      </div>
    </div>
  );
};
