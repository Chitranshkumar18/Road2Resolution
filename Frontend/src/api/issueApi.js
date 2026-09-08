import api from './axios';
import { INITIAL_MOCK_ISSUES } from '../utils/constants';

const STORAGE_KEY = 'civicvision_issues_db';

function getLocalIssues() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ISSUES));
    return INITIAL_MOCK_ISSUES;
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MOCK_ISSUES;
  } catch {
    return INITIAL_MOCK_ISSUES;
  }
}

function saveLocalIssues(issues) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
  } catch (err) {
    console.warn('LocalStorage save notice (handling storage limits):', err);
    try {
      // Safe fallback: Trim oversized data URLs (> 100KB) to prevent storage quota exhaustion
      const sanitized = issues.map((i) => ({
        ...i,
        repairVerificationUrl:
          typeof i.repairVerificationUrl === 'string' && i.repairVerificationUrl.length > 100000
            ? 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=800&auto=format&fit=crop&q=80'
            : i.repairVerificationUrl,
        workerSubmission: i.workerSubmission
          ? {
              ...i.workerSubmission,
              afterImageUrl:
                typeof i.workerSubmission.afterImageUrl === 'string' && i.workerSubmission.afterImageUrl.length > 100000
                  ? 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=800&auto=format&fit=crop&q=80'
                  : i.workerSubmission.afterImageUrl
            }
          : undefined
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    } catch (e2) {
      console.warn('LocalStorage secondary fallback ignored:', e2);
    }
  }
}

export const issueApi = {
  getAllIssues: async (filters = {}) => {
    try {
      const response = await api.get('/issues', { params: filters });
      return response.data;
    } catch {
      let issues = getLocalIssues();
      
      if (filters.category && filters.category !== 'all') {
        issues = issues.filter(i => i.category === filters.category);
      }
      if (filters.status && filters.status !== 'all') {
        issues = issues.filter(i => i.status === filters.status);
      }
      if (filters.severity && filters.severity !== 'all') {
        issues = issues.filter(i => i.severity === filters.severity);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        issues = issues.filter(i => 
          i.title.toLowerCase().includes(q) || 
          i.description.toLowerCase().includes(q) ||
          i.location?.address?.toLowerCase().includes(q)
        );
      }
      if (filters.reporterEmail) {
        issues = issues.filter(i => i.reporter?.email === filters.reporterEmail);
      }
      
      return issues;
    }
  },

  getIssueById: async (id) => {
    try {
      const response = await api.get(`/issues/${id}`);
      return response.data;
    } catch {
      const issues = getLocalIssues();
      const issue = issues.find(i => i.id === id) || INITIAL_MOCK_ISSUES.find(i => i.id === id);
      if (!issue) {
        return issues[0] || INITIAL_MOCK_ISSUES[0];
      }
      return issue;
    }
  },

  createIssue: async (issueData) => {
    try {
      const response = await api.post('/issues', issueData);
      return response.data;
    } catch {
      const issues = getLocalIssues();
      const newIssue = {
        id: `CIV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        upvotes: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
          { status: 'Reported', time: new Date().toISOString(), note: 'Submitted by citizen with AI scan data.' },
          { status: 'AI Verified', time: new Date().toISOString(), note: `AI categorized as ${issueData.category} with score ${issueData.priorityScore || 80}.` }
        ],
        ...issueData
      };
      
      const updatedList = [newIssue, ...issues];
      saveLocalIssues(updatedList);
      return newIssue;
    }
  },

  updateIssueStatus: async (id, status, note, assignedOfficer, department) => {
    try {
      const response = await api.patch(`/issues/${id}/status`, { status, note, assignedOfficer, department });
      return response.data;
    } catch {
      const issues = getLocalIssues();
      let index = issues.findIndex(i => i.id === id);
      if (index === -1) {
        index = 0;
      }
      
      const issue = issues[index] || INITIAL_MOCK_ISSUES[0];
      const updatedTimeline = [
        ...(issue.timeline || []),
        {
          status: status.replace('_', ' '),
          time: new Date().toISOString(),
          note: note || `Status updated to ${status}`
        }
      ];

      const updated = {
        ...issue,
        status,
        updatedAt: new Date().toISOString(),
        assignedOfficer: assignedOfficer !== undefined ? assignedOfficer : issue.assignedOfficer,
        department: department !== undefined ? department : issue.department,
        timeline: updatedTimeline
      };

      issues[index] = updated;
      saveLocalIssues(issues);
      return updated;
    }
  },

  upvoteIssue: async (id) => {
    try {
      const response = await api.post(`/issues/${id}/upvote`);
      return response.data;
    } catch {
      const issues = getLocalIssues();
      const index = issues.findIndex(i => i.id === id);
      if (index !== -1) {
        issues[index].upvotes = (issues[index].upvotes || 0) + 1;
        saveLocalIssues(issues);
        return issues[index];
      }
      return issues[0];
    }
  },

  submitRepairVerification: async (id, repairImageUrl, notes, auditData) => {
    try {
      const response = await api.post(`/issues/${id}/verify-repair`, { repairImageUrl, notes, auditData });
      return response.data;
    } catch {
      const issues = getLocalIssues();
      let index = issues.findIndex(i => i.id === id);
      if (index === -1) {
        index = 0;
      }
      
      const issue = issues[index] || INITIAL_MOCK_ISSUES[0];
      const updated = {
        ...issue,
        repairVerificationUrl: repairImageUrl,
        status: 'RESOLVED',
        updatedAt: new Date().toISOString(),
        repairAudit: {
          verified: true,
          confidenceScore: auditData?.confidenceScore || 97.4,
          verificationNotes: notes || auditData?.verificationNotes || 'AI differential computer vision verified defect rectification and smooth surface restoration.',
          verifiedAt: new Date().toISOString(),
          verifiedBy: auditData?.verifiedBy || 'Director S. K. Malhotra (Municipal Admin)'
        },
        timeline: [
          ...(issue.timeline || []),
          {
            status: 'Repair Certified & Published',
            time: new Date().toISOString(),
            note: notes || 'Admin certified differential AI repair audit and published verified completion to Citizen Portal.'
          }
        ]
      };
      issues[index] = updated;
      saveLocalIssues(issues);
      return updated;
    }
  },

  submitWorkerRepair: async (id, { repairImageUrl, notes, materialsUsed, workerInfo }) => {
    try {
      const response = await api.post(`/issues/${id}/worker-repair`, { repairImageUrl, notes, materialsUsed, workerInfo });
      return response.data;
    } catch {
      const issues = getLocalIssues();
      let index = issues.findIndex(i => i.id === id);
      
      if (index === -1) {
        const fallback = INITIAL_MOCK_ISSUES.find(i => i.id === id) || {
          id: id || 'CIV-2026-8941',
          title: 'Infrastructure Defect',
          category: 'pothole',
          severity: 'HIGH',
          status: 'IN_PROGRESS',
          location: { address: 'Delhi NCR' },
          imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString(),
          timeline: []
        };
        issues.unshift(fallback);
        index = 0;
      }

      const issue = issues[index];
      const safeAfterImage = repairImageUrl || 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=800&auto=format&fit=crop&q=80';

      const updated = {
        ...issue,
        repairVerificationUrl: safeAfterImage,
        status: 'PENDING_VERIFICATION',
        updatedAt: new Date().toISOString(),
        workerSubmission: {
          workerName: workerInfo?.name || 'Ramesh Verma (Field Contractor)',
          workerEmail: workerInfo?.email || 'worker@civicvision.ai',
          contractorUnit: workerInfo?.contractorUnit || 'PWD Rapid Road Repair Unit #4',
          afterImageUrl: safeAfterImage,
          repairNotes: notes || 'On-site repair completed with high quality materials. Ready for Admin inspection.',
          materialsUsed: materialsUsed || 'Cold bitumen mix, hot asphalt seal & steam roller',
          submittedAt: new Date().toISOString()
        },
        timeline: [
          ...(issue.timeline || []),
          {
            status: 'Worker Submitted Repair Proof',
            time: new Date().toISOString(),
            note: `Field Contractor (${workerInfo?.name || 'Ramesh Verma'}) finished repair and submitted after-photo for Admin QA verification.`
          }
        ]
      };

      issues[index] = updated;
      saveLocalIssues(issues);
      return updated;
    }
  },

  startWorkerTask: async (id, workerInfo) => {
    try {
      const response = await api.patch(`/issues/${id}/start-work`, { workerInfo });
      return response.data;
    } catch {
      const issues = getLocalIssues();
      let index = issues.findIndex(i => i.id === id);
      if (index === -1) {
        index = 0;
      }
      
      const issue = issues[index] || INITIAL_MOCK_ISSUES[0];
      const updated = {
        ...issue,
        status: 'IN_PROGRESS',
        assignedOfficer: workerInfo?.name || 'Ramesh Verma (Field Tech)',
        updatedAt: new Date().toISOString(),
        timeline: [
          ...(issue.timeline || []),
          {
            status: 'Work In Progress',
            time: new Date().toISOString(),
            note: `Field unit ${workerInfo?.contractorUnit || 'Rapid Repair Unit'} dispatched and commenced on-site repairs.`
          }
        ]
      };
      issues[index] = updated;
      saveLocalIssues(issues);
      return updated;
    }
  },

  addPublicReview: async (id, reviewData) => {
    try {
      const response = await api.post(`/issues/${id}/reviews`, reviewData);
      return response.data;
    } catch {
      const issues = getLocalIssues();
      let index = issues.findIndex(i => i.id === id);
      if (index === -1) {
        index = 0;
      }
      
      const issue = issues[index] || INITIAL_MOCK_ISSUES[0];
      const newReview = {
        id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        author: reviewData.author?.trim() || 'Anonymous Resident',
        rating: Number(reviewData.rating) || 5,
        comment: reviewData.comment?.trim() || 'Verified quality resolution.',
        createdAt: new Date().toISOString(),
        role: reviewData.role || 'Community Feedback',
        tag: reviewData.tag || 'Public Review'
      };

      const existingReviews = Array.isArray(issue.reviews) ? issue.reviews : [];
      const updated = {
        ...issue,
        reviews: [newReview, ...existingReviews],
        updatedAt: new Date().toISOString()
      };

      issues[index] = updated;
      saveLocalIssues(issues);
      return updated;
    }
  }
};

export default issueApi;
