import api from './axios';

export const analyticsApi = {
  getIssueTrends: async (timeframe = 'monthly') => {
    try {
      const response = await api.get(`/analytics/trends?timeframe=${timeframe}`);
      return response.data;
    } catch {
      return [
        { period: 'Jan', reported: 65, resolved: 58, avgResolutionHours: 24 },
        { period: 'Feb', reported: 78, resolved: 74, avgResolutionHours: 22 },
        { period: 'Mar', reported: 90, resolved: 85, avgResolutionHours: 19 },
        { period: 'Apr', reported: 81, resolved: 79, avgResolutionHours: 18 },
        { period: 'May', reported: 110, resolved: 98, avgResolutionHours: 17 },
        { period: 'Jun', reported: 145, resolved: 130, avgResolutionHours: 16 },
        { period: 'Jul', reported: 190, resolved: 172, avgResolutionHours: 15 },
        { period: 'Aug', reported: 210, resolved: 195, avgResolutionHours: 14 },
        { period: 'Sep', reported: 160, resolved: 155, avgResolutionHours: 13 }
      ];
    }
  },

  getSeverityBreakdown: async () => {
    try {
      const response = await api.get('/analytics/severity-breakdown');
      return response.data;
    } catch {
      return [
        { name: 'Critical', value: 34, color: '#F43F5E' },
        { name: 'High', value: 48, color: '#F59E0B' },
        { name: 'Medium', value: 58, color: '#EAB308' },
        { name: 'Low', value: 25, color: '#64748B' }
      ];
    }
  },

  getCategoryBreakdown: async () => {
    try {
      const response = await api.get('/analytics/category-breakdown');
      return response.data;
    } catch {
      return [
        { category: 'Potholes / Road Damage', count: 72, color: '#F59E0B' },
        { category: 'Water Supply / Leaks', count: 44, color: '#06B6D4' },
        { category: 'Streetlight Outages', count: 38, color: '#EAB308' },
        { category: 'Garbage & Sanitation', count: 56, color: '#10B981' },
        { category: 'Traffic Signals', count: 21, color: '#F43F5E' },
        { category: 'Drainage / Sewage', count: 29, color: '#6366F1' }
      ];
    }
  },

  getDepartmentWorkload: async () => {
    try {
      const response = await api.get('/analytics/department-workload');
      return response.data;
    } catch {
      return [
        { department: 'PWD Roads', active: 42, resolved: 380, targetSlaHours: 24, actualAvgHours: 18 },
        { department: 'Water Board', active: 28, resolved: 290, targetSlaHours: 12, actualAvgHours: 10 },
        { department: 'Electrical Dept', active: 19, resolved: 410, targetSlaHours: 18, actualAvgHours: 12 },
        { department: 'Sanitation', active: 35, resolved: 520, targetSlaHours: 8, actualAvgHours: 6 },
        { department: 'Traffic Bureau', active: 12, resolved: 175, targetSlaHours: 6, actualAvgHours: 4 }
      ];
    }
  }
};

export default analyticsApi;
