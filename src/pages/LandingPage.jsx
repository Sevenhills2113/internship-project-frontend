import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

/**
 * Landing Page Component
 * Features a modern "Dark Glassmorphism" aesthetic with smooth animations.
 */
function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Background Elements */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-grid"></div>

      {/* Navbar */}
      <nav className="landing-nav">
        <div className="logo">
          <span className="logo-icon">🎓</span> InternshipHub
        </div>
        <div className="nav-links">
          <button className="login-btn-nav" onClick={() => navigate("/login")}>
            Login
          </button>
          <button
            className="signup-btn-nav"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="badge">🚀 v2.0 Now Live</div>
          <h1 className="hero-title">
            Launch Your Career at Aja Consulting Services LLP
            <br />
            <span className="highlight">With Real Experience</span>
          </h1>

          <p className="hero-subtitle">
            Join thousands of interns gaining practical skills through our
            mentor-guided internship programs. Master the tech stack that
            matters.
          </p>

          <div className="cta-group">
            <button
              className="cta-button primary"
              onClick={() => navigate("/login")}
            >
              Start Learning <span className="arrow-icon">→</span>
            </button>
            <button
              className="cta-button secondary"
              onClick={() => window.scrollTo(0, 800)}
            >
              Explore Programs
            </button>
          </div>

          <div className="trust-badges">
            <span>Trusted by students from:</span>
            <div className="logos">
              <span>MIT</span> • <span>Stanford</span> • <span>IIT</span> •{" "}
              <span>BITS</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glass-card main-card">
            <div className="card-header">
              <div className="circle red"></div>
              <div className="circle yellow"></div>
              <div className="circle green"></div>
            </div>
            <div className="code-content">
              <span className="keyword">const</span>{" "}
              <span className="variable">internship</span> = &#123; <br />
              &nbsp;&nbsp;status: <span className="string">"Hired"</span>,<br />
              &nbsp;&nbsp;skills: [<span className="string">"React"</span>,{" "}
              <span className="string">"Node"</span>],
              <br />
              &nbsp;&nbsp;salary: <span className="number">120000</span>
              <br />
              &#125;;
            </div>
            <div className="floating-badge b1">✅ 100% Verified</div>
            <div className="floating-badge b2">🔥 Top Rated</div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Us?</h2>
          <p>Everything you need to kickstart your professional journey.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="icon-box">📚</div>
            <h3>Structured Learning</h3>
            <p>
              Follow a clear roadmap designed by industry experts to master
              complex topics step-by-step.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-box">💡</div>
            <h3>Real Projects</h3>
            <p>
              Work on tasks that mimic real-world software development. No more
              "todo list" tutorials.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-box">🤝</div>
            <h3>Expert Mentorship</h3>
            <p>
              Get code reviews and personalized feedback from experienced senior
              engineers.
            </p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 InternshipHub. Crafted with ❤️ for developers.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
