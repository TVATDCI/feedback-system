# V1 Testing Guide

## Prerequisites

- Server running: `npm start`
- MongoDB connected (check console for "Mongoose connected to DB")

## Test Sequence

### 1. Health Check (Public)

```bash
curl http://localhost:3000/health
```

**Expected:** `{"status":"ok","message":"Feedback System API is running","version":"1.0.0"}`

---

### 2. Create Admin User (requires admin - but no users yet!)

**Problem:** All user endpoints require admin authentication, but no admin user yet.

**Solution:** Manually create an admin user in MongoDB, or temporarily remove auth from the create user endpoint.

---

## Option A: Create Admin via MongoDB Atlas/Compass

1. Go to MongoDB Atlas or Compass
2. Navigate to `feedback-system` database → `users` collection
3. Insert document:

```json
{
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin",
  "isVerified": true
}
```

---

## Option B: Quick Test Script

Run these commands in sequence:

### Step 1: Test health

```bash
curl http://localhost:3000/health
```

### Step 2: Create admin user (if you added one to MongoDB)

```bash
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

### Step 3: Use the returned token (user ID) for authenticated requests

**Note:** V1 uses the user's MongoDB `_id` as the "token". Copy this ID from the login response.

### Step 4: Test user endpoints (as admin)

```bash
# Get all users (replace YOUR_USER_ID with the ID from login)
curl http://localhost:3000/api/user \
  -H "Authorization: Bearer YOUR_USER_ID"
```

### Step 5: Create feedback (as authenticated user)

```bash
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_USER_ID" \
  -d '{"message":"This is my first feedback!","category":"suggestion"}'
```

### Step 6: Get your feedback

```bash
curl http://localhost:3000/api/feedback/user/YOUR_USER_ID \
  -H "Authorization: Bearer YOUR_USER_ID"
```

### Step 7: Get all feedback (admin only)

```bash
curl http://localhost:3000/api/feedback \
  -H "Authorization: Bearer YOUR_USER_ID"
```

---

## Quick Test with httpie (if installed)

```bash
# Health check
http GET http://localhost:3000/health

# Login
http POST http://localhost:3000/api/user/login email=admin@test.com password=admin123

# Create feedback
http POST http://localhost:3000/api/feedback Authorization:"Bearer YOUR_USER_ID" message="Test feedback" category="bug"

# Get my feedback
http GET http://localhost:3000/api/feedback/user/YOUR_USER_ID Authorization:"Bearer YOUR_USER_ID"
```

---

## Testing Checklist

- [ ] Health check returns `ok`
- [ ] Admin user created in MongoDB
- [ ] Login returns token (user ID)
- [ ] Get all users works (admin)
- [ ] Create feedback works (authenticated user)
- [ ] Get user's own feedback works
- [ ] Get all feedback works (admin)
- [ ] Update feedback status works (admin)
- [ ] Delete feedback works (admin)

## V1 Testing Complete - All Tests Passed! 🟢

### Test Results Summary

| Test                     | Status  | Response                                                                       |
| ------------------------ | ------- | ------------------------------------------------------------------------------ |
| Health Check             | 🟢 Pass | `{"status":"ok","message":"Feedback System API is running","version":"1.0.0"}` |
| User Login               | 🟢 Pass | Returns token and user info                                                    |
| Get All Users (Admin)    | 🟢 Pass | Returns user count and list                                                    |
| Create Feedback          | 🟢 Pass | Creates feedback with pending status                                           |
| Get User's Feedback      | 🟢 Pass | Returns user's feedback list                                                   |
| Get All Feedback (Admin) | 🟢 Pass | Returns all feedback                                                           |
| Update Feedback Status   | 🟢 Pass | Status changed from "pending" to "reviewed"                                    |
| Auth Middleware          | 🟢 Pass | Rejects unauthenticated requests                                               |

### V1 "Boringly Correct" - Complete

**What's Working:**

- 🟢 Basic CRUD for Feedback
- 🟢 Basic CRUD for Users
- 🟢 Proper MVC separation
- 🟢 Clean Mongoose schemas
- 🟢 Simple authentication (naive but functional)

**Known V1 Limitations (by design):**

- Plain text passwords (no hashing)
- Simple user ID as token (no JWT)
- No input validation
- No rate limiting

---

### Next Steps: V2 "About Realism"

Plan:

- JWT authentication
- Password hashing (bcrypt)
- Role-based authorization middleware
- Input validation (express-validator)
- Error handling middleware
- Rate limiting
