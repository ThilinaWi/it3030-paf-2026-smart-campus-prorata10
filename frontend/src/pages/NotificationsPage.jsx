import { useNotifications } from '../hooks/useNotifications';
import NotificationItem from '../components/NotificationItem';
import { HiOutlineBell, HiOutlineRefresh } from 'react-icons/hi';

/**
 * Full notifications page showing all user notifications.
 */
export default function NotificationsPage() {
  const { notifications, unreadCount, loading, refresh, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="notifications-page" id="notifications-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <HiOutlineBell size={28} />
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} unread</span>
          )}
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-secondary"
            onClick={refresh}
            id="refresh-notifications-btn"
          >
            <HiOutlineRefresh size={18} />
            Refresh
          </button>
          {unreadCount > 0 && (
            <button
              className="btn btn-primary"
              onClick={markAllAsRead}
              id="mark-all-read-page-btn"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state" id="no-notifications">
            <HiOutlineBell size={48} />
            <h3>No notifications</h3>
            <p>You're all caught up! New notifications will appear here.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
}
