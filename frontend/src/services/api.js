import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const resourceApi = {
    getAll: () => api.get('/resources'),
    getById: (id) => api.get(`/resources/${id}`),
    create: (resource) => api.post('/resources', resource),
    update: (id, resource) => api.put(`/resources/${id}`, resource),
    delete: (id) => api.delete(`/resources/${id}`),
    search: (params) => {
        const queryParams = new URLSearchParams();
        if (params.type) queryParams.append('type', params.type);
        if (params.minCapacity) queryParams.append('minCapacity', params.minCapacity);
        if (params.location) queryParams.append('location', params.location);
        if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
        return api.get(`/resources/search?${queryParams.toString()}`);
    }
};

export default api;