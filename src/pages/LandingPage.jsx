import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

// 1. Add the placement data here
const placements = [
  { name: "Vinitha badi", tech: "Java Developer" },
  { name: "Yedukondalu Thontla", tech: "Java Engineer" },
  { name: "Dileep", tech: "DevOps Specialist" },
  { name: "Ashokkumar Nimmaturi", tech: "Salesforce Admin" },
  { name: "Jhansi Rani Garidepalli", tech: "Cloud Architect" },
  { name: "Radhika Nampally", tech: "Full Stack Dev" },
  { name: "Alina Malla", tech: "Data Scientist" },
  { name: "Sravani Annapureddy", tech: "Java Developer" },
  { name: "Ramya Peddinti", tech: "Python Specialist" },
];

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Background Elements */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-grid"></div>

      {/* Navbar Code... (kept same) */}
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

      {/* Hero Section Code... (kept same) */}
      <header className="hero-section">
        {/* ... your existing hero content ... */}
        <div className="hero-content">
          <div className="badge">🚀 v2.0 Now Live</div>
          <h1 className="hero-title">
            Launch Your Career at Aja Consulting Services LLP
            <br />
            <span className="highlight">With Real Experience</span>
          </h1>
          <p className="hero-subtitle">
            Join thousands of interns gaining practical skills through our
            mentor-guided programs.
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
          </div>
        </div>
      </header>

      {/* --- ADD THE TICKER SECTION HERE --- */}
      <section className="deploymentTicker">
        <div className="tickerTitle">Recent Successful Deployments 🚀</div>
        <div className="tickerWrapper">
          <div className="tickerTrack">
            {/* We map twice to create the infinite loop effect */}
            {[...placements, ...placements].map((item, index) => (
              <div key={index} className="tickerItem">
                <span className="internName">{item.name}</span>
                <span className="internTech">{item.tech}</span>
                <span className="dot">•</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ------------------------------------ */}

      {/* Features Grid Code... (kept same) */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Us?</h2>
          <p>Everything you need to kickstart your professional journey.</p>
        </div>
        {/* ... your existing feature cards ... */}
      </section>

      <footer className="landing-footer">
        <p>© 2026 InternshipHub. Aja Consulting Services LLP.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
