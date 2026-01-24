// src/pages/admin/SchoolDetailPage.jsx
// Trang chi tiết trường học
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  School, ArrowLeft, Edit2, Mail, Phone, MapPin, Calendar,
  Users, GraduationCap, Building2, BookOpen, CreditCard,
  CheckCircle, XCircle, Loader2, RefreshCw, Crown, Sparkles, Star
} from 'lucide-react';
import { formatCurrency } from '../../services/financeManagement';

const PLAN_BADGES = {
  free: { label: 'Miễn phí', color: 'bg-gray-100 text-gray-700', icon: null },
  basic: { label: 'Cơ bản', color: 'bg-blue-100 text-blue-700', icon: Star },
  pro: { label: 'Pro', color: 'bg-purple-100 text-purple-700', icon: Sparkles },
  premium: { label: 'Premium', color: 'bg-amber-100 text-amber-700', icon: Crown },
};

export default function SchoolDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [school, setSchool] = useState(null);
  const [stats, setStats] = useState({});
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadSchoolData();
    }
  }, [id]);

  const loadSchoolData = async () => {
    try {
      setLoading(true);

      // Load school info
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select(`
          *,
          plan:plans(id, name, slug, price_monthly)
        `)
        .eq('id', id)
        .single();

      if (schoolError) throw schoolError;
      setSchool(schoolData);
      setSelectedPlan(schoolData.plan_id || '');

      // Load all related data in parallel
      const [
        statsRes,
        deptRes,
        teachersRes,
        classesRes,
        transRes,
        plansRes
      ] = await Promise.all([
        // Stats
        Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('school_id', id).eq('role', 'teacher'),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('school_id', id).eq('role', 'student'),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('school_id', id).eq('role', 'parent'),
          supabase.from('departments').select('id', { count: 'exact', head: true }).eq('school_id', id),
          supabase.from('classes').select('id', { count: 'exact', head: true }).eq('school_id', id),
        ]),
        // Departments
        supabase.from('departments').select('*').eq('school_id', id).order('name'),
        // Teachers (top 5)
        supabase.from('profiles').select('id, full_name, email, avatar_url').eq('school_id', id).eq('role', 'teacher').order('created_at', { ascending: false }).limit(5),
        // Classes (top 5)
        supabase.from('classes').select('*').eq('school_id', id).order('name').limit(5),
        // Transactions
        supabase.from('transactions').select('*').eq('school_id', id).order('created_at', { ascending: false }).limit(10),
        // Plans
        supabase.from('plans').select('id, name, slug, price_monthly').eq('is_active', true),
      ]);

      setStats({
        teachers: statsRes[0].count || 0,
        students: statsRes[1].count || 0,
        parents: statsRes[2].count || 0,
        departments: statsRes[3].count || 0,
        classes: statsRes[4].count || 0,
      });

      setDepartments(deptRes.data || []);
      setTeachers(teachersRes.data || []);
      setClasses(classesRes.data || []);
      setTransactions(transRes.data || []);
      setPlans(plansRes.data || []);

    } catch (error) {
      console.error('Error loading school:', error);
      alert('Không thể tải thông tin trường: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!school) return;
    const newStatus = !school.is_active;
    const action = newStatus ? 'kích hoạt' : 'tạm ngưng';

    if (!confirm(`Bạn có chắc muốn ${action} trường này?`)) return;

    try {
      setUpdating(true);
      const { error } = await supabase
        .from('schools')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      setSchool({ ...school, is_active: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Lỗi: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePlan = async () => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('schools')
        .update({ plan_id: selectedPlan || null, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setShowPlanModal(false);
      loadSchoolData();
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Lỗi: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const getPlanBadge = () => {
    if (!school?.plan_id || !school?.plan) {
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

  if (!school) {
    return (
      <div className="text-center py-12">
        <School className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">Không tìm thấy trường học</p>
        <button
          onClick={() => navigate('/admin/schools')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const planBadge = getPlanBadge();
  const PlanIcon = planBadge.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/schools')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Chi tiết Trường học</h1>
          <p className="text-gray-600">Xem và quản lý thông tin trường</p>
        </div>
        <button
          onClick={loadSchoolData}
          className="p-2 hover:bg-gray-100 rounded-lg"
          title="Làm mới"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* School Info Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              {school.logo_url ? (
                <img src={school.logo_url} alt={school.name} className="w-full h-full object-cover" />
              ) : (
                <School className="w-12 h-12 text-white" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">{school.name}</h2>
                    {school.is_active !== false ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Đang hoạt động
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Tạm ngưng
                      </span>
                    )}
                  </div>

                  {/* Plan Badge */}
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${planBadge.color}`}>
                      {PlanIcon && <PlanIcon className="w-4 h-4" />}
                      {school.plan?.name || planBadge.label}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPlanModal(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    Đổi gói cước
                  </button>
                  <button
                    onClick={handleToggleStatus}
                    disabled={updating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      school.is_active !== false
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {school.is_active !== false ? (
                      <>
                        <XCircle className="w-4 h-4" />
                        Tạm ngưng
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Kích hoạt
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => navigate('/admin/schools', { state: { editSchool: school } })}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Sửa thông tin
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {school.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{school.email}</span>
                  </div>
                )}
                {school.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{school.phone}</span>
                  </div>
                )}
                {school.address && (
                  <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{school.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Tham gia: {new Date(school.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              {school.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{school.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 bg-gray-50 border-t grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto bg-blue-100 rounded-xl flex items-center justify-center mb-2">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.departments}</p>
            <p className="text-xs text-gray-500">Bộ phận</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto bg-green-100 rounded-xl flex items-center justify-center mb-2">
              <GraduationCap className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.teachers}</p>
            <p className="text-xs text-gray-500">Giáo viên</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto bg-purple-100 rounded-xl flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.students}</p>
            <p className="text-xs text-gray-500">Học sinh</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto bg-orange-100 rounded-xl flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600">{stats.classes}</p>
            <p className="text-xs text-gray-500">Lớp học</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto bg-pink-100 rounded-xl flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-pink-600" />
            </div>
            <p className="text-2xl font-bold text-pink-600">{stats.parents}</p>
            <p className="text-xs text-gray-500">Phụ huynh</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Departments */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Danh sách Bộ phận</h3>
            <span className="text-sm text-gray-500">{departments.length} bộ phận</span>
          </div>
          <div className="p-4">
            {departments.length > 0 ? (
              <div className="space-y-3">
                {departments.map((dept) => (
                  <div key={dept.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{dept.name}</p>
                      {dept.description && (
                        <p className="text-sm text-gray-500 truncate">{dept.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Chưa có bộ phận nào</p>
            )}
          </div>
        </div>

        {/* Teachers */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Giáo viên mới nhất</h3>
            <span className="text-sm text-gray-500">{stats.teachers} giáo viên</span>
          </div>
          <div className="p-4">
            {teachers.length > 0 ? (
              <div className="space-y-3">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                      {teacher.avatar_url ? (
                        <img src={teacher.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <GraduationCap className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{teacher.full_name || 'Chưa có tên'}</p>
                      <p className="text-sm text-gray-500 truncate">{teacher.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Chưa có giáo viên nào</p>
            )}
          </div>
        </div>

        {/* Classes */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Lớp học</h3>
            <span className="text-sm text-gray-500">{stats.classes} lớp</span>
          </div>
          <div className="p-4">
            {classes.length > 0 ? (
              <div className="space-y-3">
                {classes.map((cls) => (
                  <div key={cls.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{cls.name}</p>
                      {cls.grade && (
                        <p className="text-sm text-gray-500">Khối {cls.grade}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Chưa có lớp học nào</p>
            )}
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Lịch sử Thanh toán</h3>
            <span className="text-sm text-gray-500">{transactions.length} giao dịch</span>
          </div>
          <div className="p-4">
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((trans) => (
                  <div key={trans.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        trans.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        <CreditCard className={`w-5 h-5 ${
                          trans.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {formatCurrency(trans.amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(trans.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trans.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : trans.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {trans.status === 'completed' ? 'Thành công' :
                       trans.status === 'pending' ? 'Chờ xử lý' : 'Thất bại'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Chưa có giao dịch nào</p>
            )}
          </div>
        </div>
      </div>

      {/* Change Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-bold">Đổi gói cước</h3>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600">
                Chọn gói cước mới cho trường <strong>{school.name}</strong>
              </p>

              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="plan"
                    value=""
                    checked={selectedPlan === ''}
                    onChange={() => setSelectedPlan('')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <p className="font-medium">Miễn phí</p>
                    <p className="text-sm text-gray-500">Gói cơ bản, không mất phí</p>
                  </div>
                </label>

                {plans.map((plan) => (
                  <label
                    key={plan.id}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={selectedPlan === plan.id}
                      onChange={() => setSelectedPlan(plan.id)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-sm text-gray-500">
                        {plan.price_monthly > 0 ? formatCurrency(plan.price_monthly) + '/tháng' : 'Miễn phí'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleChangePlan}
                  disabled={updating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating ? 'Đang lưu...' : 'Xác nhận'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
