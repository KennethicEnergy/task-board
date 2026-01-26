'use client';

import { useState, useEffect, FormEvent } from 'react';
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

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setCategoryId(task.categoryId);
      setPriorityId(task.priorityId);
      setExpiryDate(task.expiryDate ? formatDate(task.expiryDate) : '');
      setDraft(task.draft);
    } else {
      if (categories.length > 0) {
        setCategoryId(categories[0].id);
      }
      if (priorities.length > 0) {
        setPriorityId(priorities[0].id);
      }
    }
  }, [task, categories, priorities]);

  const handleSaveDraft = async (draftData: TaskDraft) => {
    if (!task) return;
    setSaving(true);
    try {
      await updateTask(task.id, { draft: draftData });
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setSaving(false);
    }
  };

  useDraftSaving(
    draft
      ? {
          title,
          description,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          priorityId: priorityId || null,
        }
      : null,
    handleSaveDraft,
    !!task
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {task ? 'Edit Task' : 'Create Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Task title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Task description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={priorityId}
                onChange={(e) => setPriorityId(e.target.value)}
                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {saving && (
            <div className="text-sm text-blue-600">Saving draft...</div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              {task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
