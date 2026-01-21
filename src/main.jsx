// src/main.jsx
// ĐÃ CẬP NHẬT - Thêm AuthProvider cho đăng nhập phụ huynh
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './contexts/AppContext';
import { MemberProvider } from './contexts/MemberContext';
import { AudioProvider } from './contexts/AudioContext';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <AudioProvider>
          <AuthProvider>
            <MemberProvider>
              <App />
            </MemberProvider>
          </AuthProvider>
        </AudioProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
