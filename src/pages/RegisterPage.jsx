import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api.service"; // <-- Importing your service!
import "../styles/LoginPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("🚨 REGISTER BUTTON CLICKED! Data:", formData);

    // 1. Basic Frontend Validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    try {
      // 2. Use your custom api.service.js instead of raw fetch!
      const data = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "INTERN",
      });

      // 3. Success Flow
      console.log("Registration Success:", data);
      alert("Account created successfully! Please sign in.");
      navigate("/");
    } catch (error) {
      // 4. Catch errors thrown by your apiClient
      console.error("Registration failed:", error);
      alert(error.message || "Registration failed. Email might already exist.");
    }
  };

  return (
    <div className="container">
      <div className="login-box" style={{ margin: "auto" }}>
        <h2>Create Account</h2>
        <p>Register to join InternshipHub</p>

        {/* Added noValidate so the browser stops silently blocking our code */}
        <form onSubmit={handleRegister} noValidate>
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Email *</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Password *</label>
          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
          />

          <label>Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit">Register</button>
        </form>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already have an account? <Link to="/">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
