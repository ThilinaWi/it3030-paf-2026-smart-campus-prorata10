import { useEffect, useState } from 'react';
import IncidentUpdateList from './IncidentUpdateList';
import IncidentTimeline from './IncidentTimeline';

const STATUS_CLASS_MAP = {
  OPEN: 'incident-status-open',
  ASSIGNED: 'incident-status-assigned',
  IN_PROGRESS: 'incident-status-in-progress',
  RESOLVED: 'incident-status-resolved',
  CLOSED: 'incident-status-closed',
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
  const isTechnician = currentRole === 'TECHNICIAN';
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

  return (
    <div className="incident-detail-card">
      <div className="modal-header">
        <h2>{incident.title}</h2>
      </div>

      <div className="booking-form">
        <div className="detail-grid incident-detail-grid">
          <div>
            <p className="detail-label">Status</p>
            <span className={`booking-status-badge ${STATUS_CLASS_MAP[incident.status] || 'incident-status-open'}`}>
              {incident.status}
            </span>
          </div>
          <div>
            <p className="detail-label">Priority</p>
            <p className="detail-value">{incident.priority}</p>
          </div>
          <div>
            <p className="detail-label">Category</p>
            <p className="detail-value">{incident.category}</p>
          </div>
          <div>
            <p className="detail-label">Created</p>
            <p className="detail-value">{new Date(incident.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="detail-label">Assigned to</p>
            <p className="detail-value">{incident.technicianName || 'Unassigned'}</p>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <p className="booking-purpose">{incident.description}</p>
        </div>

        <div className="form-group">
          <label>Attachments</label>
          {incident.attachments?.length ? (
            <div className="incident-attachment-list">
              {incident.attachments.map((path, index) => {
                const fileUrl = `http://localhost:8080${path}`;
                const fileName = getFileNameFromPath(path);
                const isImage = isImageAttachment(path);

                return (
                  <div className="incident-attachment-row" key={path || `${fileName}-${index}`}>
                    <span className="incident-attachment-name" title={fileName}>{fileName}</span>
                    <div className="incident-attachment-actions">
                      {isImage && (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary"
                        >
                          Preview
                        </a>
                      )}
                      <a
                        href={fileUrl}
                        download={fileName}
                        onClick={(e) => {
                          e.preventDefault();
                          onDownloadAttachment?.(path);
                        }}
                        className="btn btn-primary"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="detail-value">No attachments</p>
          )}
        </div>

        <div className="form-group">
          <label>Technician Updates</label>
          <IncidentUpdateList updates={updates} />
        </div>

        <div className="form-group">
          <label>Activity Timeline</label>
          <IncidentTimeline history={incident.history || []} />
        </div>

        {canUpdateStatus && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="incident-status-update">Update Status</label>
                <select
                  id="incident-status-update"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={statusSubmitting || allowedNextStatuses.length === 0}
                >
                  {allowedNextStatuses.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ justifyContent: 'flex-end', display: 'flex', alignItems: 'flex-end' }}>
                <button
                  className="btn btn-primary"
                  disabled={statusSubmitting || !status || allowedNextStatuses.length === 0}
                  onClick={() => onStatusSubmit(status)}
                  type="button"
                >
                  {statusSubmitting ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="incident-tech-update">Add Update Message</label>
              <textarea
                id="incident-tech-update"
                rows={3}
                placeholder="Write progress note"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button
                className="btn btn-primary"
                type="button"
                disabled={updateSubmitting || !message.trim()}
                onClick={() => {
                  onUpdateSubmit(message.trim());
                  setMessage('');
                }}
              >
                {updateSubmitting ? 'Sending...' : 'Add Update'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
