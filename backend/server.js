require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const app = express();
connectDB();


const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ["http://localhost:3000"];

console.log('Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests) in development
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    

    if (origin) {
      console.log('CORS request from origin:', origin);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin, 'Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(bodyParser.json());

// Root API endpoint - provides API information
app.get('/api', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FocusBlock API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        users: 'GET /api/auth/users'
      },
      blocked: {
        list: 'GET /api/blocked',
        add: 'POST /api/blocked',
        update: 'PUT /api/blocked/:id',
        delete: 'DELETE /api/blocked/:id'
      },
      stats: {
        get: 'GET /api/stats?days=7',
        record: 'POST /api/stats/blocked'
      }
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FocusBlock API is running' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/blocked', require('./routes/blocked'));
app.use('/api/stats', require('./routes/stats'));

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found', 
    path: req.path,
    message: 'Available endpoints: /api, /api/health, /api/auth/*, /api/blocked/*, /api/stats/*'
  });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
