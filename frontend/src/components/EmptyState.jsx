function EmptyState({ message = 'No results found.', actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-ink-200 bg-white px-6 py-16 text-center">
      <p className="text-ink-400">{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="text-sm font-medium text-ink-700 underline hover:text-ink-900">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
