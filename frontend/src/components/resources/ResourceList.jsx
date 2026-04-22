import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceApi } from '../../services/api';
import ResourceSearch from './ResourceSearch';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { HiOutlineRefresh, HiOutlineViewGrid } from 'react-icons/hi';

const ResourceList = () => {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async (filters = {}) => {
        try {
            setLoading(true);
            const response = await resourceApi.getAll(filters);
            setResources(response.data);
            setError(null);
        } catch (err) {
            setError('❌ Failed to load resources. Please try again.');
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
            setError('❌ Search failed. Please check your filters and try again.');
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

    const handleToggleStatus = async (id, currentActive) => {
        try {
            await resourceApi.updateStatus(id, !currentActive);
            await fetchResources();
        } catch (err) {
            alert('❌ Failed to update resource status');
        }
    };

    if (loading) return <LoadingSpinner />;

    const getStatusMeta = (resource) => {
        const isActive = resource.isActive ?? resource.status === 'ACTIVE';
        return {
            label: isActive ? 'ACTIVE' : 'INACTIVE',
            className: isActive ? 'resource-status-active' : 'resource-status-inactive',
            isActive,
        };
    };

    return (
        <div className="resources-page">
            <div className="page-header">
                <div className="resource-header-block">
                    <h1 className="resource-page-title">
                        <HiOutlineViewGrid size={28} />
                        Facilities & Resources Catalogue
                    </h1>
                    <p className="resource-page-caption">Manage all bookable resources on campus</p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-secondary" onClick={fetchResources}>
                        <HiOutlineRefresh size={18} />
                        Refresh
                    </button>
                </div>
            </div>
            
            <ResourceSearch onSearch={handleSearch} onClear={handleClear} />
            
            {error && (
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}
            
            <div className="booking-filters" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span className="resource-count-chip">Found {resources.length} resource(s)</span>
                {isAdmin && (
                    <Link to="/resources/create" className="btn btn-primary">
                        Add Resource
                    </Link>
                )}
            </div>
            
            {resources.length === 0 ? (
                <div className="empty-state">
                    <p>No resources found.</p>
                </div>
            ) : (
                <div className="resource-admin-table-wrap" style={{ marginTop: '0.75rem' }}>
                    <table className="resource-admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Capacity</th>
                                <th>Location</th>
                                <th>Availability</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map((resource) => {
                                const statusMeta = getStatusMeta(resource);

                                return (
                                    <tr key={resource.id}>
                                        <td>{resource.name || '-'}</td>
                                        <td>{(resource.type || '').replaceAll('_', ' ') || '-'}</td>
                                        <td>{resource.capacity ?? '-'}</td>
                                        <td>{resource.location || '-'}</td>
                                        <td>{resource.availabilityWindow || '-'}</td>
                                        <td>
                                            <span className={`resource-status-badge ${statusMeta.className}`}>
                                                {statusMeta.label}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="resource-admin-table-actions">
                                                <Link to={`/resources/${resource.id}`} className="btn btn-secondary">View</Link>
                                                {isAdmin ? (
                                                    <>
                                                        <button
                                                            className="btn btn-secondary"
                                                            onClick={() => handleToggleStatus(resource.id, statusMeta.isActive)}
                                                        >
                                                            {statusMeta.isActive ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                        <Link to={`/resources/edit/${resource.id}`} className="btn btn-secondary">Edit</Link>
                                                        <button
                                                            className="btn btn-delete"
                                                            onClick={() => handleDelete(resource.id, resource.name)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                ) : (
                                                    <Link
                                                        to={`/bookings?resourceId=${encodeURIComponent(resource.id)}&resourceName=${encodeURIComponent(resource.name || '')}`}
                                                        className="btn btn-primary"
                                                    >
                                                        Book
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ResourceList;