import { useEffect, useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import BookingCard from '../components/BookingCard';
import { HiOutlineCalendar, HiOutlineRefresh, HiOutlineX } from 'react-icons/hi';

/**
 * Admin bookings management page — view all bookings and approve/reject.
 */
export default function AdminBookingsPage() {
  const [successMsg, setSuccessMsg] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [processingBookingId, setProcessingBookingId] = useState(null);
  const [decisionModal, setDecisionModal] = useState({
    open: false,
    bookingId: null,
    reason: '',
    error: null,
  });
  const { bookings, loading, error, refresh, updateStatus } = useBookings(true, filter);

  useEffect(() => {
    const pollInterval = window.setInterval(() => {
      if (!decisionModal.open) {
        refresh({ silent: true });
      }
    }, 8000);

    const handleWindowFocus = () => {
      refresh({ silent: true });
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refresh({ silent: true });
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(pollInterval);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [decisionModal.open, refresh]);

  const openDecisionModal = (bookingId) => {
    setDecisionModal({
      open: true,
      bookingId,
      reason: '',
      error: null,
    });
  };

  const closeDecisionModal = () => {
    setDecisionModal({
      open: false,
      bookingId: null,
      reason: '',
      error: null,
    });
  };

  const handleApprove = async (bookingId) => {
    setProcessingBookingId(bookingId);
    try {
      await updateStatus(bookingId, 'APPROVED', null);
      await refresh({ silent: true });
      setSuccessMsg('Booking approved successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to approve booking.';
      setSuccessMsg(message);
      setTimeout(() => setSuccessMsg(null), 4000);
    } finally {
      setProcessingBookingId(null);
    }
  };

  const submitDecision = async () => {
    const { bookingId, reason } = decisionModal;
    if (!bookingId) return;

    if (!reason.trim()) {
      setDecisionModal((prev) => ({
        ...prev,
        error: 'Rejection reason is required.',
      }));
      return;
    }

    setProcessingBookingId(bookingId);
    try {
      await updateStatus(bookingId, 'REJECTED', reason.trim());
      await refresh({ silent: true });
      setSuccessMsg('Booking rejected.');
      setTimeout(() => setSuccessMsg(null), 4000);
      closeDecisionModal();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update booking decision.';
      setDecisionModal((prev) => ({
        ...prev,
        error: message,
      }));
    } finally {
      setProcessingBookingId(null);
    }
  };

  const statusCounts = {
    ALL: filter === 'ALL' ? bookings.length : '-',
    PENDING: filter === 'PENDING' ? bookings.length : '-',
    APPROVED: filter === 'APPROVED' ? bookings.length : '-',
    REJECTED: filter === 'REJECTED' ? bookings.length : '-',
    CANCELLED: filter === 'CANCELLED' ? bookings.length : '-',
  };

  return (
    <div className="bookings-page admin-bookings-page" id="admin-bookings-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <HiOutlineCalendar size={28} />
            Manage Bookings
          </h1>
          {statusCounts.PENDING > 0 && (
            <span className="unread-badge">{statusCounts.PENDING} pending</span>
          )}
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={refresh} id="refresh-admin-bookings-btn">
            <HiOutlineRefresh size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="alert alert-success" id="admin-success-msg">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)}><HiOutlineX size={16} /></button>
        </div>
      )}

      {decisionModal.open && (
        <div className="booking-form-overlay" id="admin-decision-modal-overlay">
          <div className="booking-form-modal" id="admin-decision-modal">
            <div className="modal-header">
              <h2>Reject Booking</h2>
              <button className="modal-close" onClick={closeDecisionModal}>
                <HiOutlineX size={20} />
              </button>
            </div>

            {decisionModal.error && (
              <div className="alert alert-error" style={{ margin: '1rem 1.25rem 0' }}>
                <span>{decisionModal.error}</span>
              </div>
            )}

            <div className="booking-form" style={{ paddingTop: '1rem' }}>
              <p style={{ color: 'var(--gray-600)', marginBottom: '0.25rem' }}>
                Add a reason for rejecting this booking.
              </p>
              <div className="form-group">
                <label htmlFor="admin-decision-reason">Decision Reason</label>
                <textarea
                  id="admin-decision-reason"
                  value={decisionModal.reason}
                  onChange={(e) => setDecisionModal((prev) => ({
                    ...prev,
                    reason: e.target.value,
                    error: null,
                  }))}
                  rows={3}
                  placeholder="Enter rejection reason (e.g., timeslot conflict, maintenance, policy limits)"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeDecisionModal}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-reject"
                  onClick={submitDecision}
                  disabled={processingBookingId === decisionModal.bookingId}
                >
                  {processingBookingId === decisionModal.bookingId ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="booking-filters" id="booking-filters">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map((status) => (
          <button
            key={status}
            className={`filter-tab ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
            <span className="filter-count">{statusCounts[status]}</span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="bookings-list">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading all bookings...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={refresh}>Try Again</button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-state" id="no-admin-bookings">
            <HiOutlineCalendar size={48} />
            <h3>No {filter !== 'ALL' ? filter.toLowerCase() : ''} bookings</h3>
            <p>
              {filter === 'PENDING'
                ? 'No bookings awaiting approval.'
                : 'No bookings found with this filter.'}
            </p>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onApprove={handleApprove}
                onReject={openDecisionModal}
                processingBookingId={processingBookingId}
                isAdmin={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
