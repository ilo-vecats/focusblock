# FocusBlock 

A productivity app to block distracting websites and stay focused. Features user authentication, website blocking, dashboard management, schedule presets, categories, and Chrome extension integration.

## 🌐 Live Demo

- **Frontend**: [https://focusblock-frontend.onrender.com](https://focusblock-frontend.onrender.com)
- **Backend API**: [https://focusblock.onrender.com/api](https://focusblock.onrender.com/api)

## ✨ Features

- 🔐 User authentication (Register/Login with JWT)
- 🚫 Block distracting websites
- ⏰ Schedule-based blocking (Work Hours, Weekends, Custom)
- 📁 Organize sites by categories (Social Media, Entertainment, etc.)
- 🔍 Search and filter blocked sites
- 📊 Statistics and productivity tracking
- ✅ Bulk operations (enable/disable/delete multiple sites)
- 🎨 Modern, responsive UI
- 🔌 Chrome extension integration (coming soon)

## Structure

- backend/ - Express + MongoDB API
- frontend/ - React SPA
- focusblock-extension/ - Chrome extension for blocking sites

## Quick start (local)

1. Start MongoDB locally (or use MongoDB Atlas).
2. Backend:
   - cd backend
   - Create `.env` file with:
     ```
     MONGO_URI=mongodb://localhost:27017/focusblock
     JWT_SECRET=your-secret-key
     FRONTEND_URL=http://localhost:3000
     PORT=5050
     ```
   - npm install
   - npm run dev
3. Frontend:
   - cd frontend
   - Create `.env` file with:
     ```
     REACT_APP_API_URL=http://localhost:5050/api
     ```
   - npm install
   - npm start

## Environment Variables

### Backend (.env)
- `MONGO_URI` - MongoDB connection string (local or Atlas)
- `JWT_SECRET` - Secret key for JWT token signing
- `FRONTEND_URL` - Frontend URL(s) for CORS. Can be single URL or comma-separated: `http://localhost:3000,https://your-frontend.onrender.com`
- `PORT` - Server port (default: 5050)

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL (must start with `REACT_APP_`). Example: `http://localhost:5050/api` or `https://your-backend.onrender.com/api`

**Note**: For production deployment, set these environment variables in your hosting platform (Render, Railway, etc.)

## 🔌 API Endpoints

### Base URL
- **Production**: `https://focusblock.onrender.com/api`
- **Local**: `http://localhost:5050/api`

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Blocked Sites Endpoints

#### Get All Blocked Sites
```http
GET /api/blocked
Authorization: Bearer {token}
```

#### Add Blocked Site
```http
POST /api/blocked
Authorization: Bearer {token}
Content-Type: application/json

{
  "url": "facebook.com",
  "category": "Social Media",
  "schedule": {
    "enabled": true,
    "startTime": "09:00",
    "endTime": "17:00",
    "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "preset": "work-hours"
  }
}
```

#### Update Blocked Site
```http
PUT /api/blocked/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "isActive": true,
  "category": "Entertainment",
  "schedule": { ... }
}
```

#### Delete Blocked Site
```http
DELETE /api/blocked/:id
Authorization: Bearer {token}
```

### Statistics Endpoints

#### Get Statistics
```http
GET /api/stats?days=7
Authorization: Bearer {token}

Response:
{
  "dailyStats": [...],
  "summary": {
    "totalBlockedSites": 5,
    "totalActiveBlocks": 3
  }
}
```

#### Record Blocked Attempt
```http
POST /api/stats/blocked
Authorization: Bearer {token}
Content-Type: application/json

{
  "url": "facebook.com"
}
```

### Health Check

#### API Health
```http
GET /api/health

Response:
{
  "status": "ok",
  "message": "FocusBlock API is running"
}
```

#### API Info
```http
GET /api

Response:
{
  "status": "ok",
  "message": "FocusBlock API is running",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

## 📝 Notes

This starter focuses on functionality rather than production hardening.

