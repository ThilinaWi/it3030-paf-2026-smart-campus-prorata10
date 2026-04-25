import React, { useMemo, useState } from 'react';

const ResourceSearch = ({ onSearch, onClear }) => {
    const [filters, setFilters] = useState({
        name: '',
        type: '',
        minCapacity: '',
        location: '',
        status: '',
    });

    const hasActiveFilters = useMemo(() => (
        Object.values(filters).some((value) => String(value).trim() !== '')
    ), [filters]);

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({
            name: filters.name.trim(),
            type: filters.type,
            minCapacity: filters.minCapacity,
            location: filters.location.trim(),
            status: filters.status,
        });
    };

    const handleClear = () => {
        const emptyFilters = { name: '', type: '', minCapacity: '', location: '', status: '' };
        setFilters(emptyFilters);
        onClear();
    };

    return (
        <section className="resource-search-section resource-search-redesign">
            <div className="resource-search-top">
                <h3 className="resource-search-title">Search and Filter Resources</h3>
                {hasActiveFilters && <span className="resource-active-filter-chip">Filters Active</span>}
            </div>

            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-row search-row-5">
                    <div className="search-field">
                        <label htmlFor="resource-search-name">Keyword</label>
                        <input
                            type="text"
                            id="resource-search-name"
                            name="name"
                            value={filters.name}
                            onChange={handleChange}
                            placeholder="Name, id, or keyword"
                        />
                    </div>

                    <div className="search-field">
                        <label htmlFor="resource-search-type">Type</label>
                        <select id="resource-search-type" name="type" value={filters.type} onChange={handleChange}>
                            <option value="">All Types</option>
                            <option value="LECTURE_HALL">Lecture Hall</option>
                            <option value="LAB">Lab</option>
                            <option value="MEETING_ROOM">Meeting Room</option>
                            <option value="EQUIPMENT">Equipment</option>
                            <option value="AUDITORIUM">Auditorium</option>
                            <option value="STUDY_ROOM">Study Room</option>
                        </select>
                    </div>

                    <div className="search-field">
                        <label htmlFor="resource-search-capacity">Minimum Capacity</label>
                        <input
                            type="number"
                            id="resource-search-capacity"
                            name="minCapacity"
                            value={filters.minCapacity}
                            onChange={handleChange}
                            placeholder="e.g. 30"
                            min="0"
                        />
                    </div>

                    <div className="search-field">
                        <label htmlFor="resource-search-location">Location</label>
                        <input
                            type="text"
                            id="resource-search-location"
                            name="location"
                            value={filters.location}
                            onChange={handleChange}
                            placeholder="Building or floor"
                        />
                    </div>

                    <div className="search-field">
                        <label htmlFor="resource-search-status">Status</label>
                        <select id="resource-search-status" name="status" value={filters.status} onChange={handleChange}>
                            <option value="">All Statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="search-actions resource-search-actions">
                    <button type="submit" className="btn btn-primary">
                        Apply Filters
                    </button>

                    <button type="button" onClick={handleClear} className="btn btn-secondary">
                        Clear
                    </button>
                </div>
            </form>

            {hasActiveFilters && (
                <p className="resource-search-hint">Tip: press Enter in any field to apply instantly.</p>
            )}
        </section>
    );
};

export default ResourceSearch;