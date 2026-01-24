// src/pages/admin/TransactionsPage.jsx
// Trang lịch sử giao dịch
import React, { useState, useEffect } from 'react';
import {
  Search, Filter, Download, Eye, RefreshCw,
  CheckCircle, XCircle, Clock, ArrowUpDown, X
} from 'lucide-react';
import {
  getTransactions, getTransactionById, updateTransactionStatus,
  formatCurrency, PAYMENT_METHODS, TRANSACTION_STATUS
} from '../../services/financeManagement';

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, search, statusFilter, methodFilter, dateFrom, dateTo]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(t =>
        t.user?.full_name?.toLowerCase().includes(searchLower) ||
        t.user?.email?.toLowerCase().includes(searchLower) ||
        t.transaction_code?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Method filter
    if (methodFilter) {
      filtered = filtered.filter(t => t.payment_method === methodFilter);
    }

    // Date filters
    if (dateFrom) {
      filtered = filtered.filter(t => new Date(t.created_at) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(t => new Date(t.created_at) <= new Date(dateTo + 'T23:59:59'));
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === 'amount') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    setFilteredTransactions(filtered);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const viewTransaction = async (id) => {
    try {
      const data = await getTransactionById(id);
      setSelectedTransaction(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error loading transaction:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTransactionStatus(id, newStatus);
      loadTransactions();
      if (selectedTransaction?.id === id) {
        setSelectedTransaction({ ...selectedTransaction, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const exportToExcel = () => {
    // Simple CSV export
    const headers = ['Mã GD', 'Người dùng', 'Email', 'Gói cước', 'Số tiền', 'Phương thức', 'Trạng thái', 'Ngày tạo'];
    const rows = filteredTransactions.map(t => [
      t.transaction_code || t.id.slice(0, 8),
      t.user?.full_name || '',
      t.user?.email || '',
      t.plan?.name || '',
      t.amount,
      PAYMENT_METHODS.find(m => m.id === t.payment_method)?.name || t.payment_method,
      TRANSACTION_STATUS.find(s => s.id === t.status)?.name || t.status,
      new Date(t.created_at).toLocaleString('vi-VN')
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `giao-dich-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      failed: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
      refunded: { bg: 'bg-purple-100', text: 'text-purple-700', icon: null },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-700', icon: null },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const statusName = TRANSACTION_STATUS.find(s => s.id === status)?.name || status;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {Icon && <Icon className="w-3 h-3" />}
        {statusName}
      </span>
    );
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setMethodFilter('');
    setDateFrom('');
    setDateTo('');
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
          <h1 className="text-2xl font-bold text-gray-800">Lịch sử Giao dịch</h1>
          <p className="text-gray-600">Quản lý và theo dõi các giao dịch thanh toán</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadTransactions}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, email, mã GD..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            {TRANSACTION_STATUS.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả phương thức</option>
            {PAYMENT_METHODS.map(m => (
              <option key={m.id} value={m.id}>{m.icon} {m.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Từ ngày"
          />

          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Đến ngày"
          />
        </div>

        {(search || statusFilter || methodFilter || dateFrom || dateTo) && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {filteredTransactions.length} kết quả
            </span>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Mã GD
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Người dùng
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Gói cước
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-1">
                    Số tiền
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Phương thức
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Trạng thái
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center gap-1">
                    Ngày tạo
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-gray-600">
                      {transaction.transaction_code || transaction.id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        {transaction.user?.avatar_url ? (
                          <img
                            src={transaction.user.avatar_url}
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <span className="text-sm">
                            {transaction.user?.full_name?.charAt(0) || '?'}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {transaction.user?.full_name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transaction.user?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">
                      {transaction.plan?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {formatCurrency(transaction.amount)}
                      </p>
                      {transaction.discount_amount > 0 && (
                        <p className="text-xs text-green-600">
                          -{formatCurrency(transaction.discount_amount)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">
                      {PAYMENT_METHODS.find(m => m.id === transaction.payment_method)?.icon}{' '}
                      {PAYMENT_METHODS.find(m => m.id === transaction.payment_method)?.name || transaction.payment_method}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">
                      {new Date(transaction.created_at).toLocaleString('vi-VN')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => viewTransaction(transaction.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Không có giao dịch nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Chi tiết Giao dịch</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {selectedTransaction.user?.avatar_url ? (
                    <img
                      src={selectedTransaction.user.avatar_url}
                      alt=""
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <span className="text-xl">
                      {selectedTransaction.user?.full_name?.charAt(0) || '?'}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{selectedTransaction.user?.full_name}</p>
                  <p className="text-sm text-gray-500">{selectedTransaction.user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Mã giao dịch</label>
                  <p className="font-mono">{selectedTransaction.transaction_code || selectedTransaction.id.slice(0, 8)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Trạng thái</label>
                  <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Gói cước</label>
                  <p className="font-medium">{selectedTransaction.plan?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Phương thức</label>
                  <p>{PAYMENT_METHODS.find(m => m.id === selectedTransaction.payment_method)?.name}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Số tiền gốc</label>
                  <p className="font-semibold">{formatCurrency(selectedTransaction.original_amount || selectedTransaction.amount)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Giảm giá</label>
                  <p className="text-green-600">-{formatCurrency(selectedTransaction.discount_amount || 0)}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">Tổng thanh toán</label>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedTransaction.amount)}</p>
                </div>
                {selectedTransaction.promotion && (
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500">Mã khuyến mãi</label>
                    <p className="font-medium">{selectedTransaction.promotion.code} - {selectedTransaction.promotion.name}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">Ngày tạo</label>
                  <p>{new Date(selectedTransaction.created_at).toLocaleString('vi-VN')}</p>
                </div>
              </div>

              {/* Status Actions */}
              {selectedTransaction.status === 'pending' && (
                <div className="pt-4 border-t">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Cập nhật trạng thái
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(selectedTransaction.id, 'completed')}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Xác nhận thành công
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedTransaction.id, 'failed')}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Đánh dấu thất bại
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
