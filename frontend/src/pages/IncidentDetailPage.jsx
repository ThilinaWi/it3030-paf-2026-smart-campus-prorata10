import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineRefresh } from 'react-icons/hi';
import IncidentDetail from '../components/IncidentDetail';
import { useAuth } from '../hooks/useAuth';
import incidentService from '../services/incidentService';

export default function IncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [incident, setIncident] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [updateSubmitting, setUpdateSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const loadDetails = async () => {
    try {
      setLoading(true);
      setError(null);
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

  useEffect(() => {
    loadDetails();
  }, [id]);

  const handleStatusSubmit = async (status) => {
    try {
      setStatusSubmitting(true);
      await incidentService.updateStatus(id, status);
      setSuccessMsg('Incident status updated.');
      setTimeout(() => setSuccessMsg(null), 3000);
      await loadDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setStatusSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (message) => {
    try {
      setUpdateSubmitting(true);
      await incidentService.addUpdate(id, { message });
      setSuccessMsg('Update message added.');
      setTimeout(() => setSuccessMsg(null), 3000);
      await loadDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add update message.');
    } finally {
      setUpdateSubmitting(false);
    }
  };

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
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <HiOutlineArrowLeft size={16} />
            Back
          </button>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={loadDetails}>
            <HiOutlineRefresh size={16} />
            Refresh
          </button>
        </div>
      </div>

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
