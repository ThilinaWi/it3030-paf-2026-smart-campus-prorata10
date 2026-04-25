import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle, HiOutlineRefresh } from 'react-icons/hi';
import IncidentCard from '../components/IncidentCard';
import incidentService from '../services/incidentService';

// Priority order for sorting incidents by status (lower = higher priority)
const STATUS_PRIORITY = {
  ASSIGNED: 0,
  IN_PROGRESS: 1,
  OPEN: 2,
  RESOLVED: 3,
  CLOSED: 4,
};

// Normalizes status text (handles spaces, lowercase, etc.)
const normalizeStatus = (status) => String(status || '')
  .trim()
  .toUpperCase()
  .replace(/[\s-]+/g, '_');

// Sorts incidents by status priority first, then by newest created date
const sortAssignedIncidents = (items) => [...items].sort((a, b) => {

  const statusA = normalizeStatus(a?.status || a?.ticketStatus || a?.incidentStatus);
  const statusB = normalizeStatus(b?.status || b?.ticketStatus || b?.incidentStatus);

  const rankA = STATUS_PRIORITY[statusA] ?? 99;
  const rankB = STATUS_PRIORITY[statusB] ?? 99;

  // Sort by status priority
  if (rankA !== rankB) return rankA - rankB;

  // If same status, sort by newest first
  const createdA = new Date(a?.createdAt || 0).getTime();
  const createdB = new Date(b?.createdAt || 0).getTime();
  return createdB - createdA;
});

export default function TechnicianIncidentsPage() {

  // Stores assigned incidents
  const [incidents, setIncidents] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assigned incidents from backend
  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await incidentService.getAssignedIncidents();

      // Ensure safe array
      const safeData = Array.isArray(data) ? data : [];

      // Sort incidents before displaying
      setIncidents(sortAssignedIncidents(safeData));

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assigned incidents.');
    } finally {
      setLoading(false);
    }
  };

  // Load data when page loads
  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <div className="bookings-page">

      {/* Page header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <HiOutlineExclamationCircle size={28} />
            Assigned Incidents
          </h1>
        </div>

        {/* Refresh button */}
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={loadIncidents}>
            <HiOutlineRefresh size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading / Error / Empty / Data states */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading assigned tickets...</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <p>{error}</p>
        </div>
      ) : incidents.length === 0 ? (
        <div className="empty-state">
          <p>No assigned incidents.</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  );
}