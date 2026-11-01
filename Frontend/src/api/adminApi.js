import api from './axios';//
import { DEPARTMENTS } from '../utils/constants';
import { issueApi } from './issueApi';

export const adminApi = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch {
      try {
        const issues = await issueApi.getAllIssues();
        const criticalCount = issues.filter(i => i.severity === 'CRITICAL').length;
        const inProgressCount = issues.filter(i => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length;
        const resolvedCount = issues.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;

        return {
          totalIssues: issues.length,
          criticalCount,
          inProgressCount,
          resolvedCount,
          resolutionRate: issues.length > 0 ? Math.round((resolvedCount / issues.length) * 100) : 0,
          avgResolutionHours: 0,
          totalCitizenReporters: 0,
          aiAccuracyScore: 0
        };
      } catch {
        return {
          totalIssues: 0,
          criticalCount: 0,
          inProgressCount: 0,
          resolvedCount: 0,
          resolutionRate: 0,
          avgResolutionHours: 0,
          totalCitizenReporters: 0,
          aiAccuracyScore: 0
        };
      }
    }
  },

  getDepartments: async () => {
    try {
      const response = await api.get('/admin/departments');
      return response.data;
    } catch {
      return DEPARTMENTS;
    }
  },

  updateDepartmentAssignment: async (issueId, departmentId, officerName) => {
    try {
      const response = await api.post('/admin/assign', { issueId, departmentId, officerName });
      return response.data;
    } catch {
      const dept = DEPARTMENTS.find(d => d.id === departmentId)?.name || departmentId;
      return await issueApi.updateIssueStatus(
        issueId,
        'ASSIGNED',
        `Assigned to ${dept} (${officerName || 'Duty Engineer'})`,
        officerName,
        dept
      );
    }
  },

  getRiskPredictionData: async () => {
    try {
      const response = await api.get('/admin/risk-predictions');
      return response.data;
    } catch {
      return {
        highRiskZones: [],
        seasonalForecast: []
      };
    }
  }
};

export default adminApi;
