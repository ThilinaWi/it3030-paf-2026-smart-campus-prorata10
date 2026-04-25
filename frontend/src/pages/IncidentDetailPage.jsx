import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineRefresh } from 'react-icons/hi';
import IncidentDetail from '../components/IncidentDetail';
import { useAuth } from '../hooks/useAuth';
import incidentService from '../services/incidentService';

export default function IncidentDetailPage() {
  // Get incident ID from URL
  const { id } = useParams();

  // Used for page navigation
  const navigate = useNavigate();

  // Get logged-in user details
  const { user } = useAuth();

  // Page data states
  const [incident, setIncident] = useState(null);
  const [updates, setUpdates] = useState([]);

  // Loading, error, and action states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [updateSubmitting, setUpdateSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  // Load incident details and technician updates from backend
  const loadDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch ticket details and updates at the same time
      const [ticketData, updateData] = await Promise.all([
        incidentService.getIncidentById(id),
        incidentService.getUpdates(id),
      ]);

      setIncident(ticketData);
      setUpdates(updateData || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load incident details.');
    } finally {
      setLoading(false);
    }
  };

  // Load details when page opens or incident ID changes
  useEffect(() => {
    loadDetails();
  }, [id]);

  // Handles status update action from admin/technician
  const handleStatusSubmit = async (status) => {
    try {
      setStatusSubmitting(true);

      await incidentService.updateStatus(id, status);

      setSuccessMsg('Incident status updated.');
      setTimeout(() => setSuccessMsg(null), 3000);

      // Reload page data after status update
      await loadDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setStatusSubmitting(false);
    }
  };

  // Handles technician update message submission
  const handleUpdateSubmit = async (message) => {
    try {
      setUpdateSubmitting(true);

      await incidentService.addUpdate(id, { message });

      setSuccessMsg('Update message added.');
      setTimeout(() => setSuccessMsg(null), 3000);

      // Reload details to show latest update
      await loadDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add update message.');
    } finally {
      setUpdateSubmitting(false);
    }
  };

  // Handles attachment download
  const handleAttachmentDownload = async (path) => {
    try {
      await incidentService.downloadAttachment(id, path);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to download attachment.');
    }
  };

  return (
    <div className="bookings-page">
      <div className="page-header">
        <div className="page-header-left">
          {/* Go back to previous page */}
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <HiOutlineArrowLeft size={16} />
            Back
          </button>
        </div>

        <div className="page-header-actions">
          {/* Refresh incident details manually */}
          <button className="btn btn-secondary" onClick={loadDetails}>
            <HiOutlineRefresh size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Success and error messages */}
      {successMsg && <div className="alert alert-success"><span>{successMsg}</span></div>}
      {error && <div className="alert alert-error"><span>{error}</span></div>}

      {loading ? (
        <div className="loading-state"><div className="loading-spinner"></div><p>Loading details...</p></div>
      ) : (
        <IncidentDetail
          incident={incident}
          updates={updates}
          currentRole={user?.role}
          statusSubmitting={statusSubmitting}
          updateSubmitting={updateSubmitting}
          onStatusSubmit={handleStatusSubmit}
          onUpdateSubmit={handleUpdateSubmit}
          onDownloadAttachment={handleAttachmentDownload}
        />
      )}
    </div>
  );
}