import { useEffect, useState } from 'react';
import { HiOutlineAdjustments, HiOutlineSave } from 'react-icons/hi';
import notificationService from '../services/notificationService';

const defaultPreferences = {
  statusUpdates: true,
  technicianUpdates: true,
  assignments: true,
  system: true,
};

const preferenceItems = [
  {
    key: 'statusUpdates',
    title: 'Incident Status Updates',
    description: 'Receive alerts when incident status changes (OPEN, IN_PROGRESS, RESOLVED, CLOSED).',
  },
  {
    key: 'technicianUpdates',
    title: 'Technician Updates',
    description: 'Receive messages and progress comments from technicians.',
  },
  {
    key: 'assignments',
    title: 'Assignment Notifications',
    description: 'Receive alerts when incidents are assigned to technicians.',
  },
  {
    key: 'system',
    title: 'General System Notifications',
    description: 'Receive system-wide operational updates and alerts.',
  },
];

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        const response = await notificationService.getPreferences();
        setPreferences({
          statusUpdates: response?.statusUpdates ?? true,
          technicianUpdates: response?.technicianUpdates ?? true,
          assignments: response?.assignments ?? true,
          system: response?.system ?? true,
        });
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || 'Failed to load notification preferences.');
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await notificationService.updatePreferences(preferences);
      setPreferences({
        statusUpdates: response?.statusUpdates ?? true,
        technicianUpdates: response?.technicianUpdates ?? true,
        assignments: response?.assignments ?? true,
        system: response?.system ?? true,
      });
      setSuccessMessage('Notification preferences updated successfully.');
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to save notification preferences.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="notifications-settings-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>
            <HiOutlineAdjustments size={28} />
            Notification Preferences
          </h1>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || loading}>
            <HiOutlineSave size={16} />
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>

      {successMessage && <div className="alert alert-success"><span>{successMessage}</span></div>}
      {errorMessage && <div className="alert alert-error"><span>{errorMessage}</span></div>}

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading preferences...</p>
        </div>
      ) : (
        <div className="ns-card">
          <h3>Notification Preferences</h3>
          <p className="ns-subtitle">Choose which notifications you want to receive.</p>

          <div className="ns-list">
            {preferenceItems.map((item) => (
              <label key={item.key} className="ns-row" htmlFor={`pref-${item.key}`}>
                <div className="ns-content">
                  <div className="ns-title">{item.title}</div>
                  <div className="ns-description">{item.description}</div>
                </div>
                <span className="ns-switch-wrap">
                  <input
                    id={`pref-${item.key}`}
                    type="checkbox"
                    className="ns-switch-input"
                    checked={Boolean(preferences[item.key])}
                    onChange={() => handleToggle(item.key)}
                  />
                  <span className="ns-switch-slider" aria-hidden="true"></span>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
