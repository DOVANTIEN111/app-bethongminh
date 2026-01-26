// src/pages/admin/PlansPage.jsx
// Enhanced Subscription Plans Management Page
import React, { useState, useEffect } from 'react';
import supabase from '../../lib/supabase';
import {
  CreditCard, Plus, Edit, Trash2, Search,
  Loader2, X, Check, Users, Eye, EyeOff,
  ArrowUp, ArrowDown, Star, Zap, Building2, Phone,
  GripVertical, AlertCircle
} from 'lucide-react';

// Badge color options
const BADGE_COLORS = [
  { value: 'blue', label: 'Xanh dương', class: 'bg-blue-100 text-blue-700' },
  { value: 'green', label: 'Xanh lá', class: 'bg-green-100 text-green-700' },
  { value: 'orange', label: 'Cam', class: 'bg-orange-100 text-orange-700' },
  { value: 'purple', label: 'Tím', class: 'bg-purple-100 text-purple-700' },
  { value: 'indigo', label: 'Chàm', class: 'bg-indigo-100 text-indigo-700' },
  { value: 'pink', label: 'Hồng', class: 'bg-pink-100 text-pink-700' },
  { value: 'gray', label: 'Xám', class: 'bg-gray-100 text-gray-700' },
];

// Target audience options
const TARGET_OPTIONS = [
  { value: 'student', label: 'Học sinh' },
  { value: 'teacher', label: 'Giáo viên' },
  { value: 'school', label: 'Nhà trường' },
  { value: 'family', label: 'Gia đình' },
];

// Icon options
const ICON_OPTIONS = [
  { value: 'star', label: 'Star', icon: Star },
  { value: 'zap', label: 'Zap', icon: Zap },
  { value: 'building-2', label: 'Building', icon: Building2 },
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'credit-card', label: 'Card', icon: CreditCard },
];

// Default feature template
const DEFAULT_FEATURE = { name: '', included: true };

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Enhanced form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_monthly: '',
    price_yearly: '',
    duration_days: '30',
    features: [{ name: '', included: true }],
    is_active: true,
    display_order: 0,
    badge: '',
    badge_color: 'blue',
    target_user: 'student',
    button_text: 'Đăng ký ngay',
    button_link: '/register',
    is_featured: false,
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        // Use mock data if table doesn't exist
        setPlans(getMockPlans());
      } else {
        setPlans(data || getMockPlans());
      }
    } catch (err) {
      console.error('Load plans error:', err);
      setPlans(getMockPlans());
    } finally {
      setLoading(false);
    }
  };

  const getMockPlans = () => [
    {
      id: '1',
      name: 'Miễn phí',
      description: 'Cho học sinh mới bắt đầu',
      price_monthly: 0,
      price_yearly: 0,
      duration_days: 30,
      features: [
        { name: '3 bài học/môn', included: true },
        { name: 'Trò chơi giáo dục cơ bản', included: true },
        { name: 'Theo dõi tiến độ', included: true },
        { name: 'Tất cả bài học', included: false },
      ],
      is_active: true,
      user_count: 150,
      display_order: 1,
      badge: null,
      badge_color: 'gray',
      target_user: 'student',
      button_text: 'Bắt đầu miễn phí',
      button_link: '/register',
      is_featured: false,
    },
    {
      id: '2',
      name: 'Học sinh Premium',
      description: 'Cho học sinh muốn học tập toàn diện',
      price_monthly: 49000,
      price_yearly: 490000,
      duration_days: 30,
      features: [
        { name: 'Tất cả 500+ bài học', included: true },
        { name: 'Không quảng cáo', included: true },
        { name: 'Hỗ trợ 24/7', included: true },
      ],
      is_active: true,
      user_count: 85,
      display_order: 2,
      badge: 'Phổ biến nhất',
      badge_color: 'blue',
      target_user: 'student',
      button_text: 'Dùng thử 30 ngày',
      button_link: '/register',
      is_featured: true,
    },
    {
      id: '3',
      name: 'Giáo viên Pro',
      description: 'Cho giáo viên quản lý lớp học',
      price_monthly: 199000,
      price_yearly: 1990000,
      duration_days: 30,
      features: [
        { name: 'Tạo bài giảng không giới hạn', included: true },
        { name: 'Quản lý đến 100 học sinh', included: true },
        { name: 'Chấm điểm tự động', included: true },
      ],
      is_active: true,
      user_count: 42,
      display_order: 3,
      badge: null,
      badge_color: 'purple',
      target_user: 'teacher',
      button_text: 'Đăng ký ngay',
      button_link: '/register/teacher',
      is_featured: false,
    },
  ];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      // Parse features if it's a string
      let features = plan.features;
      if (typeof features === 'string') {
        try {
          features = JSON.parse(features);
        } catch {
          features = [];
        }
      }
      // Convert old format (array of strings) to new format
      if (Array.isArray(features) && features.length > 0 && typeof features[0] === 'string') {
        features = features.map(f => ({ name: f, included: true }));
      }

      setFormData({
        name: plan.name || '',
        description: plan.description || '',
        price_monthly: plan.price_monthly?.toString() || '0',
        price_yearly: plan.price_yearly?.toString() || '0',
        duration_days: plan.duration_days?.toString() || '30',
        features: features && features.length > 0 ? features : [DEFAULT_FEATURE],
        is_active: plan.is_active !== false,
        display_order: plan.display_order || 0,
        badge: plan.badge || '',
        badge_color: plan.badge_color || 'blue',
        target_user: plan.target_user || 'student',
        button_text: plan.button_text || 'Đăng ký ngay',
        button_link: plan.button_link || '/register',
        is_featured: plan.is_featured || false,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        description: '',
        price_monthly: '',
        price_yearly: '',
        duration_days: '30',
        features: [DEFAULT_FEATURE],
        is_active: true,
        display_order: plans.length + 1,
        badge: '',
        badge_color: 'blue',
        target_user: 'student',
        button_text: 'Đăng ký ngay',
        button_link: '/register',
        is_featured: false,
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showToast('Vui lòng nhập tên gói cước', 'error');
      return;
    }

    setSaving(true);
    try {
      // Filter out empty features
      const cleanFeatures = formData.features.filter(f => f.name.trim());

      const planData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price_monthly: parseInt(formData.price_monthly) || 0,
        price_yearly: parseInt(formData.price_yearly) || 0,
        duration_days: parseInt(formData.duration_days) || 30,
        features: cleanFeatures,
        is_active: formData.is_active,
        display_order: parseInt(formData.display_order) || 0,
        badge: formData.badge.trim() || null,
        badge_color: formData.badge_color,
        target_user: formData.target_user,
        button_text: formData.button_text.trim(),
        button_link: formData.button_link.trim(),
        is_featured: formData.is_featured,
      };

      if (editingPlan) {
        const { error } = await supabase
          .from('plans')
          .update({ ...planData, updated_at: new Date().toISOString() })
          .eq('id', editingPlan.id);

        if (error) throw error;
        showToast('Cập nhật gói cước thành công!');
      } else {
        const { error } = await supabase
          .from('plans')
          .insert(planData);

        if (error) throw error;
        showToast('Thêm gói cước thành công!');
      }

      setShowModal(false);
      loadPlans();
    } catch (err) {
      console.error('Save plan error:', err);
      showToast('Có lỗi xảy ra: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plan) => {
    if (!confirm(`Bạn có chắc muốn xóa gói "${plan.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', plan.id);

      if (error) throw error;
      showToast('Đã xóa gói cước!');
      loadPlans();
    } catch (err) {
      console.error('Delete plan error:', err);
      showToast('Có lỗi xảy ra: ' + err.message, 'error');
    }
  };

  const handleToggleActive = async (plan) => {
    try {
      const { error } = await supabase
        .from('plans')
        .update({ is_active: !plan.is_active, updated_at: new Date().toISOString() })
        .eq('id', plan.id);

      if (error) throw error;
      showToast(plan.is_active ? 'Đã ẩn gói cước' : 'Đã hiện gói cước');
      loadPlans();
    } catch (err) {
      console.error('Toggle plan error:', err);
      showToast('Có lỗi xảy ra: ' + err.message, 'error');
    }
  };

  // Feature management
  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { ...DEFAULT_FEATURE }],
    });
  };

  const removeFeature = (index) => {
    if (formData.features.length <= 1) return;
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const updateFeature = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData({ ...formData, features: newFeatures });
  };

  const formatPrice = (price) => {
    if (price === 0 || price === null || price === undefined) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const getBadgeColorClass = (color) => {
    return BADGE_COLORS.find(c => c.value === color)?.class || 'bg-blue-100 text-blue-700';
  };

  const filteredPlans = plans.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý gói cước</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý các gói đăng ký cho người dùng</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Thêm gói mới
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm gói cước..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Plans Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Thứ tự
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tên gói
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Giá tháng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Giá năm
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Đối tượng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className={`hover:bg-gray-50 ${!plan.is_active ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <span className="text-gray-500">{plan.display_order || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getBadgeColorClass(plan.badge_color)}`}>
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{plan.name}</span>
                          {plan.badge && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColorClass(plan.badge_color)}`}>
                              {plan.badge}
                            </span>
                          )}
                          {plan.is_featured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{plan.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{formatPrice(plan.price_monthly)}</span>
                    <span className="text-gray-400 text-sm">/{plan.duration_days} ngày</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{formatPrice(plan.price_yearly)}</span>
                    <span className="text-gray-400 text-sm">/năm</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {TARGET_OPTIONS.find(t => t.value === plan.target_user)?.label || plan.target_user}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      plan.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {plan.is_active ? 'Hoạt động' : 'Đã ẩn'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{plan.user_count || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenModal(plan)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                        title="Sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(plan)}
                        className={`p-2 rounded-lg ${
                          plan.is_active ? 'hover:bg-orange-50 text-orange-600' : 'hover:bg-green-50 text-green-600'
                        }`}
                        title={plan.is_active ? 'Ẩn' : 'Hiện'}
                      >
                        {plan.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(plan)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPlans.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Chưa có gói cước nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingPlan ? 'Sửa gói cước' : 'Thêm gói cước mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tên gói <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Gói Premium"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mô tả ngắn
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả ngắn gọn về gói"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Giá tháng (VND)
                  </label>
                  <input
                    type="number"
                    value={formData.price_monthly}
                    onChange={(e) => setFormData({ ...formData, price_monthly: e.target.value })}
                    placeholder="49000"
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Giá năm (VND)
                  </label>
                  <input
                    type="number"
                    value={formData.price_yearly}
                    onChange={(e) => setFormData({ ...formData, price_yearly: e.target.value })}
                    placeholder="490000"
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Thời hạn (ngày)
                  </label>
                  <input
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                    placeholder="30"
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh sách tính năng
                </label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={feature.included}
                        onChange={(e) => updateFeature(index, 'included', e.target.checked)}
                        className="rounded text-blue-600 w-5 h-5"
                      />
                      <input
                        type="text"
                        value={feature.name}
                        onChange={(e) => updateFeature(index, 'name', e.target.value)}
                        placeholder="Tên tính năng"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <button
                        onClick={() => removeFeature(index)}
                        disabled={formData.features.length <= 1}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-500 disabled:opacity-30"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addFeature}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Thêm tính năng
                </button>
              </div>

              {/* Badge & Appearance */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Badge (nếu có)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="VD: Phổ biến nhất"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Màu badge
                  </label>
                  <select
                    value={formData.badge_color}
                    onChange={(e) => setFormData({ ...formData, badge_color: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    {BADGE_COLORS.map((color) => (
                      <option key={color.value} value={color.value}>{color.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    placeholder="1"
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Target & Button */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Đối tượng
                  </label>
                  <select
                    value={formData.target_user}
                    onChange={(e) => setFormData({ ...formData, target_user: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    {TARGET_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Text nút bấm
                  </label>
                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    placeholder="Đăng ký ngay"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Link nút bấm
                  </label>
                  <input
                    type="text"
                    value={formData.button_link}
                    onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                    placeholder="/register"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded text-blue-600 w-5 h-5"
                  />
                  <span className="text-sm font-medium text-gray-700">Hoạt động</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded text-yellow-500 w-5 h-5"
                  />
                  <span className="text-sm font-medium text-gray-700">Nổi bật (scale lớn hơn)</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-100 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name.trim()}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Lưu
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
