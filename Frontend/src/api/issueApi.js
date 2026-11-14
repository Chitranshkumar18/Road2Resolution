import api from './axios.js';
import { INITIAL_ORGANIZATIONS } from '../utils/constants.js';
import { getEligibleOrganizations } from '../utils/helpers.js';

export const issueApi = {
  getAllIssues: async (filters = {}) => {
    try {
      const response = await api.get('/issues', { params: filters });
      return Array.isArray(response.data) ? response.data : (response.data?.issues || []);
    } catch {
      return [];
    }
  },

  getIssueById: async (id) => {
    try {
      const response = await api.get(`/issues/${id}`);
      return response.data?.issue || response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Complaint not found or server unavailable.');
    }
  },

  createIssue: async (issueData) => {
    try {
      const response = await api.post('/issues', issueData);
      return response.data?.issue || response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Unable to submit complaint. Please check connection and try again.');
    }
  },

  updateIssueStatus: async (id, status, note, assignedOfficer, department) => {
    try {
      const response = await api.patch(`/issues/${id}/status`, {
        status,
        note,
        assignedOfficer,
        department
      });
      return response.data?.issue || response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to update issue status.');
    }
  },

  assignIssueToOrganization: async (issueId, organizationId, notes, assignedOfficer) => {
    try {
      const response = await api.post(`/issues/${issueId}/assign-organization`, {
        organizationId,
        notes,
        assignedOfficer
      });
      return response.data?.issue || response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to assign organization.');
    }
  },

  acceptWorkAsOrganization: async (issueId, workerInfo) => {
    try {
      const response = await api.post(`/issues/${issueId}/accept-org`, { workerInfo });
      return response.data?.issue || response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to accept work as organization.');
    }
  },

  acceptWorkAsVolunteer: async (issueId, volunteerInfo) => {
    try {
      const response = await api.post(`/issues/${issueId}/accept-volunteer`, { volunteerInfo });
      return response.data?.issue || response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to take task as individual.');
    }
  },

  createOrganization: async (orgData) => {
    try {
      const response = await api.post('/organizations', orgData);
      return response.data?.organization || response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to register organization.');
    }
  },

  getAllOrganizations: async () => {
    try {
      const response = await api.get('/organizations');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return INITIAL_ORGANIZATIONS;
    } catch {
      return INITIAL_ORGANIZATIONS;
    }
  },

  getEligibleOrganizationsForIssue: async (issueId) => {
    try {
      const response = await api.get(`/issues/${issueId}/eligible-organizations`);
      return response.data;
    } catch {
      return [];
    }
  },

  upvoteIssue: async (id) => {
    try {
      const response = await api.post(`/issues/${id}/upvote`);
      return response.data?.issue || response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to register upvote.');
    }
  },

  submitRepairVerification: async (id, repairImageUrl, notes, auditData) => {
    try {
      const response = await api.post(`/issues/${id}/verify-repair`, {
        repairImageUrl,
        notes,
        auditData
      });
      return response.data?.issue || response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to certify repair.');
    }
  },

  submitWorkerRepair: async (id, repairData) => {
    try {
      const response = await api.post(`/issues/${id}/worker-repair`, repairData);
      return response.data?.issue || response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to submit repair proof.');
    }
  },

  startWorkerTask: async (id, workerInfo) => {
    try {
      const response = await api.post(`/issues/${id}/start-work`, { workerInfo });
      return response.data?.issue || response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to commence task.');
    }
  },

  addPublicReview: async (id, reviewData) => {
    try {
      const response = await api.post(`/issues/${id}/reviews`, reviewData);
      return response.data?.issue || response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to submit public review.');
    }
  },

  deleteIssue: async (id) => {
    try {
      const response = await api.delete(`/issues/${id}`);
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Failed to delete issue.');
    }
  }
};

export default issueApi;
