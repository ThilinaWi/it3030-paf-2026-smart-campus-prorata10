import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineUserCircle,
  HiOutlineLogout,
} from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import NotificationPanel from './NotificationPanel';

/**
 * Minimal top navbar with logo/user and a dedicated left sidebar for navigation.
 */
export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) return null;

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <nav className="navbar" id="main-navbar">
        <div className="navbar-container">
          <div className="navbar-top-row">
            <button
              type="button"
              className="navbar-mobile-toggle"
              onClick={() => setIsSidebarOpen((open) => !open)}
              aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isSidebarOpen}
              aria-controls="app-sidebar"
            >
              {isSidebarOpen ? <HiOutlineX size={20} /> : <HiOutlineMenu size={20} />}
            </button>

            <Link to="/dashboard" className="navbar-brand" onClick={closeSidebar}>
              <span className="brand-icon">🏫</span>
              <span className="brand-text">Smart Campus</span>
            </Link>
          </div>

          <div className="navbar-right">
            <NotificationPanel />
            <div className="user-menu" title={user?.name || 'Logged in user'}>
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="user-avatar"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="user-avatar-fallback" aria-hidden="true">
                  <HiOutlineUserCircle size={22} />
                </span>
              )}
              <div className="user-info">
                <span className="user-name">{user?.name || 'User'}</span>
                <span className="user-role">{user?.role || 'USER'}</span>
              </div>
            </div>
            <button
              type="button"
              className="logout-btn"
              onClick={logout}
              id="logout-btn"
              title="Logout"
              aria-label="Logout"
            >
              <HiOutlineLogout size={18} />
            </button>
          </div>
        </div>
      </nav>

      {isSidebarOpen && <button className="sidebar-backdrop" onClick={closeSidebar} aria-label="Close sidebar" />}

      <aside className={`app-sidebar ${isSidebarOpen ? 'open' : ''}`} id="app-sidebar">
        <div className="navbar-links" id="navbar-links">
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            id="nav-dashboard"
            onClick={closeSidebar}
          >
            <span>Dashboard</span>
          </Link>
          {user?.role !== 'ADMIN' && (
            <Link
              to="/bookings"
              className={`nav-link ${location.pathname === '/bookings' ? 'active' : ''}`}
              id="nav-bookings"
              onClick={closeSidebar}
            >
              <span>Bookings</span>
            </Link>
          )}
          {user?.role === 'USER' && (
            <>
              <Link
                to="/incidents/my"
                className={`nav-link ${location.pathname === '/incidents/my' ? 'active' : ''}`}
                id="nav-my-incidents"
                onClick={closeSidebar}
              >
                <span>My Incidents</span>
              </Link>
              <Link
                to="/incidents/create"
                className={`nav-link ${location.pathname === '/incidents/create' ? 'active' : ''}`}
                id="nav-create-incident"
                onClick={closeSidebar}
              >
                <span>Create Incident</span>
              </Link>
            </>
          )}
          {user?.role === 'TECHNICIAN' && (
            <Link
              to="/incidents/assigned"
              className={`nav-link ${location.pathname === '/incidents/assigned' ? 'active' : ''}`}
              id="nav-assigned-incidents"
              onClick={closeSidebar}
            >
              <span>Assigned Incidents</span>
            </Link>
          )}
          <Link
            to="/resources"
            className={`nav-link ${location.pathname.startsWith('/resources') ? 'active' : ''}`}
            id="nav-resources"
            onClick={closeSidebar}
          >
            <span>Resource</span>
          </Link>
          {user?.role === 'ADMIN' && (
            <>
              <Link
                to="/admin/bookings"
                className={`nav-link nav-link-admin ${location.pathname === '/admin/bookings' ? 'active' : ''}`}
                id="nav-admin-bookings"
                onClick={closeSidebar}
              >
                <span>Admin Bookings</span>
              </Link>
              <Link
                to="/incidents/admin"
                className={`nav-link nav-link-admin ${location.pathname === '/incidents/admin' ? 'active' : ''}`}
                id="nav-admin-incidents"
                onClick={closeSidebar}
              >
                <span>Admin Incidents</span>
              </Link>
              <Link
                to="/admin/users"
                className={`nav-link nav-link-admin ${location.pathname === '/admin/users' ? 'active' : ''}`}
                id="nav-admin-users"
                onClick={closeSidebar}
              >
                <span>Access Control</span>
              </Link>
            </>
          )}
        </div>

      </aside>
    </>
  );
}
