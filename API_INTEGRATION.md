# API Integration Guide 🚀

## Overview

This document describes the complete API integration for the Internship Hub React application. All frontend components now connect to backend APIs through a service layer architecture.

---

## 📋 Table of Contents

1. [Service Layer Architecture](#service-layer-architecture)
2. [Dashboard Endpoints](#dashboard-endpoints)
3. [Task Management Flow](#task-management-flow)
4. [Submission Flow](#submission-flow)
5. [Certificate Integration](#certificate-integration)
6. [Real-Time Metrics](#real-time-metrics)
7. [Testing the APIs](#testing-the-apis)

---

## Service Layer Architecture

### Available Services

All services are exported from `/src/services/api.service.js`:

```javascript
export const authService              // Auth operations (login, register, logout)
export const internshipService        // Internship CRUD operations
export const taskService              // Task CRUD operations
export const submissionService        // Submission handling & review
export const dashboardService         // Dashboard metrics & data
export const certificateService       // Certificate generation & download
```

### Service Usage Pattern

```javascript
import { dashboardService, taskService } from "../services/api.service.js";

// Services automatically:
// ✅ Inject Authorization Bearer token
// ✅ Retry failed requests (exponential backoff)
// ✅ Parse HTTP error status codes
// ✅ Handle errors with user-friendly messages
// ✅ Return typed data matching DTOs

const data = await dashboardService.getDashboardOverview(userId);
```

---

## Dashboard Endpoints

### 1. **Get Dashboard Overview (Metrics)**

**Endpoint:** `GET /api/dashboard/overview/{userId}`

**Purpose:** Fetch dashboard metrics (active internships, completed tasks, pending tasks, certificates count)

**Called From:** `Dashboard.jsx` (component load)

**Service Method:**
```javascript
const overview = await dashboardService.getDashboardOverview(userId);
```

**Expected Response:**
```json
{
  "active": 2,
  "completed": 5,
  "pending": 3,
  "certificates": 1
}
```

**Frontend Updates:**
```jsx
setOverview(overviewData); // Updates metrics cards
```

---

### 2. **Get User Internships**

**Endpoint:** `GET /api/dashboard/internships/{userId}`

**Purpose:** Fetch all internships assigned to intern

**Called From:** `Dashboard.jsx` (component load)

**Service Method:**
```javascript
const internships = await dashboardService.getDashboardInternships(userId);
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "title": "Web Development",
    "company": "TechCorp",
    "description": "Build responsive web apps",
    "progress": 65,
    "status": "ACTIVE",
    "startDate": "2026-01-15",
    "endDate": "2026-03-15",
    "internshipManager": "John Doe"
  }
]
```

---

### 3. **Get User Tasks**

**Endpoint:** `GET /api/dashboard/tasks/{userId}`

**Purpose:** Fetch all tasks assigned to intern

**Called From:** `Dashboard.jsx` (component load)

**Service Method:**
```javascript
const tasks = await dashboardService.getDashboardTasks(userId);
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "title": "Build React Component",
    "description": "Create a reusable form component",
    "deadline": "2026-02-20",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "assignedBy": "mentor_id",
    "createdAt": "2026-02-01"
  }
]
```

**Status Values:** `PENDING`, `IN_PROGRESS`, `COMPLETED`

---

### 4. **Get User Submissions**

**Endpoint:** `GET /api/dashboard/submissions/{userId}`

**Purpose:** Fetch all submissions for intern

**Called From:** `Dashboard.jsx` (component load)

**Service Method:**
```javascript
const submissions = await dashboardService.getDashboardSubmissions(userId);
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "taskId": 5,
    "taskTitle": "UI Design",
    "internName": "Alex Johnson",
    "submittedDate": "2026-02-10",
    "status": "APPROVED",
    "feedbackFromMentor": "Great work!",
    "submissionUrl": "https://github.com/..."
  }
]
```

**Status Values:** `PENDING`, `APPROVED`, `REJECTED`

---

### 5. **Get User Certificates**

**Endpoint:** `GET /api/dashboard/certificates/{userId}`

**Purpose:** Fetch all certificates earned by intern

**Called From:** `Dashboard.jsx` (component load)

**Service Method:**
```javascript
const certificates = await dashboardService.getDashboardCertificates(userId);
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "internshipId": 1,
    "internshipTitle": "Web Development",
    "issuedDate": "2026-03-15",
    "certificateUrl": "/certificates/cert_1.pdf",
    "downloadUrl": "/api/certificates/1/download"
  }
]
```

---

### 6. **Get Notifications**

**Endpoint:** `GET /api/dashboard/notifications/{userId}`

**Purpose:** Fetch notifications for user

**Called From:** `Dashboard.jsx` (component load)

**Service Method:**
```javascript
const notifications = await dashboardService.getNotifications(userId);
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "title": "New Task Assigned",
    "message": "You have been assigned 'Build React Component'",
    "date": "2026-02-10T10:30:00Z",
    "type": "INFO"
  }
]
```

---

### 7. **Get Resources**

**Endpoint:** `GET /api/dashboard/resources`

**Purpose:** Fetch learning resources for all users

**Called From:** `Dashboard.jsx` (component load)

**Service Method:**
```javascript
const resources = await dashboardService.getResources();
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "title": "React Documentation",
    "link": "https://react.dev",
    "category": "Frontend"
  }
]
```

---

### 8. **Get Mentor Dashboard Overview**

**Endpoint:** `GET /api/dashboard/mentor/overview/{userId}`

**Purpose:** Fetch mentor-specific metrics

**Called From:** `MentorDashboard.jsx` (component load)

**Service Method:**
```javascript
const mentorStats = await dashboardService.getMentorOverview(mentorId);
```

**Expected Response:**
```json
{
  "interns": 24,
  "reviews": 8,
  "completion": 87,
  "programs": 6
}
```

---

### 9. **Get Mentor Internships**

**Endpoint:** `GET /api/dashboard/mentor/internships/{userId}`

**Purpose:** Fetch internships managed by mentor

**Called From:** `MentorDashboard.jsx` (component load)

**Service Method:**
```javascript
const mentorPrograms = await dashboardService.getMentorInternships(mentorId);
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "title": "Web Development",
    "company": "TechCorp",
    "interns": 5,
    "status": "ACTIVE",
    "created": "2026-01-15"
  }
]
```

---

## Task Management Flow

### 1. **Create Task**

**Endpoint:** `POST /api/tasks`

**Purpose:** Mentor creates task for internship program

**Called From:** `CreateTask.jsx` (form submission)

**Service Method:**
```javascript
const newTask = await taskService.createTask({
  title: "Build React Component",
  description: "Create a reusable form component",
  program: "Web Development",
  deadline: "2026-02-20",
  status: "PENDING",
  createdBy: mentorId,
  createdAt: new Date().toISOString()
});
```

**Request Body:**
```json
{
  "title": "Build React Component",
  "description": "Create a reusable form component",
  "program": "Web Development",
  "deadline": "2026-02-20",
  "status": "PENDING",
  "createdBy": 1,
  "createdAt": "2026-02-01T10:00:00Z"
}
```

**Expected Response:**
```json
{
  "id": 5,
  "title": "Build React Component",
  "status": "PENDING",
  "createdAt": "2026-02-01T10:00:00Z"
}
```

**Frontend Updates:**
```jsx
// Task appears in Dashboard immediately
// onSuccess: Refresh tasks list or append to existing
```

---

### 2. **Update Task Status**

**Endpoint:** `PUT /api/tasks/{id}`

**Purpose:** Update task details or status

**Service Method:**
```javascript
await taskService.updateTask(taskId, {
  status: "IN_PROGRESS",  // or "COMPLETED"
  updatedAt: new Date().toISOString()
});
```

---

### 3. **Get All Tasks** (Backend Notification)

When a new task is created:
- Backend updates `tasks` table
- Sends notification to interns
- Next dashboard refresh fetches updated task list

---

## Submission Flow

### 1. **Intern Submits Task**

**Endpoint:** `POST /api/submissions`

**Purpose:** Intern submits completed task for mentor review

**Service Method:**
```javascript
const submission = await submissionService.createSubmission({
  taskId: 5,
  internId: userId,
  submissionUrl: "https://github.com/alex/repo",
  submittedAt: new Date().toISOString(),
  status: "PENDING"
});
```

**Request Body:**
```json
{
  "taskId": 5,
  "internId": 1,
  "submissionUrl": "https://github.com/alex/repo",
  "submittedAt": "2026-02-19T15:30:00Z",
  "status": "PENDING"
}
```

---

### 2. **Mentor Approves Submission**

**Endpoint:** `PUT /api/submissions/{id}/approve`

**Purpose:** Mentor approves submission, marks task as completed

**Called From:** `Submissions.jsx` (Approve button)

**Service Method:**
```javascript
await submissionService.approveSubmission(submissionId, "Great work!");
```

**Request Body:**
```json
{
  "status": "APPROVED",
  "feedback": "Great work!"
}
```

**Backend Actions:**
1. Updates submission status → `APPROVED`
2. Updates task status → `COMPLETED`
3. Increments intern's progress
4. Sends notification to intern
5. Checks if internship complete → generates certificate
6. Returns updated submission

**Frontend Updates:**
```jsx
// Submission displays ✅ APPROVED
// Task marked as COMPLETED in dashboard
// Certificate generated and appears in dashboard
```

---

### 3. **Mentor Rejects Submission**

**Endpoint:** `PUT /api/submissions/{id}/reject`

**Purpose:** Mentor rejects submission with feedback

**Called From:** `Submissions.jsx` (Reject button)

**Service Method:**
```javascript
await submissionService.rejectSubmission(submissionId, "Please fix validation");
```

**Request Body:**
```json
{
  "status": "REJECTED",
  "feedback": "Please fix validation"
}
```

**Backend Actions:**
1. Updates submission status → `REJECTED`
2. Task remains pending
3. Sends feedback to intern
4. Allows resubmission

**Frontend Updates:**
```jsx
// Submission displays ❌ REJECTED with feedback
// Task remains in pending
// Intern can resubmit
```

---

### 4. **Real-Time Dashboard Update**

After approval/rejection:
- Intern's Dashboard refreshes automatically
- Displays updated task status
- Shows approval feedback
- Certificate appears (if internship complete)

---

## Certificate Integration

### 1. **Auto-Generate Certificate** ✨

**Triggered:** After internship completion (all tasks approved)

**Endpoint:** `POST /api/certificates/generate`

**Purpose:** Backend auto-generates PDF certificate

**Service Method:**
```javascript
await certificateService.generateCertificate(internshipId);
```

**Request Body:**
```json
{
  "internshipId": 1
}
```

**Backend Actions:**
1. Verifies internship is COMPLETED
2. Generates PDF certificate (name, dates, company)
3. Saves file in `/certificates/` folder
4. Stores metadata in `certificates` table
5. Returns download URL

**Expected Response:**
```json
{
  "id": 1,
  "internshipId": 1,
  "internshipTitle": "Web Development",
  "fileName": "cert_alex_webdev_2026.pdf",
  "issuedDate": "2026-03-15T00:00:00Z",
  "downloadUrl": "/api/certificates/1/download"
}
```

---

### 2. **Download Certificate**

**Endpoint:** `GET /api/certificates/{id}/download`

**Purpose:** Download certificate PDF

**Service Method:**
```javascript
const downloadUrl = await certificateService.downloadCertificate(certId);
// Returns: "http://localhost:8081/api/certificates/1/download?token=xyz"
```

**Frontend:**
```jsx
<a href={downloadUrl} download>Download Certificate</a>
```

---

## Real-Time Metrics

### Dashboard Displays Real-Time Data

**Intern Dashboard Metrics:**

| Metric | Source API | Updates When |
|--------|-----------|--------------|
| Active Internships | `GET /dashboard/overview` | Page loads |
| Completed Tasks | `GET /dashboard/tasks` | Task marked COMPLETED |
| Pending Tasks | `GET /dashboard/tasks` | New task created |
| Certificates | `GET /dashboard/certificates` | Internship completed |

**Mentor Dashboard Metrics:**

| Metric | Source API | Updates When |
|--------|-----------|--------------|
| Interns Count | `GET /dashboard/mentor/overview` | Page loads |
| Pending Reviews | `GET /dashboard/mentor/internships` | New submission |
| Completion Rate | `GET /dashboard/mentor/overview` | Submission approved |
| Program Count | `GET /dashboard/mentor/internships` | Page loads |

### Dynamic Updates

All metrics update automatically because:

1. **Every API call returns fresh data** from backend
2. **Dashboard fetches all data on mount** using `Promise.all()`
3. **Each action (create, approve) triggers re-fetch**
4. **No stale data** - all displays reflect current state

**Example Flow:**

```
1. Mentor creates task → POST /api/tasks
2. Backend saves task
3. Dashboard re-fetches data → GET /dashboard/tasks
4. Intern sees new task immediately
5. Intern submits → POST /api/submissions
6. Mentor reviews → PUT /api/submissions/1/approve
7. Backend updates task status
8. Dashboard re-fetches → GET /dashboard/tasks
9. Task shows COMPLETED, Progress increases, Certificate generated
10. All UIs update instantly
```

---

## Testing the APIs

### 1. **Local Development**

Start the backend server first:
```bash
# Terminal 1: Backend
cd backend
java -jar application.jar  # Spring Boot runs on localhost:8081

# Terminal 2: Frontend
cd frontend
npm run dev  # Vite dev server on localhost:5173
```

### 2. **Test Dashboard Load**

```javascript
// Open browser DevTools → Console
// In Dashboard.jsx component:

const userId = localStorage.getItem('userId');
const overview = await dashboardService.getDashboardOverview(userId);
console.log('Overview:', overview);  // Check metrics
```

### 3. **Test Task Creation**

```javascript
// In CreateTask.jsx
const newTask = await taskService.createTask({
  title: "Test Task",
  program: "Web Dev",
  deadline: "2026-02-28",
  status: "PENDING",
  createdBy: 1
});
console.log('Task created:', newTask);

// Then refresh dashboard - task should appear
```

### 4. **Test Submission Flow**

```javascript
// Step 1: Create submission
const submission = await submissionService.createSubmission({
  taskId: 1,
  internId: 1,
  submissionUrl: "https://github.com/test"
});

// Step 2: Approve submission
await submissionService.approveSubmission(submission.id, "Good!");

// Step 3: Check dashboard - task should show COMPLETED
```

### 5. **View Network Requests**

Open DevTools → Network tab:
- Filter by `Fetch/XHR`
- Watch Requests/Responses in real-time
- Verify correct endpoints are called
- Check auth headers include `Authorization: Bearer {token}`

---

## Error Handling

All services automatically handle errors:

```javascript
try {
  const data = await dashboardService.getDashboardTasks(userId);
} catch (err) {
  const userMessage = formatErrorMessage(err);
  // Error messages:
  // 400: "Invalid input. Please check your data."
  // 401: "Unauthorized. Please login again."
  // 403: "You don't have permission to access this resource."
  // 404: "Resource not found."
  // 500: "Server error. Please try again later."
  // Network: "Network error. Please check your connection."
}
```

---

## API Response Format

All endpoints follow consistent response format:

### Success Response (200)
```json
{
  "data": { /* ... */ },
  "message": "Success",
  "timestamp": "2026-02-11T10:30:00Z"
}
```

### Error Response
```json
{
  "error": "Task not found",
  "code": "NOT_FOUND",
  "timestamp": "2026-02-11T10:30:00Z"
}
```

---

## Summary

✅ **Complete API Integration:**
- Dashboard loads all metrics from backend
- Tasks appear automatically when created
- Submissions update in real-time
- Approvals trigger cascading updates
- Certificates auto-generate on completion
- All frontend UI reflects instant backend state
- Error handling and retry logic built-in
- Authorization tokens auto-injected

🚀 **Ready for Backend Connection** - Just ensure your Spring Boot API implements these endpoints with the specified request/response formats.

---

## Backend Implementation Checklist

- [ ] `GET /api/dashboard/overview/{userId}` - Return metrics
- [ ] `GET /api/dashboard/internships/{userId}` - Return user internships
- [ ] `GET /api/dashboard/tasks/{userId}` - Return user tasks
- [ ] `GET /api/dashboard/submissions/{userId}` - Return user submissions
- [ ] `GET /api/dashboard/certificates/{userId}` - Return user certificates
- [ ] `GET /api/dashboard/notifications/{userId}` - Return notifications
- [ ] `GET /api/dashboard/resources` - Return resources
- [ ] `GET /api/dashboard/mentor/overview/{userId}` - Return mentor metrics
- [ ] `GET /api/dashboard/mentor/internships/{userId}` - Return mentor programs
- [ ] `POST /api/tasks` - Create task
- [ ] `PUT /api/tasks/{id}` - Update task
- [ ] `POST /api/submissions` - Create submission
- [ ] `PUT /api/submissions/{id}/approve` - Approve submission & mark task complete
- [ ] `PUT /api/submissions/{id}/reject` - Reject submission
- [ ] `POST /api/certificates/generate` - Auto-generate certificate
- [ ] `GET /api/certificates/{id}/download` - Download certificate PDF

---

**Last Updated:** February 13, 2026
**Status:** ✅ Frontend Ready | ⏳ Waiting for Backend Implementation
