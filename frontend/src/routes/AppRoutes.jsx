import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import NotificationsPage from '../pages/NotificationsPage';
import BookingsPage from '../pages/BookingsPage';
import AdminBookingsPage from '../pages/AdminBookingsPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import CreateIncidentPage from '../pages/CreateIncidentPage';
import MyIncidentsPage from '../pages/MyIncidentsPage';
import AdminIncidentsPage from '../pages/AdminIncidentsPage';
import TechnicianIncidentsPage from '../pages/TechnicianIncidentsPage';
import IncidentDetailPage from '../pages/IncidentDetailPage';
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
      <Route path="/" element={<HomePage />} />
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
        path="/incidents/create"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <CreateIncidentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/incidents/my"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <MyIncidentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/incidents/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminIncidentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/incidents/assigned"
        element={
          <ProtectedRoute allowedRoles={['TECHNICIAN']}>
            <TechnicianIncidentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/incidents/:id"
        element={
          <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}>
            <IncidentDetailPage />
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
