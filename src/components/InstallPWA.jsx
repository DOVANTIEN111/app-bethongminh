// src/components/InstallPWA.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone } from 'lucide-react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');
    setIsStandalone(standalone);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Listen for beforeinstallprompt (Chrome, Edge, etc.)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Check if user has dismissed before
      const dismissed = localStorage.getItem('pwa_prompt_dismissed');
      const lastDismissed = dismissed ? parseInt(dismissed) : 0;
      const daysSinceDismissed = (Date.now() - lastDismissed) / (1000 * 60 * 60 * 24);
      
      // Show prompt if never dismissed or dismissed more than 7 days ago
      if (!dismissed || daysSinceDismissed > 7) {
        // Delay showing prompt to not interrupt user
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show iOS prompt after delay if on iOS and not installed
    if (iOS && !standalone) {
      const dismissed = localStorage.getItem('pwa_prompt_dismissed');
      const lastDismissed = dismissed ? parseInt(dismissed) : 0;
      const daysSinceDismissed = (Date.now() - lastDismissed) / (1000 * 60 * 60 * 24);
      
      if (!dismissed || daysSinceDismissed > 7) {
        setTimeout(() => setShowPrompt(true), 5000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  // Don't show if already installed
  if (isStandalone) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-20 left-4 right-4 z-50"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-100">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                📚
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">
                  Cài đặt ứng dụng
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Thêm vào màn hình chính để học mọi lúc, mọi nơi!
                </p>
              </div>
            </div>

            {isIOS ? (
              // iOS instructions
              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span>1. Nhấn</span>
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                      <polyline points="16 6 12 2 8 6"/>
                      <line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                  </span>
                  <span>ở thanh menu</span>
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  2. Chọn <strong>"Thêm vào MH chính"</strong>
                </p>
              </div>
            ) : (
              // Android/Chrome install button
              <button
                onClick={handleInstall}
                className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Download size={20} />
                Cài đặt ngay
              </button>
            )}

            <p className="text-xs text-gray-400 text-center mt-3">
              Miễn phí • Không cần App Store
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
