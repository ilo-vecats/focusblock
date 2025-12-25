# FocusBlock 

This repository contains a minimal MERN + JWT starter project for *FocusBlock*, a focus-blocking app.

## Structure

- backend/ - Express + MongoDB API
- frontend/ - React SPA (minimal)

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

This starter focuses on functionality rather than production hardening.

