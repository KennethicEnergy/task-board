import { format, formatDistanceToNow, isAfter, isBefore, addDays, addHours } from 'date-fns';

export const formatDate = (date: Date | null): string => {
  if (!date) return '';
  return format(date, 'yyyy-MM-dd');
};

export const formatDateTime = (date: Date | null): string => {
  if (!date) return '';
  return format(date, 'yyyy-MM-dd HH:mm');
};

export const formatRelativeTime = (date: Date | null): string => {
  if (!date) return '';
  return formatDistanceToNow(date, { addSuffix: true });
};

export const isExpired = (date: Date | null): boolean => {
  if (!date) return false;
  return isBefore(date, new Date());
};

export const isExpiringSoon = (
  date: Date | null,
  daysBefore: number,
  hoursBefore: number
): boolean => {
  if (!date) return false;
  const now = new Date();
  const threshold = addHours(addDays(now, daysBefore), hoursBefore);
  return isAfter(date, now) && isBefore(date, threshold);
};

export const createExpiryDate = (days: number, hours: number = 0): Date => {
  return addHours(addDays(new Date(), days), hours);
};
