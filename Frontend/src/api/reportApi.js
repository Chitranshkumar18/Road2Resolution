import api from './axios';
import { issueApi } from './issueApi';

export const reportApi = {
  submitReport: async (reportPayload) => {
    try {
      const response = await api.post('/reports/submit', reportPayload);
      return response.data;
    } catch {
      return await issueApi.createIssue(reportPayload);
    }
  },

  getUserReports: async (userEmail) => {
    return await issueApi.getAllIssues({ reporterEmail: userEmail });
  },

  exportReportSummary: async (format = 'json') => {
    try {
      const response = await api.get(`/reports/export?format=${format}`);
      return response.data;
    } catch {
      const issues = await issueApi.getAllIssues();
      return {
        exportDate: new Date().toISOString(),
        totalIssues: issues.length,
        data: issues
      };
    }
  }
};

export default reportApi;
