import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast — auto-dismissing notification.
 * Use the exported `useToast` hook to trigger toasts imperatively.
 */
const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: '#34d399',
  error: '#fb7185',
  info: '#38bdf8',
};

let toastId = 0;
let externalAddToast = null;

export const toast = {
  success: (message, duration) =>
    externalAddToast?.({ type: 'success', message, duration }),
  error: (message, duration) =>
    externalAddToast?.({ type: 'error', message, duration }),
  info: (message, duration) =>
    externalAddToast?.({ type: 'info', message, duration }),
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', message, duration = 4000 }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Expose addToast externally for imperative usage
  useEffect(() => {
    externalAddToast = addToast;
    return () => {
      externalAddToast = null;
    };
  }, [addToast]);

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(({ id, type, message }) => {
          const Icon = icons[type];
          return (
            <motion.div
              key={id}
              className="glass-panel-static flex items-center gap-3 px-4 py-3 pointer-events-auto"
              style={{ minWidth: '280px', maxWidth: '400px' }}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Icon className="w-5 h-5 shrink-0" style={{ color: colors[type] }} />
              <p
                className="text-sm flex-1"
                style={{ color: 'var(--text-primary)' }}
              >
                {message}
              </p>
              <button
                onClick={() => removeToast(id)}
                className="shrink-0 cursor-pointer"
                style={{
                  color: 'var(--text-tertiary)',
                  background: 'none',
                  border: 'none',
                }}
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default toast;
