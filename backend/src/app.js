const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');
const mapDbError = require('./utils/dbErrorMapper');

// `app.js` only wires up middleware and routes. Starting the server
// (binding to a port) is handled separately in `server.js` so that the
// app can also be imported directly by test files in the future
// without opening a real network port.
const app = express();

// Only allow the configured frontend origin to call this API, rather
// than reflecting every request origin, which would defeat the purpose
// of CORS restrictions.
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple health check so deployment/setup issues can be diagnosed
// without needing to hit an authenticated route. It also pings the
// database so a misconfigured .env is caught immediately rather than
// surfacing as a confusing error on the first real query.
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ success: true, message: 'API is running', database: 'connected' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'API is running but the database is unreachable', error: null });
  }
});

// Feature routes are mounted here, one per resource.
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/departments', require('./routes/department.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/students', require('./routes/student.routes'));
app.use('/api/enrollments', require('./routes/enrollment.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));

// 404 handler for any route that didn't match above.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: null,
  });
});

// Centralized error handler. Any `throw` inside a catchAsync-wrapped
// controller, or any `next(err)` call, ends up here so error
// formatting only needs to be written once.
//
// AppError instances (thrown deliberately, e.g. "invalid credentials")
// carry their own statusCode and a safe, user-facing message.
// Anything else is treated as an unexpected bug: logged for debugging,
// but never exposed to the client as a raw stack trace or DB error,
// which could leak internal details.
app.use((err, req, res, next) => {
  // Raw MySQL errors (e.g. a duplicate key from a race condition, or
  // a foreign key violation) aren't AppErrors, so translate the
  // recognizable ones into a friendly message before falling back to
  // a generic 500.
  const dbError = mapDbError(err);
  const resolvedError = dbError || err;

  const statusCode = resolvedError.isOperational ? resolvedError.statusCode : 500;
  const message = resolvedError.isOperational ? resolvedError.message : 'Internal server error';

  if (!resolvedError.isOperational) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: null,
  });
});

module.exports = app;
