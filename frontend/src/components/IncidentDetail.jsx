import { useEffect, useState } from 'react';
import {
  HiOutlineExclamation,
  HiOutlineTag,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlinePaperClip,
  HiOutlineEye,
  HiOutlineDownload,
} from 'react-icons/hi';
import IncidentUpdateList from './IncidentUpdateList';
import IncidentTimeline from './IncidentTimeline';

const STATUS_CLASS_MAP = {
  OPEN: 'incident-status-open',
  ASSIGNED: 'incident-status-assigned',
  IN_PROGRESS: 'incident-status-in-progress',
  RESOLVED: 'incident-status-resolved',
  CLOSED: 'incident-status-closed',
};

const PRIORITY_CLASS_MAP = {
  HIGH: 'incident-priority-high',
  MEDIUM: 'incident-priority-medium',
  LOW: 'incident-priority-low',
};

const getAllowedNextStatuses = (currentStatus, currentRole) => {
  if (currentRole === 'TECHNICIAN') {
    if (currentStatus === 'ASSIGNED') return ['IN_PROGRESS'];
    if (currentStatus === 'IN_PROGRESS') return ['RESOLVED'];
    return [];
  }

  if (currentRole === 'ADMIN') {
    if (currentStatus === 'RESOLVED') return ['CLOSED'];
    return [];
  }

  return [];
};

const getResolutionTime = (createdAt, resolvedAt) => {
  if (!createdAt || !resolvedAt) return null;

  const diffMs = new Date(resolvedAt) - new Date(createdAt);
  if (diffMs < 0) return null;

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

const formatDateTimeDetail = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  const datePart = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return `${datePart} • ${timePart}`;
};

const formatMinutesCompact = (minutes) => {
  if (minutes == null || Number.isNaN(minutes) || minutes < 0) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${hours}h ${remainder}m`;
};

export default function IncidentDetail({
  incident,
  updates,
  currentRole,
  statusSubmitting,
  updateSubmitting,
  onStatusSubmit,
  onUpdateSubmit,
  onDownloadAttachment,
}) {
  const allowedNextStatuses = getAllowedNextStatuses(incident?.status, currentRole);
  const [status, setStatus] = useState(allowedNextStatuses[0] || incident?.status || 'OPEN');
  const [message, setMessage] = useState('');
  const canUpdateStatus = currentRole !== 'USER' && allowedNextStatuses.length > 0;

  const getFileNameFromPath = (path) => {
    if (!path) return 'Attachment';
    const lastSegment = path.split('/').pop() || path;
    const normalized = decodeURIComponent(lastSegment);
    const underscoreIndex = normalized.indexOf('_');
    return underscoreIndex > -1 ? normalized.substring(underscoreIndex + 1) : normalized;
  };

  const isImageAttachment = (path) => {
    const lower = (path || '').toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'].some((ext) => lower.endsWith(ext));
  };

  useEffect(() => {
    setStatus(allowedNextStatuses[0] || incident?.status || 'OPEN');
  }, [incident?.status, currentRole]);

  if (!incident) return null;

  const resolutionDuration =
    formatMinutesCompact(incident.timeToResolutionMinutes) ||
    getResolutionTime(incident.createdAt, incident.resolvedAt);
  const firstResponseDuration = formatMinutesCompact(incident.timeToFirstResponseMinutes);

  return (
    <div className="id-page">
      {/* ── Header ── */}
      <div className="id-header">
        <div className="id-header-top">
          <h1 className="id-title">{incident.title}</h1>
          <span className={`booking-status-badge ${STATUS_CLASS_MAP[incident.status] || 'incident-status-open'}`}>
            {incident.status?.replace('_', ' ')}
          </span>
        </div>
        <div className="id-meta-row">
          <span className="id-meta-item">
            <HiOutlineCalendar size={14} />
            {new Date(incident.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="id-meta-item">
            <HiOutlineUser size={14} />
            {incident.technicianName || 'Unassigned'}
          </span>
        </div>
      </div>

      {/* ── Info Cards Row ── */}
      <div className="id-info-grid">
        <div className="id-info-card">
          <div className="id-info-icon" style={{ background: 'var(--primary-bg)', color: 'var(--primary)' }}>
            <HiOutlineExclamation size={18} />
          </div>
          <div>
            <div className="id-info-label">Priority</div>
            <span className={`incident-priority-chip ${PRIORITY_CLASS_MAP[incident.priority] || ''}`}>
              {incident.priority}
            </span>
          </div>
        </div>
        <div className="id-info-card">
          <div className="id-info-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
            <HiOutlineTag size={18} />
          </div>
          <div>
            <div className="id-info-label">Category</div>
            <div className="id-info-value">{incident.category}</div>
          </div>
        </div>
        <div className="id-info-card">
          <div className="id-info-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
            <HiOutlineUser size={18} />
          </div>
          <div>
            <div className="id-info-label">Assigned To</div>
            <div className="id-info-value">{incident.technicianName || 'Unassigned'}</div>
          </div>
        </div>
      </div>

      {/* ── SLA / Resolution Time ── */}
      <div className="id-section id-sla-card">
        <h3 className="id-section-title">
          <HiOutlineClock size={16} />
          Resolution Time (SLA)
        </h3>
        <div className="id-sla-grid">
          <div className="id-sla-row">
            <span className="id-sla-label">Created:</span>
            <div className="id-sla-value-block">
              <span className="id-sla-value">{formatDateTimeDetail(incident.createdAt)}</span>
            </div>
          </div>

          <div className="id-sla-row">
            <span className="id-sla-label">First Response:</span>
            {incident.firstResponseAt ? (
              <div className="id-sla-value-block">
                <span className="id-sla-value">{formatDateTimeDetail(incident.firstResponseAt)}</span>
                <span className="id-sla-subvalue">Response Time: {firstResponseDuration || '-'}</span>
              </div>
            ) : (
              <span className="id-sla-value">-</span>
            )}
          </div>

          <div className="id-sla-row">
            <span className="id-sla-label">Resolution Time:</span>
            {incident.resolvedAt ? (
              <div className="id-sla-value-block">
                <span className="id-sla-value">{formatDateTimeDetail(incident.resolvedAt)}</span>
                <span className="id-sla-subvalue">Resolution Time: {resolutionDuration || '-'}</span>
              </div>
            ) : (
              <span className="id-sla-value">-</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Description ── */}
      <div className="id-section">
        <h3 className="id-section-title">
          <HiOutlineDocumentText size={16} />
          Description
        </h3>
        <div className="id-description">{incident.description}</div>
      </div>

      {/* ── Attachments ── */}
      <div className="id-section">
        <h3 className="id-section-title">
          <HiOutlinePaperClip size={16} />
          Attachments
          {incident.attachments?.length > 0 && (
            <span className="id-count-badge">{incident.attachments.length}</span>
          )}
        </h3>
        {incident.attachments?.length ? (
          <div className="id-attachments">
            {incident.attachments.map((path, index) => {
              const fileUrl = `http://localhost:8080${path}`;
              const fileName = getFileNameFromPath(path);
              const isImage = isImageAttachment(path);

              return (
                <div className="id-attachment" key={path || `${fileName}-${index}`}>
                  <div className="id-attachment-info">
                    <HiOutlinePaperClip size={14} />
                    <span className="id-attachment-name" title={fileName}>{fileName}</span>
                  </div>
                  <div className="id-attachment-actions">
                    {isImage && (
                      <a href={fileUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
                        <HiOutlineEye size={14} /> Preview
                      </a>
                    )}
                    <a
                      href={fileUrl}
                      download={fileName}
                      onClick={(e) => { e.preventDefault(); onDownloadAttachment?.(path); }}
                      className="btn btn-primary"
                    >
                      <HiOutlineDownload size={14} /> Download
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="id-empty-mini">No attachments</div>
        )}
      </div>

      {/* ── Technician Updates ── */}
      <div className="id-section">
        <h3 className="id-section-title">💬 Technician Updates</h3>
        <IncidentUpdateList updates={updates} />
      </div>

      {/* ── Activity Timeline ── */}
      <div className="id-section">
        <h3 className="id-section-title">📋 Activity Timeline</h3>
        <IncidentTimeline history={incident.history || []} />
      </div>

      {/* ── Actions (Technician / Admin) ── */}
      {canUpdateStatus && (
        <div className="id-section id-actions-section">
          <h3 className="id-section-title">⚡ Actions</h3>

          <div className="id-action-row">
            <div className="id-action-field">
              <label htmlFor="incident-status-update">Update Status</label>
              <select
                id="incident-status-update"
                className="id-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={statusSubmitting || allowedNextStatuses.length === 0}
              >
                {allowedNextStatuses.map((option) => (
                  <option key={option} value={option}>{option.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <button
              className="btn btn-primary"
              disabled={statusSubmitting || !status || allowedNextStatuses.length === 0}
              onClick={() => onStatusSubmit(status)}
              type="button"
            >
              {statusSubmitting ? 'Updating...' : 'Update Status'}
            </button>
          </div>

          <div className="id-update-form">
            <label htmlFor="incident-tech-update">Add Progress Note</label>
            <textarea
              id="incident-tech-update"
              className="id-textarea"
              rows={3}
              placeholder="Write a progress note or comment..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="id-update-btn-row">
              <button
                className="btn btn-primary"
                type="button"
                disabled={updateSubmitting || !message.trim()}
                onClick={() => { onUpdateSubmit(message.trim()); setMessage(''); }}
              >
                {updateSubmitting ? 'Sending...' : 'Add Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
