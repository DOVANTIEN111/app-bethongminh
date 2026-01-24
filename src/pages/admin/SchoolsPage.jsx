// src/pages/admin/SchoolsPage.jsx
// Trang quản lý trường học - Tối ưu hóa
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  School, Plus, Edit2, Trash2, Search, Eye, RefreshCw,
  Loader2, X, MapPin, Phone, Mail, Users, GraduationCap,
  Upload, Building2, Calendar, Filter, ArrowUpDown, CheckCircle,
  XCircle, Crown, Sparkles, Star
} from 'lucide-react';

const PLAN_BADGES = {
  free: { label: 'Miễn phí', color: 'bg-gray-100 text-gray-700', icon: null },
  basic: { label: 'Cơ bản', color: 'bg-blue-100 text-blue-700', icon: Star },
  pro: { label: 'Pro', color: 'bg-purple-100 text-purple-700', icon: Sparkles },
  premium: { label: 'Premium', color: 'bg-amber-100 text-amber-700', icon: Crown },
};

export default function SchoolsPage() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [schoolStats, setSchoolStats] = useState({});
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    plan_id: '',
    notes: '',
    logo_url: '',
    is_active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('=== DEBUG: Loading schools data ===');

      const [schoolsRes, plansRes] = await Promise.all([
        supabase
          .from('schools')
          .select(`
            *,
            plan:plans(id, name, slug)
          `)
          .order('created_at', { ascending: false }),
        supabase.from('plans').select('id, name, slug').eq('is_active', true),
      ]);

      console.log('Schools response:', schoolsRes);
      console.log('Plans response:', plansRes);

      if (schoolsRes.error) {
        console.error('Schools error:', schoolsRes.error);
        throw schoolsRes.error;
      }

      const schoolsData = schoolsRes.data || [];
      setSchools(schoolsData);
      setPlans(plansRes.data || []);
      console.log('Loaded schools:', schoolsData.length);
      console.log('Loaded plans:', plansRes.data?.length || 0);

      // Load stats for all schools
      await loadAllStats(schoolsData.map(s => s.id));
    } catch (err) {
      console.error('Load schools error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllStats = async (schoolIds) => {
    try {
      const statsPromises = schoolIds.map(async (id) => {
        const [teachersRes, studentsRes, classesRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('school_id', id).eq('role', 'teacher'),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('school_id', id).eq('role', 'student'),
          supabase.from('classes').select('id', { count: 'exact', head: true }).eq('school_id', id),
        ]);
        return {
          id,
          teachers: teachersRes.count || 0,
          students: studentsRes.count || 0,
          classes: classesRes.count || 0,
        };
      });

      const allStats = await Promise.all(statsPromises);
      const statsMap = {};
      allStats.forEach(s => {
        statsMap[s.id] = s;
      });
      setSchoolStats(statsMap);
    } catch (err) {
      console.error('Load stats error:', err);
    }
  };

  const handleOpenModal = (school = null) => {
    if (school) {
      setEditingSchool(school);
      setFormData({
        name: school.name || '',
        email: school.email || '',
        address: school.address || '',
        phone: school.phone || '',
        plan_id: school.plan_id || '',
        notes: school.notes || '',
        logo_url: school.logo_url || '',
        is_active: school.is_active !== false,
      });
    } else {
      setEditingSchool(null);
      setFormData({
        name: '',
        email: '',
        address: '',
        phone: '',
        plan_id: '',
        notes: '',
        logo_url: '',
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const handleUploadLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `school-logos/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      setFormData({ ...formData, logo_url: publicUrl });
    } catch (err) {
      console.error('Upload error:', err);
      alert('Lỗi upload: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên trường');
      return;
    }
    if (!formData.email.trim()) {
      alert('Vui lòng nhập email');
      return;
    }

    setSaving(true);
    try {
      // Dữ liệu cơ bản (các cột chắc chắn tồn tại)
      const baseData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        address: formData.address.trim() || null,
        phone: formData.phone.trim() || null,
      };

      // Dữ liệu mở rộng (các cột mới từ migration)
      const extendedData = {
        ...baseData,
        plan_id: formData.plan_id || null,
        notes: formData.notes.trim() || null,
        logo_url: formData.logo_url || null,
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      };

      console.log('=== DEBUG: Saving school ===');
      console.log('Form data:', formData);
      console.log('Extended data to save:', extendedData);

      let result;

      if (editingSchool) {
        console.log('Updating school ID:', editingSchool.id);
        result = await supabase
          .from('schools')
          .update(extendedData)
          .eq('id', editingSchool.id)
          .select();

        // Nếu lỗi do cột không tồn tại, thử với dữ liệu cơ bản
        if (result.error && result.error.message.includes('column')) {
          console.log('Retrying with base data only...');
          result = await supabase
            .from('schools')
            .update(baseData)
            .eq('id', editingSchool.id)
            .select();
        }
      } else {
        console.log('Inserting new school');
        result = await supabase
          .from('schools')
          .insert(extendedData)
          .select();

        // Nếu lỗi do cột không tồn tại, thử với dữ liệu cơ bản
        if (result.error && result.error.message.includes('column')) {
          console.log('Retrying with base data only...');
          result = await supabase
            .from('schools')
            .insert(baseData)
            .select();
        }
      }

      console.log('Supabase result:', result);

      if (result.error) {
        console.error('Supabase error details:', {
          message: result.error.message,
          details: result.error.details,
          hint: result.error.hint,
          code: result.error.code,
        });
        throw result.error;
      }

      console.log('School saved successfully:', result.data);
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error('Save school error:', err);
      alert('Có lỗi xảy ra: ' + (err.message || JSON.stringify(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (school) => {
    if (!confirm(`Bạn có chắc muốn xóa trường "${school.name}"?\nTất cả dữ liệu liên quan (giáo viên, học sinh, lớp học) sẽ bị xóa!`)) return;

    try {
      const { error } = await supabase.from('schools').delete().eq('id', school.id);
      if (error) throw error;
      loadData();
    } catch (err) {
      console.error('Delete school error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    }
  };

  const handleToggleStatus = async (school) => {
    try {
      const { error } = await supabase
        .from('schools')
        .update({ is_active: !school.is_active, updated_at: new Date().toISOString() })
        .eq('id', school.id);
      if (error) throw error;
      loadData();
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  // Filter and sort schools
  const filteredSchools = schools
    .filter(s => {
      // Search filter
      const matchSearch = !searchQuery ||
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.address?.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && s.is_active !== false) ||
        (statusFilter === 'inactive' && s.is_active === false);

      // Plan filter
      const matchPlan = planFilter === 'all' ||
        (planFilter === 'free' && !s.plan_id) ||
        (s.plan?.slug?.includes(planFilter));

      return matchSearch && matchStatus && matchPlan;
    })
    .sort((a, b) => {
      const statsA = schoolStats[a.id] || {};
      const statsB = schoolStats[b.id] || {};

      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'students':
          return (statsB.students || 0) - (statsA.students || 0);
        case 'newest':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

  const getPlanBadge = (school) => {
    if (!school.plan_id || !school.plan) {
      return PLAN_BADGES.free;
    }
    const slug = school.plan.slug || '';
    if (slug.includes('premium')) return PLAN_BADGES.premium;
    if (slug.includes('pro') || slug.includes('basic')) return PLAN_BADGES.pro;
    return PLAN_BADGES.basic;
  };

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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Trường học</h1>
          <p className="text-gray-600">Quản lý thông tin và theo dõi các trường</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm trường mới
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <School className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tổng số trường</p>
              <p className="text-xl font-bold">{schools.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Đang hoạt động</p>
              <p className="text-xl font-bold">{schools.filter(s => s.is_active !== false).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tổng giáo viên</p>
              <p className="text-xl font-bold">{Object.values(schoolStats).reduce((sum, s) => sum + (s.teachers || 0), 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tổng học sinh</p>
              <p className="text-xl font-bold">{Object.values(schoolStats).reduce((sum, s) => sum + (s.students || 0), 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên, email, địa chỉ..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Tạm ngưng</option>
          </select>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả gói cước</option>
            <option value="free">Miễn phí</option>
            <option value="basic">Cơ bản</option>
            <option value="pro">Pro</option>
            <option value="premium">Premium</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="name">Tên A-Z</option>
            <option value="students">Nhiều HS nhất</option>
          </select>
        </div>

        {/* Active filters info */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Hiển thị {filteredSchools.length} / {schools.length} trường
          </span>
          <button
            onClick={loadData}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchools.map((school) => {
          const stats = schoolStats[school.id] || {};
          const planBadge = getPlanBadge(school);
          const PlanIcon = planBadge.icon;

          return (
            <div
              key={school.id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                school.is_active === false ? 'opacity-75' : ''
              }`}
            >
              {/* Card Header */}
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Logo */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    {school.logo_url ? (
                      <img
                        src={school.logo_url}
                        alt={school.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <School className="w-7 h-7 text-white" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{school.name}</h3>
                      {/* Status Badge */}
                      {school.is_active === false ? (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Tạm ngưng
                        </span>
                      ) : (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Hoạt động
                        </span>
                      )}
                    </div>

                    {school.email && (
                      <p className="text-sm text-gray-500 truncate flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3 flex-shrink-0" /> {school.email}
                      </p>
                    )}
                    {school.address && (
                      <p className="text-sm text-gray-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 flex-shrink-0" /> {school.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* Plan Badge */}
                <div className="mt-3 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${planBadge.color}`}>
                    {PlanIcon && <PlanIcon className="w-3 h-3" />}
                    {school.plan?.name || planBadge.label}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="px-4 py-3 bg-gray-50 border-t grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-blue-600">{stats.teachers || 0}</p>
                  <p className="text-xs text-gray-500">Giáo viên</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-600">{stats.students || 0}</p>
                  <p className="text-xs text-gray-500">Học sinh</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-orange-600">{stats.classes || 0}</p>
                  <p className="text-xs text-gray-500">Lớp học</p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {new Date(school.created_at).toLocaleDateString('vi-VN')}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate(`/admin/schools/${school.id}`)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleOpenModal(school)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Sửa"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(school)}
                    className={`p-2 rounded-lg transition-colors ${
                      school.is_active === false
                        ? 'hover:bg-green-50'
                        : 'hover:bg-yellow-50'
                    }`}
                    title={school.is_active === false ? 'Kích hoạt' : 'Tạm ngưng'}
                  >
                    {school.is_active === false ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-yellow-500" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(school)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSchools.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
            <School className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">Không tìm thấy trường học nào</p>
            <p className="text-gray-400 text-sm mt-1">Thử thay đổi bộ lọc hoặc thêm trường mới</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">
                {editingSchool ? 'Sửa thông tin trường' : 'Thêm trường mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo trường
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {formData.logo_url ? (
                      <img src={formData.logo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <School className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer">
                      <span className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        {uploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        {uploading ? 'Đang tải...' : 'Tải logo lên'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadLogo}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    {formData.logo_url && (
                      <button
                        onClick={() => setFormData({ ...formData, logo_url: '' })}
                        className="ml-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên trường <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Trường Tiểu học ABC"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="school@email.com"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912345678"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Đường ABC, Quận XYZ"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Plan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gói cước
                </label>
                <select
                  value={formData.plan_id}
                  onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Miễn phí (Mặc định)</option>
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.id}>{plan.name}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ghi chú thêm về trường..."
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  Đang hoạt động
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.name.trim() || !formData.email.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
