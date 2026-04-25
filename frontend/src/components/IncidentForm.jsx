import { useState } from 'react';

const CATEGORY_OPTIONS = ['ELECTRICAL', 'NETWORK', 'EQUIPMENT', 'CLEANING', 'OTHER'];
const PRIORITY_OPTIONS = ['HIGH', 'MEDIUM', 'LOW'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_ATTACHMENTS = 3;
const TITLE_MIN = 3;
const TITLE_MAX = 120;
const DESCRIPTION_MIN = 10;
const DESCRIPTION_MAX = 1000;
const ALLOWED_ATTACHMENT_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];

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
  const [touched, setTouched] = useState({});
  
  const handleRemoveFile = (indexToRemove) => {
    const nextFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(nextFiles);
    updateFieldError('files', nextFiles);
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateFiles = (selectedFiles) => {
    if (!showAttachmentInput) return '';

    if (selectedFiles.length > MAX_ATTACHMENTS) {
      return `You can upload up to ${MAX_ATTACHMENTS} photos`;
    }

    const oversizedFile = selectedFiles.find((file) => file.size > MAX_FILE_SIZE_BYTES);
    if (oversizedFile) {
      return `${oversizedFile.name} is larger than 5MB`;
    }

    const invalidExtFile = selectedFiles.find((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return !extension || !ALLOWED_ATTACHMENT_EXTENSIONS.includes(extension);
    });

    if (invalidExtFile) {
      return `${invalidExtFile.name} is not a supported photo format`;
    }

    return '';
  };

  const validateField = (field, value) => {
    if (field === 'title') {
      const trimmedTitle = value.trim();
      if (!trimmedTitle) return 'Title is required';
      if (trimmedTitle.length < TITLE_MIN) return `Title must be at least ${TITLE_MIN} characters`;
      if (trimmedTitle.length > TITLE_MAX) return `Title must be at most ${TITLE_MAX} characters`;
      return '';
    }

    if (field === 'description') {
      const trimmedDescription = value.trim();
      if (!trimmedDescription) return 'Description is required';
      if (trimmedDescription.length < DESCRIPTION_MIN) return `Description must be at least ${DESCRIPTION_MIN} characters`;
      if (trimmedDescription.length > DESCRIPTION_MAX) return `Description must be at most ${DESCRIPTION_MAX} characters`;
      return '';
    }

    if (field === 'category') {
      return CATEGORY_OPTIONS.includes(value) ? '' : 'Please select a valid category';
    }

    if (field === 'priority') {
      return PRIORITY_OPTIONS.includes(value) ? '' : 'Please select a valid priority';
    }

    if (field === 'files') {
      return validateFiles(value);
    }

    return '';
  };

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const updateFieldError = (field, value) => {
    if (!touched[field]) return;
    const fieldError = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const handleFilesChange = (event) => {
    const selectedNow = Array.from(event.target.files || []);
    if (!selectedNow.length) return;

    const merged = [...files, ...selectedNow].slice(0, MAX_ATTACHMENTS);
    setFiles(merged);
    updateFieldError('files', merged);

    // Reset input value so selecting the same file again still triggers change.
    event.target.value = '';
  };

  const validate = () => {
    const nextErrors = {};
    const titleError = validateField('title', title);
    if (titleError) nextErrors.title = titleError;

    const descriptionError = validateField('description', description);
    if (descriptionError) nextErrors.description = descriptionError;

    const categoryError = validateField('category', category);
    if (categoryError) nextErrors.category = categoryError;

    const priorityError = validateField('priority', priority);
    if (priorityError) nextErrors.priority = priorityError;

    if (showAttachmentInput) {
      const filesError = validateField('files', files);
      if (filesError) nextErrors.files = filesError;
    }

    setErrors(nextErrors);
    setTouched({
      title: true,
      description: true,
      category: true,
      priority: true,
      files: true,
    });
    return Object.keys(nextErrors).length === 0;
  };

  const isValid =
    title.trim().length >= TITLE_MIN &&
    title.trim().length <= TITLE_MAX &&
    description.trim().length >= DESCRIPTION_MIN &&
    description.trim().length <= DESCRIPTION_MAX &&
    CATEGORY_OPTIONS.includes(category) &&
    PRIORITY_OPTIONS.includes(priority) &&
    !validateFiles(files);

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
    <form className="booking-form incident-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="incident-title">Title</label>
        <span className="field-hint">Use a short, specific title to help support teams triage quickly.</span>
        <input
          id="incident-title"
          value={title}
          onChange={(e) => {
            const next = e.target.value;
            setTitle(next);
            updateFieldError('title', next);
          }}
          onBlur={() => {
            markTouched('title');
            setErrors((prev) => ({ ...prev, title: validateField('title', title) }));
          }}
          placeholder="Enter incident title"
          maxLength={TITLE_MAX}
          required
          aria-invalid={Boolean(errors.title)}
          className={errors.title ? 'input-error' : ''}
        />
        <span className="char-counter">{title.trim().length}/{TITLE_MAX}</span>
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="incident-description">Description</label>
        <span className="field-hint">Include what happened, where it happened, and any urgency details.</span>
        <textarea
          id="incident-description"
          rows={4}
          value={description}
          onChange={(e) => {
            const next = e.target.value;
            setDescription(next);
            updateFieldError('description', next);
          }}
          onBlur={() => {
            markTouched('description');
            setErrors((prev) => ({ ...prev, description: validateField('description', description) }));
          }}
          placeholder="Describe the issue"
          maxLength={DESCRIPTION_MAX}
          required
          aria-invalid={Boolean(errors.description)}
          className={errors.description ? 'input-error' : ''}
        />
        <span className="char-counter">{description.trim().length}/{DESCRIPTION_MAX}</span>
        {errors.description && <span className="field-error">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="incident-category">Category</label>
          <select
            id="incident-category"
            value={category}
            onChange={(e) => {
              const next = e.target.value;
              setCategory(next);
              updateFieldError('category', next);
            }}
            onBlur={() => {
              markTouched('category');
              setErrors((prev) => ({ ...prev, category: validateField('category', category) }));
            }}
            aria-invalid={Boolean(errors.category)}
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
              const next = e.target.value;
              setPriority(next);
              updateFieldError('priority', next);
            }}
            onBlur={() => {
              markTouched('priority');
              setErrors((prev) => ({ ...prev, priority: validateField('priority', priority) }));
            }}
            aria-invalid={Boolean(errors.priority)}
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
          <label htmlFor="incident-files">Photos</label>
          <span className="field-hint">
            Optional. Up to {MAX_ATTACHMENTS} photos, each 5MB max. Allowed: JPG, PNG, WEBP.
          </span>
          <input
            id="incident-files"
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFilesChange}
            onBlur={() => {
              markTouched('files');
              setErrors((prev) => ({ ...prev, files: validateField('files', files) }));
            }}
            aria-invalid={Boolean(errors.files)}
            className={`incident-file-input-hidden ${errors.files ? 'input-error' : ''}`}
          />
          <label htmlFor="incident-files" className="btn btn-secondary incident-choose-photo-btn">
            Choose Photos
          </label>
          {files.length > 0 && (
            <div className="incident-file-list">
              {files.map((file, index) => (
                <span className="incident-file-item" key={`${file.name}-${file.size}`}>
                  <span>{file.name} ({formatBytes(file.size)})</span>
                  <button
                    type="button"
                    className="incident-file-remove"
                    onClick={() => handleRemoveFile(index)}
                    aria-label={`Remove ${file.name}`}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
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
