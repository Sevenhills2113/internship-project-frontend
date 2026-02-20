const BASE_URL = "/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // ignore JSON parse error (in case of empty body)
  }

  if (!response.ok) {
    throw new Error(data?.message || "Server Error");
  }

  return data;
}

const apiClient = {
  get: (url) => request(url),
  post: (url, body) =>
    request(url, { method: "POST", body: JSON.stringify(body) }),
  put: (url, body) =>
    request(url, { method: "PUT", body: JSON.stringify(body) }),
};

// ================= AUTH =================
class AuthService {
  async login(data) {
    const res = await apiClient.post("/auth/login", data);

    // Normalize response shapes: support { token, id, name, role } and { token, user: { id, name, role } }
    const token = res.token || res.data?.token;
    const userObj = res.user || res.data?.user || {
      id: res.id || res.data?.id,
      name: res.name || res.data?.name,
      role: res.role || res.data?.role,
    };

    if (token) localStorage.setItem("token", token);
    if (userObj?.id) localStorage.setItem("userId", userObj.id);
    if (userObj?.name) localStorage.setItem("userName", userObj.name);
    if (userObj?.role) localStorage.setItem("userRole", userObj.role);

    return {
      token,
      id: userObj?.id,
      name: userObj?.name,
      role: userObj?.role,
      raw: res,
    };
  }

  register(data) {
    return apiClient.post("/auth/register", data);
  }

  logout() {
    localStorage.clear();
  }

  getCurrentUser() {
    const id = localStorage.getItem("userId");
    if (!id) return null;
    return {
      id,
      name: localStorage.getItem("userName"),
      role: localStorage.getItem("userRole"),
    };
  }
}

// ================= DASHBOARD =================
class DashboardService {
  getOverview() {
    const userId = localStorage.getItem("userId");
    return apiClient.get(`/dashboard/overview/${userId}`);
  }

  // Compatibility wrappers used by other pages
  getDashboardOverview(userId) {
    // accept optional userId param (page sometimes passes explicit id)
    const id = userId || localStorage.getItem("userId");
    return apiClient.get(`/dashboard/overview/${id}`);
  }

  getDashboardInternships(userId) {
    const id = userId || localStorage.getItem("userId");
    return apiClient.get(`/dashboard/internships/${id}`);
  }

  getDashboardTasks(userId) {
    const id = userId || localStorage.getItem("userId");
    return apiClient.get(`/dashboard/tasks/${id}`);
  }

  getDashboardSubmissions(userId) {
    const id = userId || localStorage.getItem("userId");
    return apiClient.get(`/dashboard/submissions/${id}`);
  }

  getDashboardCertificates(userId) {
    const id = userId || localStorage.getItem("userId");
    return apiClient.get(`/dashboard/certificates/${id}`);
  }

  // Mentor-specific dashboard endpoints (used by MentorDashboard page)
  getMentorOverview(mentorId) {
    return apiClient.get(`/dashboard/mentor/overview/${mentorId}`);
  }

  getMentorInternships(mentorId) {
    return apiClient.get(`/dashboard/mentor/internships/${mentorId}`);
  }

  getTasks() {
    const userId = localStorage.getItem("userId");
    return apiClient.get(`/dashboard/tasks/${userId}`);
  }

  getSubmissions() {
    const userId = localStorage.getItem("userId");
    return apiClient.get(`/dashboard/submissions/${userId}`);
  }

  getCertificates() {
    const userId = localStorage.getItem("userId");
    return apiClient.get(`/dashboard/certificates/${userId}`);
  }

  getNotifications() {
    const userId = localStorage.getItem("userId");
    return apiClient.get(`/dashboard/notifications/${userId}`);
  }

  getResources() {
    return apiClient.get(`/dashboard/resources`);
  }
}

// ================= INTERN =================
class InternService {
  getTasks() {
    const internId = localStorage.getItem("userId");
    return apiClient.get(`/tasks/${internId}`);
  }

  getSubmissions() {
    const internId = localStorage.getItem("userId");
    return apiClient.get(`/submissions/intern/${internId}`);
  }

  submitTask(data) {
    return apiClient.post(`/submissions`, data);
  }
}

// ================= SUBMISSION =================
class SubmissionService {
  getSubmissions(internId) {
    return apiClient.get(`/submissions/intern/${internId}`);
  }

  getPendingSubmissions() {
    return apiClient.get(`/submissions/pending`);
  }

  approveSubmission(id, feedback = "") {
    return apiClient.put(`/submissions/${id}/approve`, { feedback });
  }

  rejectSubmission(id, feedback = "") {
    return apiClient.put(`/submissions/${id}/reject`, { feedback });
  }

  submitTask(data) {
    return apiClient.post(`/submissions`, data);
  }
}

// ================= MENTOR =================
class MentorService {
  getPendingSubmissions() {
    return apiClient.get(`/submissions/pending`);
  }

  // Endpoints used by MentorDashboard (expecting mentorId path)
  getTasks(mentorId) {
    return apiClient.get(`/mentor/${mentorId}/tasks`);
  }

  getSubmissions(mentorId) {
    return apiClient.get(`/mentor/${mentorId}/submissions`);
  }

  approveSubmission(id, feedback = "") {
    return apiClient.put(`/submissions/${id}/approve`, { feedback });
  }

  rejectSubmission(id, feedback = "") {
    return apiClient.put(`/submissions/${id}/reject`, { feedback });
  }

  createTask(data) {
    return apiClient.post(`/mentor/tasks`, data);
  }
}

// ================= CERTIFICATE =================
class CertificateService {
  generateCertificate(internId) {
    return apiClient.post(`/certificates/generate/${internId}`);
  }
}

export const authService = new AuthService();
export const dashboardService = new DashboardService();
export const internService = new InternService();
export const mentorService = new MentorService();
export const submissionService = new SubmissionService();
export const certificateService = new CertificateService();
