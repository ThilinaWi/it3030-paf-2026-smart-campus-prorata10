import { Link } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineExclamationCircle, HiOutlineUser } from 'react-icons/hi';

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

export default function IncidentCard({
  incident,
  showRequestedUser = false,
  requestedUserName,
  showAssignee = false,
  showAssignControls = false,
  technicians = [],
  selectedTechnicianId = '',
  onTechnicianChange,
  onAssign,
  assigning = false,
  showOwnerActions = false,
  onEdit,
  onDelete,
  actionLoading = false,
}) {
  const canAssignTechnician = showAssignControls && incident.status === 'OPEN';
  const canOwnerModify = showOwnerActions && incident.status === 'OPEN';

  return (
    <div className="incident-card">
      <div className="booking-card-header">
        <div className="booking-resource">
          <HiOutlineExclamationCircle size={18} />
          <span className="resource-id">{incident.title}</span>
        </div>
        <span className={`booking-status-badge ${STATUS_CLASS_MAP[incident.status] || 'incident-status-open'}`}>
          {incident.status}
        </span>
      </div>

      <div className="booking-card-body">
        <div className="booking-time">
          <HiOutlineCalendar size={16} />
          <span>{new Date(incident.createdAt).toLocaleString()}</span>
        </div>

        <div className="incident-badge-row">
          <span className="incident-category-chip">{incident.category}</span>
          <span className={`incident-priority-chip ${PRIORITY_CLASS_MAP[incident.priority] || 'incident-priority-low'}`}>
            {incident.priority}
          </span>
        </div>

        <p className="booking-purpose">{incident.description}</p>

        {showRequestedUser && (
          <p className="booking-requester">
            <HiOutlineUser size={14} /> Requested by: <strong>{requestedUserName || incident.userId}</strong>
          </p>
        )}

        {showAssignee && (
          <p className="booking-requester">
            <HiOutlineUser size={14} /> Assigned to: <strong>{incident.technicianName || 'Unassigned'}</strong>
          </p>
        )}
      </div>

      <div className="booking-card-footer">
        <div className="booking-actions">
          <Link className="btn btn-secondary" to={`/incidents/${incident.id}`}>
            View Details
          </Link>
          {canOwnerModify && (
            <>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => onEdit?.(incident)}
                disabled={actionLoading}
              >
                Edit
              </button>
              <button
                className="btn btn-delete"
                type="button"
                onClick={() => onDelete?.(incident)}
                disabled={actionLoading}
              >
                Delete
              </button>
            </>
          )}
        </div>

        {canAssignTechnician && (
          <div className="incident-assign-inline">
            <select
              className="role-select"
              value={selectedTechnicianId}
              onChange={(e) => onTechnicianChange?.(incident.id, e.target.value)}
            >
              <option value="">Select technician</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name || tech.email}
                </option>
              ))}
            </select>
            <button
              className="btn btn-primary"
              disabled={!selectedTechnicianId || assigning}
              onClick={() => onAssign?.(incident.id, selectedTechnicianId)}
            >
              {assigning ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
