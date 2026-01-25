// src/pages/AuthPage.jsx
// TRANG ĐĂNG NHẬP / ĐĂNG KÝ - v3.5.0
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Onboarding from '../components/Onboarding';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { validateEmail, validatePassword, validateParentName, getPasswordStrength } from '../utils/validation';

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp, loading, isAuthenticated } = useAuth();
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [parentName, setParentName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  // Check nếu đã đăng nhập thì redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/select-role');
    }
  }, [isAuthenticated, navigate]);

  // Check nếu chưa xem onboarding
  useEffect(() => {
    const seen = localStorage.getItem('gdtm_onboarding_seen');
    if (!seen) {
      setShowOnboarding(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate email
    const emailResult = validateEmail(email);
    if (!emailResult.valid) {
      setError(emailResult.error);
      return;
    }

    // Validate password
    const passwordResult = validatePassword(password);
    if (!passwordResult.valid) {
      setError(passwordResult.error);
      return;
    }

    if (!isLogin) {
      // Validate parent name
      const nameResult = validateParentName(parentName);
      if (!nameResult.valid) {
        setError(nameResult.error);
        return;
      }

      if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp');
        return;
      }
    }

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.includes('Invalid')) {
          setError('Email hoặc mật khẩu không đúng');
        } else if (error.includes('Email not confirmed')) {
          setError('Vui lòng xác nhận email trước khi đăng nhập');
        } else {
          setError(error);
        }
      } else {
        navigate('/select-role');
      }
    } else {
      const { error } = await signUp(email, password, parentName);
      if (error) {
        if (error.includes('already')) {
          setError('Email đã được đăng ký');
        } else {
          setError(error);
        }
      } else {
        setSuccess('🎉 Đăng ký thành công! Đang chuyển hướng...');
        setTimeout(() => navigate('/select-role'), 1500);
      }
    }
  };

  // Hiển thị Onboarding nếu chưa xem
  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        <div className="absolute top-1/4 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        
        {/* Floating emojis */}
        <motion.div 
          animate={{ y: [0, -20, 0] }} 
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-20 right-20 text-4xl opacity-50"
        >
          📚
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0] }} 
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-32 left-10 text-4xl opacity-50"
        >
          🎮
        </motion.div>
        <motion.div 
          animate={{ y: [0, -15, 0] }} 
          transition={{ duration: 3.5, repeat: Infinity }}
          className="absolute top-1/3 left-5 text-3xl opacity-50"
        >
          ⭐
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-white rounded-3xl flex items-center justify-center text-5xl shadow-2xl mb-4 rotate-3">
            🎓
          </div>
          <h1 className="text-3xl font-bold text-white">SchoolHub</h1>
          <p className="text-white/80 mt-2">Học vui mỗi ngày cùng bé 🌟</p>
        </motion.div>

        {/* Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
        >
          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-2xl p-1.5">
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                isLogin 
                  ? 'bg-white shadow-md text-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                !isLogin 
                  ? 'bg-white shadow-md text-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Đăng ký
            </button>
          </div>

          {/* Error */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-center gap-3"
              >
                <span className="text-xl">😢</span>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success */}
          <AnimatePresence mode="wait">
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-600 text-sm flex items-center gap-3"
              >
                <span className="text-xl">🎉</span>
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Parent Name (only for register) */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tên phụ huynh
                  </label>
                  <div className={`relative rounded-xl border-2 transition-all ${
                    focusedField === 'name' ? 'border-indigo-500 shadow-lg shadow-indigo-100' : 'border-gray-200'
                  }`}>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="VD: Nguyễn Văn A"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl focus:outline-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className={`relative rounded-xl border-2 transition-all ${
                focusedField === 'email' ? 'border-indigo-500 shadow-lg shadow-indigo-100' : 'border-gray-200'
              }`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="email@example.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mật khẩu
              </label>
              <div className={`relative rounded-xl border-2 transition-all ${
                focusedField === 'password' ? 'border-indigo-500 shadow-lg shadow-indigo-100' : 'border-gray-200'
              }`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {!isLogin && password.length > 0 && password.length < 6 && (
                <p className="text-xs text-orange-500 mt-1.5 flex items-center gap-1">
                  ⚠️ Mật khẩu cần ít nhất 6 ký tự
                </p>
              )}
            </div>

            {/* Confirm Password (only for register) */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Xác nhận mật khẩu
                  </label>
                  <div className={`relative rounded-xl border-2 transition-all ${
                    focusedField === 'confirm' ? 'border-indigo-500 shadow-lg shadow-indigo-100' : 'border-gray-200'
                  }`}>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocusedField('confirm')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl focus:outline-none"
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      ❌ Mật khẩu không khớp
                    </p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="text-xs text-green-500 mt-1.5 flex items-center gap-1">
                      ✅ Mật khẩu khớp
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang xử lý...
                </>
              ) : isLogin ? (
                <>
                  Đăng nhập
                  <ArrowRight size={20} />
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Tạo tài khoản
                </>
              )}
            </motion.button>
          </form>

          {/* Forgot Password */}
          {isLogin && (
            <p className="text-center mt-4 text-sm text-gray-500">
              Quên mật khẩu?{' '}
              <button className="text-indigo-600 font-medium hover:underline">
                Lấy lại
              </button>
            </p>
          )}

          {/* Terms (for register) */}
          {!isLogin && (
            <p className="text-center mt-4 text-xs text-gray-400">
              Bằng việc đăng ký, bạn đồng ý với{' '}
              <button className="text-indigo-600 hover:underline">Điều khoản</button>
              {' '}và{' '}
              <button className="text-indigo-600 hover:underline">Chính sách bảo mật</button>
            </p>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-white/60 text-sm">
            Phiên bản 3.5.0 • Made with ❤️ for kids
          </p>
          
          {/* View Onboarding again */}
          <button
            onClick={() => setShowOnboarding(true)}
            className="mt-2 text-white/40 text-xs hover:text-white/70 transition"
          >
            Xem giới thiệu app
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
