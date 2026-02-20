import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import MentorDashboard from "./pages/MentorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import InternsList from "./pages/Interns";
import SubmissionsPage from "./pages/Submissions";

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* Home Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Mentor Dashboard */}
        <Route path="/mentor" element={<MentorDashboard />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Interns List */}
        <Route path="/interns" element={<InternsList />} />

        {/* Submissions */}
        <Route path="/submissions" element={<SubmissionsPage />} />

      </Routes>
    </AuthProvider>
  );
}

export default App;
