// A plain `throw new Error('message')` has no HTTP status code attached,
// forcing every catch block to guess one. AppError carries the status
// code alongside the message so the centralized error handler in
// app.js can respond correctly without inspecting error text.
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // Distinguishes errors we threw on purpose (bad input, not found,
    // etc.) from unexpected bugs, which is useful if logging is ever
    // extended to alert only on the latter.
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
