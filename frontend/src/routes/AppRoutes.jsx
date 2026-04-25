import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import NotificationsPage from '../pages/NotificationsPage';
import SettingsPage from '../pages/SettingsPage';
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

// This component redirects users to their respective dashboard based on role
function RoleDashboardRedirect() {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (user?.role === 'TECHNICIAN') {
    return <Navigate to="/dashboard/technician" replace />;
  }

  // Default: normal user
  return <Navigate to="/dashboard/user" replace />;
}

/**
 * Main application routing configuration
 */
export default function AppRoutes() {
  return (
    <Routes>

      {/* ---------- Public Routes (No login required) ---------- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* ---------- Dashboard Routing (Auto redirect based on role) ---------- */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleDashboardRedirect />
          </ProtectedRoute>
        }
      />

      {/* ---------- Role-based Dashboards ---------- */}
      <Route
        path="/dashboard/user"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/technician"
        element={
          <ProtectedRoute allowedRoles={['TECHNICIAN']}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* ---------- Notifications & Settings ---------- */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/notifications"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/profile"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/security"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Redirect /settings → default tab */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Navigate to="/settings/notifications" replace />
          </ProtectedRoute>
        }
      />

      {/* ---------- Booking Module ---------- */}
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

      {/* ---------- Admin User Management ---------- */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />

      {/* ---------- Incident Module ---------- */}

      {/* Create incident (User only) */}
      <Route
        path="/incidents/create"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <CreateIncidentPage />
          </ProtectedRoute>
        }
      />

      {/* User's own incidents */}
      <Route
        path="/incidents/my"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <MyIncidentsPage />
          </ProtectedRoute>
        }
      />

      {/* Admin view all incidents */}
      <Route
        path="/incidents/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminIncidentsPage />
          </ProtectedRoute>
        }
      />

      {/* Technician assigned incidents */}
      <Route
        path="/incidents/assigned"
        element={
          <ProtectedRoute allowedRoles={['TECHNICIAN']}>
            <TechnicianIncidentsPage />
          </ProtectedRoute>
        }
      />

      {/* View incident details (All roles) */}
      <Route
        path="/incidents/:id"
        element={
          <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}>
            <IncidentDetailPage />
          </ProtectedRoute>
        }
      />

      {/* ---------- Resource Module ---------- */}
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

      {/* Admin-only resource management */}
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

      {/* ---------- Default Redirects ---------- */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  );
}