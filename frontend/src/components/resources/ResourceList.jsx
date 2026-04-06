import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceApi } from '../../services/api';
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
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>📚 Facilities & Resources Catalogue</h1>
                <p style={styles.subtitle}>Manage all bookable resources on campus</p>
            </div>
            
            <ResourceSearch onSearch={handleSearch} onClear={handleClear} />
            
            {error && (
                <div style={styles.error}>
                    ⚠️ {error}
                </div>
            )}
            
            <div style={styles.stats}>
                <span>📊 Found {resources.length} resource(s)</span>
                <Link to="/resources/create" style={styles.addButton}>
                    ➕ Add New Resource
                </Link>
            </div>
            
            {resources.length === 0 ? (
                <div style={styles.empty}>
                    <p>📭 No resources found.</p>
                    <p>Click <strong>"Add New Resource"</strong> to create one!</p>
                </div>
            ) : (
                <div style={styles.grid}>
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

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    title: {
        color: '#2c3e50',
        marginBottom: '0.5rem',
    },
    subtitle: {
        color: '#7f8c8d',
        fontSize: '1rem',
    },
    stats: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '0 1rem',
    },
    addButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#27ae60',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
    },
    grid: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1rem',
    },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '1rem',
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '1rem',
    },
    empty: {
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        color: '#7f8c8d',
    },
};

export default ResourceList;