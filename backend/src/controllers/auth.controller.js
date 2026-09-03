const authService = require('../services/auth.service');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Basic presence validation lives here; the service layer handles
  // the "does this email/password actually match an account" logic.
  if (!email || !password) {
    throw new AppError('Email and password are required.', 422);
  }

  const { token, user } = await authService.login(email, password);
  sendSuccess(res, 200, 'Login successful', { token, user });
});

// JWTs are stateless, so there's no server-side session to destroy.
// This endpoint exists mainly for a consistent API surface and a
// place to add token blacklisting later if that's ever needed; the
// frontend is responsible for discarding the token on its side.
const logout = catchAsync(async (req, res) => {
  sendSuccess(res, 200, 'Logged out successfully');
});

// req.user is already populated by the `authenticate` middleware,
// so this just echoes it back rather than re-querying the database.
const getMe = catchAsync(async (req, res) => {
  sendSuccess(res, 200, 'Current user retrieved successfully', req.user);
});

module.exports = { login, logout, getMe };
