// src/pages/admin/PlansPage.jsx
// Subscription Plans Management Page
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  CreditCard, Plus, Edit, Trash2, Search,
  Loader2, X, Check, Users
} from 'lucide-react';

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_days: '30',
    features: '',
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      // Try to load from plans table, if not exists use mock data
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price');

      if (error) {
        // Use mock data if table doesn't exist
        setPlans([
          {
            id: '1',
            name: 'Goi Mien Phi',
            description: 'Dung thu cac tinh nang co ban',
            price: 0,
            duration_days: 30,
            features: ['Truy cap bai hoc co ban', 'Toi da 3 bai hoc/ngay'],
            is_active: true,
            user_count: 150,
          },
          {
            id: '2',
            name: 'Goi Co Ban',
            description: 'Phu hop cho hoc sinh tieu hoc',
            price: 99000,
            duration_days: 30,
            features: ['Truy cap tat ca bai hoc', 'Khong gioi han bai hoc', 'Ho tro truc tuyen'],
            is_active: true,
            user_count: 85,
          },
          {
            id: '3',
            name: 'Goi Nang Cao',
            description: 'Day du tinh nang cho hoc sinh',
            price: 199000,
            duration_days: 30,
            features: ['Tat ca tinh nang Goi Co Ban', 'Bai tap nang cao', 'Bao cao tien do chi tiet', 'Uu tien ho tro'],
            is_active: true,
            user_count: 42,
          },
          {
            id: '4',
            name: 'Goi Gia Dinh',
            description: 'Cho toi da 5 thanh vien',
            price: 399000,
            duration_days: 30,
            features: ['Tat ca tinh nang Goi Nang Cao', 'Toi da 5 tai khoan', 'Quan ly gia dinh', 'Giam 50% cho thanh vien tiep theo'],
            is_active: true,
            user_count: 28,
          },
        ]);
      } else {
        setPlans(data || []);
      }
    } catch (err) {
      console.error('Load plans error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name || '',
        description: plan.description || '',
        price: plan.price?.toString() || '0',
        duration_days: plan.duration_days?.toString() || '30',
        features: Array.isArray(plan.features) ? plan.features.join('\n') : (plan.features || ''),
        is_active: plan.is_active !== false,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        duration_days: '30',
        features: '',
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      const planData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseInt(formData.price) || 0,
        duration_days: parseInt(formData.duration_days) || 30,
        features: formData.features.split('\n').filter(f => f.trim()),
        is_active: formData.is_active,
      };

      if (editingPlan) {
        const { error } = await supabase
          .from('plans')
          .update({ ...planData, updated_at: new Date().toISOString() })
          .eq('id', editingPlan.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('plans')
          .insert(planData);

        if (error) throw error;
      }

      setShowModal(false);
      loadPlans();
    } catch (err) {
      console.error('Save plan error:', err);
      alert('Co loi xay ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plan) => {
    if (!confirm(`Ban co chac muon xoa goi "${plan.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', plan.id);

      if (error) throw error;
      loadPlans();
    } catch (err) {
      console.error('Delete plan error:', err);
      alert('Co loi xay ra: ' + err.message);
    }
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Mien phi';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filteredPlans = plans.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tim kiem goi cuoc..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Them goi cuoc
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl shadow-sm overflow-hidden ${
              !plan.is_active ? 'opacity-60' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenModal(plan)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(plan)}
                    className="p-2 hover:bg-red-100 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-blue-600">{formatPrice(plan.price)}</span>
                <span className="text-gray-500">/{plan.duration_days} ngay</span>
              </div>

              <div className="space-y-2 mb-4">
                {(Array.isArray(plan.features) ? plan.features : []).slice(0, 4).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{plan.user_count || 0} nguoi dung</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  plan.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {plan.is_active ? 'Hoat dong' : 'Tam dung'}
                </span>
              </div>
            </div>
          </div>
        ))}
        {filteredPlans.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Chua co goi cuoc nao</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {editingPlan ? 'Sua goi cuoc' : 'Them goi cuoc moi'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ten goi *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Goi Co Ban"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mo ta
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mo ta ngan gon ve goi"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gia (VND)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thoi han (ngay)
                  </label>
                  <input
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                    placeholder="30"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tinh nang (moi dong 1 tinh nang)
                </label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Truy cap tat ca bai hoc&#10;Khong gioi han bai hoc&#10;Ho tro truc tuyen"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Hoat dong</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Huy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.name.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Dang luu...' : 'Luu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
