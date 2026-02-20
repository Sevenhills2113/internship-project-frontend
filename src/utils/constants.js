// ============= API Configuration & Constants =============

// API Base URL
const API_BASE_URL = "/api";

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
};

// Internship Endpoints
export const INTERNSHIP_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/internships`,
  GET_BY_ID: (id) => `${API_BASE_URL}/internships/${id}`,
  CREATE: `${API_BASE_URL}/internships`,
  UPDATE: (id) => `${API_BASE_URL}/internships/${id}`,
  DELETE: (id) => `${API_BASE_URL}/internships/${id}`,
};

// Task Endpoints
export const TASK_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/tasks`,
  GET_BY_ID: (id) => `${API_BASE_URL}/tasks/${id}`,
  CREATE: `${API_BASE_URL}/tasks`,
  UPDATE: (id) => `${API_BASE_URL}/tasks/${id}`,
  DELETE: (id) => `${API_BASE_URL}/tasks/${id}`,
};

// Submission Endpoints
export const SUBMISSION_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/submissions`,
  GET_BY_ID: (id) => `${API_BASE_URL}/submissions/${id}`,
  CREATE: `${API_BASE_URL}/submissions`,
  UPDATE: (id) => `${API_BASE_URL}/submissions/${id}`,
  REVIEW: (id) => `${API_BASE_URL}/submissions/${id}/review`,
  APPROVE: (id) => `${API_BASE_URL}/submissions/${id}/approve`,
  REJECT: (id) => `${API_BASE_URL}/submissions/${id}/reject`,
};

// Dashboard Endpoints
export const DASHBOARD_ENDPOINTS = {
  GET_OVERVIEW: (userId) => `${API_BASE_URL}/dashboard/overview/${userId}`,
  GET_INTERNSHIPS: (userId) => `${API_BASE_URL}/dashboard/internships/${userId}`,
  GET_TASKS: (userId) => `${API_BASE_URL}/dashboard/tasks/${userId}`,
  GET_SUBMISSIONS: (userId) => `${API_BASE_URL}/dashboard/submissions/${userId}`,
  GET_CERTIFICATES: (userId) => `${API_BASE_URL}/dashboard/certificates/${userId}`,
  GET_NOTIFICATIONS: (userId) => `${API_BASE_URL}/dashboard/notifications/${userId}`,
  GET_RESOURCES: `${API_BASE_URL}/dashboard/resources`,
  GET_MENTOR_OVERVIEW: (userId) => `${API_BASE_URL}/dashboard/mentor/overview/${userId}`,
  GET_MENTOR_INTERNSHIPS: (userId) => `${API_BASE_URL}/dashboard/mentor/internships/${userId}`,
};

// Certificate Endpoints
export const CERTIFICATE_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/certificates`,
  GET_BY_ID: (id) => `${API_BASE_URL}/certificates/${id}`,
  DOWNLOAD: (id) => `${API_BASE_URL}/certificates/${id}/download`,
  GENERATE: `${API_BASE_URL}/certificates/generate`,
};

// User Endpoints
export const USER_ENDPOINTS = {
  GET_PROFILE: `${API_BASE_URL}/users/profile`,
  GET_ALL: `${API_BASE_URL}/users`,
  GET_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
};

// localStorage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: "token",
  USER_ID: "userId",
  USER_NAME: "userName",
  USER_ROLE: "userRole",
  IS_LOGGED_IN: "isLoggedIn",
  INTERNSHIPS: "internships",
  TASKS: "tasks",
  AUTH_DATA: "authData",
};

// API Request Config
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// User Roles
export const USER_ROLES = {
  INTERN: "INTERN",
  MENTOR: "MENTOR",
  ADMIN: "ADMIN",
};

// Task Status
export const TASK_STATUS = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

// Submission Status
export const SUBMISSION_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "Unauthorized. Please login again.",
  FORBIDDEN: "You don't have permission to access this resource.",
  NOT_FOUND: "Resource not found.",
  INVALID_INPUT: "Invalid input. Please check your data.",
  SESSION_EXPIRED: "Your session has expired. Please login again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful!",
  LOGOUT_SUCCESS: "Logged out successfully!",
  REGISTER_SUCCESS: "Registration successful! Please login.",
  CREATE_SUCCESS: "Created successfully!",
  UPDATE_SUCCESS: "Updated successfully!",
  DELETE_SUCCESS: "Deleted successfully!",
};
