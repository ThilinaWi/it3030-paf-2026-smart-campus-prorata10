import { Link, useLocation } from 'react-router-dom';
import { HiOutlineHome, HiOutlineLogout, HiOutlineBell } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import NotificationPanel from './NotificationPanel';

/**
 * Top navigation bar with user info, navigation links, and notification bell.
 */
export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        {/* Logo / Brand */}
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">🏫</span>
          <span className="brand-text">Smart Campus</span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            id="nav-dashboard"
          >
            <HiOutlineHome size={18} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/notifications"
            className={`nav-link ${location.pathname === '/notifications' ? 'active' : ''}`}
            id="nav-notifications"
          >
            <HiOutlineBell size={18} />
            <span>Notifications</span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          <NotificationPanel />

          <div className="user-menu">
            {user?.profilePicture && (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="user-avatar"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>

          <button className="logout-btn" onClick={logout} id="logout-btn" title="Logout">
            <HiOutlineLogout size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
