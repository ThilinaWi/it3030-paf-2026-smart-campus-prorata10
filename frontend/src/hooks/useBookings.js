import { useState, useEffect, useCallback } from 'react';
import bookingService from '../services/bookingService';

/**
 * Custom hook for managing bookings state.
 * @param {boolean} isAdmin - Whether to fetch all bookings (admin mode)
 * @param {string} adminStatusFilter - Optional status filter for admin bookings
 * @returns {{ bookings, loading, error, refresh, createBooking, cancelBooking, updateStatus }}
 */
export function useBookings(isAdmin = false, adminStatusFilter = 'ALL') {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = isAdmin
        ? await bookingService.getAllBookings(adminStatusFilter)
        : await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, adminStatusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = useCallback(async (bookingData) => {
    const newBooking = await bookingService.createBooking(bookingData);
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  }, []);

  const updateBooking = useCallback(async (id, bookingData) => {
    const updated = await bookingService.updateBooking(id, bookingData);
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? updated : b))
    );
    return updated;
  }, []);

  const cancelBooking = useCallback(async (id) => {
    const updated = await bookingService.cancelBooking(id);
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? updated : b))
    );
    return updated;
  }, []);

  const updateStatus = useCallback(async (id, status, reason) => {
    const updated = await bookingService.updateBookingStatus(id, status, reason);
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? updated : b))
    );
    return updated;
  }, []);

  return {
    bookings,
    loading,
    error,
    refresh: fetchBookings,
    createBooking,
    updateBooking,
    cancelBooking,
    updateStatus,
  };
}
