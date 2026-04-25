import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle, HiOutlineRefresh } from 'react-icons/hi';
import incidentService from '../services/incidentService';
import adminUserService from '../services/adminUserService';

const STATUS_FILTERS = ['ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const CATEGORY_FILTERS = ['ALL', 'ELECTRICAL', 'NETWORK', 'EQUIPMENT', 'CLEANING', 'OTHER'];

const STATUS_CLASS_MAP = {
  OPEN: 'incident-status-open',
  ASSIGNED: 'incident-status-assigned',
  IN_PROGRESS: 'incident-status-in-progress',
  RESOLVED: 'incident-status-resolved',
  CLOSED: 'incident-status-closed',
};

const PRIORITY_CLASS_MAP = {
  HIGH: 'incident-priority-high',
  MEDIUM: 'incident-priority-medium',
  LOW: 'incident-priority-low',
};

export default function AdminIncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [requesterNames, setRequesterNames] = useState({});
  const [selectedTech, setSelectedTech] = useState({});
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [assigningId, setAssigningId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [incidentPage, users] = await Promise.all([
        incidentService.getAllIncidents({
          page: currentPage,
          size: pageSize,
          search,
          status: statusFilter,
          category: categoryFilter,
        }),
        adminUserService.getAllUsers(),
      ]);

      const userNameMap = (users || []).reduce((acc, user) => {
        acc[user.id] = user.name || user.email || user.id;
        return acc;
      }, {});

      setIncidents(incidentPage.content || []);
      setTotalPages(Math.max(incidentPage.totalPages || 1, 1));
      setTechnicians((users || []).filter((user) => user.role === 'TECHNICIAN'));
      setRequesterNames(userNameMap);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin incidents data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage, search, statusFilter, categoryFilter]);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  const handleAssign = async (incidentId, technicianId) => {
    try {
      setAssigningId(incidentId);
      await incidentService.assignTechnician(incidentId, technicianId);
      setSuccessMsg('Technician assigned successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign technician.');
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="bookings-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <HiOutlineExclamationCircle size={28} />
            Admin Incident Management
          </h1>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={loadData}>
            <HiOutlineRefresh size={18} />
            Refresh
          </button>
        </div>
      </div>

      {successMsg && <div className="alert alert-success"><span>{successMsg}</span></div>}
      {error && <div className="alert alert-error"><span>{error}</span></div>}

      <div className="booking-filters">
        <input
          type="text"
          placeholder="Search incidents..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="role-select"
          style={{ minWidth: '260px' }}
        />
      </div>

      <div className="booking-filters" style={{ marginTop: '0.5rem' }}>
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            className={`filter-tab ${statusFilter === status ? 'active' : ''}`}
            onClick={() => {
              setStatusFilter(status);
              setCurrentPage(1);
            }}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="booking-filters" style={{ marginTop: '0.5rem' }}>
        {CATEGORY_FILTERS.map((category) => (
          <button
            key={category}
            className={`filter-tab ${categoryFilter === category ? 'active' : ''}`}
            onClick={() => {
              setCategoryFilter(category);
              setCurrentPage(1);
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-state"><div className="loading-spinner"></div><p>Loading incidents...</p></div>
      ) : incidents.length === 0 ? (
        <div className="empty-state"><p>No incidents found for selected filters.</p></div>
      ) : (
        <div className="incident-admin-table-wrap" style={{ marginTop: '1rem' }}>
          <table className="incident-admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Requester</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Technician</th>
                <th>New Technician</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id}>
                  <td>
                    <div className="incident-table-title">{incident.title}</div>
                  </td>
                  <td>{requesterNames[incident.userId] || incident.userId}</td>
                  <td>{incident.category}</td>
                  <td>
                    <span className={`incident-priority-chip ${PRIORITY_CLASS_MAP[incident.priority] || 'incident-priority-low'}`}>
                      {incident.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`booking-status-badge ${STATUS_CLASS_MAP[incident.status] || 'incident-status-open'}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td>{incident.technicianName || 'Unassigned'}</td>
                  <td>
                    {incident.status === 'OPEN' ? (
                      <select
                        className="role-select incident-admin-table-select"
                        value={selectedTech[incident.id] || ''}
                        onChange={(e) => setSelectedTech((prev) => ({ ...prev, [incident.id]: e.target.value }))}
                      >
                        <option value="">Select technician</option>
                        {technicians.map((tech) => (
                          <option key={tech.id} value={tech.id}>
                            {tech.name || tech.email}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="incident-table-subtext">Only OPEN incidents can be assigned</span>
                    )}
                  </td>
                  <td>{new Date(incident.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="incident-admin-table-actions">
                      {incident.status === 'OPEN' && (
                        <button
                          className="btn btn-primary"
                          disabled={!selectedTech[incident.id] || assigningId === incident.id}
                          onClick={() => handleAssign(incident.id, selectedTech[incident.id])}
                        >
                          {assigningId === incident.id ? 'Assigning...' : 'Assing'}
                        </button>
                      )}
                      <Link className="btn btn-secondary" to={`/incidents/${incident.id}`}>
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="booking-filters" style={{ marginTop: '1rem' }}>
        <button
          className="filter-tab"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || loading}
        >
          Prev
        </button>

        {pageNumbers.map((pageNo) => (
          <button
            key={pageNo}
            className={`filter-tab ${currentPage === pageNo ? 'active' : ''}`}
            onClick={() => setCurrentPage(pageNo)}
            disabled={loading}
          >
            {pageNo}
          </button>
        ))}

        <button
          className="filter-tab"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage >= totalPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
}
