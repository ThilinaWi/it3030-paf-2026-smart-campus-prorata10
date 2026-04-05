import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceApi } from '../../services/resourceService';
import ResourceCard from './ResourceCard';
import ResourceSearch from './ResourceSearch';
import LoadingSpinner from '../common/LoadingSpinner';

const ResourceList = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const response = await resourceApi.getAll();
            setResources(response.data);
            setError(null);
        } catch (err) {
            setError('❌ Failed to load resources. Make sure backend is running on port 8080');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (filters) => {
        try {
            setLoading(true);
            const response = await resourceApi.search(filters);
            setResources(response.data);
            setError(null);
        } catch (err) {
            setError('❌ Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async () => {
        await fetchResources();
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await resourceApi.delete(id);
                await fetchResources();
                alert('✅ Resource deleted successfully!');
            } catch (err) {
                alert('❌ Failed to delete resource');
            }
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="resources-page">
            <div className="resources-header">
                <h1>📚 Facilities & Resources Catalogue</h1>
                <p>Manage all bookable resources on campus including lecture halls, labs, meeting rooms, and equipment</p>
            </div>
            
            <ResourceSearch onSearch={handleSearch} onClear={handleClear} />
            
            {error && (
                <div className="error-message">
                    ⚠️ {error}
                </div>
            )}
            
            <div className="resources-stats">
                <span className="resources-count">📊 Found {resources.length} resource(s)</span>
                <Link to="/resources/create" className="add-resource-btn">
                    ➕ Add New Resource
                </Link>
            </div>
            
            {resources.length === 0 ? (
                <div className="empty-state-resources">
                    <div className="empty-icon">📭</div>
                    <h3>No Resources Found</h3>
                    <p>Get started by creating your first resource</p>
                    <Link to="/resources/create" className="btn-submit">
                        ➕ Create Resource
                    </Link>
                </div>
            ) : (
                <div className="resource-grid">
                    {resources.map(resource => (
                        <ResourceCard 
                            key={resource.id} 
                            resource={resource} 
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResourceList;