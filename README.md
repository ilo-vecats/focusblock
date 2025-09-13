# FocusBlock - MERN Starter

This repository contains a minimal MERN + JWT starter project for *FocusBlock*, a focus-blocking app.

## Structure

- backend/ - Express + MongoDB API
- frontend/ - React SPA (minimal)

## Quick start (local)

1. Start MongoDB locally (or use a cloud MongoDB).
2. Backend:
   - cd backend
   - copy `.env.example` to `.env` and set MONGO_URI & JWT_SECRET
   - npm install
   - npm run dev
3. Frontend:
   - cd frontend
   - npm install
   - set `REACT_APP_API_URL=http://localhost:5000/api` in `.env`
   - npm start

This starter focuses on functionality rather than production hardening.

