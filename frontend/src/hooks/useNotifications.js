import { useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';
import { useAuth } from './useAuth';

/**
 * Custom hook for managing notifications state.
 * @returns {{ notifications, unreadCount, loading, refresh, markAsRead, markAllAsRead }}
 */
export function useNotifications(options = {}) {
  const { autoRefresh = false, pollIntervalMs = 8000 } = options;
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotifications = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      const [notifs, countData] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getUnreadCount(),
      ]);

      if (import.meta.env.DEV && user?.role === 'ADMIN') {
        console.log('[Admin Notifications] API payload:', notifs);
        console.log('[Admin Notifications] Unread count payload:', countData);
      }

      setNotifications(notifs);
      setUnreadCount(countData.count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [user?.role]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!autoRefresh) return undefined;

    const intervalId = setInterval(() => {
      fetchNotifications(true);
    }, pollIntervalMs);

    return () => clearInterval(intervalId);
  }, [autoRefresh, pollIntervalMs, fetchNotifications]);

  const markAsRead = useCallback(async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    refresh: () => fetchNotifications(false),
    markAsRead,
    markAllAsRead,
  };
}
