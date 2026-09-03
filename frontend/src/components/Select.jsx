// Mirrors Input's label/error layout so forms mixing text fields and
// dropdowns stay visually consistent.
function Select({ label, id, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-800">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`rounded-md border bg-white px-3 py-2 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-gold-400 ${
          error ? 'border-red-400' : 'border-ink-200'
        } ${className}`}
        aria-invalid={!!error}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default Select;
