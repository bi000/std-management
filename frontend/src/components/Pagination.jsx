import Button from './Button';

// `pagination` is the {page, limit, total, totalPages} object the
// backend already returns, so pages can pass it through directly
// instead of recomputing it client-side.
function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between border-t border-ink-100 px-4 py-3 text-sm text-ink-500">
      <span>
        Showing {startItem}–{endItem} of {total}
      </span>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Previous
        </Button>
        <Button variant="secondary" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
