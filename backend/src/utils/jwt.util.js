const jwt = require('jsonwebtoken');
require('dotenv').config();

// The token payload only carries `id` and `role`. Keeping it minimal
// means the token stays small and never leaks personal data (name,
// email) into something a client could decode without a request.
function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

function verifyToken(token) {
  // Throws JsonWebTokenError (invalid/malformed) or TokenExpiredError
  // (expired) — the auth middleware translates these into a clean
  // 401 response rather than letting the raw error reach the client.
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { signToken, verifyToken };
