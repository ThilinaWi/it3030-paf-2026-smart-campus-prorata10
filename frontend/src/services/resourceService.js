import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Resources API
export const resourceApi = {
    // Get all resources
    getAll: () => api.get('/resources'),
    
    // Get resource by ID
    getById: (id) => api.get(`/resources/${id}`),
    
    // Create new resource
    create: (resource) => api.post('/resources', resource),
    
    // Update resource
    update: (id, resource) => api.put(`/resources/${id}`, resource),
    
    // Delete resource
    delete: (id) => api.delete(`/resources/${id}`),
    
    // Search resources
    search: (filters) => {
        const params = new URLSearchParams();
        if (filters.type) params.append('type', filters.type);
        if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);
        if (filters.location) params.append('location', filters.location);
        if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
        return api.get(`/resources/search?${params.toString()}`);
    }
};

export default resourceApi;