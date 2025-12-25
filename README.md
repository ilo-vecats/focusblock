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

## Deployment

For detailed deployment instructions using MongoDB Atlas, see [DEPLOYMENT.md](./DEPLOYMENT.md).

Quick deployment options:
- **Backend**: Deploy to [Railway](https://railway.app) or [Render](https://render.com)
- **Frontend**: Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- **Database**: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)

This starter focuses on functionality rather than production hardening.

