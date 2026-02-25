import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

// 1. Add the placement data here
const placements = [
  { name: "Vinitha badi", company: "Google", role: "Java Developer", image: "👩‍💻" },
  { name: "Yedukondalu Thontla", company: "Amazon", role: "Java Engineer", image: "👨‍💼" },
  { name: "Dileep", company: "Microsoft", role: "DevOps Specialist", image: "👨‍💻" },
  { name: "Ashokkumar Nimmaturi", company: "Salesforce", role: "Salesforce Admin", image: "👨‍💼" },
  { name: "Jhansi Rani Garidepalli", company: "AWS", role: "Cloud Architect", image: "👩‍💼" },
  { name: "Radhika Nampally", company: "Meta", role: "Full Stack Dev", image: "👩‍💻" },
  { name: "Alina Malla", company: "IBM", role: "Data Scientist", image: "👩‍💼" },
  { name: "Sravani Annapureddy", company: "TCS", role: "Java Developer", image: "👩‍💻" },
  { name: "Ramya Peddinti", company: "Infosys", role: "Python Specialist", image: "👩‍💼" },
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
                <div className="intern-card-item">
                  <div className="intern-avatar">{item.image}</div>
                  <div className="intern-details">
                    <h4 className="intern-name">{item.name}</h4>
                    <p className="intern-company">{item.company}</p>
                    <p className="intern-role">{item.role}</p>
                  </div>
                </div>
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
          <p>Transform your career with structured guidance, real-world projects, and proven results.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon-box">🎯</div>
            <h3>Industry-Aligned Skills</h3>
            <p>Learn the exact technologies and practices that top companies like Google, Amazon, and Microsoft are using today. Our curriculum is updated quarterly to stay ahead of industry trends.</p>
          </div>

          <div className="feature-card">
            <div className="icon-box">👥</div>
            <h3>Expert Mentorship</h3>
            <p>Get paired with experienced professionals from Fortune 500 companies who guide you through real-world challenges, share career insights, and open doors to career opportunities.</p>
          </div>

          <div className="feature-card">
            <div className="icon-box">🚀</div>
            <h3>Real-World Projects</h3>
            <p>Work on actual production-level projects that matter. Build a portfolio that impresses hiring managers and demonstrates your ability to solve complex problems in a professional environment.</p>
          </div>

          <div className="feature-card">
            <div className="icon-box">📈</div>
            <h3>Guaranteed Placement Support</h3>
            <p>9 out of 10 interns secure placements with leading tech companies. We provide interview prep, resume coaching, and direct introductions to hiring managers in our partner network.</p>
          </div>

          <div className="feature-card">
            <div className="icon-box">🏆</div>
            <h3>Verified Certificates</h3>
            <p>Earn industry-recognized certifications that validate your skills. These certificates are trusted by top companies and significantly boost your job prospects and salary negotiations.</p>
          </div>

          <div className="feature-card">
            <div className="icon-box">💼</div>
            <h3>Lifetime Career Network</h3>
            <p>Join a growing community of 10,000+ successful interns. Access exclusive job boards, networking events, and opportunities for long-term career growth throughout your professional journey.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 InternshipHub. Aja Consulting Services LLP.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
