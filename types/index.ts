export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent' | 'custom';

export interface Priority {
  id: string;
  label: string;
  color: string;
  level: PriorityLevel;
  order: number;
}

export interface Category {
  id: string;
  title: string;
  order: number;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface TaskDraft {
  title: string;
  description: string;
  expiryDate: Date | null;
  priorityId: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  priorityId: string;
  expiryDate: Date | null;
  draft: TaskDraft | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  order: number;
}

export interface UpdateHistoryEntry {
  id: string;
  type: 'board' | 'card';
  action: 'category_created' | 'category_moved' | 'category_deleted' | 'task_created' | 'task_moved' | 'task_updated' | 'task_deleted' | 'priority_changed' | 'expiry_changed';
  entityId: string;
  entityType: 'category' | 'task';
  previousValue?: string | number;
  newValue?: string | number;
  metadata?: Record<string, unknown>;
  timestamp: Date;
  userId: string;
}

export const NOTIFICATION_METHODS = ['visual', 'toast', 'email', 'push'] as const;
export type NotificationMethod = (typeof NOTIFICATION_METHODS)[number];

export const DEFAULT_NOTIFICATION_METHODS: NotificationMethod[] = ['visual', 'toast'];

export interface NotificationSettings {
  enabled: boolean;
  daysBefore: number;
  hoursBefore: number;
  methods: NotificationMethod[];
}

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  notificationSettings: NotificationSettings;
}

export interface BoardState {
  categories: Category[];
  tasks: Task[];
  priorities: Priority[];
  updateHistory: UpdateHistoryEntry[];
  isLoading: boolean;
  error: string | null;
}
