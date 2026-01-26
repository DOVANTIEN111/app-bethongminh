// src/pages/RegisterTeacherPage.jsx
// Teacher Registration Page
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, School, BookOpen, Loader2, CheckCircle, Eye, EyeOff, Lock } from 'lucide-react';
import supabase from '../lib/supabase';

const SUBJECTS = [
  { value: 'math', label: 'Toán' },
  { value: 'vietnamese', label: 'Tiếng Việt' },
  { value: 'english', label: 'Tiếng Anh' },
  { value: 'science', label: 'Khoa học' },
  { value: 'history', label: 'Lịch sử' },
  { value: 'geography', label: 'Địa lý' },
  { value: 'music', label: 'Âm nhạc' },
  { value: 'art', label: 'Mỹ thuật' },
  { value: 'pe', label: 'Thể dục' },
  { value: 'other', label: 'Khác' },
];

export default function RegisterTeacherPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    schoolName: '',
    subjects: [],
    experience: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubjectChange = (subjectValue) => {
    setFormData((prev) => {
      const subjects = prev.subjects.includes(subjectValue)
        ? prev.subjects.filter((s) => s !== subjectValue)
        : [...prev.subjects, subjectValue];
      return { ...prev, subjects };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    else if (formData.password.length < 6) newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
    if (formData.subjects.length === 0) newErrors.subjects = 'Vui lòng chọn ít nhất 1 môn dạy';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
            phone: formData.phone.trim(),
            role: 'teacher',
          },
        },
      });

      if (authError) throw authError;

      // Create profile
      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: authData.user.id,
          email: formData.email.trim().toLowerCase(),
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim(),
          role: 'teacher',
          is_active: true,
          metadata: {
            school_name: formData.schoolName.trim(),
            subjects: formData.subjects,
            experience: formData.experience,
            registration_source: 'landing_page',
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (profileError) {
          console.error('Profile error:', profileError);
        }
      }

      setSuccess(true);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message.includes('already registered')) {
        setErrors({ email: 'Email này đã được đăng ký' });
      } else {
        alert('Có lỗi xảy ra, vui lòng thử lại: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Đăng ký thành công!</h2>
          <p className="text-gray-600 mb-6">
            Tài khoản Giáo viên của bạn đã được tạo. Vui lòng kiểm tra email để xác nhận tài khoản, sau đó đăng nhập để bắt đầu sử dụng.
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-white">
            <span className="text-xl">🎓</span>
            <span className="font-bold">SchoolHub</span>
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👨‍🏫</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Đăng ký Giáo viên
            </h1>
            <p className="text-gray-600">
              Tạo bài giảng, giao bài tập, theo dõi học sinh dễ dàng
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    errors.fullName ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* Email & Phone */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0xx xxx xxxx"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* School Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Trường đang dạy
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder="VD: Trường TH Nguyễn Trãi"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Subjects */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Môn dạy <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((subject) => (
                  <button
                    key={subject.value}
                    type="button"
                    onClick={() => handleSubjectChange(subject.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      formData.subjects.includes(subject.value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {subject.label}
                  </button>
                ))}
              </div>
              {errors.subjects && <p className="text-red-500 text-sm mt-1">{errors.subjects}</p>}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Kinh nghiệm giảng dạy
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Chọn số năm kinh nghiệm</option>
                <option value="< 1">Dưới 1 năm</option>
                <option value="1-3">1 - 3 năm</option>
                <option value="3-5">3 - 5 năm</option>
                <option value="5-10">5 - 10 năm</option>
                <option value="> 10">Trên 10 năm</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                'Đăng ký tài khoản Giáo viên'
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
