import api from './axios';

export const analyticsApi = {
  getIssueTrends: async (timeframe = 'monthly') => {
    try {
      const response = await api.get(`/analytics/trends?timeframe=${timeframe}`);
      return response.data;
    } catch {
      return [];
    }
  },

  getSeverityBreakdown: async () => {
    try {
      const response = await api.get('/analytics/severity-breakdown');
      return response.data;
    } catch {
      return [];
    }
  },

  getCategoryBreakdown: async () => {
    try {
      const response = await api.get('/analytics/category-breakdown');
      return response.data;
    } catch {
      return [];
    }
  },

  getDepartmentWorkload: async () => {
    try {
      const response = await api.get('/analytics/department-workload');
      return response.data;
    } catch {
      return [];
    }
  }
};

export default analyticsApi;
