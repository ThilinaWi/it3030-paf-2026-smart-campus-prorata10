import { useEffect, useMemo, useState } from 'react';
import { HiOutlineExclamationCircle, HiOutlineRefresh } from 'react-icons/hi';
import IncidentCard from '../components/IncidentCard';
import incidentService from '../services/incidentService';
import adminUserService from '../services/adminUserService';

const STATUS_FILTERS = ['ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const CATEGORY_FILTERS = ['ALL', 'ELECTRICAL', 'NETWORK', 'EQUIPMENT', 'CLEANING', 'OTHER'];

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
        <div className="bookings-grid" style={{ marginTop: '1rem' }}>
          {incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              showRequestedUser={true}
              showAssignee={true}
              requestedUserName={requesterNames[incident.userId] || incident.userId}
              showAssignControls={true}
              technicians={technicians}
              selectedTechnicianId={selectedTech[incident.id] || ''}
              onTechnicianChange={(id, value) => setSelectedTech((prev) => ({ ...prev, [id]: value }))}
              onAssign={handleAssign}
              assigning={assigningId === incident.id}
            />
          ))}
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
