import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { resourceApi } from '../../services/api';

const ResourceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        capacity: '',
        location: '',
        description: '',
        availabilityWindow: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (isEdit) {
            fetchResource();
        }
    }, [id]);

    const fetchResource = async () => {
        try {
            const response = await resourceApi.getById(id);
            const resource = response.data;
            setFormData({
                name: resource.name || '',
                type: resource.type || '',
                capacity: resource.capacity || '',
                location: resource.location || '',
                description: resource.description || '',
                availabilityWindow: resource.availabilityWindow || '',
            });
        } catch (err) {
            setError('❌ Failed to load resource');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const nextErrors = {};
        const trimmedName = formData.name.trim();
        const trimmedLocation = formData.location.trim();
        const trimmedDescription = formData.description.trim();
        const trimmedWindow = formData.availabilityWindow.trim();
        const capacityNumber = Number(formData.capacity);

        if (!trimmedName) {
            nextErrors.name = 'Resource name is required';
        } else if (trimmedName.length < 3) {
            nextErrors.name = 'Resource name must be at least 3 characters';
        } else if (trimmedName.length > 120) {
            nextErrors.name = 'Resource name must be at most 120 characters';
        }

        if (!formData.type) {
            nextErrors.type = 'Resource type is required';
        }

        if (!formData.capacity && formData.capacity !== 0) {
            nextErrors.capacity = 'Capacity is required';
        } else if (!Number.isInteger(capacityNumber) || capacityNumber < 1) {
            nextErrors.capacity = 'Capacity must be a whole number greater than 0';
        } else if (capacityNumber > 10000) {
            nextErrors.capacity = 'Capacity must be 10000 or less';
        }

        if (!trimmedLocation) {
            nextErrors.location = 'Location is required';
        } else if (trimmedLocation.length < 2) {
            nextErrors.location = 'Location must be at least 2 characters';
        } else if (trimmedLocation.length > 120) {
            nextErrors.location = 'Location must be at most 120 characters';
        }

        if (trimmedDescription.length > 500) {
            nextErrors.description = 'Description must be at most 500 characters';
        }

        if (trimmedWindow.length > 120) {
            nextErrors.availabilityWindow = 'Availability window must be at most 120 characters';
        }

        setFieldErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        const payload = {
            ...formData,
            name: formData.name.trim(),
            location: formData.location.trim(),
            description: formData.description.trim(),
            availabilityWindow: formData.availabilityWindow.trim(),
            capacity: Number(formData.capacity),
        };

        try {
            if (isEdit) {
                await resourceApi.update(id, payload);
                alert('✅ Resource updated successfully!');
            } else {
                await resourceApi.create(payload);
                alert('✅ Resource created successfully!');
            }
            navigate('/resources');
        } catch (err) {
            setError(err.response?.data?.message || '❌ Failed to save resource');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>
                    {isEdit ? '✏️ Edit Resource' : '➕ Create New Resource'}
                </h2>
                
                {error && <div style={styles.error}>{error}</div>}
                
                <form onSubmit={handleSubmit} noValidate>
                    <div style={styles.field}>
                        <label>Resource Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Computer Lab A"
                            style={styles.input}
                            className={fieldErrors.name ? 'input-error' : ''}
                        />
                        {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
                    </div>
                    
                    <div style={styles.field}>
                        <label>Resource Type *</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            className={fieldErrors.type ? 'input-error' : ''}
                        >
                            <option value="">Select Type</option>
                            <option value="LECTURE_HALL">Lecture Hall</option>
                            <option value="LAB">Lab</option>
                            <option value="MEETING_ROOM">Meeting Room</option>
                            <option value="EQUIPMENT">Equipment</option>
                            <option value="AUDITORIUM">Auditorium</option>
                            <option value="STUDY_ROOM">Study Room</option>
                        </select>
                        {fieldErrors.type && <div className="field-error">{fieldErrors.type}</div>}
                    </div>
                    
                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label>Capacity *</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                                min="1"
                                placeholder="Number of people"
                                style={styles.input}
                                className={fieldErrors.capacity ? 'input-error' : ''}
                            />
                            {fieldErrors.capacity && <div className="field-error">{fieldErrors.capacity}</div>}
                        </div>
                        
                        <div style={styles.field}>
                            <label>Location *</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Building A, Floor 2"
                                style={styles.input}
                                className={fieldErrors.location ? 'input-error' : ''}
                            />
                            {fieldErrors.location && <div className="field-error">{fieldErrors.location}</div>}
                        </div>
                    </div>
                    
                    <div style={styles.field}>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Describe the resource..."
                            style={styles.textarea}
                            className={fieldErrors.description ? 'input-error' : ''}
                        />
                        {fieldErrors.description && <div className="field-error">{fieldErrors.description}</div>}
                    </div>
                    
                    <div style={styles.field}>
                        <label>Availability Window (optional)</label>
                        <input
                            type="text"
                            name="availabilityWindow"
                            value={formData.availabilityWindow}
                            onChange={handleChange}
                            placeholder="e.g., Mon-Fri 9AM-5PM"
                            style={styles.input}
                            className={fieldErrors.availabilityWindow ? 'input-error' : ''}
                        />
                        {fieldErrors.availabilityWindow && <div className="field-error">{fieldErrors.availabilityWindow}</div>}
                    </div>
                    
                    <div style={styles.buttons}>
                        <button type="submit" disabled={loading} style={{...styles.button, backgroundColor: '#27ae60'}}>
                            {loading ? '💾 Saving...' : (isEdit ? '✏️ Update' : '➕ Create')}
                        </button>
                        <Link to="/resources" style={{...styles.button, backgroundColor: '#95a5a6', textDecoration: 'none'}}>
                            ❌ Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
    },
    formContainer: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    title: {
        marginTop: 0,
        marginBottom: '1.5rem',
        color: '#2c3e50',
        textAlign: 'center',
    },
    field: {
        marginBottom: '1rem',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '1rem',
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '14px',
    },
    textarea: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '14px',
        fontFamily: 'inherit',
    },
    buttons: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1.5rem',
        justifyContent: 'flex-end',
    },
    button: {
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '6px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        display: 'inline-block',
    },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '0.75rem',
        borderRadius: '6px',
        marginBottom: '1rem',
        textAlign: 'center',
    },
};

export default ResourceForm;