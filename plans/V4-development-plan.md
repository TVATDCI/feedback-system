# V4 Development Plan: "Consumer Perspective"

## Overview

**Theme:** Nothing teaches API design better than being forced to consume your own API.

V4 adds a React frontend to consume the V3 backend API. This version focuses on:

- Full-stack integration experience
- API consumer perspective (discovering pain points)
- Authentication flow in a real UI
- Error handling and UX patterns

---

## Architecture Decision: Monorepo vs Separate Repo

### Option A: Monorepo (Recommended for learning)

```
feedback-system/
├── server.js
├── package.json (root - workspace)
├── features/
├── middleware/
├── client/                    # React app
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.jsx
│   └── index.html
└── ...
```

**Pros:** Single repo, shared development, easier to coordinate changes
**Cons:** Slightly more complex setup

### Option B: Separate Repository

```
feedback-system/          # Backend (current)
feedback-system-client/   # Frontend (new repo)
```

**Pros:** Clean separation, independent deployment
**Cons:** Two repos to manage, harder to coordinate API changes

### Recommendation: Monorepo

For learning purposes, a monorepo makes it easier to:

- See the full picture
- Make coordinated API changes
- Understand full-stack tradeoffs

---

## Tech Stack

### Frontend

- **React 19** - Latest UI library with improved concurrent features
- **Vite** - Build tool (fast, modern)
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management (keep it simple for V4)
- **Tailwind CSS v4.1** - Utility-first CSS with theme directives

### Backend (existing V3)

- Express.js
- MongoDB + Mongoose
- JWT authentication
- Service layer + Repository pattern

### Why React 19 + Tailwind v4.1?

- **React 19**: Latest stable release with improved concurrent rendering, better error handling, and new hooks
- **Tailwind v4.1**: Theme directive in `index.css` for centralized styling - combines Tailwind and pure CSS skills
- **Future-proof**: Solid foundation template for future full-stack projects

---

## Features to Build

### Phase 1: Authentication

- [ ] Login page
- [ ] Register page (admin only - or skip for V4)
- [ ] Protected routes
- [ ] Token storage and refresh
- [ ] Logout functionality

### Phase 2: Feedback Management

- [ ] View all feedback (admin)
- [ ] View my feedback (user)
- [ ] Create new feedback
- [ ] Edit feedback (admin)
- [ ] Delete feedback (admin)

### Phase 3: User Management (Admin)

- [ ] View all users
- [ ] Create user
- [ ] Edit user
- [ ] Delete user

### Phase 4: Polish

- [ ] Error handling UI
- [ ] Loading states
- [ ] Responsive design
- [ ] Dark/light mode (optional)

---

## API Endpoints Review

### Current V3 Endpoints

| Method | Endpoint                   | Auth       | Description         |
| ------ | -------------------------- | ---------- | ------------------- |
| POST   | /api/user/login            | Public     | Login               |
| GET    | /api/user/me               | User       | Get current user    |
| GET    | /api/user                  | Admin      | List all users      |
| POST   | /api/user                  | Admin      | Create user         |
| GET    | /api/user/:id              | Admin      | Get user by ID      |
| PATCH  | /api/user/:id              | Admin      | Update user         |
| DELETE | /api/user/:id              | Admin      | Delete user         |
| GET    | /api/feedback              | Admin      | List all feedback   |
| POST   | /api/feedback              | User       | Create feedback     |
| GET    | /api/feedback/user/:userId | User/Admin | Get user's feedback |
| GET    | /api/feedback/:id          | Admin      | Get feedback by ID  |
| PATCH  | /api/feedback/:id          | Admin      | Update feedback     |
| DELETE | /api/feedback/:id          | Admin      | Delete feedback     |

### Potential Gaps to Address

- [ ] Public endpoint to check if API is alive (health check exists)
- [ ] User registration endpoint (currently admin-only)
- [ ] Password change endpoint
- [ ] Profile update endpoint (non-admin)

---

## Project Structure

```
feedback-system/
├── client/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   └── Loading.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Layout.jsx
│   │   │   └── feedback/
│   │   │       ├── FeedbackList.jsx
│   │   │       ├── FeedbackItem.jsx
│   │   │       └── FeedbackForm.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Feedback.jsx
│   │   │   ├── Users.jsx
│   │   │   └── NotFound.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useApi.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── feedbackService.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css          # Tailwind v4.1 theme directives here
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── features/              # Existing V3 backend
├── middleware/
├── utils/
├── config/
├── tests/
├── server.js
└── package.json
```

### Tailwind CSS v4.1 Setup

The `index.css` will use Tailwind v4.1 theme directives for centralized styling:

```css
/* client/src/index.css */
@import "tailwindcss";

@theme {
  /* Color palette */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;

  /* Feedback status colors */
  --color-status-pending: #f59e0b;
  --color-status-reviewed: #10b981;
  --color-status-archived: #6b7280;

  /* Typography */
  --font-family-sans: Inter, system-ui, sans-serif;

  /* Spacing */
  --spacing-section: 2rem;

  /* Border radius */
  --radius-card: 0.75rem;
  --radius-button: 0.5rem;
}

/* Base styles */
@layer base {
  body {
    @apply bg-gray-50 text-gray-900 font-sans;
  }
}

/* Component styles */
@layer components {
  .btn-primary {
    @apply bg-primary-600 text-white px-4 py-2 rounded-button 
           hover:bg-primary-700 transition-colors duration-200;
  }

  .card {
    @apply bg-white rounded-card shadow-md p-6;
  }
}
```

---

## Development Phases

### Phase 1: Setup (Day 1)

1. Create Vite React app in `client/` directory
2. Configure proxy for API calls during development
3. Set up basic routing
4. Create API service layer

### Phase 2: Authentication (Day 2-3)

1. Build login page
2. Implement auth context
3. Add protected route wrapper
4. Handle token storage

### Phase 3: Feedback Features (Day 4-5)

1. Build feedback list view
2. Create feedback form
3. Implement CRUD operations
4. Add error handling

### Phase 4: Admin Features (Day 6)

1. User management UI
2. Feedback moderation
3. Role-based UI rendering

### Phase 5: Polish (Day 7)

1. Loading states
2. Error messages
3. Responsive design
4. Final testing

---

## Learning Objectives

By completing V4, you will learn:

1. **Full-Stack Integration**
   - How frontend and backend communicate
   - CORS configuration
   - Environment variables for different environments

2. **Authentication in Practice**
   - Token storage strategies
   - Protected routes
   - Token refresh patterns

3. **API Consumer Perspective**
   - What makes an API pleasant to use
   - Error response formats that help UI
   - Response shapes that reduce frontend logic

4. **State Management**
   - When to use Context vs local state
   - Handling async state
   - Optimistic updates

5. **Error Handling**
   - Network errors
   - API errors
   - Validation errors

---

## API Improvements to Consider

While building the frontend, you may discover these needs:

### 1. Better Error Responses

```javascript
// Current
{ error: "AUTH_ERROR", message: "Invalid token" }

// Better for UI
{
  error: "AUTH_ERROR",
  message: "Invalid token",
  code: "TOKEN_INVALID",
  action: "Please log in again"
}
```

### 2. Pagination

```javascript
// Add to GET /api/feedback
{
  feedback: [...],
  pagination: {
    page: 1,
    limit: 10,
    total: 50,
    pages: 5
  }
}
```

### 3. Filtering and Sorting

```
GET /api/feedback?status=pending&sort=-createdAt
```

### 4. User Profile Endpoint

```
GET /api/user/profile    # Get own profile
PATCH /api/user/profile  # Update own profile
```

---

## Commands to Start

```bash
# Create React app with Vite (React 19)
cd /home/vladi/Projects/GitHub/feedback-system
npm create vite@latest client -- --template react

# Navigate to client and upgrade to React 19
cd client
npm install react@latest react-dom@latest
npm install react-router-dom axios

# Install Tailwind CSS v4.1
npm install tailwindcss @tailwindcss/vite

# Start development
npm run dev
```

### Vite Config for Tailwind v4.1

```javascript
// client/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
```

---

## Success Criteria

V4 is complete when:

- [ ] User can log in and see their data
- [ ] User can create and view their feedback
- [ ] Admin can manage all users and feedback
- [ ] Errors display helpful messages
- [ ] Loading states provide feedback
- [ ] Application works on mobile devices

---

## Future: V5 TypeScript Migration

After V4, V5 will migrate both frontend and backend to TypeScript:

- Shared type definitions
- Compile-time API validation
- Better IDE support
- Reduced runtime errors

---

## Template Philosophy

This V4 implementation will serve as a **solid foundation template** for future projects:

### What the Template Provides

- ✅ Full-stack monorepo structure
- ✅ React 19 + Tailwind v4.1 frontend
- ✅ Express + MongoDB backend
- ✅ JWT authentication flow
- ✅ Service layer architecture
- ✅ Protected routes pattern
- ✅ Error handling patterns

### What Can Be Extended

- Additional routes and pages
- More features (notifications, file uploads, etc.)
- TypeScript migration (V5)
- Testing infrastructure
- CI/CD pipelines
- Deployment configurations

---

_Plan created: 2026-02-20_
_Updated: React 19 + Tailwind v4.1_
_Status: Ready for implementation_
