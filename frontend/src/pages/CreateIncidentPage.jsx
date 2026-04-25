import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { HiOutlineX } from 'react-icons/hi';
import IncidentForm from '../components/IncidentForm';
import incidentService from '../services/incidentService';

export default function CreateIncidentPage() {
  const navigate = useNavigate();

  // Used to reset the form after successful submission
  const [formKey, setFormKey] = useState(0);

  // Page states for loading, error, and success messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handles incident form submission
  const handleSubmit = async ({ payload, files }) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // First create the incident ticket
      const created = await incidentService.createIncident(payload);

      // If photos are selected, upload them one by one after ticket creation
      if (files?.length) {
        const failedUploads = [];

        for (const file of files) {
          try {
            await incidentService.uploadAttachment(created.id, file);
          } catch (uploadError) {
            failedUploads.push({
              fileName: file.name,
              message: uploadError?.response?.data?.message || uploadError?.message || 'Upload failed',
            });
          }
        }

        // If ticket created but some uploads failed, show partial success message
        if (failedUploads.length > 0) {
          const detail = failedUploads.map((item) => `${item.fileName}: ${item.message}`).join(' | ');
          setSuccess('Incident ticket created, but one or more attachments failed to upload.');
          setError(detail);
          setFormKey((prev) => prev + 1);
          return;
        }
      }

      // Show success message and reset form
      setSuccess('Incident ticket created successfully.');
      setFormKey((prev) => prev + 1);
    } catch (err) {
      // Handles backend connection and authorization errors
      if (!err.response) {
        setError('Unable to reach backend. Check if backend is running on http://localhost:8080.');
      } else if (err.response.status === 403) {
        setError('You are not allowed to create incidents with this account role.');
      } else if (err.response.status === 401) {
        setError('Your session has expired. Please login again.');
      } else {
        setError(err.response?.data?.message || 'Failed to create incident ticket.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bookings-page" id="create-incident-page">
      <div className="booking-form-overlay incident-create-overlay">
        <div className="booking-form-modal incident-create-modal">
          <div className="modal-header">
            <h2>
              <HiOutlineExclamationCircle size={22} />
              Create Incident Ticket
            </h2>

            {/* Close button navigates back to user's incidents page */}
            <button className="modal-close" onClick={() => navigate('/incidents/my')}>
              <HiOutlineX size={20} />
            </button>
          </div>

          {/* Success and error feedback messages */}
          {success && <div className="alert alert-success"><span>{success}</span></div>}
          {error && <div className="alert alert-error"><span>{error}</span></div>}

          {/* Reusable incident form component */}
          <IncidentForm
            key={formKey}
            onSubmit={handleSubmit}
            loading={loading}
            onCancel={() => navigate('/incidents/my')}
            submitLabel="Create Ticket"
          />
        </div>
      </div>
    </div>
  );
}