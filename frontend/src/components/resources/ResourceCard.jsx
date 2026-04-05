import React from 'react';
import { useNavigate } from 'react-router-dom';

const ResourceCard = ({ resource, onDelete }) => {
    const navigate = useNavigate();

    const getStatusClass = (status) => {
        switch (status) {
            case 'ACTIVE': return 'status-active';
            case 'OUT_OF_SERVICE': return 'status-out_of_service';
            case 'MAINTENANCE': return 'status-maintenance';
            default: return '';
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
        <div className="resource-card">
            <div className="resource-card-header">
                <h3>{resource.name}</h3>
                <span className={`resource-status ${getStatusClass(resource.status)}`}>
                    {getStatusIcon(resource.status)} {resource.status}
                </span>
            </div>
            
            <div className="resource-card-body">
                <div className="resource-detail-item">
                    <strong>📌 Type:</strong> {resource.type?.replace('_', ' ')}
                </div>
                <div className="resource-detail-item">
                    <strong>👥 Capacity:</strong> {resource.capacity} people
                </div>
                <div className="resource-detail-item">
                    <strong>📍 Location:</strong> {resource.location}
                </div>
                {resource.description && (
                    <div className="resource-description">
                        {resource.description.length > 100 
                            ? resource.description.substring(0, 100) + '...' 
                            : resource.description}
                    </div>
                )}
            </div>
            
            <div className="resource-card-actions">
                <button 
                    className="btn-view"
                    onClick={() => navigate(`/resources/${resource.id}`)}
                >
                    🔍 View
                </button>
                <button 
                    className="btn-edit"
                    onClick={() => navigate(`/resources/edit/${resource.id}`)}
                >
                    ✏️ Edit
                </button>
                <button 
                    className="btn-delete"
                    onClick={() => onDelete(resource.id, resource.name)}
                >
                    🗑️ Delete
                </button>
            </div>
        </div>
    );
};

export default ResourceCard;