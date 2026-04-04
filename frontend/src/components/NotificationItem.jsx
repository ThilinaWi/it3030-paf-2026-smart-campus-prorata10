import { HiOutlineBell, HiOutlineCheckCircle } from 'react-icons/hi';
import { NOTIFICATION_TYPES } from '../utils/constants';

/**
 * Single notification item component.
 */
export default function NotificationItem({ notification, onMarkAsRead }) {
  const { id, type, message, isRead, createdAt } = notification;

  const typeIcons = {
    [NOTIFICATION_TYPES.SYSTEM]: '⚙️',
    [NOTIFICATION_TYPES.ALERT]: '⚠️',
    [NOTIFICATION_TYPES.REMINDER]: '🔔',
    [NOTIFICATION_TYPES.INFO]: 'ℹ️',
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`notification-item ${isRead ? 'read' : 'unread'}`} id={`notification-${id}`}>
      <div className="notification-icon">
        {typeIcons[type] || '📩'}
      </div>
      <div className="notification-content">
        <p className="notification-message">{message}</p>
        <span className="notification-time">{formatTime(createdAt)}</span>
      </div>
      {!isRead && (
        <button
          className="mark-read-btn"
          onClick={() => onMarkAsRead(id)}
          title="Mark as read"
          id={`mark-read-${id}`}
        >
          <HiOutlineCheckCircle size={20} />
        </button>
      )}
    </div>
  );
}
