import { useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import BookingCard from '../components/BookingCard';
import { HiOutlineCalendar, HiOutlineRefresh, HiOutlineX } from 'react-icons/hi';

/**
 * Admin bookings management page — view all bookings and approve/reject.
 */
export default function AdminBookingsPage() {
  const { bookings, loading, error, refresh, updateStatus } = useBookings(true);
  const [successMsg, setSuccessMsg] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const handleApprove = async (id) => {
    try {
      await updateStatus(id, 'APPROVED');
      setSuccessMsg('Booking approved successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to approve booking:', err);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this booking?')) return;
    try {
      await updateStatus(id, 'REJECTED');
      setSuccessMsg('Booking rejected.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to reject booking:', err);
    }
  };

  const filteredBookings = filter === 'ALL'
    ? bookings
    : bookings.filter((b) => b.status === filter);

  const statusCounts = {
    ALL: bookings.length,
    PENDING: bookings.filter((b) => b.status === 'PENDING').length,
    APPROVED: bookings.filter((b) => b.status === 'APPROVED').length,
    REJECTED: bookings.filter((b) => b.status === 'REJECTED').length,
    CANCELLED: bookings.filter((b) => b.status === 'CANCELLED').length,
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
        ) : filteredBookings.length === 0 ? (
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
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onApprove={handleApprove}
                onReject={handleReject}
                isAdmin={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
