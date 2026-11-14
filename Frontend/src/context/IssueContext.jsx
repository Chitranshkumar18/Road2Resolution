import React, { createContext, useState, useEffect, useCallback } from 'react';
import { issueApi } from '../api/issueApi';

export const IssueContext = createContext(null);

export const IssueProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    severity: 'all',
    state: 'all',
    city: 'all',
    search: '',
  });

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const data = await issueApi.getAllIssues(filters);
      setIssues(data);
    } catch (err) {
      console.error('Failed to fetch issues:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchOrganizations = useCallback(async () => {
    try {
      const orgs = await issueApi.getAllOrganizations();
      setOrganizations(orgs);
    } catch (err) {
      console.error('Failed to fetch organizations:', err);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
    fetchOrganizations();
  }, [fetchIssues, fetchOrganizations]);

  const addIssue = async (newIssueData) => {
    const created = await issueApi.createIssue(newIssueData);
    setIssues(prev => [created, ...prev]);
    return created;
  };

  const updateIssueStatus = async (id, status, note, assignedOfficer, department) => {
    const updated = await issueApi.updateIssueStatus(id, status, note, assignedOfficer, department);
    setIssues(prev => prev.map(item => item.id === id ? updated : item));
    return updated;
  };

  const assignIssueToOrganization = async (issueId, organizationId, notes, assignedOfficer) => {
    const updated = await issueApi.assignIssueToOrganization(issueId, organizationId, notes, assignedOfficer);
    setIssues(prev => prev.map(item => item.id === issueId ? updated : item));
    return updated;
  };

  const acceptWorkAsOrganization = async (issueId, workerInfo) => {
    const updated = await issueApi.acceptWorkAsOrganization(issueId, workerInfo);
    setIssues(prev => prev.map(item => item.id === issueId ? updated : item));
    return updated;
  };

  const acceptWorkAsVolunteer = async (issueId, volunteerInfo) => {
    const updated = await issueApi.acceptWorkAsVolunteer(issueId, volunteerInfo);
    setIssues(prev => prev.map(item => item.id === issueId ? updated : item));
    return updated;
  };

  const createOrganization = async (orgData) => {
    const created = await issueApi.createOrganization(orgData);
    setOrganizations(prev => [created, ...prev]);
    return created;
  };

  const getEligibleOrganizationsForIssue = async (issueId) => {
    return await issueApi.getEligibleOrganizationsForIssue(issueId);
  };

  const upvoteIssue = async (id) => {
    const updated = await issueApi.upvoteIssue(id);
    setIssues(prev => prev.map(item => item.id === id ? updated : item));
    return updated;
  };

  const submitRepairVerification = async (id, repairImageUrl, notes, auditData) => {
    const updated = await issueApi.submitRepairVerification(id, repairImageUrl, notes, auditData);
    setIssues(prev => prev.map(item => item.id === id ? updated : item));
    return updated;
  };

  const submitWorkerRepair = async (id, repairData) => {
    const updated = await issueApi.submitWorkerRepair(id, repairData);
    setIssues(prev => prev.map(item => item.id === id ? updated : item));
    return updated;
  };

  const startWorkerTask = async (id, workerInfo) => {
    const updated = await issueApi.startWorkerTask(id, workerInfo);
    setIssues(prev => prev.map(item => item.id === id ? updated : item));
    return updated;
  };

  const addPublicReview = async (id, reviewData) => {
    const updated = await issueApi.addPublicReview(id, reviewData);
    setIssues(prev => prev.map(item => item.id === id ? updated : item));
    return updated;
  };

  return (
    <IssueContext.Provider
      value={{
        issues,
        organizations,
        loading,
        filters,
        setFilters,
        refreshIssues: fetchIssues,
        refreshOrganizations: fetchOrganizations,
        addIssue,
        updateIssueStatus,
        assignIssueToOrganization,
        acceptWorkAsOrganization,
        acceptWorkAsVolunteer,
        createOrganization,
        getEligibleOrganizationsForIssue,
        upvoteIssue,
        submitRepairVerification,
        submitWorkerRepair,
        startWorkerTask,
        addPublicReview
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};

export default IssueProvider;
