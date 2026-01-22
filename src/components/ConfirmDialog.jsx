// src/components/ConfirmDialog.jsx
// Reusable confirmation dialog
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

const VARIANTS = {
  danger: {
    icon: AlertTriangle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
    confirmBg: 'bg-red-500 hover:bg-red-600',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-500',
    confirmBg: 'bg-amber-500 hover:bg-amber-600',
  },
  info: {
    icon: Info,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-500',
    confirmBg: 'bg-blue-500 hover:bg-blue-600',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-500',
    confirmBg: 'bg-green-500 hover:bg-green-600',
  },
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'danger',
  loading = false,
}) {
  const config = VARIANTS[variant] || VARIANTS.info;
  const Icon = config.icon;

  const handleConfirm = async () => {
    await onConfirm?.();
    if (!loading) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center`}>
                  <Icon size={32} className={config.iconColor} />
                </div>
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600">
                  {message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className={`flex-1 py-3 ${config.confirmBg} text-white rounded-xl font-medium transition disabled:opacity-50 flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for easy usage
export function useConfirm() {
  const [state, setState] = React.useState({
    isOpen: false,
    config: {},
    resolve: null,
  });

  const confirm = React.useCallback((config) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        config,
        resolve,
      });
    });
  }, []);

  const handleClose = React.useCallback(() => {
    state.resolve?.(false);
    setState({ isOpen: false, config: {}, resolve: null });
  }, [state.resolve]);

  const handleConfirm = React.useCallback(() => {
    state.resolve?.(true);
    setState({ isOpen: false, config: {}, resolve: null });
  }, [state.resolve]);

  const ConfirmDialogComponent = React.useCallback(() => (
    <ConfirmDialog
      isOpen={state.isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      {...state.config}
    />
  ), [state.isOpen, state.config, handleClose, handleConfirm]);

  return { confirm, ConfirmDialog: ConfirmDialogComponent };
}
