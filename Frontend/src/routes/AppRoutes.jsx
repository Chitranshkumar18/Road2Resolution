import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import CitizenLayout from '../layouts/CitizenLayout';
import WorkerLayout from '../layouts/WorkerLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import Home from '../pages/public/Home';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import PublicReviews from '../pages/public/PublicReviews';

// Citizen Pages
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import ReportIssue from '../pages/citizen/ReportIssue';
import AIAnalysis from '../pages/citizen/AIAnalysis';
import DuplicateCheck from '../pages/citizen/DuplicateCheck';
import MyReports from '../pages/citizen/MyReports';
import IssueDetails from '../pages/citizen/IssueDetails';
import ExploreMap from '../pages/citizen/ExploreMap';
import RepairVerification from '../pages/citizen/RepairVerification';
import Profile from '../pages/citizen/Profile';

// Worker Pages
import WorkerDashboard from '../pages/worker/WorkerDashboard';
import WorkerComplaints from '../pages/worker/WorkerComplaints';
import UploadRepairProof from '../pages/worker/UploadRepairProof';
import WorkerSubmittedRepairs from '../pages/worker/WorkerSubmittedRepairs';
import WorkerProfile from '../pages/worker/WorkerProfile';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import PriorityQueue from '../pages/admin/PriorityQueue';
import IssueManagement from '../pages/admin/IssueManagement';
import LiveMap from '../pages/admin/LiveMap';
import DepartmentManagement from '../pages/admin/DepartmentManagement';
import Analytics from '../pages/admin/Analytics';
import Heatmap from '../pages/admin/Heatmap';
import RiskPrediction from '../pages/admin/RiskPrediction';
import AdminRepairVerification from '../pages/admin/RepairVerification';

// Route Guards
import CitizenRoute from './CitizenRoute';
import WorkerRoute from './WorkerRoute';
import AdminRoute from './AdminRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>         
        <Route path="/" element={<Home />} />
        <Route path="/reviews" element={<PublicReviews />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Citizen Portal */}
      <Route
        path="/citizen"
        element={
          <CitizenRoute>
            <CitizenLayout />
          </CitizenRoute>
        }
      >
        <Route index element={<Navigate to="/citizen/dashboard" replace />} />
        <Route path="dashboard" element={<CitizenDashboard />} />
        <Route path="report" element={<ReportIssue />} />
        <Route path="ai-analysis" element={<AIAnalysis />} />
        <Route path="duplicate-check" element={<DuplicateCheck />} />
        <Route path="my-reports" element={<MyReports />} />
        <Route path="issue/:id" element={<IssueDetails />} />
        <Route path="explore" element={<ExploreMap />} />
        <Route path="repair-verification" element={<RepairVerification />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Worker Field Operations Hub */}
      <Route
        path="/worker"
        element={
          <WorkerRoute>
            <WorkerLayout />
          </WorkerRoute>
        }
      >
        <Route index element={<Navigate to="/worker/dashboard" replace />} />
        <Route path="dashboard" element={<WorkerDashboard />} />
        <Route path="complaints" element={<WorkerComplaints />} />
        <Route path="upload-proof" element={<UploadRepairProof />} />
        <Route path="submitted-repairs" element={<WorkerSubmittedRepairs />} />
        <Route path="profile" element={<WorkerProfile />} />
      </Route>

      {/* Admin Operations Center */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="priority-queue" element={<PriorityQueue />} />
        <Route path="issues" element={<IssueManagement />} />
        <Route path="live-map" element={<LiveMap />} />
        <Route path="departments" element={<DepartmentManagement />} />
        <Route path="repair-verification" element={<AdminRepairVerification />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="heatmap" element={<Heatmap />} />
        <Route path="risk-prediction" element={<RiskPrediction />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
