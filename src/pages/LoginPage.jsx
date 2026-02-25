import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { validateLoginForm } from "../utils/validation.js";
import { formatErrorMessage } from "../utils/errorHandler.js";
import { authService } from "../services/api.service";
import "../styles/LoginPage.css";

function LoginPage() {
  const [page, setPage] = useState("login");
  const [role, setRole] = useState("intern");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    // ✅ Your Custom Validation
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      alert("Login Error: Please check your email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login(email, password, role);
      if (response) {
        const userRole = (response.role || role).toLowerCase();
        if (userRole === "intern") navigate("/dashboard");
        else if (userRole === "mentor") navigate("/mentor");
        else if (userRole === "admin") navigate("/admin");
        else navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert(formatErrorMessage(err) || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await authService.register({
        name,
        email,
        password,
        role: role.toUpperCase(),
      });

      console.log("Registration Success:", data);

      alert(
        `${role.toUpperCase()} Account created successfully! Please sign in.`,
      );

      setPage("login");
    } catch (err) {
      console.error("Register Error:", err);
      alert(err.message || "Registration failed. Email might already exist.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= FORGOT ================= */
  const handleForgot = (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();

    if (!email) {
      alert("Email is required for password reset.");
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
        <div className="secure-badge">🔒 Secure Educational Platform</div>
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

              <form onSubmit={handleLogin} noValidate>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                />
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="forgot-text" onClick={() => setPage("forgot")}>
                Forgot Password?
              </p>

              <p className="switch-text">
                Don’t have an account?{" "}
                <span onClick={() => setPage("register")}>Register</span>
              </p>
            </>
          )}

          {/* REGISTER */}
          {page === "register" && (
            <>
              <h2>{role.toUpperCase()} Register</h2>
              <p>Join Aja Internship</p>

              <form onSubmit={handleRegister} noValidate>
                <input
                  name="name"
                  placeholder="Full Name"
                  autoComplete="name"
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  required
                />
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Register"}
                </button>
              </form>

              <p className="switch-text">
                Already have an account?{" "}
                <span onClick={() => setPage("login")}>Login</span>
              </p>
            </>
          )}

          {/* FORGOT */}
          {page === "forgot" && (
            <>
              <h2>Forgot Password</h2>
              <p>Enter your email to reset password</p>

              <form onSubmit={handleForgot} noValidate>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
                <button type="submit">Send Reset Link</button>
              </form>

              <p className="switch-text">
                Back to <span onClick={() => setPage("login")}>Login</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
