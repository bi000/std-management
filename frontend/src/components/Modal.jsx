import { useEffect } from 'react';

// A single Modal implementation means every dialog in the app (forms,
// confirmations) gets the same overlay, escape-to-close, and focus
// behavior for free, instead of each feature reimplementing it.
function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevents the page behind the modal from scrolling while it's open.
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-lg`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1 text-ink-400 hover:bg-ink-50 hover:text-ink-700"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
