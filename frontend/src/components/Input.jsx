// Pairs a label, the input itself, and an error message as one unit
// so every form field in the app gets consistent spacing and error
// styling without repeating that markup on every page.
function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-800">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`rounded-md border px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-gold-400 ${
          error ? 'border-red-400' : 'border-ink-200'
        } ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
