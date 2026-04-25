import { HiOutlineCalendar, HiOutlineClock, HiOutlineUsers, HiOutlineLocationMarker } from 'react-icons/hi';

/**
 * Individual booking card displaying booking details and actions.
 */
export default function BookingCard({ booking, onCancel, onEdit, onApprove, onReject, isAdmin, processingBookingId, onShowQr }) {
  const statusConfig = {
    PENDING: { label: 'Pending', className: 'status-pending' },
    APPROVED: { label: 'Approved', className: 'status-approved' },
    REJECTED: { label: 'Rejected', className: 'status-rejected' },
    CANCELLED: { label: 'Cancelled', className: 'status-cancelled' },
  };

  const status = statusConfig[booking.status] || statusConfig.PENDING;
  const isProcessingThisBooking = processingBookingId === booking.id;
  const displayResource = booking.resourceName || booking.resourceId;
  const attendeeCount = booking.attendees?.length || 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatCreatedAt = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <article className={`booking-card booking-card-modern ${status.className} ${isAdmin ? 'booking-card-admin' : 'booking-card-user'}`} id={`booking-${booking.id}`}>
      <div className="booking-card-header">
        <div className="booking-resource">
          <HiOutlineLocationMarker size={18} />
          <span className="resource-id">{displayResource}</span>
        </div>
        <span className={`booking-status-badge ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="booking-card-body">
        <div className="booking-meta-grid">
          <div className="booking-meta-item">
            <HiOutlineCalendar size={16} />
            <div>
              <span className="booking-meta-label">Date</span>
              <span className="booking-meta-value">{formatDate(booking.date)}</span>
            </div>
          </div>

          <div className="booking-meta-item">
            <HiOutlineClock size={16} />
            <div>
              <span className="booking-meta-label">Time</span>
              <span className="booking-meta-value">{formatTime(booking.startTime)} — {formatTime(booking.endTime)}</span>
            </div>
          </div>

          <div className="booking-meta-item">
            <HiOutlineUsers size={16} />
            <div>
              <span className="booking-meta-label">Attendees</span>
              <span className="booking-meta-value">{attendeeCount} attendee(s)</span>
            </div>
          </div>
        </div>

        <div className="booking-purpose-block">
          <span className="booking-meta-label">Purpose</span>
          <p className="booking-purpose">{booking.purpose || 'No purpose provided.'}</p>
        </div>

        {(booking.resourceLocation || isAdmin) && (
          <div className="booking-context-grid">
            {booking.resourceLocation && (
              <p className="booking-requester">
                Location: <strong>{booking.resourceLocation}</strong>
              </p>
            )}
            {isAdmin && (
              <p className="booking-requester">
                Requested by: <strong>{booking.userName || booking.userId || 'Unknown user'}</strong>
              </p>
            )}
          </div>
        )}

        {booking.adminReason && (
          <p className="booking-admin-reason">Decision reason: {booking.adminReason}</p>
        )}
      </div>

      <div className="booking-card-footer">
        <span className="booking-created">Created {formatCreatedAt(booking.createdAt)}</span>
        <div className="booking-actions">
          {/* Admin actions: approve/reject pending bookings */}
          {isAdmin && booking.status === 'PENDING' && (
            <>
              <button
                className="btn btn-approve"
                onClick={() => onApprove(booking.id)}
                id={`approve-${booking.id}`}
                disabled={isProcessingThisBooking}
              >
                {isProcessingThisBooking ? 'Approving...' : 'Approve'}
              </button>
              <button
                className="btn btn-reject"
                onClick={() => onReject(booking.id)}
                id={`reject-${booking.id}`}
                disabled={isProcessingThisBooking}
              >
                Reject
              </button>
            </>
          )}

          {/* User actions: cancel own pending/approved bookings */}
          {!isAdmin && (booking.status === 'PENDING' || booking.status === 'APPROVED') && (
            <>
              {booking.status === 'APPROVED' && typeof onShowQr === 'function' && (
                <button
                  className="btn btn-secondary"
                  onClick={() => onShowQr(booking)}
                  id={`show-qr-${booking.id}`}
                >
                  Show QR Code
                </button>
              )}
              <button
                className="btn btn-edit-booking"
                onClick={() => onEdit(booking)}
                id={`edit-${booking.id}`}
              >
                Edit
              </button>
              <button
                className="btn btn-cancel-booking"
                onClick={() => onCancel(booking.id)}
                id={`cancel-${booking.id}`}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
