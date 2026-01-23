// src/pages/AdminPaymentsPage.jsx
// Trang quản lý thanh toán cho Admin
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRBAC } from '../contexts/RBACContext';
import { usePayment } from '../contexts/PaymentContext';
import {
  ChevronLeft, CreditCard, Check, X, Clock,
  Search, Filter, BarChart3, TrendingUp,
  Loader2, AlertCircle, CheckCircle, XCircle,
  Eye, DollarSign, Users, Calendar
} from 'lucide-react';

// Status config
const PAYMENT_STATUS = {
  pending: { label: 'Chờ duyệt', color: 'bg-amber-100 text-amber-700', icon: Clock },
  success: { label: 'Thành công', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  failed: { label: 'Thất bại', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function AdminPaymentsPage() {
  const navigate = useNavigate();
  const { isAdmin } = useRBAC();
  const {
    getPaymentStats, getPendingPayments, approvePayment, rejectPayment, formatPrice
  } = usePayment();

  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    loadData();
  }, [isAdmin, navigate]);

  const loadData = async () => {
    setLoading(true);
    const [statsData, paymentsData] = await Promise.all([
      getPaymentStats(),
      getPendingPayments(),
    ]);
    setStats(statsData);
    setPayments(paymentsData);
    setLoading(false);
  };

  const handleApprove = async (paymentId) => {
    setActionLoading(true);
    const result = await approvePayment(paymentId);
    if (result.success) {
      await loadData();
      setSelectedPayment(null);
    }
    setActionLoading(false);
  };

  const handleReject = async (paymentId) => {
    if (!rejectReason.trim()) return;

    setActionLoading(true);
    const result = await rejectPayment(paymentId, rejectReason);
    if (result.success) {
      await loadData();
      setSelectedPayment(null);
      setRejectReason('');
    }
    setActionLoading(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Quản lý thanh toán</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng doanh thu</p>
                  <p className="text-xl font-bold text-gray-800">
                    {formatPrice(stats.total_revenue || 0)}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tháng này</p>
                  <p className="text-xl font-bold text-gray-800">
                    {formatPrice(stats.this_month_revenue || 0)}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Chờ duyệt</p>
                  <p className="text-xl font-bold text-gray-800">
                    {stats.pending_payments || 0}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gói đang active</p>
                  <p className="text-xl font-bold text-gray-800">
                    {stats.active_subscriptions || 0}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Pending payments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">
              Thanh toán chờ duyệt ({payments.length})
            </h2>
            <button
              onClick={loadData}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Loader2 className={`w-5 h-5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {payments.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {payments.map((payment) => {
                const status = PAYMENT_STATUS[payment.status];
                const StatusIcon = status.icon;

                return (
                  <div
                    key={payment.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-gray-500" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-800 truncate">
                            {payment.user?.name || 'Unknown'}
                          </p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {payment.user?.email} • {payment.plan?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(payment.created_at)} • Mã GD: {payment.transaction_id}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-800">{formatPrice(payment.amount)}</p>
                        <p className="text-xs text-gray-500">
                          {payment.method === 'bank_transfer' ? 'Chuyển khoản' : 'MoMo'}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(payment.id);
                          }}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPayment(payment);
                          }}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-300" />
              <p>Không có thanh toán nào đang chờ duyệt</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Payment detail modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Chi tiết thanh toán</h3>
              <button
                onClick={() => {
                  setSelectedPayment(null);
                  setRejectReason('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Khách hàng</p>
                <p className="font-medium">{selectedPayment.user?.name}</p>
                <p className="text-sm text-gray-500">{selectedPayment.user?.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Gói</p>
                  <p className="font-medium">{selectedPayment.plan?.name}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Số tiền</p>
                  <p className="font-medium text-indigo-600">{formatPrice(selectedPayment.amount)}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Mã giao dịch</p>
                <p className="font-mono font-medium">{selectedPayment.transaction_id}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Phương thức</p>
                <p className="font-medium">
                  {selectedPayment.method === 'bank_transfer' ? 'Chuyển khoản ngân hàng' : 'Ví MoMo'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Thời gian tạo</p>
                <p className="font-medium">{formatDate(selectedPayment.created_at)}</p>
              </div>

              {/* Reject reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do từ chối (nếu từ chối)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Nhập lý do từ chối..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleReject(selectedPayment.id)}
                disabled={actionLoading || !rejectReason.trim()}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-50"
              >
                {actionLoading ? 'Đang xử lý...' : 'Từ chối'}
              </button>
              <button
                onClick={() => handleApprove(selectedPayment.id)}
                disabled={actionLoading}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 disabled:opacity-50"
              >
                {actionLoading ? 'Đang xử lý...' : 'Duyệt thanh toán'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
