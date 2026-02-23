import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { validateLoginForm, validateRegisterForm } from "../utils/validation.js";
import { formatErrorMessage } from "../utils/errorHandler.js";
import "../styles/LoginPage.css";

/**
 * LoginPage Component - Authentication UI
 * Handles login, register, and password reset flows
 * Integrates with AuthContext for global state management
 */
function LoginPage() {
  const [page, setPage] = useState("login");
  const [role, setRole] = useState("intern");
  // eslint-disable-next-line no-unused-vars
  const [formErrors, setFormErrors] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login, register } = useAuth();

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    // Validate form
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login(email, password, role);

      if (response) {
        const userRole = (response.role || role).toLowerCase();

        // Navigate by role
        if (userRole === "intern") navigate("/dashboard");
        else if (userRole === "mentor") navigate("/mentor");
        else if (userRole === "admin") navigate("/admin");
        else navigate("/dashboard");
      }
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setFormErrors({ submit: errorMessage });
      console.error("Login Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    // Validate form
    const validation = validateRegisterForm(name, email, password);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name, email, password, role);
      alert("Registration successful! Please login.");
      setPage("login");
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setFormErrors({ submit: errorMessage });
      console.error("Register Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= FORGOT ================= */
  const handleForgot = (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();

    if (!email) {
      setFormErrors({ email: "Email is required" });
      return;
    }

    alert(`Password reset link sent to ${email}`);
    setPage("login");
  };


  return (
    <div className="container">

      <div className="auth-header">
        <div className="logo-box">🎓</div>
        <h1>Aja Learn2Earn</h1>
        <p className="tagline">
          Empowering the next generation through structured internships
        </p>
        <div className="secure-badge">
          🔒 Secure Educational Platform
        </div>
      </div>

      <div className="auth-wrapper">

        <div className="auth-box">

          <div className="role-tabs">
            <button
              className={role === "intern" ? "active" : ""}
              onClick={() => setRole("intern")}
            >
              Intern
            </button>

            <button
              className={role === "mentor" ? "active" : ""}
              onClick={() => setRole("mentor")}
            >
              Mentor
            </button>

            <button
              className={role === "admin" ? "active" : ""}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
          </div>


          {/* LOGIN */}
          {page === "login" && (
            <>
              <h2>{role.toUpperCase()} Sign In</h2>
              <p>Welcome back! Login to continue</p>

              <form onSubmit={handleLogin}>
                <input name="email" type="email" placeholder="Email" autocomplete="email" required />
                <input name="password" type="password" placeholder="Password" autocomplete="current-password" required />
                <button type="submit">Sign In</button>
              </form>

              <p className="forgot-text" onClick={() => setPage("forgot")}>
                Forgot Password?
              </p>

              <p className="switch-text">
                Don’t have an account?{" "}
                <span onClick={() => setPage("register")}>
                  Register
                </span>
              </p>
            </>
          )}


          {/* REGISTER */}
          {page === "register" && (
            <>
              <h2>{role.toUpperCase()} Register</h2>
              <p>Join Aja Internship</p>

              <form onSubmit={handleRegister}>
                <input name="name" placeholder="Full Name" autocomplete="name" required />
                <input name="email" type="email" placeholder="Email" autocomplete="email" required />
                <input name="password" type="password" placeholder="Password" autocomplete="new-password" required />
                <button type="submit">Register</button>
              </form>

              <p className="switch-text">
                Already have an account?{" "}
                <span onClick={() => setPage("login")}>
                  Login
                </span>
              </p>
            </>
          )}


          {/* FORGOT */}
          {page === "forgot" && (
            <>
              <h2>Forgot Password</h2>
              <p>Enter your email to reset password</p>

              <form onSubmit={handleForgot}>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  autocomplete="email"
                  required
                />
                <button type="submit">Send Reset Link</button>
              </form>

              <p className="switch-text">
                Back to{" "}
                <span onClick={() => setPage("login")}>
                  Login
                </span>
              </p>
            </>
          )}

        </div>

        {/* ================= RIGHT ================= */}
        <div className="info-box">

          <h2 className="why">
            Why Choose Aja Online Internship?
          </h2>

          <p className="info-desc">
            Build skills, gain experience, and grow your career with us.
          </p>


          <div className="features-grid">

            <div className="feature-card">
              🎯
              <div>
                <h3>Goal-Oriented</h3>
                <p>Clear learning objectives</p>
              </div>
            </div>

            <div className="feature-card">
              👥
              <div>
                <h3>Mentorship</h3>
                <p>Industry experts</p>
              </div>
            </div>

            <div className="feature-card">
              📈
              <div>
                <h3>Progress</h3>
                <p>Track achievements</p>
              </div>
            </div>

            <div className="feature-card">
              🏆
              <div>
                <h3>Certificates</h3>
                <p>Verified credentials</p>
              </div>
            </div>

          </div>


          <div className="bottom-bar">

            <div>⏰ 24/7 Access</div>
            <div className="divider"></div>
            <div>🎧 Support</div>
            <div className="divider"></div>
            <div>🌍 Global</div>

          </div>


          <div className="trust-box">

            <h4>Trusted & Secure</h4>

            <div className="trust-stats">
              <span>🛡️ SSL</span>
              <span>🎖️ Certified</span>
              <span>🔒 Private</span>
            </div>

            <p>500+ Institutions • 10k+ Users</p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;
