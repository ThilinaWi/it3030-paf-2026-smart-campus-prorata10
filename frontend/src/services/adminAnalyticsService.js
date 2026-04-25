import api from './api';

const adminAnalyticsService = {
  async getTopResources(limit = 5) {
    const response = await api.get('/admin/analytics/top-resources', { params: { limit } });
    return response.data;
  },

  async getPeakHours() {
    const response = await api.get('/admin/analytics/peak-hours');
    return response.data;
  },

  async getBookingTrends() {
    const response = await api.get('/admin/analytics/booking-trends');
    return response.data;
  },

  async getIncidentsSummary() {
    const response = await api.get('/admin/analytics/incidents-summary');
    return response.data;
  },
};

export default adminAnalyticsService;
