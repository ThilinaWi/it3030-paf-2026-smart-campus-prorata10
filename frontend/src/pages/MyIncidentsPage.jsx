import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle, HiOutlineRefresh } from 'react-icons/hi';
import IncidentCard from '../components/IncidentCard';
import IncidentForm from '../components/IncidentForm';
import incidentService from '../services/incidentService';

export default function MyIncidentsPage() {

  // Stores all incidents of the logged-in user
  const [incidents, setIncidents] = useState([]);

  // Page states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Editing and deleting states
  const [editingIncident, setEditingIncident] = useState(null);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Load user's incidents from backend
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

  // Load incidents when page opens
  useEffect(() => {
    loadIncidents();
  }, []);

  // Opens edit modal
  const handleEdit = (incident) => {
    setError(null);
    setSuccessMsg(null);
    setEditingIncident(incident);
  };

  // Handles edit submission
  const handleEditSubmit = async ({ payload, files }) => {
    if (!editingIncident) return;

    try {
      setSubmittingEdit(true);
      setError(null);

      // Update incident details
      await incidentService.updateIncident(editingIncident.id, payload);

      // Upload new attachments if any
      if (files?.length) {
        const failedUploads = [];

        for (const file of files) {
          try {
            await incidentService.uploadAttachment(editingIncident.id, file);
          } catch (uploadError) {
            failedUploads.push({
              fileName: file.name,
              message: uploadError?.response?.data?.message || uploadError?.message || 'Upload failed',
            });
          }
        }

        // Partial success if some uploads fail
        if (failedUploads.length > 0) {
          const detail = failedUploads.map((item) => `${item.fileName}: ${item.message}`).join(' | ');
          setSuccessMsg('Incident updated, but one or more photos failed to upload.');
          setError(detail);
          setEditingIncident(null);
          await loadIncidents();
          return;
        }
      }

      // Success case
      setSuccessMsg('Incident updated successfully.');
      setEditingIncident(null);
      await loadIncidents();

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update incident.');
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Handles deleting an incident (only if OPEN)
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
    <div className="bookings-page" id="my-incidents-page">

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <HiOutlineExclamationCircle size={28} />
            My Incidents
          </h1>
        </div>

        {/* Header actions */}
        <div className="page-header-actions">
          <Link className="btn btn-primary" to="/incidents/create">
            Create Ticket
          </Link>

          <button className="btn btn-secondary" onClick={loadIncidents}>
            <HiOutlineRefresh size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Success and error messages */}
      {successMsg && <div className="alert alert-success"><span>{successMsg}</span></div>}
      {error && <div className="alert alert-error"><span>{error}</span></div>}

      {/* Loading / Empty / Data states */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading incidents...</p>
        </div>
      ) : incidents.length === 0 ? (
        <div className="empty-state">
          <p>No incident tickets found.</p>
        </div>
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

      {/* Edit Modal */}
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
              showAttachmentInput={true}
              submitLabel="Update Incident"
              onCancel={() => setEditingIncident(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}