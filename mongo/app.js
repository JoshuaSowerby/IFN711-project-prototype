const express = require('express');
const app = express();
require('dotenv').config();

// Middlewares
app.use(express.json());

// Routers
app.use('/api/auth', require('./router/authRoutes'));
app.use('/api/leaderboard', require('./router/leaderboardRoutes'));

module.exports = app;
