const AppError = require('../utils/AppError');

// Usage: router.delete('/:id', authenticate, authorize('Admin'), handler)
// Must run after `authenticate`, since it relies on req.user being set.
// Takes a rest-parameter list of allowed roles so the same middleware
// works for single-role and multi-role routes.
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      // Indicates authenticate() was skipped for this route — a
      // programming mistake in route setup, not a client error.
      throw new AppError('Authentication is required before authorization.', 500);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError('You do not have permission to perform this action.', 403);
    }

    next();
  };
}

module.exports = authorize;
