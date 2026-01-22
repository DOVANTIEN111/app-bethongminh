// src/components/Toast.jsx
// Toast notification system
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    bg: 'bg-green-500',
    iconColor: 'text-white',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-500',
    iconColor: 'text-white',
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-amber-500',
    iconColor: 'text-white',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-500',
    iconColor: 'text-white',
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 left-4 right-4 z-[100] pointer-events-none flex flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onRemove={() => onRemove(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({ id, message, type, onRemove }) {
  const config = TOAST_TYPES[type] || TOAST_TYPES.info;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`${config.bg} text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3 pointer-events-auto max-w-sm w-full`}
    >
      <Icon size={20} className={config.iconColor} />
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={onRemove}
        className="text-white/70 hover:text-white transition"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export default ToastContext;
