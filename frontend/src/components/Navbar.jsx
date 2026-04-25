import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiOutlineChevronDown,
  HiOutlineCog,
} from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import NotificationPanel from './NotificationPanel';



/**
 * Minimal top navbar with logo/user and a dedicated left sidebar for navigation...
 */
export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const closeSidebar = () => setIsSidebarOpen(false);

  const dashboardPath = user?.role === 'ADMIN'
    ? '/dashboard/admin'
    : user?.role === 'TECHNICIAN'
      ? '/dashboard/technician'
      : '/dashboard/user';

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const onPointerDown = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

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

            <Link to={dashboardPath} className="navbar-brand" onClick={closeSidebar}>
              <span className="brand-icon">🏫</span>
              <span className="brand-text">Smart Campus</span>
            </Link>
          </div>

          <div className="navbar-right">
            <NotificationPanel />
            <div className="user-menu" title={user?.name || 'Logged in user'} ref={profileMenuRef}>
              <button
                type="button"
                className="user-menu-trigger"
                onClick={() => setIsProfileMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
              >
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
                <HiOutlineChevronDown size={16} className={`user-menu-chevron ${isProfileMenuOpen ? 'open' : ''}`} />
              </button>

              {isProfileMenuOpen && (
                <div className="user-profile-dropdown" role="menu">
                  <Link
                    to="/settings/notifications"
                    className="user-profile-menu-item"
                    onClick={() => setIsProfileMenuOpen(false)}
                    role="menuitem"
                  >
                    <HiOutlineCog size={16} />
                    <span>Settings</span>
                  </Link>
                  <button
                    type="button"
                    className="user-profile-menu-item"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                    role="menuitem"
                  >
                    <HiOutlineLogout size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {isSidebarOpen && <button className="sidebar-backdrop" onClick={closeSidebar} aria-label="Close sidebar" />}

      <aside className={`app-sidebar ${isSidebarOpen ? 'open' : ''}`} id="app-sidebar">
        <div className="navbar-links" id="navbar-links">
          <Link
            to={dashboardPath}
            className={`nav-link ${location.pathname.startsWith('/dashboard') ? 'active' : ''}`}
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
