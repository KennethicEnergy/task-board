'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Category, Task, Priority, UpdateHistoryEntry, BoardState } from '@/types';
import { DEFAULT_PRIORITIES, DEFAULT_CATEGORY_COLOR } from '@/constants';
import {
  subscribeToCategories,
  subscribeToTasks,
  subscribeToPriorities,
  subscribeToHistory,
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  updateCategoryOrder as updateCategoryOrderService,
  deleteCategory as deleteCategoryService,
  createTask as createTaskService,
  updateTask as updateTaskService,
  updateTaskOrder as updateTaskOrderService,
  deleteTask as deleteTaskService,
  createPriority as createPriorityService,
  updatePriority as updatePriorityService,
  deletePriority as deletePriorityService,
  addHistoryEntry,
} from '@/lib/firebase/board';
import { useAuth } from './AuthContext';

interface BoardContextType extends BoardState {
  createCategory: (title: string, color?: string) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (categoryIds: string[]) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (taskId: string, categoryId: string, newOrder: number) => Promise<void>;
  changeTaskPriority: (taskId: string, priorityId: string) => Promise<boolean>;
  createPriority: (priority: Omit<Priority, 'id'>) => Promise<void>;
  updatePriority: (id: string, updates: Partial<Priority>) => Promise<void>;
  deletePriority: (id: string) => Promise<void>;
  recordHistory: (entry: Omit<UpdateHistoryEntry, 'id' | 'timestamp' | 'userId'>) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>(DEFAULT_PRIORITIES);
  const [updateHistory, setUpdateHistory] = useState<UpdateHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      // Reset state when user logs out - necessary for cleanup
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategories([]);
      setTasks([]);
      setPriorities(DEFAULT_PRIORITIES);
      setUpdateHistory([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribers: (() => void)[] = [];

    unsubscribers.push(
      subscribeToCategories(user.id, (newCategories) => {
        setCategories(newCategories);
        setIsLoading(false);
      })
    );

    unsubscribers.push(
      subscribeToTasks(user.id, (newTasks) => {
        setTasks(newTasks);
      })
    );

    unsubscribers.push(
      subscribeToPriorities(user.id, (newPriorities) => {
        if (newPriorities.length > 0) {
          setPriorities(newPriorities);
        }
      })
    );

    unsubscribers.push(
      subscribeToHistory(user.id, (newHistory) => {
        setUpdateHistory(newHistory);
      })
    );

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [user]);

  const recordHistory = useCallback(
    async (entry: Omit<UpdateHistoryEntry, 'id' | 'timestamp' | 'userId'>) => {
      if (!user) return;
      await addHistoryEntry({
        ...entry,
        userId: user.id,
        timestamp: new Date(),
      });
    },
    [user]
  );

  const createCategory = useCallback(
    async (title: string, color?: string) => {
      if (!user) return;
      try {
        const maxOrder = categories.length > 0 ? Math.max(...categories.map((c) => c.order)) : -1;
        const categoryId = await createCategoryService({
          title,
          order: maxOrder + 1,
          color: color || DEFAULT_CATEGORY_COLOR,
          userId: user.id,
        });
        await recordHistory({
          type: 'board',
          action: 'category_created',
          entityId: categoryId,
          entityType: 'category',
          metadata: { title },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create category');
      }
    },
    [user, categories, recordHistory]
  );

  const updateCategory = useCallback(
    async (id: string, updates: Partial<Category>) => {
      try {
        await updateCategoryService(id, updates);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update category');
      }
    },
    []
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        await deleteCategoryService(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete category');
      }
    },
    []
  );

  const reorderCategories = useCallback(
    async (categoryIds: string[]) => {
      if (!user) return;
      try {
        const updates = categoryIds.map((id, index) => ({ id, order: index }));
        await updateCategoryOrderService(updates);
        await recordHistory({
          type: 'board',
          action: 'category_moved',
          entityId: categoryIds.join(','),
          entityType: 'category',
          metadata: { newOrder: categoryIds },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to reorder categories');
      }
    },
    [user, recordHistory]
  );

  const createTask = useCallback(
    async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
      if (!user) return;
      try {
        const categoryTasks = tasks.filter((t) => t.categoryId === task.categoryId);
        const maxOrder =
          categoryTasks.length > 0 ? Math.max(...categoryTasks.map((t) => t.order)) : -1;
        const taskId = await createTaskService({
          ...task,
          order: maxOrder + 1,
          userId: user.id,
        });
        await recordHistory({
          type: 'card',
          action: 'task_created',
          entityId: taskId,
          entityType: 'task',
          metadata: { title: task.title, categoryId: task.categoryId },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create task');
      }
    },
    [user, tasks, recordHistory]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      try {
        const existingTask = tasks.find((t) => t.id === id);
        if (!existingTask) return;

        await updateTaskService(id, updates);

        // Track expiry date changes
        if (updates.expiryDate !== undefined) {
          await recordHistory({
            type: 'card',
            action: 'expiry_changed',
            entityId: id,
            entityType: 'task',
            previousValue: existingTask.expiryDate?.toISOString(),
            newValue: updates.expiryDate?.toISOString(),
          });
        }

        // Track general task updates (title, description, category, priority)
        const hasGeneralUpdates =
          (updates.title !== undefined && updates.title !== existingTask.title) ||
          (updates.description !== undefined && updates.description !== existingTask.description) ||
          (updates.categoryId !== undefined && updates.categoryId !== existingTask.categoryId);

        if (hasGeneralUpdates) {
          const changedFields: string[] = [];
          if (updates.title !== undefined && updates.title !== existingTask.title) {
            changedFields.push('title');
          }
          if (updates.description !== undefined && updates.description !== existingTask.description) {
            changedFields.push('description');
          }
          if (updates.categoryId !== undefined && updates.categoryId !== existingTask.categoryId) {
            changedFields.push('category');
          }

          await recordHistory({
            type: 'card',
            action: 'task_updated',
            entityId: id,
            entityType: 'task',
            metadata: {
              changedFields,
              previousTitle: existingTask.title,
              newTitle: updates.title ?? existingTask.title,
              previousCategoryId: existingTask.categoryId,
              newCategoryId: updates.categoryId ?? existingTask.categoryId,
            },
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update task');
      }
    },
    [tasks, recordHistory]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      try {
        await deleteTaskService(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete task');
      }
    },
    []
  );

  const moveTask = useCallback(
    async (taskId: string, categoryId: string, newOrder: number) => {
      if (!user) return;
      try {
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        const oldCategoryId = task.categoryId;

        // If moving within the same category, don't do anything
        if (oldCategoryId === categoryId) {
          return;
        }

        // Get tasks in the new category (excluding the moved task)
        const newCategoryTasks = tasks
          .filter((t) => t.categoryId === categoryId && t.id !== taskId)
          .sort((a, b) => a.order - b.order);

        // Get tasks in the old category (excluding the moved task)
        const oldCategoryTasks = tasks
          .filter((t) => t.categoryId === oldCategoryId && t.id !== taskId)
          .sort((a, b) => a.order - b.order);

        const updates: { id: string; order: number; categoryId?: string }[] = [];

        // Update the moved task
        updates.push({ id: taskId, order: newOrder, categoryId });

        // Reorder tasks in the new category
        newCategoryTasks.forEach((t, index) => {
          if (index >= newOrder) {
            updates.push({ id: t.id, order: index + 1 });
          } else {
            updates.push({ id: t.id, order: index });
          }
        });

        // Reorder tasks in the old category
        oldCategoryTasks.forEach((t, index) => {
          updates.push({ id: t.id, order: index });
        });

        await updateTaskOrderService(updates);
        await recordHistory({
          type: 'card',
          action: 'task_moved',
          entityId: taskId,
          entityType: 'task',
          previousValue: oldCategoryId,
          newValue: categoryId,
          metadata: { newOrder },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to move task');
      }
    },
    [user, tasks, recordHistory]
  );

  const changeTaskPriority = useCallback(
    async (taskId: string, priorityId: string): Promise<boolean> => {
      if (!user) return false;

      try {
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return false;

        // Don't update if priority is already the same
        if (task.priorityId === priorityId) {
          return false;
        }

        await updateTaskService(taskId, { priorityId });

        await recordHistory({
          type: 'card',
          action: 'priority_changed',
          entityId: taskId,
          entityType: 'task',
          previousValue: task.priorityId,
          newValue: priorityId,
        });
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to change task priority');
        throw err;
      }
    },
    [user, tasks, recordHistory]
  );

  const createPriority = useCallback(
    async (priority: Omit<Priority, 'id'>) => {
      if (!user) return;
      try {
        await createPriorityService({
          ...priority,
          userId: user.id,
        } as Priority & { userId: string });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create priority');
      }
    },
    [user]
  );

  const updatePriority = useCallback(
    async (id: string, updates: Partial<Priority>) => {
      try {
        await updatePriorityService(id, updates);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update priority');
      }
    },
    []
  );

  const deletePriority = useCallback(
    async (id: string) => {
      try {
        await deletePriorityService(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete priority');
      }
    },
    []
  );

  return (
    <BoardContext.Provider
      value={{
        categories,
        tasks,
        priorities,
        updateHistory,
        isLoading,
        error,
        createCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        createTask,
        updateTask,
        deleteTask,
        moveTask,
        changeTaskPriority,
        createPriority,
        updatePriority,
        deletePriority,
        recordHistory,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = (): BoardContextType => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};
