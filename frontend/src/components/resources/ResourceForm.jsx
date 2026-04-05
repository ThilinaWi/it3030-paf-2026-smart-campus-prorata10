import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { resourceApi } from '../../services/resourceService';

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
        imageUrl: '',
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
                imageUrl: resource.imageUrl || '',
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
        <div className="resource-form-container">
            <div className="resource-form-card">
                <div className="resource-form-header">
                    <h2>
                        {isEdit ? '✏️ Edit Resource' : '➕ Create New Resource'}
                    </h2>
                </div>
                
                <div className="resource-form-body">
                    {error && <div className="error-message">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Resource Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Computer Lab A"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Resource Type *</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
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
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Capacity *</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    placeholder="Number of people"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Building A, Floor 2"
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Describe the resource..."
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Image URL (optional)</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Availability Window (optional)</label>
                            <input
                                type="text"
                                name="availabilityWindow"
                                value={formData.availabilityWindow}
                                onChange={handleChange}
                                placeholder="e.g., Mon-Fri 9AM-5PM"
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button type="submit" className="btn-submit" disabled={loading}>
                                {loading ? '💾 Saving...' : (isEdit ? '✏️ Update Resource' : '➕ Create Resource')}
                            </button>
                            <Link to="/resources" className="btn-cancel">
                                ❌ Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResourceForm;