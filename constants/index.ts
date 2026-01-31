import type { Priority } from '@/types';

/** Toast display duration (ms) for short feedback */
export const TOAST_DURATION_SHORT = 2000;

/** Toast display duration (ms) for longer messages (e.g. expiry alerts) */
export const TOAST_DURATION_LONG = 5000;

/** How often to check for expiring tasks (ms) */
export const EXPIRY_CHECK_INTERVAL_MS = 60000;

/** Debounce delay before saving a task draft (ms) */
export const DRAFT_SAVE_DELAY_MS = 1000;

/** Hours in a day, used for expiry threshold calculation */
export const HOURS_PER_DAY = 24;

/** Default color for new categories (indigo) */
export const DEFAULT_CATEGORY_COLOR = '#6366f1';

/** Color palette for category color picker */
export const CATEGORY_COLOR_PALETTE: readonly string[] = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
];

/** Default priority levels when Firestore has none */
export const DEFAULT_PRIORITIES: Priority[] = [
  { id: 'low', label: 'Low', color: '#94a3b8', level: 'low', order: 0 },
  { id: 'medium', label: 'Medium', color: '#fbbf24', level: 'medium', order: 1 },
  { id: 'high', label: 'High', color: '#f97316', level: 'high', order: 2 },
  { id: 'urgent', label: 'Urgent', color: '#ef4444', level: 'urgent', order: 3 },
];
