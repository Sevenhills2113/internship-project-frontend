# ⚡ Quick Start Guide - API Integration

**For:** Backend Developers implementing the REST API

---

## 🚀 30-Second Overview

This React frontend is ready to connect to your Spring Boot backend. All components use a service layer that makes API calls to `http://localhost:8081/api`.

**What you need to do:**
1. Create 16 REST endpoints
2. Return JSON matching the expected format
3. Handle cascading updates (approval → task complete → certificate)
4. That's it! Frontend is done ✅

---

## 📡 The 16 Required Endpoints

### Group 1: Dashboard Metrics (9 endpoints)

```java
// Read from database and return metrics
@GetMapping("/dashboard/overview/{userId}")
public Overview getOverview(@PathVariable Long userId) {
  return new Overview(
    activeInternships: 2,
    completedTasks: 5,
    pendingTasks: 3,
    certificatesCount: 1
  );
}

@GetMapping("/dashboard/internships/{userId}")
public List<Internship> getInternships(@PathVariable Long userId) {
  return internshipRepository.findByInternId(userId);
}

@GetMapping("/dashboard/tasks/{userId}")
public List<Task> getTasks(@PathVariable Long userId) {
  return taskRepository.findByAssignedToId(userId);
}

@GetMapping("/dashboard/submissions/{userId}")
public List<Submission> getSubmissions(@PathVariable Long userId) {
  return submissionRepository.findByInternId(userId);
}

@GetMapping("/dashboard/certificates/{userId}")
public List<Certificate> getCertificates(@PathVariable Long userId) {
  return certificateRepository.findByInternId(userId);
}

@GetMapping("/dashboard/notifications/{userId}")
public List<Notification> getNotifications(@PathVariable Long userId) {
  return notificationRepository.findByUserId(userId);
}

@GetMapping("/dashboard/resources")
public List<Resource> getResources() {
  return resourceRepository.findAll();
}

@GetMapping("/dashboard/mentor/overview/{mentorId}")
public MentorOverview getMentorOverview(@PathVariable Long mentorId) {
  return new MentorOverview(
    internsCount: 24,
    pendingReviews: 8,
    completionRate: 87,
    programsCount: 6
  );
}

@GetMapping("/dashboard/mentor/internships/{mentorId}")
public List<Internship> getMentorInternships(@PathVariable Long mentorId) {
  return internshipRepository.findByMentorId(mentorId);
}
```

### Group 2: Task Management (1 endpoint)

```java
@PostMapping("/tasks")
public Task createTask(@RequestBody TaskRequest request) {
  Task task = new Task();
  task.setTitle(request.getTitle());
  task.setProgram(request.getProgram());
  task.setDeadline(request.getDeadline());
  task.setStatus("PENDING");
  task.setCreatedBy(request.getCreatedBy());
  task.setCreatedAt(LocalDateTime.now());
  
  return taskRepository.save(task);
}
```

### Group 3: Submission Review (2 critical endpoints)

```java
// ⭐ IMPORTANT: Cascading Update
@PutMapping("/submissions/{id}/approve")
public Submission approveSubmission(
  @PathVariable Long id,
  @RequestBody ApprovalRequest request
) {
  Submission submission = submissionRepository.findById(id);
  submission.setStatus("APPROVED");
  submission.setFeedback(request.getFeedback());
  submissionRepository.save(submission);
  
  // 🔥 CASCADING UPDATES:
  Task task = taskRepository.findById(submission.getTaskId());
  task.setStatus("COMPLETED");      // ← Mark task complete
  taskRepository.save(task);
  
  // Increment progress
  Internship internship = task.getInternship();
  internship.setProgress(internship.getProgress() + 20); // or calculate
  
  // Check if ALL tasks are completed
  boolean allTasksComplete = internship.getTasks()
    .stream()
    .allMatch(t -> t.getStatus().equals("COMPLETED"));
  
  if (allTasksComplete) {
    // 🎓 AUTO-GENERATE CERTIFICATE
    Certificate cert = generateCertificate(internship, submission.getIntern());
    certificateRepository.save(cert);
    // Save PDF to /certificates/cert_123.pdf
  }
  
  // Send notifications
  notificationService.notify(submission.getIntern(), 
    "Your submission was approved!");
  
  internshipRepository.save(internship);
  return submission;
}

@PutMapping("/submissions/{id}/reject")
public Submission rejectSubmission(
  @PathVariable Long id,
  @RequestBody RejectionRequest request
) {
  Submission submission = submissionRepository.findById(id);
  submission.setStatus("REJECTED");
  submission.setFeedback(request.getFeedback());
  // Task stays PENDING - no update
  
  notificationService.notify(submission.getIntern(),
    "Your submission was rejected. Please resubmit.");
  
  return submissionRepository.save(submission);
}
```

### Group 4: Certificate Generation (2 endpoints)

```java
@PostMapping("/certificates/generate")
public Certificate generateCertificate(
  @RequestBody CertificateRequest request
) {
  Internship internship = internshipRepository.
    findById(request.getInternshipId());
  
  // Check if internship is complete
  if (!isInternshipComplete(internship)) {
    throw new BadRequest("Internship not complete");
  }
  
  // Generate PDF
  String fileName = "cert_" + internship.getId() + ".pdf";
  generateAndSavePDF(
    internship.getIntern().getName(),
    internship.getTitle(),
    internship.getCompanyName(),
    internship.getStartDate(),
    internship.getEndDate(),
    fileName
  );
  
  // Save metadata
  Certificate cert = new Certificate();
  cert.setInternshipId(internship.getId());
  cert.setInternId(internship.getIntern().getId());
  cert.setFileName(fileName);
  cert.setIssuedDate(LocalDate.now());
  cert.setDownloadUrl("/api/certificates/" + cert.getId() + "/download");
  
  return certificateRepository.save(cert);
}

@GetMapping("/certificates/{id}/download")
public ResponseEntity<Resource> downloadCertificate(
  @PathVariable Long id
) {
  Certificate cert = certificateRepository.findById(id);
  File file = new File("/certificates/" + cert.getFileName());
  
  return ResponseEntity
    .ok()
    .header("Content-Disposition", "attachment; filename=" + cert.getFileName())
    .body(new FileSystemResource(file));
}
```

---

## 🔑 Key Implementation Notes

### 1. **Base URL**
Frontend expects: `http://localhost:8081/api`

```properties
# application.properties
server.port=8081
```

### 2. **JSON Response Format**

```json
{
  "id": 1,
  "title": "Web Development",
  "status": "ACTIVE",
  "createdAt": "2026-01-15T10:30:00Z"
}
```

### 3. **Authentication**
Frontend sends token in header:
```
Authorization: Bearer {token}
```

Extract it in your API:
```java
@GetMapping("/dashboard/overview/{userId}")
public Overview getOverview(
  @PathVariable Long userId,
  @RequestHeader("Authorization") String token
) {
  // Verify token is valid for this user
  String actualToken = token.replace("Bearer ", "");
  User user = tokenService.getUserFromToken(actualToken);
  
  if (user.getId() != userId) {
    throw new UnauthorizedException();
  }
  
  // ... proceed
}
```

### 4. **Error Handling**
Frontend expects errors in this format:

```json
{
  "error": "Task not found",
  "code": "NOT_FOUND",
  "timestamp": "2026-02-13T10:30:00Z"
}
```

HTTP Status Codes Used:
- `200` - Success
- `400` - Invalid input
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

### 5. **CORS Configuration**

```java
@Configuration
public class CorsConfig {
  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
          .allowedOrigins("http://localhost:5173")
          .allowedMethods("GET", "POST", "PUT", "DELETE")
          .allowedHeaders("*")
          .allowCredentials(true);
      }
    };
  }
}
```

---

## 🧪 Testing Each Endpoint

### Test 1: Dashboard Load
```bash
curl http://localhost:8081/api/dashboard/overview/1
# Expect: { "active": 2, "completed": 5, "pending": 3, "certificates": 1 }
```

### Test 2: Create Task
```bash
curl -X POST http://localhost:8081/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token123" \
  -d '{
    "title": "Build Component",
    "program": "Web Dev",
    "deadline": "2026-02-20",
    "status": "PENDING",
    "createdBy": 1
  }'
# Expect: 201 Created with task object
```

### Test 3: Approve Submission (Critical!)
```bash
curl -X PUT http://localhost:8081/api/submissions/1/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token123" \
  -d '{
    "status": "APPROVED",
    "feedback": "Great work!"
  }'
# Expect: 
# 1. Submission updated → APPROVED
# 2. Task updated → COMPLETED
# 3. Certificate generated (if internship complete)
# 4. Notification sent
```

---

## 📋 Database Schema (Reference)

```sql
-- Tables your endpoints need:
CREATE TABLE internships (
  id BIGINT PRIMARY KEY,
  title VARCHAR(255),
  company VARCHAR(255),
  mentor_id BIGINT,
  status VARCHAR(20),
  progress INT DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP
);

CREATE TABLE tasks (
  id BIGINT PRIMARY KEY,
  title VARCHAR(255),
  internship_id BIGINT,
  assigned_to BIGINT,
  status VARCHAR(20),
  deadline DATE,
  created_by BIGINT,
  created_at TIMESTAMP,
  FOREIGN KEY (internship_id) REFERENCES internships(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

CREATE TABLE submissions (
  id BIGINT PRIMARY KEY,
  task_id BIGINT,
  intern_id BIGINT,
  status VARCHAR(20),
  submission_url VARCHAR(255),
  feedback TEXT,
  submitted_at TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (intern_id) REFERENCES users(id)
);

CREATE TABLE certificates (
  id BIGINT PRIMARY KEY,
  internship_id BIGINT,
  intern_id BIGINT,
  file_name VARCHAR(255),
  issued_date DATE,
  download_url VARCHAR(255),
  FOREIGN KEY (internship_id) REFERENCES internships(id),
  FOREIGN KEY (intern_id) REFERENCES users(id)
);

CREATE TABLE notifications (
  id BIGINT PRIMARY KEY,
  user_id BIGINT,
  title VARCHAR(255),
  message TEXT,
  type VARCHAR(20),
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## ✅ Implementation Checklist

### Phase 1: Basic Endpoints
- [ ] `GET /api/dashboard/overview/{userId}`
- [ ] `GET /api/dashboard/internships/{userId}`
- [ ] `GET /api/dashboard/tasks/{userId}`
- [ ] `GET /api/dashboard/resources`

### Phase 2: Advanced Endpoints
- [ ] `GET /api/dashboard/submissions/{userId}`
- [ ] `GET /api/dashboard/certificates/{userId}`
- [ ] `GET /api/dashboard/notifications/{userId}`
- [ ] `GET /api/dashboard/mentor/overview/{userId}`
- [ ] `GET /api/dashboard/mentor/internships/{userId}`

### Phase 3: Mutation Endpoints
- [ ] `POST /api/tasks`
- [ ] `POST /api/submissions` (already exists?)
- [ ] `POST /api/certificates/generate`
- [ ] `GET /api/certificates/{id}/download`

### Phase 4: Critical Flows ⭐
- [ ] `PUT /api/submissions/{id}/approve` (with cascading!)
- [ ] `PUT /api/submissions/{id}/reject`
- [ ] Test: Approve → Task Complete → Certificate Generated

---

## 🎯 Expected Timeline

- **Phase 1-2 (Basic):** 2-3 days
- **Phase 3 (Mutations):** 1-2 days
- **Phase 4 (Critical Flows):** 2-3 days
- **Testing & Debugging:** 1-2 days
- **Total:** ~1-2 weeks for full implementation

---

## 📞 Integration Points

**Frontend waiting for you:**
- React serves on `http://localhost:5173`
- Spring Boot API on `http://localhost:8081`
- CORS configured to accept requests

**Test Integration:**
1. Start backend: `java -jar app.jar`
2. Start frontend: `npm run dev`
3. Open http://localhost:5173
4. Login → Dashboard should load with real data
5. Test each workflow

---

## 🚀 Go Live Checklist

- [ ] All 16 endpoints implemented
- [ ] Database populated with test data
- [ ] CORS properly configured
- [ ] Authentication tokens working
- [ ] Error handling returns proper HTTP codes
- [ ] Cascading updates verified (approve → complete → certificate)
- [ ] Certificate PDF generation working
- [ ] Integration testing passed
- [ ] Load testing completed
- [ ] Security hardening complete

---

**You've got this! Happy coding! 🎉**

---

*For detailed API contract, see: [API_INTEGRATION.md](./API_INTEGRATION.md)*  
*For architecture diagrams, see: [API_FLOW_ARCHITECTURE.md](./API_FLOW_ARCHITECTURE.md)*  
*For frontend code, see: [ARCHITECTURE.md](./ARCHITECTURE.md)*
