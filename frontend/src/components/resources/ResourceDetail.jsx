import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resourceApi } from '../../services/api';
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return '#27ae60';
            case 'OUT_OF_SERVICE': return '#e74c3c';
            case 'MAINTENANCE': return '#f39c12';
            default: return '#95a5a6';
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div style={styles.error}>{error}</div>;
    if (!resource) return <div style={styles.error}>No resource found</div>;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <Link to="/resources" style={styles.backButton}>
                    ← Back to Resources
                </Link>
                
                <div style={styles.header}>
                    <h1 style={styles.title}>{resource.name}</h1>
                    <span style={{...styles.status, backgroundColor: getStatusColor(resource.status)}}>
                        {resource.status}
                    </span>
                </div>
                
                <div style={styles.details}>
                    <div style={styles.row}>
                        <div style={styles.detailItem}>
                            <strong>📌 Type:</strong> {resource.type?.replace('_', ' ')}
                        </div>
                        <div style={styles.detailItem}>
                            <strong>👥 Capacity:</strong> {resource.capacity} people
                        </div>
                    </div>
                    
                    <div style={styles.detailItem}>
                        <strong>📍 Location:</strong> {resource.location}
                    </div>
                    
                    {resource.description && (
                        <div style={styles.detailItem}>
                            <strong>📝 Description:</strong>
                            <p>{resource.description}</p>
                        </div>
                    )}
                    
                    {resource.availabilityWindow && (
                        <div style={styles.detailItem}>
                            <strong>🕐 Availability:</strong> {resource.availabilityWindow}
                        </div>
                    )}
                    
                    {resource.imageUrl && (
                        <div style={styles.detailItem}>
                            <strong>🖼️ Image:</strong>
                            <img src={resource.imageUrl} alt={resource.name} style={styles.image} />
                        </div>
                    )}
                    
                    <div style={styles.row}>
                        <div style={styles.detailItem}>
                            <strong>📅 Created:</strong> {new Date(resource.createdAt).toLocaleString()}
                        </div>
                        <div style={styles.detailItem}>
                            <strong>🔄 Updated:</strong> {new Date(resource.updatedAt).toLocaleString()}
                        </div>
                    </div>
                </div>
                
                <div style={styles.actions}>
                    <Link to={`/resources/edit/${resource.id}`} style={{...styles.button, backgroundColor: '#f39c12', textDecoration: 'none'}}>
                        ✏️ Edit Resource
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    backButton: {
        display: 'inline-block',
        marginBottom: '1rem',
        color: '#3498db',
        textDecoration: 'none',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '2px solid #eee',
        paddingBottom: '1rem',
    },
    title: {
        margin: 0,
        color: '#2c3e50',
    },
    status: {
        padding: '4px 12px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
    },
    details: {
        marginBottom: '2rem',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '1rem',
    },
    detailItem: {
        marginBottom: '1rem',
    },
    image: {
        maxWidth: '100%',
        maxHeight: '300px',
        marginTop: '0.5rem',
        borderRadius: '8px',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        borderTop: '1px solid #eee',
        paddingTop: '1rem',
    },
    button: {
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold',
        display: 'inline-block',
    },
    error: {
        textAlign: 'center',
        padding: '2rem',
        color: '#e74c3c',
    },
};

export default ResourceDetail;