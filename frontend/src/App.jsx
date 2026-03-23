import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";

// Public pages
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

// User pages
import UserDashboard from "./pages/UserDashboard.jsx";
import Profile from "./pages/Profile.jsx";
import ReportIssue from "./pages/ReportIssue.jsx";
import ViewComplaints from "./pages/ViewComplaints.jsx";

// Admin Module Imports
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import ManageComplaints from "./admin/ManageComplaints.jsx";
import ManageUsers from "./admin/ManageUsers.jsx";
import ReportsPage from "./admin/ReportsPage.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ROLES } from "./utils/roles.js";

function App() {
  return (
    <Routes>
      {/* ───────── MAIN APP (Citizens & Volunteers) ───────── */}
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected User Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.VOLUNTEER, ROLES.ADMIN]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/view-complaints"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.VOLUNTEER, ROLES.ADMIN]}>
              <ViewComplaints />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.VOLUNTEER, ROLES.ADMIN]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/report-issue"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.VOLUNTEER, ROLES.ADMIN]}>
              <ReportIssue />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ───────── ADMIN MODULE (Restricted) ───────── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* 🔥 NEW: Auto-redirect /admin to /admin/dashboard */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />

        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="complaints" element={<ManageComplaints />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>

      {/* ───────── FALLBACK ───────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;