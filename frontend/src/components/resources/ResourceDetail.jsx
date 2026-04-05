import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resourceApi } from '../../services/resourceService';
import LoadingSpinner from '../common/LoadingSpinner';

const ResourceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResource();
    }, [id]);

    const fetchResource = async () => {
        try {
            const response = await resourceApi.getById(id);
            setResource(response.data);
        } catch (err) {
            setError('❌ Resource not found');
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'ACTIVE': return 'status-active';
            case 'OUT_OF_SERVICE': return 'status-out_of_service';
            case 'MAINTENANCE': return 'status-maintenance';
            default: return '';
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error-message" style={{ margin: '2rem' }}>{error}</div>;
    if (!resource) return <div className="error-message" style={{ margin: '2rem' }}>No resource found</div>;

    return (
        <div className="resource-detail-container">
            <div className="resource-detail-card">
                <div className="resource-detail-header">
                    <h1>{resource.name}</h1>
                    <span className={`resource-status ${getStatusClass(resource.status)}`}>
                        {resource.status}
                    </span>
                </div>
                
                <div className="resource-detail-body">
                    <div className="detail-section">
                        <div className="detail-grid">
                            <div>
                                <div className="detail-label">📌 Type</div>
                                <div className="detail-value">{resource.type?.replace('_', ' ')}</div>
                            </div>
                            <div>
                                <div className="detail-label">👥 Capacity</div>
                                <div className="detail-value">{resource.capacity} people</div>
                            </div>
                            <div>
                                <div className="detail-label">📍 Location</div>
                                <div className="detail-value">{resource.location}</div>
                            </div>
                            {resource.availabilityWindow && (
                                <div>
                                    <div className="detail-label">🕐 Availability</div>
                                    <div className="detail-value">{resource.availabilityWindow}</div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {resource.description && (
                        <div className="detail-section">
                            <div className="detail-label">📝 Description</div>
                            <div className="detail-value">{resource.description}</div>
                        </div>
                    )}
                    
                    {resource.imageUrl && (
                        <div className="detail-section">
                            <div className="detail-label">🖼️ Image</div>
                            <img src={resource.imageUrl} alt={resource.name} style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '8px' }} />
                        </div>
                    )}
                    
                    <div className="detail-section">
                        <div className="detail-grid">
                            <div>
                                <div className="detail-label">📅 Created</div>
                                <div className="detail-value">{new Date(resource.createdAt).toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="detail-label">🔄 Last Updated</div>
                                <div className="detail-value">{new Date(resource.updatedAt).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="resource-detail-actions">
                    <Link to={`/resources/edit/${resource.id}`} className="btn-edit" style={{ textDecoration: 'none', padding: 'var(--space-1) var(--space-5)' }}>
                        ✏️ Edit Resource
                    </Link>
                    <Link to="/resources" className="btn-cancel" style={{ textDecoration: 'none' }}>
                        ← Back to Resources
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResourceDetail;