import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineChartBar,
  HiOutlineExclamationCircle,
  HiOutlineBell,
  HiOutlineClipboardList,
  HiOutlinePlus,
} from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import adminAnalyticsService from '../services/adminAnalyticsService';
import bookingService from '../services/bookingService';
import incidentService from '../services/incidentService';
import StatsCard from '../components/StatsCard';
import ChartCard from '../components/ChartCard';

/**
 * Dashboard page — main landing page for authenticated users.
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('This Month');
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');
  const [topResources, setTopResources] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [bookingTrends, setBookingTrends] = useState([]);
  const [incidentsSummary, setIncidentsSummary] = useState({
    totalBookings: 0,
    totalIncidents: 0,
    activeIncidents: 0,
    resolvedIncidents: 0,
    statusCounts: [],
  });
  const [roleCounts, setRoleCounts] = useState({
    loading: false,
    myBookings: 0,
    myIncidents: 0,
    myActiveIncidents: 0,
    assignedIncidents: 0,
    inProgressAssigned: 0,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      return;
    }

    let cancelled = false;

    const loadAnalytics = async () => {
      try {
        setLoadingAnalytics(true);
        setAnalyticsError('');

        const [resourcesData, peakHoursData, bookingTrendsData, incidentsSummaryData] = await Promise.all([
          adminAnalyticsService.getTopResources(5),
          adminAnalyticsService.getPeakHours(),
          adminAnalyticsService.getBookingTrends(),
          adminAnalyticsService.getIncidentsSummary(),
        ]);

        if (cancelled) return;

        setTopResources(resourcesData || []);
        setPeakHours(peakHoursData || []);
        setBookingTrends(bookingTrendsData || []);
        setIncidentsSummary(incidentsSummaryData || {
          totalBookings: 0,
          totalIncidents: 0,
          activeIncidents: 0,
          resolvedIncidents: 0,
          statusCounts: [],
        });
      } catch (error) {
        if (cancelled) return;
        setAnalyticsError(error?.response?.data?.message || 'Failed to load analytics dashboard.');
      } finally {
        if (!cancelled) {
          setLoadingAnalytics(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [user?.role]);

  useEffect(() => {
    if (!user?.role || user.role === 'ADMIN') {
      return;
    }

    let cancelled = false;

    const loadRoleCounts = async () => {
      try {
        setRoleCounts((prev) => ({ ...prev, loading: true }));

        if (user.role === 'USER') {
          const [bookings, incidents] = await Promise.all([
            bookingService.getMyBookings(),
            incidentService.getMyIncidents(),
          ]);

          if (cancelled) return;

          const activeStatuses = new Set(['OPEN', 'ASSIGNED', 'IN_PROGRESS']);
          const safeBookings = Array.isArray(bookings) ? bookings : [];
          const safeIncidents = Array.isArray(incidents) ? incidents : [];

          setRoleCounts({
            loading: false,
            myBookings: safeBookings.length,
            myIncidents: safeIncidents.length,
            myActiveIncidents: safeIncidents.filter((incident) => activeStatuses.has(incident?.status)).length,
            assignedIncidents: 0,
            inProgressAssigned: 0,
          });
          return;
        }

        if (user.role === 'TECHNICIAN') {
          const [bookings, assignedIncidents] = await Promise.all([
            bookingService.getMyBookings(),
            incidentService.getAssignedIncidents(),
          ]);

          if (cancelled) return;

          const safeBookings = Array.isArray(bookings) ? bookings : [];
          const safeAssigned = Array.isArray(assignedIncidents) ? assignedIncidents : [];

          setRoleCounts({
            loading: false,
            myBookings: safeBookings.length,
            myIncidents: 0,
            myActiveIncidents: 0,
            assignedIncidents: safeAssigned.length,
            inProgressAssigned: safeAssigned.filter((incident) => incident?.status === 'IN_PROGRESS').length,
          });
        }
      } catch (error) {
        if (cancelled) return;
        setRoleCounts((prev) => ({ ...prev, loading: false }));
      }
    };

    loadRoleCounts();

    return () => {
      cancelled = true;
    };
  }, [user?.role]);

  const pieColors = ['#3b82f6', '#f59e0b', '#eab308', '#22c55e'];
  const tooltipStyle = {
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)',
    fontSize: '12px',
  };

  const shortenLabel = (value, maxLength = 18) => {
    if (!value) return 'N/A';
    if (value.length <= maxLength) return value;
    return `${value.slice(0, maxLength - 1)}...`;
  };

  const bookingTrendChartData = useMemo(
    () => (bookingTrends || []).map((point) => ({
      date: point.date,
      shortDate: point.date ? point.date.slice(5) : point.date,
      bookings: point.bookingCount,
    })),
    [bookingTrends],
  );

  const statCards = [
    {
      title: 'Total Bookings',
      value: incidentsSummary.totalBookings,
      helper: loadingAnalytics ? 'Loading...' : 'All recorded booking requests',
      accent: 'bg-blue-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-700',
      icon: <HiOutlineCalendar size={18} />,
    },
    {
      title: 'Total Incidents',
      value: incidentsSummary.totalIncidents,
      helper: loadingAnalytics ? 'Loading...' : 'Total non-deleted incidents',
      accent: 'bg-orange-500',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-700',
      icon: <HiOutlineChartBar size={18} />,
    },
    {
      title: 'Active Incidents',
      value: incidentsSummary.activeIncidents,
      helper: loadingAnalytics ? 'Loading...' : 'Open and in-progress incidents',
      accent: 'bg-yellow-500',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-700',
      icon: <HiOutlineExclamationCircle size={18} />,
    },
    {
      title: 'Resolved Incidents',
      value: incidentsSummary.resolvedIncidents,
      helper: loadingAnalytics ? 'Loading...' : 'Incidents marked resolved',
      accent: 'bg-green-500',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-700',
      icon: <HiOutlineCheckCircle size={18} />,
    },
  ];

  const topResourcesChartData = useMemo(
    () => (topResources || []).map((resource, index) => {
      const fallbackLabel = resource.resourceId
        ? `Resource ${resource.resourceId.slice(-4).toUpperCase()}`
        : `Resource ${index + 1}`;
      const resourceLabel = resource.resourceName && resource.resourceName !== 'Unknown Resource'
        ? resource.resourceName
        : fallbackLabel;
      return {
        name: resourceLabel,
        shortName: shortenLabel(resourceLabel),
        bookings: resource.bookingCount,
      };
    }),
    [topResources],
  );

  const peakHoursChartData = useMemo(
    () => (peakHours || []).map((point) => ({
      hourValue: point.hour,
      hour: `${point.hour}:00`,
      bookings: point.bookingCount,
    })),
    [peakHours],
  );

  const peakHourInsight = useMemo(() => {
    if (!peakHoursChartData.length) {
      return 'Peak booking time is not available yet';
    }
    const peak = peakHoursChartData.reduce((best, current) => (
      current.bookings > best.bookings ? current : best
    ), peakHoursChartData[0]);

    const hourNum = Number(peak.hourValue ?? 0);
    const suffix = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 === 0 ? 12 : hourNum % 12;
    return `Peak booking time is ${hour12} ${suffix}`;
  }, [peakHoursChartData]);

  const topResourceInsight = useMemo(() => {
    if (!topResourcesChartData.length) {
      return 'Top resource is not available yet';
    }
    const top = topResourcesChartData.reduce((best, current) => (
      current.bookings > best.bookings ? current : best
    ), topResourcesChartData[0]);
    return `Top resource is ${top.name}`;
  }, [topResourcesChartData]);

  const incidentStatusChartData = useMemo(
    () => (incidentsSummary?.statusCounts || []).map((point) => ({
      name: point.status,
      value: point.count,
    })),
    [incidentsSummary?.statusCounts],
  );

  if (user?.role === 'USER') {
    return (
      <div className="dashboard-page" id="dashboard-page">
        <div className="welcome-banner">
          <div className="welcome-text">
            <h1>{getGreeting()}, {user?.name?.split(' ')[0]}!</h1>
            <p>Your USER dashboard for bookings, incidents, and updates.</p>
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
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--primary-bg)', color: 'var(--primary)' }}>
              <HiOutlineBell size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{unreadCount}</span>
              <span className="stat-label">Unread Notifications</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ecfeff', color: '#0e7490' }}>
              <HiOutlineCalendar size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{roleCounts.loading ? '...' : roleCounts.myBookings}</span>
              <span className="stat-label">My Bookings</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fff8ed', color: '#ca8a04' }}>
              <HiOutlineClipboardList size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{roleCounts.loading ? '...' : roleCounts.myIncidents}</span>
              <span className="stat-label">My Incidents</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7', color: '#92400e' }}>
              <HiOutlineExclamationCircle size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{roleCounts.loading ? '...' : roleCounts.myActiveIncidents}</span>
              <span className="stat-label">Active Incidents</span>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/bookings" className="action-card">
              <div className="action-icon" style={{ background: 'var(--primary-bg)', color: 'var(--primary)' }}>
                <HiOutlineCalendar size={22} />
              </div>
              <h3>My Bookings</h3>
              <p>View, create, and manage your booking requests.</p>
            </Link>

            <Link to="/incidents/my" className="action-card">
              <div className="action-icon" style={{ background: '#fff8ed', color: '#ca8a04' }}>
                <HiOutlineClipboardList size={22} />
              </div>
              <h3>My Incidents</h3>
              <p>Track all incidents you have reported.</p>
            </Link>

            <Link to="/incidents/create" className="action-card">
              <div className="action-icon" style={{ background: '#ecfeff', color: '#0e7490' }}>
                <HiOutlinePlus size={22} />
              </div>
              <h3>Create Incident</h3>
              <p>Report a new issue to campus operations quickly.</p>
            </Link>

            <Link to="/notifications" className="action-card">
              <div className="action-icon" style={{ background: '#f0fdf4', color: '#15803d' }}>
                <HiOutlineBell size={22} />
              </div>
              <h3>Notifications</h3>
              <p>Check latest updates and mark alerts as read.</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role === 'TECHNICIAN') {
    return (
      <div className="dashboard-page" id="dashboard-page">
        <div className="welcome-banner">
          <div className="welcome-text">
            <h1>{getGreeting()}, {user?.name?.split(' ')[0]}!</h1>
            <p>Your TECHNICIAN dashboard for assigned incidents and updates.</p>
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

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--primary-bg)', color: 'var(--primary)' }}>
              <HiOutlineBell size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{unreadCount}</span>
              <span className="stat-label">Unread Notifications</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fff8ed', color: '#ca8a04' }}>
              <HiOutlineClipboardList size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{roleCounts.loading ? '...' : roleCounts.assignedIncidents}</span>
              <span className="stat-label">Assigned Incidents</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7', color: '#92400e' }}>
              <HiOutlineExclamationCircle size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{roleCounts.loading ? '...' : roleCounts.inProgressAssigned}</span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ecfeff', color: '#0e7490' }}>
              <HiOutlineCalendar size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{roleCounts.loading ? '...' : roleCounts.myBookings}</span>
              <span className="stat-label">My Bookings</span>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/incidents/assigned" className="action-card">
              <div className="action-icon" style={{ background: '#fff8ed', color: '#ca8a04' }}>
                <HiOutlineClipboardList size={22} />
              </div>
              <h3>Assigned Incidents</h3>
              <p>View and update incidents assigned to you.</p>
            </Link>

            <Link to="/bookings" className="action-card">
              <div className="action-icon" style={{ background: 'var(--primary-bg)', color: 'var(--primary)' }}>
                <HiOutlineCalendar size={22} />
              </div>
              <h3>Bookings</h3>
              <p>Review booking information relevant to your workflow.</p>
            </Link>

            <Link to="/notifications" className="action-card">
              <div className="action-icon" style={{ background: '#f0fdf4', color: '#15803d' }}>
                <HiOutlineBell size={22} />
              </div>
              <h3>Notifications</h3>
              <p>Stay updated with assignment and status alerts.</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100/60 p-4 md:p-6" id="dashboard-page">
      <div className="mx-auto w-full max-w-7xl space-y-5 md:space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-r from-slate-700 via-slate-600 to-slate-500 p-3.5 text-white shadow-sm md:p-4">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-14 right-12 h-32 w-32 rounded-full bg-white/10" />
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative z-10">
              <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
                {getGreeting()}, {user?.name?.split(' ')[0]}
              </h1>
              <p className="mt-1 text-xs text-slate-100/90 md:text-sm">
                Smart Campus admin analytics dashboard with real-time booking and incident insights.
              </p>
            </div>
            <div className="relative z-10 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white md:text-sm">
              <p className="text-[10px] uppercase tracking-wide text-slate-100/90">Today</p>
              <p>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {analyticsError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {analyticsError}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <StatsCard
              key={card.title}
              title={card.title}
              value={card.value}
              helper={card.helper}
              accent={card.accent}
              icon={card.icon}
              iconBg={card.iconBg}
              iconColor={card.iconColor}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-700">Time Filter</p>
            <div className="flex flex-wrap items-center gap-2">
              {['Today', 'This Week', 'This Month'].map((label) => {
                const active = selectedTimeFilter === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelectedTimeFilter(label)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? 'border-slate-600 bg-slate-700 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <ChartCard
            title="Top Resources"
            subtitle="Most booked resources by total booking count"
            chartHeight="h-72 md:h-72 lg:h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topResourcesChartData} layout="vertical" margin={{ top: 4, right: 12, left: 6, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis type="category" dataKey="shortName" tick={{ fontSize: 12 }} width={120} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }} />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Peak Booking Hours"
            subtitle="Busiest booking creation hours throughout the day"
            chartHeight="h-72 md:h-72 lg:h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursChartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(245, 158, 11, 0.08)' }} />
                <Bar dataKey="bookings" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Booking Trends"
            subtitle="Daily booking volume trend"
            chartHeight="h-72 md:h-72 lg:h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingTrendChartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="shortDate" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#0f766e"
                  strokeWidth={3}
                  dot={{ r: 2, fill: '#0f766e' }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Incident Status Overview"
            subtitle="Distribution across OPEN, IN_PROGRESS, RESOLVED, and CLOSED"
            chartHeight="h-72 md:h-72 lg:h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incidentStatusChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={88}
                  labelLine={false}
                >
                  {incidentStatusChartData.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <h3 className="text-base font-semibold text-slate-800 md:text-lg">Insights</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Peak Booking Time</p>
              <p className="mt-1.5 text-base font-semibold text-slate-800 md:text-lg">{peakHourInsight}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Top Resource</p>
              <p className="mt-1.5 text-base font-semibold text-slate-800 md:text-lg">{topResourceInsight}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Unread Notifications</p>
              <p className="mt-1.5 text-base font-semibold text-slate-800 md:text-lg">Unread notifications: {unreadCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
