import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";

export default function AdminDashboard() {

  /* ================= USER ================= */
  const userId = localStorage.getItem("userId");

  /* ================= UI ================= */
  const [section, setSection] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All Roles");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  /* ================= DATA ================= */
  const [stats] = useState({
    totalUsers: 8,
    activeUsers: 6,
    interns: 4,
    mentors: 3
  });

  const [users, setUsers] = useState([
    { id: 1, name: "David Thompson", email: "david.thompson@email.com", role: "Intern", status: "Active", registered: "01/10/2026", lastActive: "1 week ago" },
    { id: 2, name: "Emily Rodriguez", email: "emily.rodriguez@email.com", role: "Admin", status: "Active", registered: "11/05/2025", lastActive: "5 minutes ago" },
    { id: 3, name: "James William", email: "james.william@email.com", role: "Intern", status: "Active", registered: "01/20/2026", lastActive: "30 minutes ago" },
    { id: 4, name: "Lisa Anderson", email: "lisa.anderson@email.com", role: "Intern", status: "Active", registered: "01/18/2026", lastActive: "1 hour ago" },
    { id: 5, name: "Michael Chen", email: "michael.chen@email.com", role: "Mentor", status: "Active", registered: "12/30/2025", lastActive: "1 day ago" },
    { id: 6, name: "Price Patel", email: "price.patel@email.com", role: "Mentor", status: "Active", registered: "12/12/2025", lastActive: "3 hours ago" },
    { id: 7, name: "Robert Martinez", email: "robert.martinez@email.com", role: "Mentor", status: "Inactive", registered: "11/30/2025", lastActive: "2 weeks ago" },
    { id: 8, name: "Sarah Johnson", email: "sarah.johnson@email.com", role: "Intern", status: "Active", registered: "01/12/2026", lastActive: "2 hours ago" },
  ]);

  const [activities] = useState([
    { id: 1, action: "New intern Sarah Johnson registered", time: "2 hours ago", type: "registration" },
    { id: 2, action: "User James William account activated", time: "3 hours ago", type: "activation" },
    { id: 3, action: "Password reset for David Thompson", time: "1 day ago", type: "security" },
    { id: 4, action: "User Robert Martinez account deactivated", time: "2 weeks ago", type: "deactivation" },
    { id: 5, action: "Profile updated for Michael Chen", time: "1 day ago", type: "update" },
  ]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!userId) {
      window.location.href = "/";
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  /* ================= USER MANAGEMENT ================= */
  const handleAddUser = (e) => {
    if (e) e.preventDefault();
    setEditingUser(null);
    setShowAddUser(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowAddUser(true);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleSaveUser = (formData) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      setUsers([...users, { id: Date.now(), ...formData, status: "Active", registered: new Date().toLocaleDateString(), lastActive: "now" }]);
    }
    setShowAddUser(false);
    setEditingUser(null);
  };

  /* ================= FILTERING ================= */
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "All Roles" || u.role === filterRole;
    const matchesStatus = filterStatus === "All Status" || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin": return "#1E40AF";
      case "Mentor": return "#D97706";
      case "Intern": return "#059669";
      default: return "#6B7280";
    }
  };

  const getStatusColor = (status) => {
    return status === "Active" ? "#059669" : "#EF4444";
  };

  const getActivityColor = (type) => {
    const colors = {
      registration: "#3B82F6",
      activation: "#10B981",
      security: "#F59E0B",
      deactivation: "#EF4444",
      update: "#8B5CF6"
    };
    return colors[type] || "#6B7280";
  };

  return (
    <div className="app">
      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">
        <div className="logo">🎓 InternshipHub</div>
        <nav>
          <a className={section === "dashboard" ? "active" : ""} onClick={() => setSection("dashboard")} style={{ cursor: 'pointer' }}>
            📊 Dashboard
          </a>
          <a className={section === "users" ? "active" : ""} onClick={() => setSection("users")} style={{ cursor: 'pointer' }}>
            👥 User Management
          </a>
          <a className={section === "analytics" ? "active" : ""} onClick={() => setSection("analytics")} style={{ cursor: 'pointer' }}>
            📈 Analytics
          </a>
          <a className={section === "settings" ? "active" : ""} onClick={() => setSection("settings")} style={{ cursor: 'pointer' }}>
            ⚙️ Settings
          </a>
        </nav>
        <div className="sidebar-bottom">
          <div className="menu-item logout" onClick={logout}>🚪 Logout</div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="main">
        <header className="header">
          <h1>🎯 User Management</h1>
          <p style={{ color: '#666', margin: '4px 0 0 0', fontSize: '14px' }}>Manage users, roles, and permissions across the platform</p>
        </header>

        {/* ================= DASHBOARD ================= */}
        {section === "dashboard" && (
          <>
            <section style={{ marginBottom: '30px' }}>
              <div className="overview-grid">
                <div style={{ backgroundColor: '#EFF6FF', padding: '20px', borderRadius: '8px', border: '1px solid #DBEAFE' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1E40AF' }}>{stats.totalUsers}</div>
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Total Users</div>
                  <div style={{ fontSize: '12px', color: '#3B82F6', marginTop: '6px' }}>↑ +12% last month</div>
                </div>
                <div style={{ backgroundColor: '#ECFDF5', padding: '20px', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669' }}>{stats.activeUsers}</div>
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Active Users</div>
                  <div style={{ fontSize: '12px', color: '#10B981', marginTop: '6px' }}>↑ +8% last month</div>
                </div>
                <div style={{ backgroundColor: '#FEF3C7', padding: '20px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#D97706' }}>{stats.mentors}</div>
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Mentors</div>
                  <div style={{ fontSize: '12px', color: '#F59E0B', marginTop: '6px' }}>↑ +3% last month</div>
                </div>
                <div style={{ backgroundColor: '#F0FDF4', padding: '20px', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669' }}>{stats.interns}</div>
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Interns</div>
                  <div style={{ fontSize: '12px', color: '#10B981', marginTop: '6px' }}>↑ +15% last month</div>
                </div>
              </div>
            </section>

            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>Recent Activities</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activities.slice(0, 5).map(activity => (
                    <div key={activity.id} style={{ display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: getActivityColor(activity.type),
                        marginTop: '6px',
                        flexShrink: 0
                      }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#333' }}>{activity.action}</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#999' }}>{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>User Distribution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                      <span>Interns</span>
                      <span style={{ fontWeight: 'bold' }}>{stats.interns}</span>
                    </div>
                    <div style={{ backgroundColor: '#E5E7EB', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: '#059669', height: '100%', width: `${(stats.interns / stats.totalUsers) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                      <span>Mentors</span>
                      <span style={{ fontWeight: 'bold' }}>{stats.mentors}</span>
                    </div>
                    <div style={{ backgroundColor: '#E5E7EB', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: '#D97706', height: '100%', width: `${(stats.mentors / stats.totalUsers) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                      <span>Admin</span>
                      <span style={{ fontWeight: 'bold' }}>1</span>
                    </div>
                    <div style={{ backgroundColor: '#E5E7EB', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: '#1E40AF', height: '100%', width: `${(1 / stats.totalUsers) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ================= USER MANAGEMENT ================= */}
        {section === "users" && (
          <>
            <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddUser}
                style={{
                  backgroundColor: '#1E40AF',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px'
                }}
              >
                ➕ Add User
              </button>
              <span style={{ color: '#999', fontSize: '12px' }}>Showing filtered results</span>
              {(searchQuery || filterRole !== "All Roles" || filterStatus !== "All Status") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterRole("All Roles");
                    setFilterStatus("All Status");
                  }}
                  style={{
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                    border: '1px solid #ddd',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  ✕ Clear Filters
                </button>
              )}
            </div>

            {/* Filters */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '250px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '13px'
                }}
              />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '13px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option>All Roles</option>
                <option>Intern</option>
                <option>Mentor</option>
                <option>Admin</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '13px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            {/* Users Table */}
            <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>User</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>Role</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>Registered</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>Last Active</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#666' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr key={user.id} style={{ borderBottom: idx < filteredUsers.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#E5E7EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#666'
                          }}>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#333' }}>{user.name}</p>
                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#999' }}>{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'white',
                          backgroundColor: getRoleColor(user.role)
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'white',
                          backgroundColor: getStatusColor(user.status),
                          textTransform: 'uppercase'
                        }}>
                          {user.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#333' }}>{user.registered}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#666' }}>{user.lastActive}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleEditUser(user)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            marginRight: '8px'
                          }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px'
                          }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                No users found matching your criteria
              </div>
            )}

            {/* Add/Edit User Modal */}
            {showAddUser && (
              <UserFormModal
                user={editingUser}
                onSave={handleSaveUser}
                onCancel={() => { setShowAddUser(false); setEditingUser(null); }}
              />
            )}
          </>
        )}

        {/* ================= ANALYTICS ================= */}
        {section === "analytics" && (
          <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '30px', textAlign: 'center', color: '#999' }}>
            <p>Analytics dashboard coming soon...</p>
          </div>
        )}

        {/* ================= SETTINGS ================= */}
        {section === "settings" && (
          <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '30px', textAlign: 'center', color: '#999' }}>
            <p>Settings panel coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}

/* ================= USER FORM MODAL ================= */
function UserFormModal({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState(user ? {
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  } : {
    name: "",
    email: "",
    role: "Intern",
    status: "Active"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Please fill in all fields");
      return;
    }
    onSave(formData);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: 'bold' }}>
          {user ? 'Edit User' : 'Add New User'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#333' }}>
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '13px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#333' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '13px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#333' }}>
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                <option>Intern</option>
                <option>Mentor</option>
                <option>Admin</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#333' }}>
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '1px solid #ddd',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: '#1E40AF',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px'
              }}
            >
              {user ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
