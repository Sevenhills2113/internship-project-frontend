import React, { useEffect, useState } from "react";
import {
  dashboardService,
  mentorService
} from "../services/api.service.js";
import { formatErrorMessage } from "../utils/errorHandler.js";
import "../styles/Dashboard.css";

/**
 * MentorDashboard Component
 * Displays programs, tasks created, and submissions to review
 */
function MentorDashboard() {
  /* ================= USER ================= */
  const userId = localStorage.getItem("userId");
  const [userName] = useState(localStorage.getItem("userName") || "Mentor");

  /* ================= UI ================= */
  const [section, setSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= DATA ================= */
  const [stats, setStats] = useState({
    programs: 0,
    tasks: 0,
    submissions: 0,
    interns: 0
  });

  const [programs, setPrograms] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!userId) {
      window.location.href = "/";
      return;
    }

    // Loading is already true on mount
    // setError(null) is unnecessary on mount

    (async () => {
      try {
        const [statsData, programsData, tasksData, submissionsData] = await Promise.all([
          dashboardService.getMentorOverview(userId).catch(() => null),
          dashboardService.getMentorInternships(userId).catch(() => []),
          mentorService.getTasks(userId).catch(() => []),
          mentorService.getSubmissions(userId).catch(() => [])
        ]);

        if (statsData) setStats(statsData);
        if (programsData) setPrograms(programsData);
        if (tasksData) setTasks(tasksData);
        if (submissionsData) setSubmissions(submissionsData);

        // Fallback if empty (for demo)
        if (!statsData && !programsData?.length) {
          setStats({ programs: 2, tasks: 5, submissions: 3, interns: 10 });
          setPrograms([
            { id: 1, title: "Adv React", status: "Active", interns: 5 },
            { id: 2, title: "NodeJS Backend", status: "Active", interns: 5 }
          ]);
          setTasks([
            { id: 1, title: "Review PR", status: "Pending" },
            { id: 2, title: "Prepare Lecture", status: "Done" }
          ]);
          setSubmissions([
            { id: 1, task: "React Basics", student: "Alex", status: "Pending" },
            { id: 2, task: "API Design", student: "Sam", status: "Pending" }
          ]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Mentor Dashboard Error:", err);
        setError(formatErrorMessage(err));
        setLoading(false);
      }
    })();
  }, [userId]);

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (loading) return <h2>Loading Mentor Dashboard...</h2>;

  if (error) {
    return (
      <div style={{ color: "red", padding: 20 }}>
        <h2>Error: {error}</h2>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">🎓 InternshipHub</div>
        <nav>
          <a className={section === "dashboard" ? "active" : ""} onClick={() => setSection("dashboard")}>Dashboard</a>
          <a className={section === "programs" ? "active" : ""} onClick={() => setSection("programs")}>Programs</a>
          <a className={section === "tasks" ? "active" : ""} onClick={() => setSection("tasks")}>Tasks</a>
          <a className={section === "submissions" ? "active" : ""} onClick={() => setSection("submissions")}>Submissions</a>
          <a href="/interns" style={{ color: '#666', cursor: 'pointer' }}>👥 Interns List</a>
          <a href="/submissions" style={{ color: '#666', cursor: 'pointer' }}>📋 All Submissions</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="menu-item logout" onClick={logout}>🚪 Logout</div>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <h1>Welcome, {userName} (Mentor)</h1>
        </header>

        {section === "dashboard" && (
          <section className="overview">
            <h2>Overview</h2>
            <div className="overview-grid">
              <div>{stats.programs} Programs</div>
              <div>{stats.tasks} Tasks Created</div>
              <div>{stats.submissions} Pending Reviews</div>
              <div>{stats.interns} Active Interns</div>
            </div>
          </section>
        )}

        {section === "programs" && (
          <section className="box">
            <h2>Your Programs</h2>
            {programs.length === 0 && <p>No programs found.</p>}
            {programs.map(p => (
              <div key={p.id} className="list-item">
                <h4>{p.title}</h4>
                <span>{p.status}</span>
              </div>
            ))}
          </section>
        )}

        {section === "tasks" && (
          <section className="box">
            <h2>Your Tasks</h2>
            <div style={{ marginBottom: 16 }}>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const payload = {
                  title: newTaskTitle,
                  description: newTaskDesc,
                  assignedTo: newTaskAssignedTo || null,
                  status: "Pending",
                  deadline: newTaskDeadline || null,
                  createdAt: new Date().toISOString(),
                };

                try {
                  const created = await mentorService.createTask(payload).catch(() => null);
                  // If backend returns created task use it, otherwise use local payload with generated id
                  const task = created?.id ? created : { id: `local-${Date.now()}`, ...payload };

                  // Update mentor's task list
                  setTasks(prev => [task, ...prev]);

                  // Persist for interns to read (merge by assignedTo)
                  const key = "mentor_local_tasks";
                  const all = JSON.parse(localStorage.getItem(key) || "[]");
                  all.push(task);
                  localStorage.setItem(key, JSON.stringify(all));
                  // notify other components in same window to refresh local tasks
                  try {
                    window.dispatchEvent(new Event('mentorTasksUpdated'));
                  } catch {
                    // ignore
                  }

                  // Clear form
                  setNewTaskTitle("");
                  setNewTaskDesc("");
                  setNewTaskAssignedTo("");
                } catch (err) {
                  console.error("Create task failed:", err);
                }
              }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Task title" required />
                  <input value={newTaskAssignedTo} onChange={e => setNewTaskAssignedTo(e.target.value)} placeholder="Assign to (internId)" />
                  <input type="date" value={newTaskDeadline} onChange={e => setNewTaskDeadline(e.target.value)} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <input value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} placeholder="Short description" />
                </div>
                <button type="submit">Create Task</button>
              </form>
            </div>

            {tasks.length === 0 && <p>No tasks created.</p>}
            {tasks.map(t => (
              <div key={t.id} className="list-item">
                <h4>{t.title}</h4>
                <div style={{ fontSize: 12, color: '#666' }}>{t.description}</div>
                <span>{t.status}</span>
              </div>
            ))}
          </section>
        )}

        {section === "submissions" && (
          <section className="box">
            <h2>Pending Submissions</h2>
            {submissions.length === 0 && <p>No pending submissions.</p>}
            {submissions.map(s => (
              <div key={s.id} className="list-item">
                <h4>{s.task}</h4>
                <p>Student: {s.student}</p>
                <span>{s.status}</span>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default MentorDashboard;
