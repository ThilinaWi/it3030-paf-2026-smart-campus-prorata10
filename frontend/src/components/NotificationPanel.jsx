import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineBell } from 'react-icons/hi';
import { useNotifications } from '../hooks/useNotifications';
import NotificationItem from './NotificationItem';

/**
 * Notification bell icon with dropdown panel showing recent notifications.
 */
export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications({
    autoRefresh: true,
    pollIntervalMs: 5000,
  });

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="notification-panel-container" ref={panelRef}>
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        id="notification-bell-btn"
      >
        <HiOutlineBell size={24} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown" id="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-read-btn"
                onClick={markAllAsRead}
                id="mark-all-read-btn"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-dropdown-body">
            {loading ? (
              <div className="notification-loading">Loading...</div>
            ) : recentNotifications.length === 0 ? (
              <div className="notification-empty">
                <HiOutlineBell size={32} />
                <p>No notifications yet</p>
              </div>
            ) : (
              recentNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))
            )}
          </div>

          {notifications.length > 5 && (
            <div className="notification-dropdown-footer">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/notifications');
                }}
                id="view-all-notifications-btn"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
