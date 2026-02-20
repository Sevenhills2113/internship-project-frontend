
import React from "react";
import { Link } from "react-router-dom";
import "../styles/LoginPage.css"; // reuse login styles for register page

export default function RegisterPage() {
  return (
    <div className="container">

      <div className="login-box" style={{ margin: "auto" }}>
        <h2>Create Account</h2>
        <p>Register to join InternshipHub</p>

        <form>
          <label>Full Name *</label>
          <input type="text" placeholder="Enter your name" />

          <label>Email *</label>
          <input type="email" placeholder="Enter your email" />

          <label>Password *</label>
          <input type="password" placeholder="Create password" />

          <label>Confirm Password *</label>
          <input type="password" placeholder="Confirm password" />

          <button>Register</button>
        </form>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/">Sign In</Link>
        </p>
      </div>

    </div>
  );
}
