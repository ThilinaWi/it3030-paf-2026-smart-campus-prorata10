import axios from 'axios';
import { TOKEN_KEY } from '../utils/constants';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JWT token for protected backend routes.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const resourceApi = {
  getAll: () => api.get('/resources'),
  getById: (id) => api.get(`/resources/${id}`),
  create: (resource) => api.post('/resources', resource),
  update: (id, resource) => api.put(`/resources/${id}`, resource),
  delete: (id) => api.delete(`/resources/${id}`),
  search: (filters) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);
    if (filters.location) params.append('location', filters.location);
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
    return api.get(`/resources/search?${params.toString()}`);
  },
};

export default api;