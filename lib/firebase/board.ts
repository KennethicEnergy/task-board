import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
  Timestamp,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import { Category, Task, Priority, UpdateHistoryEntry } from '@/types';

const CATEGORIES_COLLECTION = 'categories';
const TASKS_COLLECTION = 'tasks';
const PRIORITIES_COLLECTION = 'priorities';
const HISTORY_COLLECTION = 'updateHistory';

const convertTimestamp = (timestamp: Timestamp | Date): Date => {
  if (timestamp instanceof Date) return timestamp;
  return timestamp.toDate();
};

const toFirestoreDate = (date: Date | null): Timestamp | null => {
  if (!date) return null;
  return Timestamp.fromDate(date);
};

export const subscribeToCategories = (
  userId: string,
  callback: (categories: Category[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, CATEGORIES_COLLECTION),
    where('userId', '==', userId),
    orderBy('order', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const categories = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as Category;
    });
    callback(categories);
  });
};

export const subscribeToTasks = (
  userId: string,
  callback: (tasks: Task[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, TASKS_COLLECTION),
    where('userId', '==', userId),
    orderBy('order', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        expiryDate: data.expiryDate ? convertTimestamp(data.expiryDate) : null,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        draft: data.draft
          ? {
              ...data.draft,
              expiryDate: data.draft.expiryDate
                ? convertTimestamp(data.draft.expiryDate)
                : null,
            }
          : null,
      } as Task;
    });
    callback(tasks);
  });
};

export const subscribeToPriorities = (
  userId: string,
  callback: (priorities: Priority[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, PRIORITIES_COLLECTION),
    where('userId', '==', userId),
    orderBy('order', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const priorities = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      } as Priority;
    });
    callback(priorities);
  });
};

export const subscribeToHistory = (
  userId: string,
  callback: (history: UpdateHistoryEntry[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, HISTORY_COLLECTION),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const history = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: convertTimestamp(data.timestamp),
      } as UpdateHistoryEntry;
    });
    callback(history);
  });
};

export const createCategory = async (
  category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const docRef = doc(collection(db, CATEGORIES_COLLECTION));
  await setDoc(docRef, {
    ...category,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateCategory = async (
  categoryId: string,
  updates: Partial<Category>
): Promise<void> => {
  await updateDoc(doc(db, CATEGORIES_COLLECTION, categoryId), {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const updateCategoryOrder = async (
  categoryUpdates: { id: string; order: number }[]
): Promise<void> => {
  const batch = writeBatch(db);
  categoryUpdates.forEach(({ id, order }) => {
    batch.update(doc(db, CATEGORIES_COLLECTION, id), {
      order,
      updatedAt: Timestamp.now(),
    });
  });
  await batch.commit();
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId));
};

export const createTask = async (
  task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const docRef = doc(collection(db, TASKS_COLLECTION));
  await setDoc(docRef, {
    ...task,
    expiryDate: toFirestoreDate(task.expiryDate),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Task>
): Promise<void> => {
  const updateData: Record<string, unknown> = {
    ...updates,
    updatedAt: Timestamp.now(),
  };

  if (updates.expiryDate !== undefined) {
    updateData.expiryDate = toFirestoreDate(updates.expiryDate);
  }

  if (updates.draft !== undefined) {
    updateData.draft = updates.draft
      ? {
          ...updates.draft,
          expiryDate: toFirestoreDate(updates.draft.expiryDate),
        }
      : null;
  }

  await updateDoc(doc(db, TASKS_COLLECTION, taskId), updateData);
};

export const updateTaskOrder = async (
  taskUpdates: { id: string; order: number; categoryId?: string; priorityId?: string }[]
): Promise<void> => {
  const batch = writeBatch(db);
  taskUpdates.forEach(({ id, order, categoryId, priorityId }) => {
    const updateData: Record<string, unknown> = {
      order,
      updatedAt: Timestamp.now(),
    };
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (priorityId !== undefined) updateData.priorityId = priorityId;
    batch.update(doc(db, TASKS_COLLECTION, id), updateData);
  });
  await batch.commit();
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
};

export const createPriority = async (
  priority: Omit<Priority, 'id'>
): Promise<string> => {
  const docRef = doc(collection(db, PRIORITIES_COLLECTION));
  await setDoc(docRef, priority);
  return docRef.id;
};

export const updatePriority = async (
  priorityId: string,
  updates: Partial<Priority>
): Promise<void> => {
  await updateDoc(doc(db, PRIORITIES_COLLECTION, priorityId), updates);
};

export const deletePriority = async (priorityId: string): Promise<void> => {
  await deleteDoc(doc(db, PRIORITIES_COLLECTION, priorityId));
};

export const addHistoryEntry = async (
  entry: Omit<UpdateHistoryEntry, 'id'>
): Promise<string> => {
  const docRef = doc(collection(db, HISTORY_COLLECTION));
  await setDoc(docRef, {
    ...entry,
    timestamp: Timestamp.now(),
  });
  return docRef.id;
};
