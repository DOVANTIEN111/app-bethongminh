// src/pages/LoginPage.jsx
// Trang đăng nhập với chọn vai trò
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRBAC, ROLES } from '../contexts/RBACContext';
import {
  ShieldCheck, GraduationCap, Users, BookOpen,
  Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight,
  Loader2, CheckCircle, AlertCircle
} from 'lucide-react';

// Thông tin các vai trò
const ROLE_INFO = [
  {
    id: ROLES.ADMIN,
    title: 'Quản trị viên',
    description: 'Quản lý toàn bộ hệ thống',
    icon: ShieldCheck,
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
  },
  {
    id: ROLES.TEACHER,
    title: 'Giáo viên',
    description: 'Quản lý lớp học và giao bài',
    icon: GraduationCap,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    id: ROLES.PARENT,
    title: 'Phụ huynh',
    description: 'Theo dõi tiến độ học tập',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
  },
  {
    id: ROLES.STUDENT,
    title: 'Học sinh',
    description: 'Học tập và làm bài',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp, isAuthenticated, loading: authLoading, role } = useRBAC();

  const [step, setStep] = useState(1); // 1: Chọn vai trò, 2: Đăng nhập/Đăng ký
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && role) {
      const dashboards = {
        admin: '/admin',
        teacher: '/teacher',
        parent: '/parent',
        student: '/',
      };
      navigate(dashboards[role] || '/');
    }
  }, [isAuthenticated, role, navigate]);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Vui lòng nhập họ tên';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu không khớp';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.includes('Invalid login')) {
            setErrors({ general: 'Email hoặc mật khẩu không đúng' });
          } else {
            setErrors({ general: error });
          }
        }
      } else {
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.name,
          selectedRole
        );
        if (error) {
          if (error.includes('already registered')) {
            setErrors({ general: 'Email này đã được đăng ký' });
          } else {
            setErrors({ general: error });
          }
        } else {
          setSuccess(true);
        }
      }
    } catch (err) {
      setErrors({ general: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  const roleInfo = ROLE_INFO.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4"
          >
            <span className="text-4xl">📚</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-white">Gia Đình Thông Minh</h1>
          <p className="text-white/80 text-sm">Hệ thống học tập trực tuyến</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Step 1: Chọn vai trò */}
            {step === 1 && (
              <motion.div
                key="role-select"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6"
              >
                <h2 className="text-xl font-bold text-center mb-2">Chọn vai trò của bạn</h2>
                <p className="text-gray-500 text-center text-sm mb-6">
                  Chọn vai trò để tiếp tục đăng nhập
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {ROLE_INFO.map((role, index) => (
                    <motion.button
                      key={role.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleRoleSelect(role.id)}
                      className={`p-4 rounded-2xl border-2 border-transparent hover:border-indigo-200 ${role.bgColor} transition-all hover:scale-105`}
                    >
                      <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${role.color} flex items-center justify-center mb-2`}>
                        <role.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">{role.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Form đăng nhập/đăng ký */}
            {step === 2 && !success && (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                {/* Header với nút back */}
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => setStep(1)}
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="flex-1 text-center">
                    {roleInfo && (
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${roleInfo.color} flex items-center justify-center`}>
                          <roleInfo.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold">{roleInfo.title}</span>
                      </div>
                    )}
                  </div>
                  <div className="w-9" /> {/* Spacer */}
                </div>

                {/* Tabs đăng nhập/đăng ký */}
                <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      isLogin ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
                    }`}
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      !isLogin ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
                    }`}
                  >
                    Đăng ký
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Họ tên (chỉ khi đăng ký) */}
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Nguyễn Văn A"
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.name ? 'border-red-500' : 'border-gray-200'
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                      )}
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="email@example.com"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                          errors.email ? 'border-red-500' : 'border-gray-200'
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Mật khẩu */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
                          errors.password ? 'border-red-500' : 'border-gray-200'
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
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
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Xác nhận mật khẩu (chỉ khi đăng ký) */}
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                          } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  )}

                  {/* Error message */}
                  {errors.general && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{errors.general}</span>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading || authLoading}
                    className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${
                      roleInfo?.color || 'from-indigo-500 to-purple-500'
                    } hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2`}
                  >
                    {loading || authLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Link quên mật khẩu */}
                {isLogin && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    <button className="text-indigo-600 hover:underline">
                      Quên mật khẩu?
                    </button>
                  </p>
                )}
              </motion.div>
            )}

            {/* Success screen */}
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center"
              >
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Đăng ký thành công!
                </h3>
                <p className="text-gray-600 mb-6">
                  Vui lòng kiểm tra email để xác nhận tài khoản, sau đó đăng nhập.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setIsLogin(true);
                  }}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
                >
                  Đăng nhập ngay
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          © 2024 Gia Đình Thông Minh. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
