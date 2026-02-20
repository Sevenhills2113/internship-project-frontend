import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/api.service.js';
import { formatErrorMessage } from '../utils/errorHandler.js';
import '../styles/Dashboard.css';

export default function InternsList() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName') || 'User';
  const userRole = localStorage.getItem('userRole') || 'Mentor';

  useEffect(() => {
    if (!userId) {
      window.location.href = '/';
      return;
    }

    fetchInterns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInterns = async () => {
    try {
      const data = await dashboardService.getDashboardInternships(userId).catch(() => null);
      if (data && Array.isArray(data)) {
        const normalized = data.map(i => ({
          id: i.id,
          name: i.name || 'Unknown',
          email: i.email || 'N/A',
          program: i.title || i.program || 'N/A',
          status: i.status || 'Active',
          progress: i.progress || 0,
        }));
        setInterns(normalized);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Failed to fetch interns:', formatErrorMessage(err));
    }
    setInterns([
      { id: 1, name: 'Alex Johnson', email: 'alex@example.com', program: 'Web Development', status: 'Active', progress: 65 },
      { id: 2, name: 'Sam Patel', email: 'sam@example.com', program: 'React Internship', status: 'Active', progress: 40 },
      { id: 3, name: 'Jordan Lee', email: 'jordan@example.com', program: 'Node.js Backend', status: 'Completed', progress: 100 },
      { id: 4, name: 'Casey Brown', email: 'casey@example.com', program: 'Mobile Dev', status: 'Active', progress: 55 },
      { id: 5, name: 'Morgan Smith', email: 'morgan@example.com', program: 'Web Development', status: 'On Hold', progress: 30 },
    ]);
    setLoading(false);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const filtered = filter === 'All' ? interns : interns.filter(i => i.status === filter);

  if (loading) return <div style={{ padding: 20 }}><h2>Loading Interns...</h2></div>;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">🎓 InternshipHub</div>
        <nav>
          <a href="/mentor">← Back</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="menu-item logout" onClick={logout}>🚪 Logout</div>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <h1>👥 Interns List</h1>
          <p>Welcome, {userName} ({userRole})</p>
        </header>

        <section className="box">
          <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
            {['All', 'Active', 'Completed', 'On Hold'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: filter === status ? '#007bff' : '#e9ecef',
                  color: filter === status ? 'white' : 'black',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 4,
                }}
              >
                {status}
              </button>
            ))}
          </div>

          <h2>Showing {filtered.length} interns</h2>

          {filtered.length === 0 ? (
            <p style={{ color: '#999', fontStyle: 'italic' }}>No interns found</p>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {filtered.map((i) => (
                <div
                  key={i.id}
                  className="list-item"
                  style={{
                    padding: 16,
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <h4 style={{ margin: '0 0 8px 0' }}>{i.name}</h4>
                  <p style={{ margin: '4px 0', fontSize: 14, color: '#666' }}>📧 {i.email}</p>
                  <p style={{ margin: '4px 0', fontSize: 14, color: '#666' }}>📚 {i.program}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <div style={{ flex: 1, marginRight: 12 }}>
                      <div style={{ width: '100%', height: 8, backgroundColor: '#e9ecef', borderRadius: 4 }}>
                        <div
                          style={{
                            width: `${i.progress}%`,
                            height: '100%',
                            backgroundColor: i.status === 'Completed' ? '#28a745' : i.status === 'Active' ? '#007bff' : '#ffc107',
                            borderRadius: 4,
                            transition: 'width 0.3s',
                          }}
                        />
                      </div>
                      <small style={{ color: '#999' }}>{i.progress}% complete</small>
                    </div>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 'bold',
                        backgroundColor:
                          i.status === 'Completed'
                            ? '#d4edda'
                            : i.status === 'Active'
                            ? '#d1ecf1'
                            : '#fff3cd',
                        color:
                          i.status === 'Completed'
                            ? '#155724'
                            : i.status === 'Active'
                            ? '#0c5460'
                            : '#856404',
                      }}
                    >
                      {i.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
