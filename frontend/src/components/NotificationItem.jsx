import { HiOutlineBell, HiOutlineCheckCircle } from 'react-icons/hi';
import { NOTIFICATION_TYPES } from '../utils/constants';

/**
 * Single notification item component.
 */
export default function NotificationItem({ notification, onMarkAsRead }) {
  const { id, type, message, isRead, createdAt } = notification;

  const normalizedMessage = (message || '').toLowerCase();
  const notificationCategory = normalizedMessage.includes('rejected')
    ? 'rejected'
    : normalizedMessage.includes('approved')
      ? 'approved'
      : (normalizedMessage.includes('booking request') || normalizedMessage.includes('re-approval'))
        ? 'request'
        : 'default';

  const typeIcons = {
    [NOTIFICATION_TYPES.SYSTEM]: '⚙️',
    [NOTIFICATION_TYPES.ALERT]: '⚠️',
    [NOTIFICATION_TYPES.REMINDER]: '🔔',
    [NOTIFICATION_TYPES.INFO]: 'ℹ️',
  };

  const categoryIcons = {
    request: '⚠️',
    approved: '✅',
    rejected: '❌',
    default: typeIcons[type] || '📩',
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatMessage = (rawMessage) => {
    if (!rawMessage) return '';

    if (normalizedMessage.includes('booking request')) {
      return rawMessage.replace(
        /\sfor\s([0-9a-f]{24}|[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})(?=\s(on|at)\b)/gi,
        ''
      );
    }

    return rawMessage;
  };

  return (
    <div
      className={`notification-item notification-item-${notificationCategory} ${isRead ? 'read' : 'unread'}`}
      id={`notification-${id}`}
    >
      <div className="notification-icon">
        {categoryIcons[notificationCategory]}
      </div>
      <div className="notification-content">
        <p className="notification-message">{formatMessage(message)}</p>
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
