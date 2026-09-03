function LoadingSpinner({ label = 'Loading…', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 text-ink-400 ${className}`} role="status">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-gold-400" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export default LoadingSpinner;
