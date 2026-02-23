import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import Profile from "./pages/Profile.jsx";
import ReportIssue from "./pages/ReportIssue.jsx"; 
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ROLES } from "./utils/roles.js";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.USER, ROLES.VOLUNTEER, ROLES.ADMIN]}
            >
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.USER, ROLES.VOLUNTEER, ROLES.ADMIN]}
            >
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/report-issue"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.USER, ROLES.VOLUNTEER, ROLES.ADMIN]}
            >
              <ReportIssue />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
