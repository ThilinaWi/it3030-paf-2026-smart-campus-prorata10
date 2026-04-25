import {
  HiOutlineCheckCircle,
  HiOutlineChatAlt2,
  HiOutlineClipboardCheck,
  HiOutlineClipboardList,
  HiOutlineUserAdd,
} from 'react-icons/hi';

const ACTION_CONFIG = {
  CREATED: { icon: HiOutlineClipboardList, className: 'timeline-created', label: 'Created' },
  ASSIGNED: { icon: HiOutlineUserAdd, className: 'timeline-assigned', label: 'Assigned' },
  STATUS_CHANGED: { icon: HiOutlineClipboardCheck, className: 'timeline-status', label: 'Status Updated' },
  COMMENT_ADDED: { icon: HiOutlineChatAlt2, className: 'timeline-comment', label: 'Comment' },
  CLOSED: { icon: HiOutlineCheckCircle, className: 'timeline-closed', label: 'Closed' },
};

const formatDate = (value) => {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return date.toLocaleString();
};

const formatRole = (role) => {
  if (!role) return '';
  const upper = String(role).toUpperCase();
  if (upper === 'TECHNICIAN') return 'Technician';
  if (upper === 'ADMIN') return 'Admin';
  if (upper === 'USER') return 'User';
  if (upper === 'SYSTEM') return 'System';
  return 'Unknown';
};

export default function IncidentTimeline({ history = [] }) {
  if (!history.length) {
    return <p className="detail-value">No activity yet.</p>;
  }

  return (
    <div className="incident-timeline">
      {history.map((item, index) => {
        const config = ACTION_CONFIG[item.action] || ACTION_CONFIG.STATUS_CHANGED;
        const Icon = config.icon;
        const key = `${item.action || 'event'}-${item.createdAt || index}`;
        const actorName = item.performedByName || item.performedBy || 'System';
        const roleLabel = formatRole(item.performedByRole);

        return (
          <div className="timeline-item" key={key}>
            <div className={`timeline-icon ${config.className}`}>
              <Icon size={14} />
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <strong>{roleLabel ? `${actorName} (${roleLabel})` : actorName}</strong>
                <span className="timeline-label">{config.label}</span>
              </div>
              <p>{item.message}</p>
              <small>{formatDate(item.createdAt)}</small>
            </div>
          </div>
        );
      })}
    </div>
  );
}