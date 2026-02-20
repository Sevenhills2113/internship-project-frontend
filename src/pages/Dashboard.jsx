import React, { useEffect, useState } from "react";
import {
  dashboardService,
  internService
} from "../services/api.service.js";
import { formatErrorMessage } from "../utils/errorHandler.js";
import "../styles/Dashboard.css";

/**
 * Dashboard (Intern Dashboard) Component
 * Displays internships, tasks, submissions, certificates, notifications
 * Uses service layer for API calls with error handling
 */
function Dashboard() {
  /* ================= USER ================= */
  const userId = localStorage.getItem("userId");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Alex");
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "Intern");

  /* ================= UI ================= */
  const [openMenu, setOpenMenu] = useState(false);
  const [section, setSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Submission Modal State
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= DATA ================= */
  const [overview, setOverview] = useState({
    active: 0,
    completed: 0,
    pending: 0,
    certificates: 0
  });

  const [internships, setInternships] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [resources, setResources] = useState([]);

  /* ================= LOAD DATA ================= */
  // Define merge helper outside effect so it's stable
  const mergeLocalTasks = (tasksFromServer) => {
    const local = JSON.parse(localStorage.getItem('mentor_local_tasks') || '[]');
    const localForUser = (local || [])
      .filter(t => !t.assignedTo || String(t.assignedTo) === String(userId))
      .map(t => ({
        id: t.id,
        title: t.title,
        deadline: t.deadline || t.createdAt || null,
        status: t.status || 'Pending',
        description: t.description || '',
      }));

    const serverIds = new Set((tasksFromServer || []).map(st => String(st.id)));
    const dedupedLocal = localForUser.filter(lt => !serverIds.has(String(lt.id)));

    return dedupedLocal.concat(tasksFromServer || []);
  };

  useEffect(() => {
    if (!userId) {
      window.location.href = "/";
      return;
    }

    setLoading(true);
    setError(null);

    (async () => {
      try {
        // Fetch all dashboard data in parallel using DashboardService
        const [
          overviewData,
          internshipsData,
          tasksData,
          submissionsData,
          certificatesData,
          notificationsData,
          resourcesData
        ] = await Promise.all([
          dashboardService.getDashboardOverview(userId).catch(err => {
            console.warn("Overview API failed:", formatErrorMessage(err));
            return null;
          }),
          dashboardService.getDashboardInternships(userId).catch(err => {
            console.warn("Internships API failed:", formatErrorMessage(err));
            return [];
          }),
          dashboardService.getDashboardTasks(userId).catch(err => {
            console.warn("Tasks API failed:", formatErrorMessage(err));
            return [];
          }),
          dashboardService.getDashboardSubmissions(userId).catch(err => {
            console.warn("Submissions API failed:", formatErrorMessage(err));
            return [];
          }),
          dashboardService.getDashboardCertificates(userId).catch(err => {
            console.warn("Certificates API failed:", formatErrorMessage(err));
            return [];
          }),
          dashboardService.getNotifications(userId).catch(err => {
            console.warn("Notifications API failed:", formatErrorMessage(err));
            return [];
          }),
          dashboardService.getResources().catch(err => {
            console.warn("Resources API failed:", formatErrorMessage(err));
            return [];
          })
        ]);

        // If all requests failed, use fallback
        if (!overviewData && !internshipsData?.length && !tasksData?.length) {
          console.warn("Backend unavailable, using fallback data");
          fallbackData();
          return;
        }

        // Set overview metrics from API or calculate from data
        if (overviewData) {
          setOverview(overviewData);
        } else {
          setOverview({
            active: internshipsData?.filter(i => i.status === "ACTIVE")?.length || 0,
            completed: internshipsData?.filter(i => i.status === "COMPLETED")?.length || 0,
            pending: tasksData?.filter(t => t.status === "PENDING")?.length || 0,
            certificates: certificatesData?.length || 0
          });
        }

        // Set all data from APIs
        setInternships(internshipsData || []);
        setTasks(mergeLocalTasks(tasksData));
        setSubmissions(submissionsData || []);
        setCertificates(certificatesData || []);
        setNotifications(notificationsData || []);
        setResources(resourcesData || []);

        setLoading(false);
      } catch (err) {
        const errorMsg = formatErrorMessage(err);
        console.error("Dashboard Error:", err);
        setError(errorMsg);
        fallbackData();
      }
    })();

    // listen for updates made by MentorDashboard in same window/tab
    const handleTasksUpdate = () => {
      const current = tasks;
      setTasks(mergeLocalTasks(current));
    };
    window.addEventListener('mentorTasksUpdated', handleTasksUpdate);

    // cleanup listener on unmount
    return () => window.removeEventListener('mentorTasksUpdated', handleTasksUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fallback data when backend is unavailable
  const fallbackData = () => {
    console.warn("Using fallback demo data — make sure backend server is running");

    setOverview({
      active: 2,
      completed: 5,
      pending: 3,
      certificates: 1
    });

    // Read internships from localStorage (created by mentor)
    const savedInternships = JSON.parse(localStorage.getItem('internships') || '[]');
    const defaultInternships = [
      { id: 1, title: "Web Development", company: "TechCorp", progress: 65 },
      { id: 2, title: "Mobile App Design", company: "StartupXYZ", progress: 40 }
    ];

    setInternships(savedInternships.length > 0 ? savedInternships : defaultInternships);

    setTasks([
      { id: 1, title: "Build React Component", deadline: "2026-02-20", status: "In Progress" },
      { id: 2, title: "API Integration", deadline: "2026-02-28", status: "Pending" }
    ]);

    setSubmissions([
      { id: 1, taskName: "UI Design", submittedDate: "2026-02-10", status: "Approved" }
    ]);

    setCertificates([]);
    setNotifications([
      { id: 1, title: "New Task Assigned", message: "Check your task list", date: "Today" }
    ]);
    setResources([
      { id: 1, title: "React Documentation", link: "https://react.dev" },
      { id: 2, title: "MDN Web Docs", link: "https://mdn.org" }
    ]);

    setLoading(false);
  };



  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };


  /* ================= PROFILE / SETTINGS ================= */

  const handleSettings = (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const role = e.target.role.value;

    // Save locally and update UI
    localStorage.setItem("userName", name);
    localStorage.setItem("userRole", role);

    setUserName(name);
    setUserRole(role);

    alert("Profile updated");
    setSection("dashboard");
  };

  /* ================= SUBMISSION HANDLER ================= */
  const handleSubmission = async (e) => {
    e.preventDefault();
    if (!selectedTask || !submissionUrl) return;

    setIsSubmitting(true);
    try {
      await internService.submitTask({
        taskId: selectedTask.id,
        internId: userId,
        submissionUrl: submissionUrl,
        submittedAt: new Date().toISOString(),
        status: "PENDING"
      });

      alert("Task submitted successfully!");
      setSubmissionUrl("");
      setSelectedTask(null);

      // Ideally re-fetch dashboard data here to update UI
      // For now, optimistic update or just close modal

    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to submit task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };



  /* ================= LOADING ================= */

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "60px" }}>
        Loading Dashboard...
      </h2>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px", color: "red" }}>
        <h2>⚠️ Error Loading Dashboard</h2>
        <p>{error}</p>
        <p>Using fallback demo data. Make sure backend is running at http://localhost:8081</p>
      </div>
    );
  }



  return (
    <div className="app">


      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">

        <div className="logo">🎓 InternshipHub</div>


        <nav>

          <a
            className={section === "dashboard" ? "active" : ""}
            onClick={() => setSection("dashboard")}
          >
            Dashboard
          </a>

          <a
            className={section === "tasks" ? "active" : ""}
            onClick={() => setSection("tasks")}
          >
            My Tasks
          </a>

          <a
            className={section === "submissions" ? "active" : ""}
            onClick={() => setSection("submissions")}
          >
            Submissions
          </a>

          <a
            className={section === "certificates" ? "active" : ""}
            onClick={() => setSection("certificates")}
          >
            Certificates
          </a>

          <a
            className={section === "notifications" ? "active" : ""}
            onClick={() => setSection("notifications")}
          >
            🔔 Notifications
          </a>

          <a
            className={section === "resources" ? "active" : ""}
            onClick={() => setSection("resources")}
          >
            📚 Resources
          </a>

        </nav>



        {/* ================= PROFILE ================= */}
        <div className="sidebar-bottom">


          {openMenu && (
            <div className="profile-menu">

              <div
                className="menu-item"
                onClick={() => { setSection("profile"); setOpenMenu(false); }}
              >
                👤 Profile
              </div>

              <div
                className="menu-item"
                onClick={() => { setSection("settings"); setOpenMenu(false); }}
              >
                ⚙ Settings
              </div>

              <div className="menu-item logout" onClick={logout}>
                🚪 Logout
              </div>

            </div>
          )}


          <div
            className="profile"
            onClick={() => setOpenMenu(!openMenu)}
          >

            <div className="avatar">
              {userName[0]}
            </div>

            <div>
              <h4>{userName}</h4>
              <p>{userRole}</p>
            </div>

            <span className="arrow">
              ⌄
            </span>

          </div>

        </div>

      </aside>



      {/* ================= MAIN ================= */}
      <main className="main">


        <header className="header">
          <h1>Welcome, {userName}</h1>
        </header>



        {/* ================= DASHBOARD ================= */}
        {section === "dashboard" && (

          <>
            <h2>My Internships</h2>

            {internships.map(i => (

              <div className="card" key={i.id}>

                <h3>{i.title}</h3>
                <p>{i.company}</p>

                <div className="bar">
                  <div style={{ width: i.progress + "%" }}></div>
                </div>

              </div>

            ))}


            <section className="overview">

              <h2>Progress Overview</h2>

              <div className="overview-grid">

                <div>{overview.active} Active</div>
                <div>{overview.completed} Completed</div>
                <div>{overview.pending} Pending</div>
                <div>{overview.certificates} Certificates</div>

              </div>

            </section>
          </>
        )}


        {/* ================= PROFILE ================= */}
        {section === "profile" && (

          <section className="box">

            <h2>👤 Profile</h2>

            <div className="profile-card">

              <div className="avatar-large">{userName[0]}</div>

              <h3>{userName}</h3>
              <p>Role: {userRole}</p>
              <p>ID: {userId}</p>

              <div style={{ marginTop: 12 }}>
                <button onClick={() => setSection("settings")}>Edit Profile</button>
              </div>

            </div>

          </section>

        )}


        {/* ================= SETTINGS ================= */}
        {section === "settings" && (

          <section className="box">

            <h2>⚙ Settings</h2>

            <form onSubmit={handleSettings}>

              <label>Full Name</label>
              <input name="name" defaultValue={userName} placeholder="Full Name" required />

              <label>Role</label>
              <select name="role" defaultValue={userRole.toLowerCase()}>
                <option value="intern">Intern</option>
                <option value="mentor">Mentor</option>
                <option value="admin">Admin</option>
              </select>

              <div style={{ marginTop: 12 }}>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setSection("dashboard")} style={{ marginLeft: 8 }}>Cancel</button>
              </div>

            </form>

          </section>

        )}



        {/* ================= TASKS ================= */}
        {section === "tasks" && (

          <section className="box">

            <h2>📋 My Tasks</h2>

            {tasks.length === 0 && <p>No Tasks</p>}

            {tasks.map(t => (

              <div key={t.id} className="list-item">

                <div style={{ flex: 1 }}>
                  <h4>{t.title}</h4>
                  <p>Deadline: {t.deadline}</p>
                  <span>{t.status}</span>
                </div>

                {t.status !== "Completed" && t.status !== "COMPLETED" && (
                  <button
                    className="small-btn"
                    onClick={() => setSelectedTask(t)}
                  >
                    Submit
                  </button>
                )}

              </div>

            ))}

          </section>
        )}



        {/* ================= SUBMISSIONS ================= */}
        {section === "submissions" && (

          <section className="box">

            <h2>📤 Submissions</h2>

            {submissions.length === 0 && <p>No Submissions</p>}

            {submissions.map(s => (

              <div key={s.id} className="list-item">

                <h4>{s.taskName}</h4>
                <p>Date: {s.submittedDate}</p>
                <span>{s.status}</span>

              </div>

            ))}

          </section>
        )}



        {/* ================= CERTIFICATES ================= */}
        {section === "certificates" && (

          <section className="box">

            <h2>📜 Certificates</h2>

            {certificates.length === 0 && <p>No Certificates</p>}

            {certificates.map(c => (

              <div key={c.id} className="list-item">

                <h4>{c.title}</h4>
                <p>Issued: {c.issuedDate}</p>

                <a
                  href={c.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download
                </a>

              </div>

            ))}

          </section>
        )}



        {/* ================= NOTIFICATIONS ================= */}
        {section === "notifications" && (

          <section className="box">

            <h2>🔔 Notifications</h2>

            {notifications.length === 0 && <p>No Notifications</p>}

            {notifications.map(n => (

              <div key={n.id} className="list-item">

                <h4>{n.title}</h4>
                <p>{n.message}</p>
                <span>{n.date}</span>

              </div>

            ))}

          </section>
        )}



        {/* ================= RESOURCES ================= */}
        {section === "resources" && (

          <section className="box">

            <h2>📚 Learning Resources</h2>

            {resources.length === 0 && <p>No Resources</p>}

            {resources.map(r => (

              <div key={r.id} className="list-item">

                <h4>{r.title}</h4>

                <a
                  href={r.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Resource
                </a>

              </div>

            ))}

          </section>
        )}

      </main>

      {/* ================= SUBMISSION MODAL ================= */}
      {selectedTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Submit Assignment</h3>
            <p>Task: {selectedTask.title}</p>

            <form onSubmit={handleSubmission}>
              <label>Submission URL (GitHub, Drive, etc.)</label>
              <input
                type="url"
                placeholder="https://..."
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                required
              />

              <div className="modal-actions">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTask(null);
                    setSubmissionUrl("");
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
