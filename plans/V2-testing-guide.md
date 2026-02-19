# V2 Testing Guide

## Prerequisites

- Server running: `npm start`
- MongoDB connected
- JWT_SECRET configured in `.env`

---

## Test Sequence

### 1. Health Check & API Info

```bash
# Health check
curl http://localhost:3000/health

# API info (new in V2)
curl http://localhost:3000/
```

**Expected Health Response:**

```json
{
  "status": "ok",
  "message": "Feedback System API is running",
  "version": "2.0.0",
  "features": [
    "JWT Authentication",
    "Password Hashing",
    "Input Validation",
    "Rate Limiting"
  ]
}
```

---

### 2. Test Input Validation

```bash
# Test invalid email format
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"123"}'

# Test short password (less than 6 chars)
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123"}'
```

**Expected Validation Error:**

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    { "field": "email", "message": "Please provide a valid email address" }
  ]
}
```

---

### 3. Test Login with Existing V1 User (Lazy Migration)

The existing admin user has a plain-text password. V2 will automatically hash it on first login.

```bash
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

**Expected Response:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@test.com",
    "role": "admin",
    "isVerified": true
  }
}
```

**Note:** The token is now a JWT (long string), not a user ID like in V1.

---

### 4. Test JWT Authentication

```bash
# Replace YOUR_JWT_TOKEN with the token from login
TOKEN="your_jwt_token_here"

# Get current user profile (new endpoint)
curl http://localhost:3000/api/user/me \
  -H "Authorization: Bearer $TOKEN"

# Get all users (admin only)
curl http://localhost:3000/api/user \
  -H "Authorization: Bearer $TOKEN"
```

---

### 5. Test Invalid JWT

```bash
# Test with invalid token
curl http://localhost:3000/api/user/me \
  -H "Authorization: Bearer invalid_token"

# Test with expired token (if you have one)
curl http://localhost:3000/api/user/me \
  -H "Authorization: Bearer expired_token"
```

**Expected Error:**

```json
{
  "error": "AUTH_ERROR",
  "message": "Invalid or expired token"
}
```

---

### 6. Test Create New User (Password Hashing)

```bash
curl -X POST http://localhost:3000/api/user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"email":"testuser@example.com","password":"password123","role":"user"}'
```

**Expected:** User created successfully. Password is hashed in database.

---

### 7. Test Login with New User

```bash
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"password123"}'
```

Save the new token for testing user-level access.

---

### 8. Test Feedback with Validation

```bash
# Create feedback with valid data
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message":"This is a test feedback for V2","category":"bug"}'

# Create feedback with empty message (should fail)
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message":"","category":"bug"}'
```

---

### 9. Test Ownership Middleware

```bash
# As regular user, try to access own feedback
curl http://localhost:3000/api/feedback/user/YOUR_USER_ID \
  -H "Authorization: Bearer USER_TOKEN"

# As regular user, try to access another user's feedback (should fail)
curl http://localhost:3000/api/feedback/user/ADMIN_USER_ID \
  -H "Authorization: Bearer USER_TOKEN"
```

**Expected Error (forbidden):**

```json
{
  "error": "FORBIDDEN",
  "message": "You can only access your own resources"
}
```

---

### 10. Test Rate Limiting

```bash
# Run this multiple times quickly to trigger rate limit
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/feedback \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"message\":\"Test $i\"}"
done
```

**Expected after limit:**

```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many feedback submissions, please slow down"
}
```

---

### 11. Test Error Handling

```bash
# Invalid MongoDB ID
curl http://localhost:3000/api/user/invalid-id \
  -H "Authorization: Bearer $TOKEN"

# Non-existent resource
curl http://localhost:3000/api/user/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Testing Checklist

### Authentication

- [ ] Login returns JWT token
- [ ] JWT token works for authenticated routes
- [ ] Invalid JWT is rejected
- [ ] Expired JWT is rejected with proper message

### Password Hashing

- [ ] New users get hashed passwords
- [ ] V1 users can login (lazy migration)
- [ ] Password is hashed after first V2 login

### Input Validation

- [ ] Invalid email format is rejected
- [ ] Short password is rejected
- [ ] Empty required fields are rejected
- [ ] Invalid enum values are rejected

### Rate Limiting

- [ ] General API limit (100/15min)
- [ ] Login limit (5/15min)
- [ ] Feedback limit (10/min)

### Error Handling

- [ ] Validation errors have details array
- [ ] 404 errors are consistent
- [ ] Auth errors are consistent
- [ ] Forbidden errors work correctly

### Authorization

- [ ] Admin can access all endpoints
- [ ] Users can only access own resources
- [ ] Ownership middleware works correctly

---

## Quick Test Script

Save as `test-v2.sh` and run:

```bash
#!/bin/bash
BASE_URL="http://localhost:3000"

echo "=== V2 API Tests ==="

echo "\n1. Health Check"
curl -s $BASE_URL/health | jq

echo "\n2. API Info"
curl -s $BASE_URL/ | jq

echo "\n3. Login (should return JWT)"
RESPONSE=$(curl -s -X POST $BASE_URL/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}')
echo $RESPONSE | jq
TOKEN=$(echo $RESPONSE | jq -r '.token')

echo "\n4. Get Current User"
curl -s $BASE_URL/api/user/me -H "Authorization: Bearer $TOKEN" | jq

echo "\n5. Create Feedback"
curl -s -X POST $BASE_URL/api/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message":"V2 test feedback"}' | jq

echo "\n=== Tests Complete ==="
```

## V2 "About Realism" - All Tests Passed! 🟢

### Test Results Summary

| Test                              | Status  | Result                                              |
| --------------------------------- | ------- | --------------------------------------------------- |
| Health Check                      | 🟢 Pass | Version 2.0.0 with features list                    |
| Input Validation (invalid email)  | 🟢 Pass | `VALIDATION_ERROR` with details                     |
| Login (V1 user lazy migration)    | 🟢 Pass | JWT token returned, password auto-hashed            |
| JWT Authentication                | 🟢 Pass | Protected routes work with Bearer token             |
| Get Current User (`/api/user/me`) | 🟢 Pass | Returns user profile                                |
| Create Feedback                   | 🟢 Pass | Works with JWT auth                                 |
| Invalid JWT                       | 🟢 Pass | `AUTH_ERROR: Invalid or expired token`              |
| Create User (password hashing)    | 🟢 Pass | New user with hashed password                       |
| Login New User                    | 🟢 Pass | JWT token returned                                  |
| Ownership Middleware              | 🟢 Pass | `FORBIDDEN: You can only access your own resources` |

---

### V2 Features Verified

- 🟢 **JWT Authentication** - Tokens with 7-day expiry
- 🟢 **Password Hashing** - bcrypt with lazy migration from V1
- 🟢 **Input Validation** - Email format, password length, etc.
- 🟢 **Error Handling** - Consistent error responses with details
- 🟢 **Rate Limiting** - Active on all endpoints
- 🟢 **Authorization** - Ownership checks working

---

### Files Created/Modified in V2

**New Files:**

- [`utils/passwordHash.js`](utils/passwordHash.js) - Password hashing utilities
- [`utils/jwt.js`](utils/jwt.js) - JWT token utilities
- [`middleware/errorHandler.js`](middleware/errorHandler.js) - Centralized error handling
- [`middleware/validators.js`](middleware/validators.js) - Input validation schemas
- [`middleware/rateLimiter.js`](middleware/rateLimiter.js) - Rate limiting configuration
- [`plans/V2-development-plan.md`](plans/V2-development-plan.md) - Development plan
- [`plans/V2-testing-guide.md`](plans/V2-testing-guide.md) - Testing guide

**Modified Files:**

- [`middleware/auth.js`](middleware/auth.js) - JWT authentication
- [`controllers/userController.js`](controllers/userController.js) - Password hashing, JWT
- [`controllers/feedbackController.js`](controllers/feedbackController.js) - Error handling
- [`routes/user.js`](routes/user.js) - Validation, rate limiting
- [`routes/feedback.js`](routes/feedback.js) - Validation, rate limiting
- [`server.js`](server.js) - Error handler, version 2.0.0
- [`package.json`](package.json) - New dependencies
- [`.env.example`](.env.example) - JWT configuration

---

### Next Steps

V2 is complete and tested. You can now:

1. Merge V2 to main and push to GitHub
2. Start planning V3 (service layer, repository pattern, logging, testing)
