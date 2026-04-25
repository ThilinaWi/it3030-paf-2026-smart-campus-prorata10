import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceApi } from '../../services/api';
import ResourceSearch from './ResourceSearch';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { HiOutlineRefresh, HiOutlineViewGrid, HiOutlineX } from 'react-icons/hi';

const applyClientFilters = (resourceList, filters = {}) => {
    const keyword = String(filters.name || '').trim().toLowerCase();
    const type = String(filters.type || '').trim();
    const minCapacity = Number.parseInt(filters.minCapacity, 10);
    const location = String(filters.location || '').trim().toLowerCase();
    const status = String(filters.status || '').trim();

    return resourceList.filter((resource) => {
        const isActive = resource.isActive ?? resource.status === 'ACTIVE';

        const matchesKeyword = !keyword || [
            resource.name,
            resource.id,
            resource.type,
            resource.location,
            resource.description,
        ].some((field) => String(field || '').toLowerCase().includes(keyword));

        const matchesType = !type || resource.type === type;
        const matchesCapacity = Number.isNaN(minCapacity) || Number(resource.capacity || 0) >= minCapacity;
        const matchesLocation = !location || String(resource.location || '').toLowerCase().includes(location);
        const matchesStatus = !status || (status === 'ACTIVE' ? isActive : !isActive);

        return matchesKeyword && matchesType && matchesCapacity && matchesLocation && matchesStatus;
    });
};

const ResourceList = () => {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilters, setActiveFilters] = useState({});
    const [selectedResource, setSelectedResource] = useState(null);

    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const response = await resourceApi.getAll();
            const payload = Array.isArray(response.data) ? response.data : [];
            setResources(applyClientFilters(payload, activeFilters));
            setError(null);
        } catch (err) {
            setError('Failed to load resources. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (filters) => {
        setActiveFilters(filters);

        try {
            setLoading(true);
            const response = await resourceApi.search(filters);
            const payload = Array.isArray(response.data) ? response.data : [];
            setResources(applyClientFilters(payload, filters));
            setError(null);
        } catch (_err) {
            setError('Search failed. Please check your filters and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async () => {
        setActiveFilters({});
        setSelectedResource(null);

        try {
            setLoading(true);
            const response = await resourceApi.getAll();
            setResources(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (_err) {
            setError('Failed to load resources. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await resourceApi.delete(id);
                await fetchResources();
                alert('Resource deleted successfully.');
            } catch (_err) {
                alert('Failed to delete resource.');
            }
        }
    };

    const handleToggleStatus = async (id, currentActive) => {
        try {
            await resourceApi.updateStatus(id, !currentActive);
            await fetchResources();
        } catch (_err) {
            alert('Failed to update resource status.');
        }
    };

    const openResourceDetail = (resource) => {
        setSelectedResource(resource);
    };

    const closeResourceDetail = () => {
        setSelectedResource(null);
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
                <span className="resource-count-chip">
                    Found {resources.length} resource(s)
                    {Object.values(activeFilters).some((value) => String(value || '').trim() !== '') ? ' with current filters' : ''}
                </span>
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
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => openResourceDetail(resource)}
                                                >
                                                    View
                                                </button>
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

            {selectedResource && (
                <div className="resource-modal-overlay" role="presentation" onClick={closeResourceDetail}>
                    <div
                        className="resource-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="resource-modal-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="resource-modal-header">
                            <div>
                                <p className="resource-modal-eyebrow">Resource Preview</p>
                                <h2 id="resource-modal-title">{selectedResource.name || 'Unnamed Resource'}</h2>
                            </div>
                            <button
                                className="resource-modal-close"
                                type="button"
                                onClick={closeResourceDetail}
                                aria-label="Close preview"
                            >
                                <HiOutlineX size={20} />
                            </button>
                        </div>

                        <div className="resource-modal-content">
                            <div className="resource-modal-grid">
                                <article>
                                    <h4>Type</h4>
                                    <p>{(selectedResource.type || '-').replaceAll('_', ' ')}</p>
                                </article>
                                <article>
                                    <h4>Status</h4>
                                    <p>
                                        <span className={`resource-status-badge ${getStatusMeta(selectedResource).className}`}>
                                            {getStatusMeta(selectedResource).label}
                                        </span>
                                    </p>
                                </article>
                                <article>
                                    <h4>Capacity</h4>
                                    <p>{selectedResource.capacity ?? '-'}</p>
                                </article>
                                <article>
                                    <h4>Location</h4>
                                    <p>{selectedResource.location || '-'}</p>
                                </article>
                            </div>

                            <div className="resource-modal-body-block">
                                <h4>Availability</h4>
                                <p>{selectedResource.availabilityWindow || 'No specific availability window defined.'}</p>
                            </div>

                            <div className="resource-modal-body-block">
                                <h4>Description</h4>
                                <p>{selectedResource.description || 'No description provided for this resource.'}</p>
                            </div>
                        </div>

                        <div className="resource-modal-actions">
                            {!isAdmin && getStatusMeta(selectedResource).isActive && (
                                <Link
                                    to={`/bookings?resourceId=${encodeURIComponent(selectedResource.id)}&resourceName=${encodeURIComponent(selectedResource.name || '')}`}
                                    className="btn btn-primary"
                                    onClick={closeResourceDetail}
                                >
                                    Book This Resource
                                </Link>
                            )}

                            {isAdmin && (
                                <Link
                                    to={`/resources/edit/${selectedResource.id}`}
                                    className="btn btn-secondary"
                                    onClick={closeResourceDetail}
                                >
                                    Edit Resource
                                </Link>
                            )}

                            <button type="button" className="btn btn-secondary" onClick={closeResourceDetail}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResourceList;