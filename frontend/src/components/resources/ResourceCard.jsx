import React from 'react';
import { useNavigate } from 'react-router-dom';

const ResourceCard = ({ resource, isAdmin, onDelete, onToggleStatus }) => {
    const navigate = useNavigate();
    const isActive = resource.isActive ?? resource.status === 'ACTIVE';

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return '#27ae60';
            case 'OUT_OF_SERVICE': return '#e74c3c';
            case 'MAINTENANCE': return '#f39c12';
            default: return '#95a5a6';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'ACTIVE': return '🟢';
            case 'OUT_OF_SERVICE': return '🔴';
            case 'MAINTENANCE': return '🟡';
            default: return '⚪';
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <h3 style={styles.title}>{resource.name}</h3>
                <span style={{...styles.status, backgroundColor: getStatusColor(resource.status)}}>
                    {getStatusIcon(resource.status)} {resource.status}
                </span>
            </div>
            
            <div style={styles.content}>
                <p><strong>📌 Type:</strong> {resource.type?.replace('_', ' ')}</p>
                <p><strong>👥 Capacity:</strong> {resource.capacity} people</p>
                <p><strong>📍 Location:</strong> {resource.location}</p>
                {resource.description && (
                    <p><strong>📝 Description:</strong> {resource.description.substring(0, 80)}...</p>
                )}
            </div>
            
            <div style={styles.actions}>
                <button 
                    style={{...styles.button, backgroundColor: '#3498db'}}
                    onClick={() => navigate(`/resources/${resource.id}`)}
                >
                    🔍 View
                </button>
                {isAdmin ? (
                    <>
                        <button
                            style={{...styles.button, backgroundColor: isActive ? '#6b7280' : '#16a34a'}}
                            onClick={() => onToggleStatus(resource.id, isActive)}
                        >
                            {isActive ? '⏸️ Inactivate' : '✅ Activate'}
                        </button>
                        <button 
                            style={{...styles.button, backgroundColor: '#f39c12'}}
                            onClick={() => navigate(`/resources/edit/${resource.id}`)}
                        >
                            ✏️ Edit
                        </button>
                        <button 
                            style={{...styles.button, backgroundColor: '#e74c3c'}}
                            onClick={() => onDelete(resource.id, resource.name)}
                        >
                            🗑️ Delete
                        </button>
                    </>
                ) : (
                    <button
                        style={{...styles.button, backgroundColor: isActive ? '#16a34a' : '#9ca3af', cursor: isActive ? 'pointer' : 'not-allowed'}}
                        onClick={() => navigate(`/bookings?resourceId=${encodeURIComponent(resource.id)}&resourceName=${encodeURIComponent(resource.name)}`)}
                        disabled={!isActive}
                    >
                        {isActive ? '📅 Book Now' : '🚫 Inactive'}
                    </button>
                )}
            </div>
        </div>
    );
};

const styles = {
    card: {
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '1rem',
        margin: '1rem',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '320px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        borderBottom: '1px solid #eee',
        paddingBottom: '0.5rem',
    },
    title: {
        margin: 0,
        color: '#2c3e50',
        fontSize: '1.2rem',
    },
    status: {
        padding: '4px 8px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '11px',
        fontWeight: 'bold',
    },
    content: {
        marginBottom: '1rem',
        fontSize: '14px',
        lineHeight: '1.6',
    },
    actions: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'flex-end',
        borderTop: '1px solid #eee',
        paddingTop: '0.75rem',
    },
    button: {
        padding: '6px 12px',
        border: 'none',
        borderRadius: '6px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 'bold',
    },
};

export default ResourceCard;