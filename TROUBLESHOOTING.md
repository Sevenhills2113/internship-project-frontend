# Troubleshooting Dashboard Load Failures

## Issue: "Failed to load dashboard"

### ✅ Quick Checklist

1. **Check Backend Server**
   - Is your backend running on `http://localhost:8081`?
   - If not, start it (e.g., `npm run dev` or `java -jar app.jar`)
   - Verify it's listening on port **8081**

2. **Check Frontend Dev Server**
   - Must be running on `http://localhost:5173` (Vite default) or `http://localhost:3000` (if using different port)
   - Run: `npm install && npm run dev`

3. **Check Browser Console**
   - Open DevTools: `F12` or `Ctrl+Shift+I`
   - Go to **Console** tab
   - Look for error messages like:
     - `Failed to connect to http://localhost:8081`
     - `CORS error`
     - `401 Unauthorized`
     - Network errors

4. **Check Network Tab** (in DevTools)
   - Click **Network** tab
   - Reload the page
   - Look for red-colored requests to `http://localhost:8081/api/...`
   - Click on failed request → **Response** tab to see error details

### 🔧 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| Backend not running | Start backend server and ensure port 8081 is open |
| CORS errors | Add CORS headers in backend (e.g., `Access-Control-Allow-Origin: *`) |
| 401 Unauthorized | Check if backend requires a token in Authorization header |
| Network timeout | Backend may be slow — increase timeout or check backend logs |
| Port 8081 already in use | Kill process on that port or configure backend to use different port |

### 📋 Example Backend Setup (Node.js Express)

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Allow all origins
app.use(express.json());

// Auth endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  
  // Simple validation (replace with real DB check)
  if (email && password) {
    res.json({
      status: "success",
      id: 1,
      name: "Alex",
      role: role || "intern"
      // token: "..." (optional — optional since we removed JWT requirement)
    });
  } else {
    res.status(400).json({ status: "fail", message: "Invalid credentials" });
  }
});

// Dashboard endpoints
app.get('/api/dashboard/overview/:userId', (req, res) => {
  res.json({ active: 2, completed: 5, pending: 3, certificates: 1 });
});

app.get('/api/dashboard/internships/:userId', (req, res) => {
  res.json([
    { id: 1, title: "Web Dev", company: "TechCorp", progress: 65 }
  ]);
});

// ... other endpoints

app.listen(8081, () => console.log('Backend running on port 8081'));
```

### 🎯 Current Frontend Behavior

- **If backend is down**: Dashboard loads with **fallback demo data** ✅
- **If backend returns 401**: Dashboard loads with fallback data (no auto-redirect) ✅
- **If backend is up**: Real data from API is displayed ✅

### 📱 Test Login Flow

1. Open `http://localhost:5173` (or your frontend URL)
2. Login with any email/password (backend should validate)
3. You should navigate to `/dashboard`
4. Data loads from backend OR shows fallback demo data

### 🐛 Still Having Issues?

Check these logs in the console:
```javascript
// Open browser console (F12 → Console) and look for:
console.error("Dashboard Error:", err);
console.warn("Using fallback demo data — make sure backend server is running");
```

If you see these messages, your backend is not responding. Ensure:
- Backend server is started
- Correct port (8081)
- CORS is enabled
- Routes match the expected API paths

---

**Need help?** Check backend logs and frontend DevTools Network tab for detailed error messages.
