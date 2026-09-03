// Keeps every success response in the exact shape the spec requires,
// so controllers don't each re-type the {success, message, data} envelope.
function sendSuccess(res, statusCode, message, data = null, pagination = null) {
  const body = { success: true, message, data };
  if (pagination) {
    body.pagination = pagination;
  }
  return res.status(statusCode).json(body);
}

module.exports = { sendSuccess };
