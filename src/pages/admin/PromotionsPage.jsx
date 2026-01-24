// src/pages/admin/PromotionsPage.jsx
// Trang quản lý khuyến mãi
import React, { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Search, Tag, Percent, Gift,
  Calendar, Users, RefreshCw, X, Eye, Copy, Check
} from 'lucide-react';
import {
  getPromotions, getPromotionById, createPromotion, updatePromotion,
  deletePromotion, getPromotionUsage, getPromotionStats, formatCurrency
} from '../../services/financeManagement';

const DISCOUNT_TYPES = [
  { id: 'percentage', name: 'Phần trăm (%)', icon: Percent },
  { id: 'fixed', name: 'Số tiền cố định (VNĐ)', icon: Tag },
];

export default function PromotionsPage() {
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [promotionUsage, setPromotionUsage] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    min_amount: '',
    max_discount: '',
    usage_limit: '',
    start_date: '',
    end_date: '',
    is_active: true,
  });

  useEffect(() => {
    loadData();
  }, [showAll]);

  useEffect(() => {
    filterPromotions();
  }, [promotions, search]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [promoData, statsData] = await Promise.all([
        getPromotions(showAll),
        getPromotionStats()
      ]);
      setPromotions(promoData || []);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPromotions = () => {
    if (!search) {
      setFilteredPromotions(promotions);
      return;
    }
    const searchLower = search.toLowerCase();
    setFilteredPromotions(
      promotions.filter(p =>
        p.code.toLowerCase().includes(searchLower) ||
        p.name.toLowerCase().includes(searchLower)
      )
    );
  };

  const openCreateModal = () => {
    setEditingPromotion(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      min_amount: '',
      max_discount: '',
      usage_limit: '',
      start_date: '',
      end_date: '',
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = async (id) => {
    try {
      const promo = await getPromotionById(id);
      setEditingPromotion(promo);
      setFormData({
        code: promo.code || '',
        name: promo.name || '',
        description: promo.description || '',
        discount_type: promo.discount_type || 'percentage',
        discount_value: promo.discount_value || '',
        min_amount: promo.min_amount || '',
        max_discount: promo.max_discount || '',
        usage_limit: promo.usage_limit || '',
        start_date: promo.start_date ? promo.start_date.split('T')[0] : '',
        end_date: promo.end_date ? promo.end_date.split('T')[0] : '',
        is_active: promo.is_active,
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error loading promotion:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        discount_value: parseFloat(formData.discount_value) || 0,
        min_amount: parseFloat(formData.min_amount) || 0,
        max_discount: formData.max_discount ? parseFloat(formData.max_amount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : new Date().toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      };

      if (editingPromotion) {
        await updatePromotion(editingPromotion.id, data);
      } else {
        await createPromotion(data);
      }

      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Error saving promotion:', error);
      alert('Lỗi: ' + (error.message || 'Không thể lưu khuyến mãi'));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa mã khuyến mãi này?')) return;
    try {
      await deletePromotion(id);
      loadData();
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  const viewUsage = async (promotionId) => {
    try {
      const usage = await getPromotionUsage(promotionId);
      setPromotionUsage(usage || []);
      setShowUsageModal(true);
    } catch (error) {
      console.error('Error loading usage:', error);
    }
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Error copying:', error);
    }
  };

  const isExpired = (endDate) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  const getStatusBadge = (promo) => {
    if (!promo.is_active) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Tắt</span>;
    }
    if (isExpired(promo.end_date)) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Hết hạn</span>;
    }
    if (promo.usage_limit && promo.used_count >= promo.usage_limit) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">Hết lượt</span>;
    }
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Hoạt động</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Khuyến mãi</h1>
          <p className="text-gray-600">Tạo và quản lý mã giảm giá</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm mã mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng mã khuyến mãi</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalPromotions || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng lượt sử dụng</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalUsage || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đang hoạt động</p>
              <p className="text-2xl font-bold text-gray-800">
                {promotions.filter(p => p.is_active && !isExpired(p.end_date)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm mã hoặc tên khuyến mãi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600"
            />
            <span className="text-sm text-gray-600">Hiển thị cả mã đã tắt</span>
          </label>
          <button
            onClick={loadData}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPromotions.map((promo) => (
          <div key={promo.id} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyCode(promo.code)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <span className="font-mono font-bold text-blue-600">{promo.code}</span>
                  {copiedCode === promo.code ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-blue-400" />
                  )}
                </button>
              </div>
              {getStatusBadge(promo)}
            </div>

            <h3 className="font-semibold text-gray-800 mb-1">{promo.name}</h3>
            {promo.description && (
              <p className="text-sm text-gray-500 mb-3">{promo.description}</p>
            )}

            <div className="flex items-center gap-2 mb-3">
              {promo.discount_type === 'percentage' ? (
                <div className="flex items-center gap-1 text-green-600">
                  <Percent className="w-4 h-4" />
                  <span className="font-bold text-lg">-{promo.discount_value}%</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-green-600">
                  <Tag className="w-4 h-4" />
                  <span className="font-bold text-lg">-{formatCurrency(promo.discount_value)}</span>
                </div>
              )}
            </div>

            <div className="space-y-1 text-sm text-gray-500 mb-4">
              {promo.min_amount > 0 && (
                <p>Đơn tối thiểu: {formatCurrency(promo.min_amount)}</p>
              )}
              {promo.max_discount && (
                <p>Giảm tối đa: {formatCurrency(promo.max_discount)}</p>
              )}
              {promo.usage_limit && (
                <p>Sử dụng: {promo.used_count || 0}/{promo.usage_limit} lượt</p>
              )}
              {promo.end_date && (
                <p className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Hết hạn: {new Date(promo.end_date).toLocaleDateString('vi-VN')}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t">
              <button
                onClick={() => viewUsage(promo.id)}
                className="flex-1 flex items-center justify-center gap-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm">Lịch sử</span>
              </button>
              <button
                onClick={() => openEditModal(promo.id)}
                className="flex-1 flex items-center justify-center gap-1 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm">Sửa</span>
              </button>
              <button
                onClick={() => handleDelete(promo.id)}
                className="flex-1 flex items-center justify-center gap-1 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Xóa</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPromotions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có mã khuyến mãi nào</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {editingPromotion ? 'Sửa Khuyến mãi' : 'Thêm Khuyến mãi mới'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã khuyến mãi *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="VD: SALE50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên khuyến mãi *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Tên hiển thị"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Mô tả chi tiết..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại giảm giá
                  </label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {DISCOUNT_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá trị giảm *
                  </label>
                  <input
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={formData.discount_type === 'percentage' ? 'VD: 10' : 'VD: 50000'}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn tối thiểu (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={formData.min_amount}
                    onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giảm tối đa (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={formData.max_discount}
                    onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Không giới hạn"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới hạn lượt dùng
                  </label>
                  <input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Không giới hạn"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span className="text-sm">Kích hoạt</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingPromotion ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Usage History Modal */}
      {showUsageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Lịch sử sử dụng</h3>
              <button
                onClick={() => setShowUsageModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {promotionUsage.length > 0 ? (
                <div className="divide-y">
                  {promotionUsage.map((usage) => (
                    <div key={usage.id} className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm">
                          {usage.user?.full_name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {usage.user?.full_name || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500">{usage.user?.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-600 font-medium">
                          -{formatCurrency(usage.discount_amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(usage.used_at).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Chưa có lượt sử dụng nào</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
