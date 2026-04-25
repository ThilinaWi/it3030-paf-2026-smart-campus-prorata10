import api from './api';

const normalizeArrayPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const incidentService = {
  createIncident: async (data) => {
    const response = await api.post('/tickets', data);
    return response.data;
  },

  getMyIncidents: async () => {
    const response = await api.get('/tickets/my');
    return normalizeArrayPayload(response.data);
  },

  getAllIncidents: async (params = {}) => {
    const response = await api.get('/tickets/all', { params });
    const payload = response.data;

    if (Array.isArray(payload)) {
      return {
        content: payload,
        page: 1,
        size: payload.length || params.size || 6,
        totalElements: payload.length,
        totalPages: 1,
        first: true,
        last: true,
      };
    }

    return {
      content: payload?.content || [],
      page: payload?.page || 1,
      size: payload?.size || params.size || 6,
      totalElements: payload?.totalElements || 0,
      totalPages: payload?.totalPages || 1,
      first: payload?.first ?? true,
      last: payload?.last ?? true,
    };
  },

  getAssignedIncidents: async () => {
    const response = await api.get('/tickets/assigned');
    return normalizeArrayPayload(response.data);
  },

  getIncidentById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  assignTechnician: async (id, technicianId) => {
    const response = await api.patch(`/tickets/${id}/assign`, { technicianId });
    return response.data;
  },

  updateIncident: async (id, data) => {
    const response = await api.put(`/incidents/${id}`, data);
    return response.data;
  },

  deleteIncident: async (id) => {
    await api.delete(`/incidents/${id}`);
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/incidents/${id}/status`, { status });
    return response.data;
  },

  addUpdate: async (id, data) => {
    const response = await api.post(`/tickets/${id}/updates`, data);
    return response.data;
  },

  getUpdates: async (id) => {
    const response = await api.get(`/tickets/${id}/updates`);
    const payload = response.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.content)) return payload.content;
    return [];
  },

  uploadAttachment: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    // Let the browser set multipart boundary automatically.
    const response = await api.post(`/tickets/${id}/attachments`, formData);
    return response.data;
  },

  downloadAttachment: async (id, path) => {
    const response = await api.get(`/tickets/${id}/attachments/download`, {
      params: { path },
      responseType: 'blob',
    });

    const disposition = response.headers['content-disposition'] || '';
    const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
    const rawPathName = decodeURIComponent((path || '').split('/').pop() || 'attachment');
    const fallbackFilename = rawPathName.includes('_') ? rawPathName.substring(rawPathName.indexOf('_') + 1) : rawPathName;
    const filename = decodeURIComponent(match?.[1] || match?.[2] || fallbackFilename || 'attachment');

    const blobUrl = window.URL.createObjectURL(response.data);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.setAttribute('download', filename);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(blobUrl);
  },
};

export default incidentService;
