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

  // Let browser set multipart boundaries for FormData requests.
  if (typeof FormData !== 'undefined' && config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type'];
    delete config.headers['content-type'];
  }

    return config;
});

export const resourceApi = {
  getAll: (filters = {}) => api.get('/resources', { params: filters }),
  getById: (id) => api.get(`/resources/${id}`),
  create: (resource) => api.post('/resources', resource),
  update: (id, resource) => api.put(`/resources/${id}`, resource),
  updateStatus: (id, isActive) => api.put(`/resources/${id}/status`, { isActive }),
  delete: (id) => api.delete(`/resources/${id}`),
  search: (filters) => {
    const params = {};
    if (filters.name) params.name = filters.name;
    if (filters.type) params.type = filters.type;
    if (filters.minCapacity) params.minCapacity = filters.minCapacity;
    if (filters.location) params.location = filters.location;
    return api.get('/resources', { params });
  },
};

export default api;