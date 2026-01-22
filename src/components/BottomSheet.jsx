// src/components/BottomSheet.jsx
// Reusable bottom sheet component
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function BottomSheet({ 
  isOpen, 
  onClose, 
  title, 
  children,
  showHandle = true,
  showCloseButton = true,
  maxHeight = '90vh',
}) {
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

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{ maxHeight }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 overflow-hidden flex flex-col"
          >
            {/* Handle */}
            {showHandle && (
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
            )}

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Compact action sheet variant
export function ActionSheet({ isOpen, onClose, actions = [] }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 p-4 z-50"
          >
            <div className="bg-white rounded-2xl overflow-hidden mb-2">
              {actions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => {
                    action.onClick?.();
                    onClose();
                  }}
                  className={`w-full py-4 text-center font-medium border-b border-gray-100 last:border-0 ${
                    action.destructive 
                      ? 'text-red-500' 
                      : action.primary 
                        ? 'text-indigo-600' 
                        : 'text-gray-700'
                  }`}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 bg-white rounded-2xl text-center font-semibold text-gray-700"
            >
              Hủy
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
