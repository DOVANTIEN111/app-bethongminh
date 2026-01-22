// src/components/ErrorBoundary.jsx
import React from 'react';
import { captureError } from '../lib/sentry';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });

    // Log error to console
    console.error('🔴 App Error:', error);
    console.error('Error Info:', errorInfo);

    // Báo cáo lỗi lên Sentry
    captureError(error, {
      componentStack: errorInfo?.componentStack,
      errorBoundary: true,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
            {/* Sad emoji animation */}
            <div className="text-8xl mb-4 animate-bounce">😢</div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Ôi không! Có lỗi xảy ra
            </h1>
            
            <p className="text-gray-600 mb-6">
              Đừng lo, mọi thứ sẽ ổn thôi! Thử tải lại trang nhé.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                🔄 Tải lại trang
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >
                🏠 Về trang chủ
              </button>
            </div>
            
            {/* Show error details in development */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  🔧 Chi tiết lỗi (dev only)
                </summary>
                <pre className="mt-2 p-3 bg-red-50 rounded-lg text-xs text-red-700 overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
          
          {/* Decorative elements */}
          <div className="mt-8 text-white/60 text-sm">
            Nếu lỗi vẫn tiếp tục, hãy liên hệ hỗ trợ
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
