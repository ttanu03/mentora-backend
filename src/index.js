require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const lessonRoutes = require('./routes/lessons');
const bookingRoutes = require('./routes/bookings');
const sessionRoutes = require('./routes/sessions');
const llmRoutes = require('./routes/llm');

const app = express();

// Body parsing
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/lessons', lessonRoutes);
app.use('/bookings', bookingRoutes);
app.use('/sessions', sessionRoutes);
// GET /lessons/:id/sessions is mounted on sessions router but served from /
app.use('/', sessionRoutes);
app.use('/llm', llmRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Mentora API running on port ${PORT}`));
});

module.exports = app;
