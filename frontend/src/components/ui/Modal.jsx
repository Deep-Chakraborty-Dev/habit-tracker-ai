import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Modal — full-screen overlay with glass content panel.
 * Uses AnimatePresence for enter/exit transitions.
 */
const Modal = ({ isOpen, onClose, title, children, maxWidth = '28rem' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Content */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div
              className="glass-panel-static w-full p-6"
              style={{ maxWidth }}
              role="dialog"
              aria-modal="true"
              aria-label={title}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {title}
                </h2>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                  style={{
                    color: 'var(--text-tertiary)',
                    background: 'transparent',
                    border: 'none',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Body */}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
