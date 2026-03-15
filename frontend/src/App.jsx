import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Profile from "./pages/Profile.jsx";
import ReportIssue from "./pages/ReportIssue.jsx";
import ViewComplaints from "./pages/ViewComplaints.jsx";   // ← NEW
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ROLES } from "./utils/roles.js";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>

        {/* ── Public routes ── */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ── Protected: Dashboard ── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.VOLUNTEER, ROLES.ADMIN]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

        {/* ── Protected: View Complaints ── */}
        <Route
          path="/dashboard/view-complaints"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.VOLUNTEER, ROLES.ADMIN]}>
              <ViewComplaints />
            </ProtectedRoute>
          }
        />

        {/* ── Protected: Profile ── */}
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.VOLUNTEER, ROLES.ADMIN]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ── Protected: Report Issue ── */}
        <Route
          path="/dashboard/report-issue"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.VOLUNTEER, ROLES.ADMIN]}>
              <ReportIssue />
            </ProtectedRoute>
          }
        />

      </Route>
    </Routes>
  );
}

export default App;