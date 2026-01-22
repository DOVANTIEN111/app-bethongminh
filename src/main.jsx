// src/main.jsx
// ENTRY POINT - v3.5.0 với PWA + Error Boundary + Toast + Sentry + Analytics
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { AudioProvider } from './contexts/AudioContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import InstallPWA from './components/InstallPWA';
import { initSentry } from './lib/sentry';
import { initAnalytics } from './lib/analytics';
import './index.css';

// Khởi tạo Sentry (error tracking)
initSentry();

// Khởi tạo Analytics
initAnalytics();

// Register PWA service worker
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    // Có bản cập nhật mới
    if (confirm('Có phiên bản mới! Tải lại để cập nhật?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('✅ App sẵn sàng hoạt động offline!');
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppProvider>
              <AudioProvider>
                <ToastProvider>
                  <App />
                  <InstallPWA />
                </ToastProvider>
              </AudioProvider>
            </AppProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
