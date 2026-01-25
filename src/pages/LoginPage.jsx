// src/pages/LoginPage.jsx
// Login Page với link đăng ký dùng thử và hỗ trợ returnUrl (deep link)
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Gift, Star, Clock } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, isAuthenticated, profile, loading: authLoading, getRedirectPath } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get returnUrl from query params for deep linking
  const returnUrl = searchParams.get('returnUrl');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && profile) {
      // If returnUrl exists and is valid (starts with /), use it
      // Otherwise, redirect based on role
      let redirectPath = getRedirectPath();

      if (returnUrl && returnUrl.startsWith('/')) {
        // Check if returnUrl is accessible by the user's role
        const rolePrefix = {
          super_admin: '/admin',
          school_admin: '/school',
          department_head: '/department',
          teacher: '/teacher',
          parent: '/parent',
          student: '/learn',
        };

        // Check if returnUrl matches user's role or is a lesson page (for students)
        const userPrefix = rolePrefix[profile.role];
        const isLessonPage = returnUrl.startsWith('/math/') ||
                            returnUrl.startsWith('/english/') ||
                            returnUrl.startsWith('/vietnamese/') ||
                            returnUrl.startsWith('/science/');

        if (returnUrl.startsWith(userPrefix) || (profile.role === 'student' && isLessonPage)) {
          redirectPath = returnUrl;
        }
      }

      console.log('[Login] Redirecting to:', redirectPath, '(returnUrl:', returnUrl, ')');
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, profile, navigate, getRedirectPath, returnUrl]);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-lg mb-3 sm:mb-4">
            <span className="text-3xl sm:text-4xl">🎓</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">SchoolHub</h1>
          <p className="text-white/80 text-xs sm:text-sm">Học tập vui nhộn cho bé</p>
        </div>

        {/* Trial Banner */}
        <Link
          to="/register"
          className="block bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4 text-center shadow-lg active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            <span className="font-bold text-white text-sm sm:text-base">DÙNG THỬ MIỄN PHÍ 30 NGÀY!</span>
          </div>
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-white/90 text-xs sm:text-sm">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Tất cả bài học
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Không cần thẻ
            </span>
          </div>
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6">Đăng nhập</h2>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base min-h-[48px]"
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
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base min-h-[48px]"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
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
              <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 active:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 min-h-[48px] text-base"
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
          <div className="mt-3 sm:mt-4 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-indigo-600 font-medium active:underline">
                Đăng ký dùng thử miễn phí
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-xs sm:text-sm mt-4 sm:mt-6">
          © 2025 SchoolHub
        </p>
      </div>
    </div>
  );
}
