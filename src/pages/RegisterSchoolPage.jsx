// src/pages/RegisterSchoolPage.jsx
// School Registration Page
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, School, Mail, Phone, MapPin, User, Loader2, CheckCircle, Building2 } from 'lucide-react';

export default function RegisterSchoolPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    phone: '',
    address: '',
    representativeName: '',
    position: '',
    studentCount: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.schoolName.trim()) newErrors.schoolName = 'Vui lòng nhập tên trường';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!formData.representativeName.trim()) newErrors.representativeName = 'Vui lòng nhập họ tên người đại diện';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: Integrate with backend API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (error) {
      console.error('Registration error:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Đăng ký thành công!</h2>
          <p className="text-gray-600 mb-6">
            Cảm ơn quý trường đã quan tâm đến SchoolHub. Đội ngũ tư vấn sẽ liên hệ với quý trường trong vòng 24 giờ làm việc.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
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
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Đăng ký Nhà trường
            </h1>
            <p className="text-gray-600">
              Triển khai SchoolHub cho toàn trường với đội ngũ hỗ trợ riêng
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* School Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tên trường <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder="VD: Trường Tiểu học Nguyễn Trãi"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    errors.schoolName ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              {errors.schoolName && <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>}
            </div>

            {/* Email & Phone */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email trường <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@school.edu.vn"
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

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  rows={2}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    errors.address ? 'border-red-500' : 'border-gray-200'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
                />
              </div>
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Representative Name & Position */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Họ tên người đại diện <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="representativeName"
                    value={formData.representativeName}
                    onChange={handleChange}
                    placeholder="Họ và tên"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                      errors.representativeName ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
                {errors.representativeName && <p className="text-red-500 text-sm mt-1">{errors.representativeName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Chức vụ
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn chức vụ</option>
                  <option value="principal">Hiệu trưởng</option>
                  <option value="vice_principal">Phó Hiệu trưởng</option>
                  <option value="head_teacher">Tổ trưởng</option>
                  <option value="teacher">Giáo viên</option>
                  <option value="admin">Nhân viên hành chính</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            {/* Student Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Số lượng học sinh dự kiến
              </label>
              <select
                name="studentCount"
                value={formData.studentCount}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Chọn quy mô</option>
                <option value="< 100">Dưới 100 học sinh</option>
                <option value="100-500">100 - 500 học sinh</option>
                <option value="500-1000">500 - 1,000 học sinh</option>
                <option value="> 1000">Trên 1,000 học sinh</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Ghi chú thêm
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Yêu cầu đặc biệt, câu hỏi..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                'Đăng ký tư vấn miễn phí'
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              Đội ngũ tư vấn sẽ liên hệ trong vòng 24 giờ làm việc
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
