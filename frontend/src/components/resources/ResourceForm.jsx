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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await resourceApi.update(id, formData);
                alert('✅ Resource updated successfully!');
            } else {
                await resourceApi.create(formData);
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
                
                <form onSubmit={handleSubmit}>
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
                        />
                    </div>
                    
                    <div style={styles.field}>
                        <label>Resource Type *</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        >
                            <option value="">Select Type</option>
                            <option value="LECTURE_HALL">Lecture Hall</option>
                            <option value="LAB">Lab</option>
                            <option value="MEETING_ROOM">Meeting Room</option>
                            <option value="EQUIPMENT">Equipment</option>
                            <option value="AUDITORIUM">Auditorium</option>
                            <option value="STUDY_ROOM">Study Room</option>
                        </select>
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
                            />
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
                            />
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
                        />
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
                        />
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