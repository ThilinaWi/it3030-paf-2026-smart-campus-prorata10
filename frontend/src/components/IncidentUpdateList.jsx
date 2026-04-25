import { HiOutlineChatAlt2 } from 'react-icons/hi';

export default function IncidentUpdateList({ updates }) {
  const formatDate = (value) => {
    if (!value) return 'Date unavailable';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Date unavailable';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).replace(',', ' -');
  };

  if (!updates || updates.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '1.5rem' }}>
        <HiOutlineChatAlt2 size={28} />
        <p>No technician updates yet.</p>
      </div>
    );
  }

  return (
    <div className="incident-updates-list">
      {updates.map((update, index) => (
        <div className="incident-update-item" key={update.id || `${update.technicianId || 'tech'}-${update.createdAt || index}`}>
          <div className="incident-update-meta">
            <span className="incident-update-author">{update.technicianName || update.technicianId || 'Technician'}</span>
            <span className="incident-update-time">
              {formatDate(update.createdAt)}
            </span>
          </div>
          <p>"{update.message}"</p>
        </div>
      ))}
    </div>
  );
}
