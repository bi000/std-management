const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const { signToken } = require('../utils/jwt.util');
const AppError = require('../utils/AppError');

// Strips the password hash before a user object is ever returned from
// this service, so controllers can't accidentally forward it in a response.
function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

async function login(email, password) {
  const user = await userModel.findByEmail(email);

  // Deliberately use the same "Invalid email or password" message for
  // both "no such user" and "wrong password". Distinguishing them
  // would let an attacker enumerate which emails have accounts.
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.status !== 'Active') {
    throw new AppError('This account has been deactivated. Contact an administrator.', 403);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken({ id: user.id, role: user.role });
  return { token, user: sanitizeUser(user) };
}

module.exports = { login };
