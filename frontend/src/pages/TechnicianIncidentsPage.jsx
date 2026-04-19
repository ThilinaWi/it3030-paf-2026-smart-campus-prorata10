import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle, HiOutlineRefresh } from 'react-icons/hi';
import IncidentCard from '../components/IncidentCard';
import incidentService from '../services/incidentService';

export default function TechnicianIncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await incidentService.getAssignedIncidents();
      setIncidents(data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assigned incidents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <div className="bookings-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <HiOutlineExclamationCircle size={28} />
            Assigned Incidents
          </h1>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={loadIncidents}>
            <HiOutlineRefresh size={18} />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state"><div className="loading-spinner"></div><p>Loading assigned tickets...</p></div>
      ) : error ? (
        <div className="empty-state"><p>{error}</p></div>
      ) : incidents.length === 0 ? (
        <div className="empty-state"><p>No assigned incidents.</p></div>
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
