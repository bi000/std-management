// One small presentational component so the six dashboard cards
// (total/active/inactive/graduated students, departments, courses,
// enrollments) share identical spacing and typography.
function StatCard({ label, value, accent = false }) {
  return (
    <div className="rounded-lg border border-ink-100 bg-white p-5">
      <p className="text-sm text-ink-400">{label}</p>
      <p className={`mt-1 font-display text-3xl font-semibold ${accent ? 'text-gold-600' : 'text-ink-900'}`}>
        {value}
      </p>
    </div>
  );
}

export default StatCard;
