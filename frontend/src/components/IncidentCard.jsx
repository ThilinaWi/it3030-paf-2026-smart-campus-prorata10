import { Link } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineExclamationCircle, HiOutlineUser } from 'react-icons/hi';

// Maps each incident status to a CSS class for styling
const STATUS_CLASS_MAP = {
  OPEN: 'incident-status-open',
  ASSIGNED: 'incident-status-assigned',
  IN_PROGRESS: 'incident-status-in-progress',
  RESOLVED: 'incident-status-resolved',
  CLOSED: 'incident-status-closed',
};

// Maps each priority level to a CSS class for styling
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
  // Get CSS class based on incident status
  const statusClass = STATUS_CLASS_MAP[incident.status] || 'incident-status-open';

  // Admin can assign technician only when the incident is still OPEN
  const canAssignTechnician = showAssignControls && incident.status === 'OPEN';

  // User can edit/delete only their own OPEN incidents
  const canOwnerModify = showOwnerActions && incident.status === 'OPEN';

  // Different card style depending on user/staff view
  const cardModeClass = canOwnerModify ? 'incident-card-user' : 'incident-card-staff';

  return (
    <div className={`incident-card incident-card-modern ${statusClass} ${cardModeClass}`}>
      <div className="booking-card-header">
        <div className="booking-resource">
          <HiOutlineExclamationCircle size={18} />
          <span className="resource-id">{incident.title}</span>
        </div>

        {/* Shows current incident status */}
        <span className={`booking-status-badge ${statusClass}`}>
          {incident.status}
        </span>
      </div>

      <div className="booking-card-body">
        {/* Shows incident created date/time */}
        <div className="booking-time">
          <HiOutlineCalendar size={16} />
          <span>{new Date(incident.createdAt).toLocaleString()}</span>
        </div>

        {/* Shows category and priority */}
        <div className="incident-badge-row">
          <span className="incident-category-chip">{incident.category}</span>
          <span className={`incident-priority-chip ${PRIORITY_CLASS_MAP[incident.priority] || 'incident-priority-low'}`}>
            {incident.priority}
          </span>
        </div>

        {/* Shows incident description */}
        <p className="booking-purpose">{incident.description}</p>

        {/* Shows requester name/id when admin or staff needs to see who reported it */}
        {showRequestedUser && (
          <p className="booking-requester">
            <HiOutlineUser size={14} /> Requested by: <strong>{requestedUserName || incident.userId}</strong>
          </p>
        )}

        {/* Shows assigned technician name */}
        {showAssignee && (
          <p className="booking-requester">
            <HiOutlineUser size={14} /> Assigned to: <strong>{incident.technicianName || 'Unassigned'}</strong>
          </p>
        )}
      </div>

      <div className="booking-card-footer">
        <div className="booking-actions">
          {/* Opens full incident detail page */}
          <Link className="btn btn-secondary" to={`/incidents/${incident.id}`}>
            View Details
          </Link>

          {/* Owner actions are shown only for OPEN incidents */}
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

        {/* Admin inline assignment section */}
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

            {/* Assign button calls parent function with incident id and technician id */}
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