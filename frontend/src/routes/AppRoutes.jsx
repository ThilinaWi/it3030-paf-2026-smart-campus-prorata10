import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import NotificationsPage from '../pages/NotificationsPage';
import BookingsPage from '../pages/BookingsPage';
import AdminBookingsPage from '../pages/AdminBookingsPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import ResourceList from '../components/resources/ResourceList';
import ResourceDetail from '../components/resources/ResourceDetail';
import ResourceForm from '../components/resources/ResourceForm';

/**
 * Application route definitions.
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute allowedRoles={['USER', 'TECHNICIAN']}>
            <BookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute>
            <ResourceList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources/:id"
        element={
          <ProtectedRoute>
            <ResourceDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources/create"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ResourceForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources/edit/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ResourceForm />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
