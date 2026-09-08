import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';

export const WorkerRoute = ({ children }) => {
  const { isAuthenticated, isWorker, isAdmin, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Verifying field worker credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Allow workers and admins to view worker portal
  if (!isWorker && !isAdmin) {
    return <Navigate to="/citizen/dashboard" replace />;
  }

  return children;
};

export default WorkerRoute;
