import api from './api';

// Helper function to normalize different backend response formats into an array
const normalizeArrayPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const incidentService = {

  // Create a new incident ticket
  createIncident: async (data) => {
    const response = await api.post('/tickets', data);
    return response.data;
  },

  // Get incidents created by logged-in user
  getMyIncidents: async () => {
    const response = await api.get('/tickets/my');
    return normalizeArrayPayload(response.data);
  },

  // Get all incidents (admin view with pagination support)
  getAllIncidents: async (params = {}) => {
    const response = await api.get('/tickets/all', { params });
    const payload = response.data;

    // If backend returns simple array, convert to pagination format
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

    // If backend already returns paginated response
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

  // Get incidents assigned to technician
  getAssignedIncidents: async () => {
    const response = await api.get('/tickets/assigned');
    return normalizeArrayPayload(response.data);
  },

  // Get single incident by ID
  getIncidentById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  // Assign technician to a ticket (admin action)
  assignTechnician: async (id, technicianId) => {
    const response = await api.patch(`/tickets/${id}/assign`, { technicianId });
    return response.data;
  },

  // Update incident details (title, description, etc.)
  updateIncident: async (id, data) => {
    const response = await api.put(`/incidents/${id}`, data);
    return response.data;
  },

  // Delete incident (soft delete)
  deleteIncident: async (id) => {
    await api.delete(`/incidents/${id}`);
  },

  // Update ticket status (e.g., IN_PROGRESS, RESOLVED, CLOSED)
  updateStatus: async (id, status) => {
    const response = await api.put(`/incidents/${id}/status`, { status });
    return response.data;
  },

  // Add technician update message
  addUpdate: async (id, data) => {
    const response = await api.post(`/tickets/${id}/updates`, data);
    return response.data;
  },

  // Get all update messages for a ticket
  getUpdates: async (id) => {
    const response = await api.get(`/tickets/${id}/updates`);
    const payload = response.data;

    // Normalize response formats
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.content)) return payload.content;
    return [];
  },

  // Upload attachment to a ticket
  uploadAttachment: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);

    // Browser automatically sets multipart headers
    const response = await api.post(`/tickets/${id}/attachments`, formData);
    return response.data;
  },

  // Download attachment file
  downloadAttachment: async (id, path) => {
    const response = await api.get(`/tickets/${id}/attachments/download`, {
      params: { path },
      responseType: 'blob', // Important for file download
    });

    // Extract filename from response headers
    const disposition = response.headers['content-disposition'] || '';
    const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);

    // Fallback filename handling
    const rawPathName = decodeURIComponent((path || '').split('/').pop() || 'attachment');
    const fallbackFilename = rawPathName.includes('_')
      ? rawPathName.substring(rawPathName.indexOf('_') + 1)
      : rawPathName;

    const filename = decodeURIComponent(
      match?.[1] || match?.[2] || fallbackFilename || 'attachment'
    );

    // Create temporary download link
    const blobUrl = window.URL.createObjectURL(response.data);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.setAttribute('download', filename);

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    // Clean up
    window.URL.revokeObjectURL(blobUrl);
  },
};

export default incidentService;