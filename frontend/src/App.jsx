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

// 🔥 FIXED ADMIN IMPORTS (correct path)
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import ManageComplaints from "./admin/ManageComplaints.jsx";
import ManageUsers from "./admin/ManageUsers.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ROLES } from "./utils/roles.js";

function App() {
  return (
    <Routes>

      {/* ───────── MAIN APP ───────── */}
      <Route element={<MainLayout />}>

        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.VOLUNTEER, ROLES.ADMIN]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* View Complaints */}
        <Route
          path="/dashboard/view-complaints"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.VOLUNTEER, ROLES.ADMIN]}>
              <ViewComplaints />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.VOLUNTEER, ROLES.ADMIN]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Report Issue */}
        <Route
          path="/dashboard/report-issue"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.VOLUNTEER, ROLES.ADMIN]}>
              <ReportIssue />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* ───────── ADMIN MODULE ───────── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="complaints" element={<ManageComplaints />} />
        <Route path="users" element={<ManageUsers />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;