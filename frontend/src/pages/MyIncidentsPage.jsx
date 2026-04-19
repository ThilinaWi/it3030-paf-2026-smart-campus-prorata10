import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle, HiOutlineRefresh } from 'react-icons/hi';
import IncidentCard from '../components/IncidentCard';
import IncidentForm from '../components/IncidentForm';
import incidentService from '../services/incidentService';

export default function MyIncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [editingIncident, setEditingIncident] = useState(null);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMsg(null);
      const data = await incidentService.getMyIncidents();
      setIncidents(data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load incidents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleEdit = (incident) => {
    setError(null);
    setSuccessMsg(null);
    setEditingIncident(incident);
  };

  const handleEditSubmit = async ({ payload }) => {
    if (!editingIncident) return;
    try {
      setSubmittingEdit(true);
      setError(null);
      await incidentService.updateIncident(editingIncident.id, payload);
      setSuccessMsg('Incident updated successfully.');
      setEditingIncident(null);
      await loadIncidents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update incident.');
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDelete = async (incident) => {
    if (!incident || incident.status !== 'OPEN') return;
    const confirmed = window.confirm('Are you sure you want to delete this incident?');
    if (!confirmed) return;

    try {
      setDeletingId(incident.id);
      setError(null);
      await incidentService.deleteIncident(incident.id);
      setSuccessMsg('Incident deleted successfully.');
      await loadIncidents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete incident.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bookings-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <HiOutlineExclamationCircle size={28} />
            My Incidents
          </h1>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={loadIncidents}>
            <HiOutlineRefresh size={18} />
            Refresh
          </button>
        </div>
      </div>

      {successMsg && <div className="alert alert-success"><span>{successMsg}</span></div>}
      {error && <div className="alert alert-error"><span>{error}</span></div>}

      {loading ? (
        <div className="loading-state"><div className="loading-spinner"></div><p>Loading incidents...</p></div>
      ) : incidents.length === 0 ? (
        <div className="empty-state"><p>No incident tickets found.</p></div>
      ) : (
        <div className="bookings-grid">
          {incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              showOwnerActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
              actionLoading={deletingId === incident.id}
            />
          ))}
        </div>
      )}

      {editingIncident && (
        <div className="booking-form-overlay">
          <div className="booking-form-modal" style={{ maxWidth: '960px' }}>
            <div className="modal-header">
              <h2>Edit Incident</h2>
            </div>
            <IncidentForm
              onSubmit={handleEditSubmit}
              loading={submittingEdit}
              initialValues={editingIncident}
              showAttachmentInput={false}
              submitLabel="Update Incident"
              onCancel={() => setEditingIncident(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
