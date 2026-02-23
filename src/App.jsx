import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import MentorDashboard from "./pages/MentorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import InternsList from "./pages/Interns";
import SubmissionsPage from "./pages/Submissions";

function AppContent() {
  const location = useLocation();
  const [lastInAppPath, setLastInAppPath] = useState(location.pathname);

  // Track last allowed in-app path for back button guard
  useEffect(() => {
    const isAuthPage = location.pathname === "/" || location.pathname === "/login";
    if (!isAuthPage) {
      setLastInAppPath(location.pathname);
    }
  }, [location.pathname]);

  // Centralized popstate handler: prevent back to login/landing while authenticated
  useEffect(() => {
    const handlePopstate = () => {
      const token = localStorage.getItem("token");
      
      // If user is logged in and back would take them to login/landing, restore last in-app path
      if (token && (location.pathname === "/" || location.pathname === "/login")) {
        window.history.pushState(null, "", lastInAppPath || "/dashboard");
      }
    };

    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, [lastInAppPath, location.pathname]);

  return (
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Login Page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Dashboard - supports sub-routes for sections */}
      <Route path="/dashboard/*" element={<Dashboard />} />

      {/* Mentor Dashboard */}
      <Route path="/mentor" element={<MentorDashboard />} />

      {/* Admin Dashboard */}
      <Route path="/admin" element={<AdminDashboard />} />

      {/* Interns List */}
      <Route path="/interns" element={<InternsList />} />

      {/* Submissions */}
      <Route path="/submissions" element={<SubmissionsPage />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
