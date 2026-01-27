'use client';

import { useState, useEffect, FormEvent, useMemo } from 'react';
import { Task, Category, Priority, TaskDraft } from '@/types';
import { useBoard } from '@/context/BoardContext';
import { useDraftSaving } from '@/hooks/useDraftSaving';
import { formatDate } from '@/utils/dateUtils';
import toast from 'react-hot-toast';

interface TaskModalProps {
  task: Task | null;
  categories: Category[];
  priorities: Priority[];
  onClose: () => void;
}

export const TaskModal = ({ task, categories, priorities, onClose }: TaskModalProps) => {
  const { createTask, updateTask } = useBoard();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priorityId, setPriorityId] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [draft, setDraft] = useState<TaskDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasLoadedTask, setHasLoadedTask] = useState(false);

  useEffect(() => {
    if (task) {
      // If task has a draft, restore draft values; otherwise use task values
      if (task.draft) {
        setTitle(task.draft.title);
        setDescription(task.draft.description);
        setPriorityId(task.draft.priorityId || task.priorityId);
        setExpiryDate(task.draft.expiryDate ? formatDate(task.draft.expiryDate) : '');
      } else {
        setTitle(task.title);
        setDescription(task.description);
        setPriorityId(task.priorityId);
        setExpiryDate(task.expiryDate ? formatDate(task.expiryDate) : '');
      }
      // Always use task's category (can't change category via draft)
      setCategoryId(task.categoryId);
      setDraft(task.draft);
      setHasLoadedTask(true);
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setExpiryDate('');
      setHasLoadedTask(false);
      if (categories.length > 0) {
        setCategoryId(categories[0].id);
      }
      if (priorities.length > 0) {
        setPriorityId(priorities[0].id);
      }
      setDraft(null);
    }
  }, [task, categories, priorities]);

  const handleSaveDraft = async (draftData: TaskDraft) => {
    if (!task) return;
    setSaving(true);
    try {
      await updateTask(task.id, { draft: draftData });
      toast.success('Draft saved', { duration: 2000, icon: '💾' });
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  // Memoize the draft object so it only changes when form values actually change
  // This prevents the useDraftSaving hook from resetting the debounce timer on every render
  const currentDraft = useMemo<TaskDraft | null>(() => {
    if (!task) return null;
    return {
      title,
      description,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      priorityId: priorityId || null,
    };
  }, [task, title, description, expiryDate, priorityId]);

  // Only pass draft after form is loaded from task, so we don't save on initial open
  useDraftSaving(
    hasLoadedTask && task ? currentDraft : null,
    handleSaveDraft,
    !!task,
    task?.id ?? null
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!categoryId) {
      toast.error('Please select a category');
      return;
    }

    try {
      if (task) {
        await updateTask(task.id, {
          title,
          description,
          categoryId,
          priorityId,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          draft: null,
        });
        toast.success('Task updated');
      } else {
        await createTask({
          title,
          description,
          categoryId,
          priorityId,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          draft: null,
          order: 0,
        });
        toast.success('Task created');
      }
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save task');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {task ? 'Edit Task' : 'Create Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl cursor-pointer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Task title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Task description"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={priorityId}
                onChange={(e) => setPriorityId(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select priority</option>
                {priorities.map((pri) => (
                  <option key={pri.id} value={pri.id}>
                    {pri.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Expiry Date
            </label>
            <input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {saving && (
            <div className="text-sm text-blue-600 dark:text-blue-400">Saving draft...</div>
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
              {task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
