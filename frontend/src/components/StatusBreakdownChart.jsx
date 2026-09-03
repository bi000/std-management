// A small dependency-free bar chart, since the approved frontend
// stack doesn't include a charting library and pulling one in for a
// single dashboard chart would be overkill.
const BAR_COLORS = {
  Active: 'bg-green-400',
  Inactive: 'bg-ink-300',
  Graduated: 'bg-gold-400',
};

function StatusBreakdownChart({ students }) {
  const total = students.total || 1; // avoid divide-by-zero when there's no data yet
  const segments = [
    { label: 'Active', value: students.active },
    { label: 'Inactive', value: students.inactive },
    { label: 'Graduated', value: students.graduated },
  ];

  return (
    <div className="rounded-lg border border-ink-100 bg-white p-5">
      <p className="mb-4 text-sm font-medium text-ink-700">Students by status</p>
      <div className="flex h-4 overflow-hidden rounded-full bg-ink-50">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={BAR_COLORS[seg.label]}
            style={{ width: `${(seg.value / total) * 100}%` }}
            title={`${seg.label}: ${seg.value}`}
          />
        ))}
      </div>
      <div className="mt-3 flex gap-6 text-sm">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${BAR_COLORS[seg.label]}`} />
            <span className="text-ink-600">
              {seg.label} ({seg.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatusBreakdownChart;
