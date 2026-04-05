import { useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import BookingForm from '../components/BookingForm';
import BookingCard from '../components/BookingCard';
import { HiOutlineCalendar, HiOutlinePlus, HiOutlineRefresh, HiOutlineX } from 'react-icons/hi';

/**
 * Bookings page — shows user's bookings and allows creating new ones.
 */
export default function BookingsPage() {
  const { bookings, loading, error, refresh, createBooking, updateBooking, cancelBooking } = useBookings(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);

  const handleSaveBooking = async (bookingData) => {
    try {
      setSubmitting(true);
      setFormError(null);
      if (editingBooking) {
        await updateBooking(editingBooking.id, bookingData);
      } else {
        await createBooking(bookingData);
      }
      setShowForm(false);
      setEditingBooking(null);
      setSuccessMsg(editingBooking
        ? 'Booking updated successfully.'
        : 'Booking created successfully! It is pending approval.');
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save booking';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBooking(null);
    setFormError(null);
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(id);
      setSuccessMsg('Booking cancelled successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    }
  };

  return (
    <div className="bookings-page" id="bookings-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <HiOutlineCalendar size={28} />
            My Bookings
          </h1>
          {bookings.length > 0 && (
            <span className="unread-badge">{bookings.length} total</span>
          )}
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={refresh} id="refresh-bookings-btn">
            <HiOutlineRefresh size={18} />
            Refresh
          </button>
          <button
            className="btn btn-primary"
            onClick={() => { setEditingBooking(null); setShowForm(true); setFormError(null); }}
            id="new-booking-btn"
          >
            <HiOutlinePlus size={18} />
            New Booking
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="alert alert-success" id="booking-success-msg">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)}><HiOutlineX size={16} /></button>
        </div>
      )}

      {/* Booking Form Modal */}
      {showForm && (
        <div className="booking-form-overlay" id="booking-form-overlay">
          <div className="booking-form-modal">
            <div className="modal-header">
              <h2>{editingBooking ? 'Edit Booking' : 'New Booking'}</h2>
              <button className="modal-close" onClick={closeForm}>
                <HiOutlineX size={20} />
              </button>
            </div>
            {formError && (
              <div className="alert alert-error">
                <span>{formError}</span>
              </div>
            )}
            <BookingForm
              onSubmit={handleSaveBooking}
              onCancel={closeForm}
              loading={submitting}
              initialValues={editingBooking}
              mode={editingBooking ? 'update' : 'create'}
            />
          </div>
        </div>
      )}

      {/* Bookings List */}
      <div className="bookings-list">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={refresh}>Try Again</button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-state" id="no-bookings">
            <HiOutlineCalendar size={48} />
            <h3>No bookings yet</h3>
            <p>Create your first booking to reserve a room, lab, or equipment.</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
              style={{ marginTop: '1rem' }}
            >
              <HiOutlinePlus size={18} />
              Create Booking
            </button>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancel}
                onEdit={handleEdit}
                isAdmin={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
