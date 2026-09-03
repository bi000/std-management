// One color mapping shared by every status-bearing resource
// (student, enrollment, user) so "Active" always means the same
// green everywhere in the app, rather than each page picking its own.
const STATUS_STYLES = {
  Active: 'bg-green-50 text-green-700',
  Inactive: 'bg-ink-100 text-ink-600',
  Graduated: 'bg-gold-50 text-gold-700',
  Completed: 'bg-blue-50 text-blue-700',
  Dropped: 'bg-red-50 text-red-700',
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-ink-100 text-ink-600';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>{status}</span>
  );
}

export default StatusBadge;
