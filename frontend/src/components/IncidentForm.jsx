import { useState } from 'react';

const CATEGORY_OPTIONS = ['ELECTRICAL', 'NETWORK', 'EQUIPMENT', 'CLEANING', 'OTHER'];
const PRIORITY_OPTIONS = ['HIGH', 'MEDIUM', 'LOW'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_ATTACHMENTS = 5;

export default function IncidentForm({
  onSubmit,
  loading = false,
  initialValues,
  showAttachmentInput = true,
  submitLabel,
  onCancel,
}) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [category, setCategory] = useState(initialValues?.category || 'EQUIPMENT');
  const [priority, setPriority] = useState(initialValues?.priority || 'MEDIUM');
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      nextErrors.title = 'Title is required';
    } else if (trimmedTitle.length < 3) {
      nextErrors.title = 'Title must be at least 3 characters';
    } else if (trimmedTitle.length > 120) {
      nextErrors.title = 'Title must be at most 120 characters';
    }

    if (!trimmedDescription) {
      nextErrors.description = 'Description is required';
    } else if (trimmedDescription.length < 10) {
      nextErrors.description = 'Description must be at least 10 characters';
    } else if (trimmedDescription.length > 1000) {
      nextErrors.description = 'Description must be at most 1000 characters';
    }

    if (!CATEGORY_OPTIONS.includes(category)) {
      nextErrors.category = 'Please select a valid category';
    }

    if (!PRIORITY_OPTIONS.includes(priority)) {
      nextErrors.priority = 'Please select a valid priority';
    }

    if (showAttachmentInput) {
      if (files.length > MAX_ATTACHMENTS) {
        nextErrors.files = `You can upload up to ${MAX_ATTACHMENTS} files`;
      } else if (files.some((file) => file.size > MAX_FILE_SIZE_BYTES)) {
        nextErrors.files = 'Each attachment must be 5MB or smaller';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isValid = title.trim() && description.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      payload: {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
      },
      files: showAttachmentInput ? files : [],
    });
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="incident-title">Title</label>
        <input
          id="incident-title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
          }}
          placeholder="Enter incident title"
          required
          className={errors.title ? 'input-error' : ''}
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="incident-description">Description</label>
        <textarea
          id="incident-description"
          rows={4}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
          }}
          placeholder="Describe the issue"
          required
          className={errors.description ? 'input-error' : ''}
        />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="incident-category">Category</label>
          <select
            id="incident-category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (errors.category) setErrors((prev) => ({ ...prev, category: '' }));
            }}
            className={errors.category ? 'input-error' : ''}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.category && <span className="field-error">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="incident-priority">Priority</label>
          <select
            id="incident-priority"
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              if (errors.priority) setErrors((prev) => ({ ...prev, priority: '' }));
            }}
            className={errors.priority ? 'input-error' : ''}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.priority && <span className="field-error">{errors.priority}</span>}
        </div>
      </div>

      {showAttachmentInput && (
        <div className="form-group">
          <label htmlFor="incident-files">Attachments</label>
          <input
            id="incident-files"
            type="file"
            multiple
            onChange={(e) => {
              setFiles(Array.from(e.target.files || []));
              if (errors.files) setErrors((prev) => ({ ...prev, files: '' }));
            }}
            className={errors.files ? 'input-error' : ''}
          />
          {files.length > 0 && (
            <small>{files.length} file(s) selected</small>
          )}
          {errors.files && <span className="field-error">{errors.files}</span>}
        </div>
      )}

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={!isValid || loading}>
          {loading ? 'Submitting...' : (submitLabel || 'Submit Ticket')}
        </button>
      </div>
    </form>
  );
}
