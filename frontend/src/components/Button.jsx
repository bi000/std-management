const VARIANT_STYLES = {
  primary: 'bg-ink-800 text-white hover:bg-ink-700 focus-visible:outline-gold-400',
  gold: 'bg-gold-400 text-ink-900 hover:bg-gold-300',
  secondary: 'bg-white text-ink-800 border border-ink-200 hover:bg-ink-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-ink-700 hover:bg-ink-50',
};

// A single component with a `variant` prop keeps every button in the
// app visually consistent, instead of each page re-inventing its own
// button colors and hover states.
function Button({ variant = 'primary', className = '', isLoading = false, children, disabled, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_STYLES[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}

export default Button;
