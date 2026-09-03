// Renders nothing when there's no message, so callers can write
// `<ErrorMessage message={error} />` unconditionally instead of
// wrapping every usage in its own `{error && ...}` check.
function ErrorMessage({ message, className = '' }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={`rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ${className}`}
    >
      {message}
    </div>
  );
}

export default ErrorMessage;
