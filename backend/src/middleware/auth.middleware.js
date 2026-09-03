const { verifyToken } = require('../utils/jwt.util');
const userModel = require('../models/user.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// Protects a route by requiring a valid "Authorization: Bearer <token>"
// header. On success, req.user holds the current user's safe profile
// (no password) so downstream handlers and the authorize middleware
// can rely on it.
const authenticate = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('You are not logged in. Please log in to continue.', 401);
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    // jsonwebtoken throws distinct error types for an expired token
    // vs. a malformed/tampered one; surfacing that distinction helps
    // the frontend decide whether to silently redirect to login or
    // show a specific "session expired" message.
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Your session has expired. Please log in again.', 401);
    }
    throw new AppError('Invalid authentication token.', 401);
  }

  // Re-fetch the user instead of trusting the token payload alone, so
  // an account that was deactivated or deleted after the token was
  // issued is rejected immediately rather than on its next login.
  const currentUser = await userModel.findById(decoded.id);
  if (!currentUser) {
    throw new AppError('The user belonging to this token no longer exists.', 401);
  }
  if (currentUser.status !== 'Active') {
    throw new AppError('This account has been deactivated.', 403);
  }

  req.user = currentUser;
  next();
});

module.exports = authenticate;
