const AppError = require('./AppError');

// mysql2 surfaces constraint violations as low-level error codes
// (ER_DUP_ENTRY, etc.) rather than anything resembling a validation
// error. Mapping the common ones here means individual services don't
// each need their own duplicate-check queries before every insert —
// the database's own constraints (see schema.sql) are the single
// source of truth, and this just translates their failures into
// messages a user can understand.
function mapDbError(err) {
  switch (err.code) {
    case 'ER_DUP_ENTRY':
      return new AppError('A record with this value already exists.', 409);
    case 'ER_ROW_IS_REFERENCED_2':
    case 'ER_ROW_IS_REFERENCED':
      return new AppError('This record cannot be deleted because other records depend on it.', 409);
    case 'ER_NO_REFERENCED_ROW_2':
    case 'ER_NO_REFERENCED_ROW':
      return new AppError('One of the referenced records (e.g. department or course) does not exist.', 422);
    case 'ER_BAD_NULL_ERROR':
      return new AppError('A required field was left empty.', 422);
    default:
      return null;
  }
}

module.exports = mapDbError;
