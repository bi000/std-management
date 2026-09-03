// Centralizes pagination/sorting parsing so every list endpoint
// behaves consistently instead of each controller re-implementing
// its own parsing (and potentially its own bugs).

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function parsePagination(query) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (!Number.isInteger(page) || page < 1) page = DEFAULT_PAGE;
  if (!Number.isInteger(limit) || limit < 1) limit = DEFAULT_LIMIT;
  // Caps the page size so a client can't request an enormous result
  // set (e.g. ?limit=999999) and force the server to load everything
  // into memory at once.
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

function buildPaginationMeta(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(Math.ceil(total / limit), 1),
  };
}

// `allowedColumns` is a whitelist. Column names can't be parameterized
// with `?` placeholders in MySQL, so if we ever interpolated a raw
// query param into ORDER BY, that would be a SQL injection point.
// Checking against a fixed list closes that off entirely.
function parseSort(query, allowedColumns, defaultColumn) {
  const sortBy = allowedColumns.includes(query.sortBy) ? query.sortBy : defaultColumn;
  const order = (query.order || '').toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  return { sortBy, order };
}

module.exports = { parsePagination, buildPaginationMeta, parseSort };
