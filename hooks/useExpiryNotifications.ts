import { useEffect, useCallback, useRef } from 'react';
import { differenceInHours, differenceInDays, isAfter, isBefore } from 'date-fns';
import { Task, User } from '@/types';
import toast from 'react-hot-toast';
import { sendExpiryEmail } from '@/lib/notifications/email';
import { sendPushNotification } from '@/lib/notifications/push';

export const useExpiryNotifications = (
  tasks: Task[],
  user: User | null,
  onVisualUpdate?: (taskIds: string[]) => void
) => {
  // Track which tasks we've already notified about to avoid duplicate notifications
  const notifiedTasksRef = useRef<Set<string>>(new Set());

  const checkExpiryNotifications = useCallback(() => {
    if (!user || !user.notificationSettings.enabled) return;

    const { daysBefore, hoursBefore, methods } = user.notificationSettings;
    const now = new Date();
    const thresholdHours = daysBefore * 24 + hoursBefore;
    const expiringTasks: string[] = [];

    tasks.forEach((task) => {
      if (!task.expiryDate) return;

      const hoursUntilExpiry = differenceInHours(task.expiryDate, now);
      const daysUntilExpiry = differenceInDays(task.expiryDate, now);

      if (
        hoursUntilExpiry <= thresholdHours &&
        hoursUntilExpiry > 0 &&
        isAfter(task.expiryDate, now)
      ) {
        expiringTasks.push(task.id);
        const notificationKey = `${task.id}-${Math.floor(hoursUntilExpiry)}`;

        // Toast notifications
        if (methods.includes('toast') && !notifiedTasksRef.current.has(notificationKey)) {
          const message =
            daysUntilExpiry > 0
              ? `"${task.title}" expires in ${daysUntilExpiry} day(s)`
              : `"${task.title}" expires in ${hoursUntilExpiry} hour(s)`;
          toast.error(message, {
            duration: 5000,
            icon: '⏰',
          });
          notifiedTasksRef.current.add(notificationKey);
        }

        // Email notifications
        if (methods.includes('email') && !notifiedTasksRef.current.has(`${notificationKey}-email`)) {
          sendExpiryEmail({
            to: user.email,
            subject: `Task "${task.title}" expires soon`,
            body: `Your task "${task.title}" expires in ${daysUntilExpiry > 0 ? `${daysUntilExpiry} day(s)` : `${hoursUntilExpiry} hour(s)`}.`,
            taskTitle: task.title,
            expiryDate: task.expiryDate,
          }).catch((err) => {
            console.error('Failed to send email notification:', err);
          });
          notifiedTasksRef.current.add(`${notificationKey}-email`);
        }

        // Push notifications
        if (methods.includes('push') && !notifiedTasksRef.current.has(`${notificationKey}-push`)) {
          sendPushNotification({
            userId: user.id,
            title: 'Task Expiring Soon',
            body: `"${task.title}" expires in ${daysUntilExpiry > 0 ? `${daysUntilExpiry} day(s)` : `${hoursUntilExpiry} hour(s)`}`,
            taskId: task.id,
            expiryDate: task.expiryDate,
          }).catch((err) => {
            console.error('Failed to send push notification:', err);
          });
          notifiedTasksRef.current.add(`${notificationKey}-push`);
        }
      } else {
        // Remove from notified set if task is no longer expiring soon
        const keysToRemove: string[] = [];
        notifiedTasksRef.current.forEach((key) => {
          if (key.startsWith(`${task.id}-`)) {
            keysToRemove.push(key);
          }
        });
        keysToRemove.forEach((key) => notifiedTasksRef.current.delete(key));
      }
    });

    if (methods.includes('visual') && onVisualUpdate) {
      onVisualUpdate(expiringTasks);
    }
  }, [tasks, user, onVisualUpdate]);

  useEffect(() => {
    checkExpiryNotifications();
    const interval = setInterval(checkExpiryNotifications, 60000);
    return () => clearInterval(interval);
  }, [checkExpiryNotifications]);

  const getExpiryStatus = useCallback(
    (task: Task): 'expired' | 'expiring' | 'normal' => {
      if (!task.expiryDate) return 'normal';

      const now = new Date();
      if (isBefore(task.expiryDate, now)) return 'expired';

      if (!user || !user.notificationSettings.enabled) return 'normal';

      const { daysBefore, hoursBefore } = user.notificationSettings;
      const thresholdHours = daysBefore * 24 + hoursBefore;
      const hoursUntilExpiry = differenceInHours(task.expiryDate, now);

      if (hoursUntilExpiry <= thresholdHours && hoursUntilExpiry > 0) {
        return 'expiring';
      }

      return 'normal';
    },
    [user]
  );

  return { getExpiryStatus };
};
