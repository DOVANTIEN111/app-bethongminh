// src/pages/RegisterPage.jsx
// Trang đăng ký dùng thử 30 ngày
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, User,
  Phone, CheckCircle, Gift, Star, BookOpen, Clock
} from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && profile) {
      navigate('/learn', { replace: true });
    }
  }, [isAuthenticated, profile, navigate]);

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Vui lòng nhập họ tên');
      return false;
    }
    if (formData.fullName.trim().length < 2) {
      setError('Họ tên phải có ít nhất 2 ký tự');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    if (!formData.agreeTerms) {
      setError('Vui lòng đồng ý với Điều khoản sử dụng');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // 1. Đăng ký tài khoản
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
            role: 'student',
            phone: formData.phone.trim() || null,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Email này đã được đăng ký. Vui lòng đăng nhập hoặc sử dụng email khác.');
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Có lỗi xảy ra. Vui lòng thử lại.');
        setLoading(false);
        return;
      }

      // 2. Tạo profile
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: formData.email.trim(),
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim() || null,
        role: 'student',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error('Profile error:', profileError);
      }

      // 3. Lấy gói trial
      const { data: trialPlan } = await supabase
        .from('plans')
        .select('id')
        .eq('slug', 'trial')
        .single();

      // 4. Tạo subscription dùng thử
      if (trialPlan) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        await supabase.from('subscriptions').insert({
          user_id: authData.user.id,
          plan_id: trialPlan.id,
          status: 'active',
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          is_trial: true,
          created_at: new Date().toISOString(),
        });
      }

      setSuccess(true);

      // Chờ một chút rồi chuyển hướng
      setTimeout(() => {
        navigate('/learn', { replace: true });
      }, 2000);

    } catch (err) {
      console.error('Register error:', err);
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Đăng ký thành công!
          </h2>
          <p className="text-gray-600 mb-4">
            Chào mừng bạn đến với SchoolHub!<br />
            Bạn có 30 ngày dùng thử miễn phí.
          </p>
          <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang chuyển hướng...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <span className="text-4xl">🎓</span>
          </div>
          <h1 className="text-2xl font-bold text-white">SchoolHub</h1>
          <p className="text-white/80 text-sm">Nền tảng học tập thông minh</p>
        </div>

        {/* Trial Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 mb-4 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Gift className="w-5 h-5 text-white" />
            <span className="font-bold text-white">DÙNG THỬ MIỄN PHÍ 30 NGÀY</span>
          </div>
          <div className="flex items-center justify-center gap-4 text-white/90 text-sm">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" /> Tất cả bài học
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4" /> Không cần thẻ
            </span>
          </div>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-center mb-4">Đăng ký tài khoản</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tối thiểu 6 ký tự"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Phone (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại <span className="text-gray-400">(tùy chọn)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0912345678"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="agreeTerms"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                disabled={loading}
              />
              <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                Tôi đồng ý với{' '}
                <a href="/terms" className="text-indigo-600 hover:underline">
                  Điều khoản sử dụng
                </a>{' '}
                và{' '}
                <a href="/privacy" className="text-indigo-600 hover:underline">
                  Chính sách bảo mật
                </a>
              </label>
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
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5" />
                  Đăng ký dùng thử miễn phí
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur rounded-xl p-3 text-center">
            <BookOpen className="w-6 h-6 text-white mx-auto mb-1" />
            <p className="text-white text-xs font-medium">500+ Bài học</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl p-3 text-center">
            <Clock className="w-6 h-6 text-white mx-auto mb-1" />
            <p className="text-white text-xs font-medium">30 ngày free</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl p-3 text-center">
            <Star className="w-6 h-6 text-white mx-auto mb-1" />
            <p className="text-white text-xs font-medium">Không cần thẻ</p>
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
