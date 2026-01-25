// src/pages/LoginPage.jsx
// Login Page với link đăng ký dùng thử
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Gift, Star, Clock } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, profile, loading: authLoading, getRedirectPath } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && profile) {
      const redirectPath = getRedirectPath();
      console.log('[Login] Redirecting to:', redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, profile, navigate, getRedirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }

    setLoading(true);
    console.log('[Login] Attempting login:', email);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      console.error('[Login] Error:', signInError);
      if (signInError.includes('Invalid login')) {
        setError('Email hoặc mật khẩu không đúng');
      } else if (signInError.includes('Email not confirmed')) {
        setError('Vui lòng xác nhận email trước khi đăng nhập');
      } else {
        setError(signInError);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <span className="text-4xl">🎓</span>
          </div>
          <h1 className="text-2xl font-bold text-white">SchoolHub</h1>
          <p className="text-white/80 text-sm">Nền tảng học tập thông minh</p>
        </div>

        {/* Trial Banner */}
        <Link
          to="/register"
          className="block bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 mb-4 text-center shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Gift className="w-5 h-5 text-white" />
            <span className="font-bold text-white">DÙNG THỬ MIỄN PHÍ 30 NGÀY!</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-white/90 text-sm">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4" /> Tất cả bài học
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> Không cần thẻ
            </span>
          </div>
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-center mb-6">Đăng nhập</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading || authLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-indigo-600 font-medium hover:underline">
                Đăng ký dùng thử miễn phí
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          © 2024 SchoolHub
        </p>
      </div>
    </div>
  );
}
