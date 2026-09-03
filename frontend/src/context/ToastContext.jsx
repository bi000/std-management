import { createContext, useState, useCallback } from 'react';

const ToastContext = createContext(undefined);

let idCounter = 0;

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  // `type` drives the toast's color (success/error/info) so callers
  // just describe what happened, not how it should look.
  const showToast = useCallback(
    (message, type = 'success') => {
      const id = idCounter++;
      setToasts((current) => [...current, { id, message, type }]);
      // Auto-dismiss after a few seconds so toasts don't pile up if
      // the user ignores them.
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`rounded-md px-4 py-3 text-sm text-white shadow-lg ${
              toast.type === 'error' ? 'bg-red-600' : toast.type === 'info' ? 'bg-ink-700' : 'bg-ink-900'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export { ToastContext, ToastProvider };
