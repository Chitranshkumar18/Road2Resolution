import api from './axios.js';
import { INITIAL_MOCK_ISSUES, INITIAL_ORGANIZATIONS, INDIAN_STATES_AND_CITIES } from '../utils/constants.js';
import { getEligibleOrganizations, calculateDistanceKm } from '../utils/helpers.js';
import { getOfflineReadableLocation, formatDisplayAddress } from '../utils/geocoding.js';

const STORAGE_KEY = 'civicvision_issues_db';
const ORG_STORAGE_KEY = 'civicvision_organizations_db';

function getLocalIssues() {
  const stored = localStorage.getItem(STORAGE_KEY);
  let issues = INITIAL_MOCK_ISSUES;
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        issues = parsed;
      }
    } catch {
      issues = INITIAL_MOCK_ISSUES;
    }
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ISSUES));
  }

  return issues.map((i) => ({
    ...i,
    location: i.location
      ? {
          ...i.location,
          address: formatDisplayAddress(i.location.address, i.location),
        }
      : i.location,
  }));
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

function getLocalOrganizations() {
  const stored = localStorage.getItem(ORG_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(INITIAL_ORGANIZATIONS));
    return INITIAL_ORGANIZATIONS;
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ORGANIZATIONS;
  } catch {
    return INITIAL_ORGANIZATIONS;
  }
}

function saveLocalOrganizations(orgs) {
  try {
    localStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(orgs));
  } catch (err) {
    console.warn('Failed to save organizations:', err);
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
      if (filters.state && filters.state !== 'all') {
        const targetState = filters.state.toLowerCase();
        issues = issues.filter(i => (i.location?.state || 'delhi').toLowerCase() === targetState);
      }
      if (filters.city && filters.city !== 'all') {
        const targetCity = filters.city.toLowerCase();
        issues = issues.filter(i => (i.location?.city || '').toLowerCase() === targetCity);
      }
      if (filters.assignedOrgId && filters.assignedOrgId !== 'all') {
        issues = issues.filter(i => i.assignedOrgId === filters.assignedOrgId);
      }
      if (filters.responsibleType && filters.responsibleType !== 'all') {
        issues = issues.filter(i => i.responsibleType === filters.responsibleType);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        issues = issues.filter(i => 
          i.title.toLowerCase().includes(q) || 
          i.description.toLowerCase().includes(q) ||
          i.location?.address?.toLowerCase().includes(q) ||
          i.location?.city?.toLowerCase().includes(q) ||
          i.location?.state?.toLowerCase().includes(q) ||
          (i.assignedOrgName && i.assignedOrgName.toLowerCase().includes(q)) ||
          (i.responsibleName && i.responsibleName.toLowerCase().includes(q))
        );
      }
      if (filters.userId) {
        const uid = String(filters.userId).trim();
        issues = issues.filter(i => 
          String(i.userId || '').trim() === uid || 
          String(i.reporter?.id || '').trim() === uid ||
          String(i.reporter?._id || '').trim() === uid
        );
      }
      if (filters.reporterEmail) {
        const targetEmail = filters.reporterEmail.trim().toLowerCase();
        issues = issues.filter(i => (i.reporter?.email || '').trim().toLowerCase() === targetEmail);
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
      const currentUserId = issueData.userId || issueData.reporter?.id || issueData.reporter?._id || 'usr_citizen_001';
      
      const issueLat = Number(issueData.location?.lat ?? issueData.lat) || 28.6139;
      const issueLng = Number(issueData.location?.lng ?? issueData.lng) || 77.2090;

      // Automatically determine closest State and City from GPS coordinates if not explicitly given
      const resolvedGeo = getOfflineReadableLocation(issueLat, issueLng);
      let locationState = issueData.location?.state || issueData.state || resolvedGeo.state;
      let locationCity = issueData.location?.city || issueData.city || resolvedGeo.city;
      let locationDistrict = issueData.location?.district || issueData.district || resolvedGeo.district || locationCity;

      const rawAddress = issueData.location?.address || issueData.address;
      const locationAddress = formatDisplayAddress(rawAddress, { lat: issueLat, lng: issueLng, city: locationCity, state: locationState }) || resolvedGeo.address;

      const newIssue = {
        id: `CIV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: currentUserId,
        upvotes: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedOrgId: null,
        assignedOrgName: null,
        responsibleType: null,
        responsibleName: null,
        responsibleOrgName: null,
        timeline: [
          { 
            status: 'Reported', 
            time: new Date().toISOString(), 
            note: `Submitted by citizen in ${locationCity}, ${locationState} with GPS telemetry. Immediately synced to Worker and Admin portals.` 
          },
          { 
            status: 'AI Verified', 
            time: new Date().toISOString(), 
            note: `AI categorized as ${issueData.category || 'Civic Defect'} with Priority Score ${issueData.priorityScore || 85}. Synced to Admin Portal for 75km Organization Assignment and to Worker Portal.` 
          }
        ],
        ...issueData,
        userId: currentUserId,
        location: {
          address: locationAddress,
          state: locationState,
          city: locationCity,
          district: locationDistrict,
          lat: issueLat,
          lng: issueLng,
          zone: issueData.location?.zone || `${locationCity} Zone`
        },
        reporter: {
          ...issueData.reporter,
          id: currentUserId,
          _id: currentUserId,
        }
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

  // --- ORGANIZATION MANAGEMENT & LOCATION ASSIGNMENT ---

  getAllOrganizations: async (filters = {}) => {
    try {
      const response = await api.get('/organizations', { params: filters });
      return response.data;
    } catch {
      let orgs = getLocalOrganizations();
      if (filters.state && filters.state !== 'all') {
        const s = filters.state.toLowerCase();
        orgs = orgs.filter(o => o.state.toLowerCase() === s);
      }
      if (filters.category && filters.category !== 'all') {
        const cat = filters.category.toLowerCase();
        orgs = orgs.filter(o => (o.categoryIds || []).map(c => c.toLowerCase()).includes(cat));
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        orgs = orgs.filter(o => 
          o.name.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q) ||
          o.state.toLowerCase().includes(q) ||
          o.serviceArea.toLowerCase().includes(q)
        );
      }
      return orgs;
    }
  },

  createOrganization: async (orgData) => {
    try {
      const response = await api.post('/organizations', orgData);
      return response.data;
    } catch {
      const orgs = getLocalOrganizations();
      const newOrg = {
        id: `org_${(orgData.state || 'gen').slice(0, 3).toLowerCase()}_${Date.now().toString().slice(-4)}`,
        name: orgData.name,
        categoryIds: orgData.categoryIds || ['pothole', 'drainage'],
        categoryLabels: orgData.categoryLabels || ['Road Damage & Pothole'],
        state: orgData.state || 'Delhi',
        city: orgData.city || 'New Delhi',
        district: orgData.district || orgData.city || 'Central Delhi',
        serviceArea: orgData.serviceArea || `${orgData.city || 'City'} Municipal Area`,
        jurisdictionRadiusKm: Number(orgData.jurisdictionRadiusKm) || 25,
        centerCoords: orgData.centerCoords || { lat: 28.6139, lng: 77.2090 },
        activeWorkers: Number(orgData.activeWorkers) || 20,
        slaRating: orgData.slaRating || '95%',
        phone: orgData.phone || '+91 11 2300 0000',
        email: orgData.email || `contact@${(orgData.name || 'org').replace(/\s+/g, '').toLowerCase()}.gov.in`,
        type: orgData.type || 'MUNICIPAL',
        headOfOrg: orgData.headOfOrg || 'Chief Engineer'
      };
      const updatedOrgs = [newOrg, ...orgs];
      saveLocalOrganizations(updatedOrgs);
      return newOrg;
    }
  },

  getEligibleOrganizationsForIssue: async (issueId) => {
    const issues = getLocalIssues();
    const issue = issues.find(i => i.id === issueId) || issues[0];
    const orgs = getLocalOrganizations();
    if (!issue) return [];
    return getEligibleOrganizations(issue, orgs);
  },

  assignIssueToOrganization: async (issueId, organizationId, notes, assignedOfficer) => {
    try {
      const response = await api.post(`/issues/${issueId}/assign-org`, { organizationId, notes, assignedOfficer });
      return response.data;
    } catch {
      const issues = getLocalIssues();
      const orgs = getLocalOrganizations();
      let index = issues.findIndex(i => i.id === issueId);
      if (index === -1) index = 0;

      const issue = issues[index] || INITIAL_MOCK_ISSUES[0];
      const org = orgs.find(o => o.id === organizationId) || orgs[0];

      const assignedNote = notes || `Admin assigned complaint to ${org.name} based on ${issue.location?.city || org.city}, ${issue.location?.state || org.state} jurisdiction.`;

      const updated = {
        ...issue,
        status: 'ASSIGNED',
        assignedOrgId: org.id,
        assignedOrgName: org.name,
        assignedOrgState: org.state,
        assignedOrgCity: org.city,
        assignedOfficer: assignedOfficer || org.headOfOrg || 'Assigned Field Unit',
        department: org.name,
        responsibleType: 'ORGANIZATION',
        responsibleName: null, // set when worker accepts
        responsibleOrgName: org.name,
        assignedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
          ...(issue.timeline || []),
          {
            status: 'Assigned to Org',
            time: new Date().toISOString(),
            note: assignedNote
          }
        ]
      };

      issues[index] = updated;
      saveLocalIssues(issues);
      return updated;
    }
  },

  acceptWorkAsOrganization: async (issueId, workerInfo) => {
    try {
      const response = await api.post(`/issues/${issueId}/accept-org`, { workerInfo });
      return response.data;
    } catch {
      const issues = getLocalIssues();
      let index = issues.findIndex(i => i.id === issueId);
      if (index === -1) index = 0;

      const issue = issues[index] || INITIAL_MOCK_ISSUES[0];
      const workerName = workerInfo?.name || 'Field Technician';
      const orgName = workerInfo?.organizationName || issue.assignedOrgName || 'Assigned Municipal Organization';

      const updated = {
        ...issue,
        status: 'IN_PROGRESS',
        responsibleType: 'ORGANIZATION',
        responsibleName: workerName,
        responsibleOrgName: orgName,
        assignedOfficer: `${workerName} (${orgName})`,
        workAcceptedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
          ...(issue.timeline || []),
          {
            status: 'Work Accepted by Organization',
            time: new Date().toISOString(),
            note: `${orgName} field crew (${workerName}) accepted responsibility and commenced field operations.`
          }
        ]
      };

      issues[index] = updated;
      saveLocalIssues(issues);
      return updated;
    }
  },

  acceptWorkAsVolunteer: async (issueId, volunteerInfo) => {
    try {
      const response = await api.post(`/issues/${issueId}/volunteer`, { volunteerInfo });
      return response.data;
    } catch {
      const issues = getLocalIssues();
      let index = issues.findIndex(i => i.id === issueId);
      if (index === -1) index = 0;

      const issue = issues[index] || INITIAL_MOCK_ISSUES[0];
      const volName = volunteerInfo?.name || 'Individual Worker / Public Person';
      const previousOrg = issue.assignedOrgName;

      const updated = {
        ...issue,
        status: 'IN_PROGRESS',
        responsibleType: 'PUBLIC_INDIVIDUAL',
        responsibleName: volName,
        responsibleOrgName: null,
        assignedOfficer: `${volName} (Individual)`,
        volunteerInfo: {
          name: volName,
          phone: volunteerInfo?.phone || '+91 98000 00000',
          email: volunteerInfo?.email || 'volunteer@civicvision.ai',
          notes: volunteerInfo?.notes || 'Normal worker / public person taking personal responsibility to complete defect fix.',
          acceptedAt: new Date().toISOString()
        },
        workAcceptedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
          ...(issue.timeline || []),
          {
            status: 'Work Taken by Individual Person',
            time: new Date().toISOString(),
            note: previousOrg 
              ? `Individual Worker (${volName}) stepped forward and took direct responsibility for this complaint (reassigned from ${previousOrg}). It is no longer an active task for the organization.`
              : `Individual Worker (${volName}) stepped forward and took personal responsibility to resolve this hazard.`
          }
        ]
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
      const isVolunteer = auditData?.completedByEntity?.type === 'PUBLIC_INDIVIDUAL' || issue.responsibleType === 'PUBLIC_INDIVIDUAL' || issue.workerSubmission?.submittedBy === 'PUBLIC_INDIVIDUAL' || issue.workerSubmission?.isVolunteer;
      
      const completedEntity = auditData?.completedByEntity || {
        type: isVolunteer ? 'PUBLIC_INDIVIDUAL' : 'ORGANIZATION',
        name: isVolunteer 
          ? (issue.responsibleName || issue.workerSubmission?.workerName || 'Public Citizen Volunteer')
          : (issue.workerSubmission?.workerName || issue.responsibleName || 'Field Technician'),
        organizationName: isVolunteer 
          ? null 
          : (issue.assignedOrgName || issue.workerSubmission?.organizationName || issue.department || 'Municipal Organization')
      };

      const entityLabel = isVolunteer
        ? `Public Volunteer (${completedEntity.name})`
        : `${completedEntity.organizationName} (${completedEntity.name})`;

      const updated = {
        ...issue,
        repairVerificationUrl: repairImageUrl,
        status: 'RESOLVED',
        updatedAt: new Date().toISOString(),
        repairAudit: {
          verified: true,
          confidenceScore: auditData?.confidenceScore || 97.4,
          verificationNotes: notes || auditData?.verificationNotes || `AI differential QA verified defect rectification completed by ${entityLabel}.`,
          verifiedAt: new Date().toISOString(),
          verifiedBy: auditData?.verifiedBy || 'Director S. K. Malhotra (Municipal Admin)',
          completedByEntity: completedEntity
        },
        timeline: [
          ...(issue.timeline || []),
          {
            status: 'Repair Certified & Published',
            time: new Date().toISOString(),
            note: `Admin verified resolution proof completed by ${entityLabel} and published verified completion to Citizen & Public Review Portals.`
          }
        ]
      };
      issues[index] = updated;
      saveLocalIssues(issues);
      return updated;
    }
  },

  submitWorkerRepair: async (id, { repairImageUrl, notes, materialsUsed, workerInfo, gpsVerification, submittedBy, isVolunteer, organizationName }) => {
    try {
      const response = await api.post(`/issues/${id}/worker-repair`, { repairImageUrl, notes, materialsUsed, workerInfo, gpsVerification, submittedBy, isVolunteer, organizationName });
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
          location: { address: 'Delhi NCR', state: 'Delhi', city: 'New Delhi' },
          imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString(),
          timeline: []
        };
        issues.unshift(fallback);
        index = 0;
      }

      const issue = issues[index];
      const safeAfterImage = repairImageUrl || 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=800&auto=format&fit=crop&q=80';

      const isVol = isVolunteer || submittedBy === 'PUBLIC_INDIVIDUAL' || issue.responsibleType === 'PUBLIC_INDIVIDUAL';
      const responsibleType = isVol ? 'PUBLIC_INDIVIDUAL' : 'ORGANIZATION';
      const actorName = workerInfo?.name || (isVol ? 'Public Citizen Volunteer' : 'Ramesh Verma (Field Contractor)');
      const resolvedOrgName = isVol ? null : (organizationName || issue.assignedOrgName || workerInfo?.contractorUnit || 'Municipal Rapid Repair Unit');

      const updated = {
        ...issue,
        repairVerificationUrl: safeAfterImage,
        status: 'PENDING_VERIFICATION',
        responsibleType,
        responsibleName: actorName,
        responsibleOrgName: resolvedOrgName,
        updatedAt: new Date().toISOString(),
        workerSubmission: {
          submittedBy: responsibleType,
          isVolunteer: isVol,
          workerName: actorName,
          workerEmail: workerInfo?.email || (isVol ? 'volunteer@civicvision.ai' : 'worker@civicvision.ai'),
          organizationName: resolvedOrgName,
          contractorUnit: isVol ? 'Public Citizen Volunteer' : (workerInfo?.contractorUnit || resolvedOrgName),
          afterImageUrl: safeAfterImage,
          repairNotes: notes || (isVol ? 'Resolution completed by citizen volunteer. Ready for Admin inspection.' : 'On-site repair completed with high quality materials. Ready for Admin inspection.'),
          materialsUsed: materialsUsed || (isVol ? 'Community tools and cold asphalt patch' : 'Cold bitumen mix, hot asphalt seal & steam roller'),
          gpsVerification: gpsVerification || {
            verified: true,
            distanceMeters: 35,
            timestamp: new Date().toISOString()
          },
          submittedAt: new Date().toISOString()
        },
        timeline: [
          ...(issue.timeline || []),
          {
            status: isVol ? 'Volunteer Submitted Resolution Proof' : 'Worker Submitted Repair Proof',
            time: new Date().toISOString(),
            note: isVol
              ? `Public Volunteer (${actorName}) completed repair and submitted photo proof (≤250m GPS verified) for Admin QA inspection.`
              : `Field Worker (${actorName}) from ${resolvedOrgName} completed repair and submitted after-photo for Admin QA verification.`
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
      const workerName = workerInfo?.name || 'Ramesh Verma (Field Tech)';
      const orgName = workerInfo?.contractorUnit || issue.assignedOrgName || 'Rapid Repair Unit';

      const updated = {
        ...issue,
        status: 'IN_PROGRESS',
        assignedOfficer: workerName,
        responsibleType: 'ORGANIZATION',
        responsibleName: workerName,
        responsibleOrgName: orgName,
        updatedAt: new Date().toISOString(),
        timeline: [
          ...(issue.timeline || []),
          {
            status: 'Work In Progress',
            time: new Date().toISOString(),
            note: `Field unit ${orgName} (${workerName}) dispatched and commenced on-site repairs.`
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
        tag: reviewData.tag || 'Public Review',
        reviewedEntity: reviewData.reviewedEntity || null
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
