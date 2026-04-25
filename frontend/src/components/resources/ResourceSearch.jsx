import React, { useState } from 'react';

const ResourceSearch = ({ onSearch, onClear }) => {
    const [filters, setFilters] = useState({
        name: '',
        type: '',
        minCapacity: '',
        location: '',
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
        const emptyFilters = { name: '', type: '', minCapacity: '', location: '' };
        setFilters(emptyFilters);
        onClear();
    };

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>🔍 Search & Filter Resources</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.row}>
                    <div style={styles.field}>
                        <label>🔎 Name</label>
                        <input
                            type="text"
                            name="name"
                            value={filters.name}
                            onChange={handleChange}
                            placeholder="Enter resource name..."
                            style={styles.input}
                        />
                    </div>
                    
                    <div style={styles.field}>
                        <label>📌 Type</label>
                        <select name="type" value={filters.type} onChange={handleChange} style={styles.input}>
                            <option value="">All Types</option>
                            <option value="LECTURE_HALL">Lecture Hall</option>
                            <option value="LAB">Lab</option>
                            <option value="MEETING_ROOM">Meeting Room</option>
                            <option value="EQUIPMENT">Equipment</option>
                            <option value="AUDITORIUM">Auditorium</option>
                            <option value="STUDY_ROOM">Study Room</option>
                        </select>
                    </div>
                    
                    <div style={styles.field}>
                        <label>👥 Min Capacity</label>
                        <input
                            type="number"
                            name="minCapacity"
                            value={filters.minCapacity}
                            onChange={handleChange}
                            placeholder="Minimum seats"
                            style={styles.input}
                        />
                    </div>
                    
                    <div style={styles.field}>
                        <label>📍 Location</label>
                        <input
                            type="text"
                            name="location"
                            value={filters.location}
                            onChange={handleChange}
                            placeholder="Building name..."
                            style={styles.input}
                        />
                    </div>
                </div>
                
                <div style={styles.buttons}>
                    <button type="submit" style={{...styles.button, backgroundColor: '#3498db'}}>
                        🔍 Search
                    </button>
                    <button type="button" onClick={handleClear} style={{...styles.button, backgroundColor: '#95a5a6'}}>
                        🗑️ Clear
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        border: '1px solid #e0e0e0',
    },
    title: {
        marginTop: 0,
        marginBottom: '1rem',
        color: '#2c3e50',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    input: {
        padding: '0.5rem',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '14px',
    },
    buttons: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end',
    },
    button: {
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '6px',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
    },
};

export default ResourceSearch;