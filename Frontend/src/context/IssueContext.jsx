import React, { createContext, useState, useEffect, useCallback } from 'react';
import { issueApi } from '../api/issueApi';

export const IssueContext = createContext(null);

export const IssueProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    severity: 'all',
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

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

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
        loading,
        filters,
        setFilters,
        refreshIssues: fetchIssues,
        addIssue,
        updateIssueStatus,
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
