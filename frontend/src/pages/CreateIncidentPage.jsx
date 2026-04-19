import { useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import IncidentForm from '../components/IncidentForm';
import incidentService from '../services/incidentService';

export default function CreateIncidentPage() {
  const [formKey, setFormKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async ({ payload, files }) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const created = await incidentService.createIncident(payload);

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

        if (failedUploads.length > 0) {
          const detail = failedUploads.map((item) => `${item.fileName}: ${item.message}`).join(' | ');
          setSuccess('Incident ticket created, but one or more attachments failed to upload.');
          setError(detail);
          setFormKey((prev) => prev + 1);
          return;
        }
      }

      setSuccess('Incident ticket created successfully.');
      setFormKey((prev) => prev + 1);
    } catch (err) {
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
    <div className="bookings-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <HiOutlineExclamationCircle size={28} />
            Create Incident Ticket
          </h1>
        </div>
      </div>

      {success && <div className="alert alert-success"><span>{success}</span></div>}
      {error && <div className="alert alert-error"><span>{error}</span></div>}

      <div className="booking-form-modal" style={{ maxWidth: '960px', margin: '0 auto' }}>
        <IncidentForm key={formKey} onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
