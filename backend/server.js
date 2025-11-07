require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(bodyParser.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/blocked', require('./routes/blocked'));
app.use('/api/stats', require('./routes/stats'));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
