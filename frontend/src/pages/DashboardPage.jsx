import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { HiOutlineBell, HiOutlineClipboardList, HiOutlineCog, HiOutlineUsers } from 'react-icons/hi';

/**
 * Dashboard page — main landing page for authenticated users.
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const stats = [
    {
      icon: <HiOutlineBell size={28} />,
      label: 'Unread Notifications',
      value: unreadCount,
      color: '#6366f1',
      bgColor: '#eef2ff',
    },
    {
      icon: <HiOutlineClipboardList size={28} />,
      label: 'Active Tasks',
      value: '—',
      color: '#10b981',
      bgColor: '#ecfdf5',
    },
    {
      icon: <HiOutlineUsers size={28} />,
      label: 'Team Members',
      value: '—',
      color: '#f59e0b',
      bgColor: '#fffbeb',
    },
    {
      icon: <HiOutlineCog size={28} />,
      label: 'System Status',
      value: 'Online',
      color: '#06b6d4',
      bgColor: '#ecfeff',
    },
  ];

  return (
    <div className="dashboard-page" id="dashboard-page">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>{getGreeting()}, {user?.name?.split(' ')[0]}! 👋</h1>
          <p>Here's what's happening on your campus today.</p>
        </div>
        <div className="welcome-meta">
          <span className="role-badge">{user?.role}</span>
          <span className="date-text">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index} style={{ '--accent': stat.color, '--accent-bg': stat.bgColor }}>
            <div className="stat-icon" style={{ background: stat.bgColor, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <div className="action-card">
            <div className="action-icon" style={{ background: '#eef2ff', color: '#6366f1' }}>
              <HiOutlineBell size={24} />
            </div>
            <h3>View Notifications</h3>
            <p>Check your latest alerts and updates</p>
          </div>
          <div className="action-card">
            <div className="action-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <HiOutlineClipboardList size={24} />
            </div>
            <h3>Manage Tasks</h3>
            <p>View and manage assigned tasks</p>
          </div>
          <div className="action-card">
            <div className="action-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <HiOutlineUsers size={24} />
            </div>
            <h3>Team Directory</h3>
            <p>Browse campus staff and departments</p>
          </div>
          <div className="action-card">
            <div className="action-icon" style={{ background: '#ecfeff', color: '#06b6d4' }}>
              <HiOutlineCog size={24} />
            </div>
            <h3>System Settings</h3>
            <p>Configure your preferences</p>
          </div>
        </div>
      </div>
    </div>
  );
}
