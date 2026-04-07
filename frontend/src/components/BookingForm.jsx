import { useEffect, useState } from 'react';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineUsers, HiOutlineClipboardList } from 'react-icons/hi';

/**
 * Booking creation form with validation.
 */
export default function BookingForm({ onSubmit, onCancel, loading, initialValues = null, mode = 'create' }) {
  const [formData, setFormData] = useState({
    resourceId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: '',
  });
  const [errors, setErrors] = useState({});

  const normalizeDateValue = (dateValue) => {
    if (!dateValue) return '';

    // Native date input usually returns yyyy-mm-dd.
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }

    // Fallback for locale text formats like dd/mm/yyyy or mm/dd/yyyy.
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateValue)) {
      const [p1, p2, year] = dateValue.split('/').map((v) => parseInt(v, 10));
      const day = p1 > 12 ? p1 : p2;
      const month = p1 > 12 ? p2 : p1;
      const mm = String(month).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      return `${year}-${mm}-${dd}`;
    }

    return dateValue;
  };

  const normalizeTimeValue = (timeValue) => {
    if (!timeValue) return '';

    // Already normalized HH:mm.
    if (/^\d{2}:\d{2}$/.test(timeValue)) {
      return `${timeValue}:00`;
    }

    // 12-hour format fallback: hh:mm AM/PM.
    const match12h = timeValue.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match12h) {
      let hours = parseInt(match12h[1], 10);
      const minutes = match12h[2];
      const ampm = match12h[3].toUpperCase();

      if (ampm === 'AM' && hours === 12) hours = 0;
      if (ampm === 'PM' && hours !== 12) hours += 12;

      return `${String(hours).padStart(2, '0')}:${minutes}:00`;
    }

    return `${timeValue}:00`;
  };

  useEffect(() => {
    if (!initialValues) {
      setFormData({
        resourceId: '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        attendees: '',
      });
      return;
    }

    setFormData({
      resourceId: initialValues.resourceId || '',
      date: initialValues.date || '',
      startTime: initialValues.startTime ? initialValues.startTime.substring(0, 5) : '',
      endTime: initialValues.endTime ? initialValues.endTime.substring(0, 5) : '',
      purpose: initialValues.purpose || '',
      attendees: Array.isArray(initialValues.attendees) ? initialValues.attendees.join(', ') : '',
    });
  }, [initialValues]);

  const validate = () => {
    const newErrors = {};
    if (!formData.resourceId.trim()) newErrors.resourceId = 'Resource ID is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
    if (!formData.attendees.trim()) newErrors.attendees = 'At least one attendee is required';

    // Check date is not in the past
    if (formData.date) {
      const today = new Date().toISOString().split('T')[0];
      if (formData.date < today) {
        newErrors.date = 'Cannot book in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const attendeeList = formData.attendees
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const normalizedDate = normalizeDateValue(formData.date);
    const normalizedStartTime = normalizeTimeValue(formData.startTime);
    const normalizedEndTime = normalizeTimeValue(formData.endTime);

    onSubmit({
      resourceId: formData.resourceId.trim(),
      date: normalizedDate,
      startTime: normalizedStartTime,
      endTime: normalizedEndTime,
      purpose: formData.purpose.trim(),
      attendees: attendeeList,
    });
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit} id="booking-form">
      <div className="form-group">
        <label htmlFor="resourceId">
          <HiOutlineClipboardList size={16} />
          Resource ID
        </label>
        <input
          type="text"
          id="resourceId"
          name="resourceId"
          value={formData.resourceId}
          onChange={handleChange}
          placeholder="e.g., room-101, lab-A, projector-3"
          className={errors.resourceId ? 'input-error' : ''}
        />
        {errors.resourceId && <span className="field-error">{errors.resourceId}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">
            <HiOutlineCalendar size={16} />
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? 'input-error' : ''}
          />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="startTime">
            <HiOutlineClock size={16} />
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className={errors.startTime ? 'input-error' : ''}
          />
          {errors.startTime && <span className="field-error">{errors.startTime}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="endTime">
            <HiOutlineClock size={16} />
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className={errors.endTime ? 'input-error' : ''}
          />
          {errors.endTime && <span className="field-error">{errors.endTime}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="purpose">
          <HiOutlineClipboardList size={16} />
          Purpose
        </label>
        <textarea
          id="purpose"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          placeholder="Describe the purpose of this booking..."
          rows={3}
          className={errors.purpose ? 'input-error' : ''}
        />
        {errors.purpose && <span className="field-error">{errors.purpose}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="attendees">
          <HiOutlineUsers size={16} />
          Attendees
        </label>
        <input
          type="text"
          id="attendees"
          name="attendees"
          value={formData.attendees}
          onChange={handleChange}
          placeholder="Comma-separated, e.g.: alice@campus.edu, bob@campus.edu"
          className={errors.attendees ? 'input-error' : ''}
        />
        {errors.attendees && <span className="field-error">{errors.attendees}</span>}
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading} id="submit-booking-btn">
          {loading ? (mode === 'update' ? 'Updating...' : 'Creating...') : (mode === 'update' ? 'Update Booking' : 'Create Booking')}
        </button>
      </div>
    </form>
  );
}
