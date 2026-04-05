import React, { useState } from 'react';

const ResourceSearch = ({ onSearch, onClear }) => {
    const [filters, setFilters] = useState({
        type: '',
        minCapacity: '',
        location: '',
        searchTerm: '',
    });

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);
    };

    const handleClear = () => {
        const emptyFilters = { type: '', minCapacity: '', location: '', searchTerm: '' };
        setFilters(emptyFilters);
        onClear();
    };

    return (
        <div className="resource-search-section">
            <div className="resource-search-title">
                🔍 Search & Filter Resources
            </div>
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-row">
                    <div className="search-field">
                        <label>🔎 Name</label>
                        <input
                            type="text"
                            name="searchTerm"
                            value={filters.searchTerm}
                            onChange={handleChange}
                            placeholder="Enter resource name..."
                        />
                    </div>
                    
                    <div className="search-field">
                        <label>📌 Type</label>
                        <select name="type" value={filters.type} onChange={handleChange}>
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
                        <label>👥 Min Capacity</label>
                        <input
                            type="number"
                            name="minCapacity"
                            value={filters.minCapacity}
                            onChange={handleChange}
                            placeholder="Minimum seats"
                        />
                    </div>
                    
                    <div className="search-field">
                        <label>📍 Location</label>
                        <input
                            type="text"
                            name="location"
                            value={filters.location}
                            onChange={handleChange}
                            placeholder="Building name..."
                        />
                    </div>
                </div>
                
                <div className="search-actions">
                    <button type="submit" className="btn-submit" style={{ padding: 'var(--space-1) var(--space-5)' }}>
                        🔍 Search
                    </button>
                    <button type="button" className="btn-cancel" onClick={handleClear}>
                        🗑️ Clear
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResourceSearch;