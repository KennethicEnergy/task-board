'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { CategoryColumn } from './CategoryColumn';
import { PriorityDropZone } from './PriorityDropZone';
import { useBoard } from '@/context/BoardContext';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { TaskModal } from '../modals/TaskModal';
import { CategoryModal } from '../modals/CategoryModal';
import toast from 'react-hot-toast';

export const Board = () => {
  const {
    categories,
    tasks,
    priorities,
    isLoading,
    createCategory,
    reorderCategories,
  } = useBoard();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const { handleDragStart, handleDragOver, handleDrop, handleDragEnd, draggedOver } =
    useDragAndDrop({
      onCategoryDrop: (draggedId, targetId) => {
        const draggedIndex = categories.findIndex((c) => c.id === draggedId);
        const targetIndex = categories.findIndex((c) => c.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const newOrder = [...categories];
        const [removed] = newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, removed);

        reorderCategories(newOrder.map((c) => c.id));
      },
    });

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleCloseTaskModal = () => {
    setEditingTask(null);
    setShowTaskModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 dark:text-gray-400">Loading board...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Board</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-3 sm:px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors text-sm cursor-pointer w-full sm:w-auto"
            >
              + Add Category
            </button>
            <button
              onClick={() => {
                if (categories.length === 0) {
                  toast.error('Please create a category first');
                  return;
                }
                setShowTaskModal(true);
              }}
              className="px-3 sm:px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm cursor-pointer w-full sm:w-auto"
            >
              + Add Task
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-4 sm:p-6">
        <div className="mb-4" onDragOver={(e) => e.stopPropagation()}>
          <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority Drop Zones</h3>
          <div className="flex gap-2 flex-wrap">
            {priorities.map((priority) => (
              <PriorityDropZone key={priority.id} priority={priority} />
            ))}
          </div>
        </div>
        <div className="flex gap-3 sm:gap-4 h-full min-w-max">
          {categories.map((category) => (
            <div
              key={category.id}
              draggable
              onDragStart={(e) => {
                // Only handle category drag if it's not a task being dragged
                // Check if the event target is the category wrapper itself, not a task card
                const target = e.target as HTMLElement;
                const isTaskCard = target.closest('[draggable]') !== e.currentTarget;
                
                // If a task is being dragged (event came from a task card), don't interfere
                // The task drag handler will have already set the drag data
                if (isTaskCard) {
                  // Don't set category drag data - let the task drag data remain
                  return;
                }
                
                // This is a category drag, proceed normally
                handleDragStart(e, 'category', category.id, category);
              }}
              onDragOver={(e) => handleDragOver(e, category.id)}
              onDrop={(e) => handleDrop(e, category.id)}
              onDragEnd={handleDragEnd}
              className={`flex-shrink-0 ${
                draggedOver === category.id ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              <CategoryColumn
                category={category}
                tasks={tasks}
                priorities={priorities}
                onTaskEdit={handleEditTask}
              />
            </div>
          ))}

          {categories.length === 0 && (
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">No categories yet</p>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 cursor-pointer"
                >
                  Create Your First Category
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
          onCreate={createCategory}
        />
      )}

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          categories={categories}
          priorities={priorities}
          onClose={handleCloseTaskModal}
        />
      )}
    </div>
  );
};
