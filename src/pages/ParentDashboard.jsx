// src/pages/ParentDashboard.jsx
// Trang quản lý cho Phụ huynh
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRBAC } from '../contexts/RBACContext';
import {
  Users, Eye, Clock, Target, TrendingUp,
  Plus, X, Mail, Loader2, CheckCircle, AlertCircle,
  BookOpen, Star, Calendar, BarChart3, Settings
} from 'lucide-react';

export default function ParentDashboard() {
  const {
    userProfile, signOut, getMyChildren, linkChild,
    getChildProgress, setTimeLimit
  } = useRBAC();

  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showLinkChild, setShowLinkChild] = useState(false);
  const [showTimeLimit, setShowTimeLimit] = useState(false);
  const [linkEmail, setLinkEmail] = useState('');
  const [linkError, setLinkError] = useState('');
  const [timeLimitData, setTimeLimitData] = useState({
    dailyLimit: 60,
    startHour: 8,
    endHour: 20
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const childrenData = await getMyChildren();
    setChildren(childrenData);
    if (childrenData.length > 0) {
      handleSelectChild(childrenData[0]);
    }
    setLoading(false);
  };

  const handleSelectChild = async (child) => {
    setSelectedChild(child);
    const progressData = await getChildProgress(child.id);
    setProgress(progressData);
  };

  const handleLinkChild = async () => {
    setLinkError('');
    const { error } = await linkChild(linkEmail);
    if (error) {
      setLinkError(error);
    } else {
      setShowLinkChild(false);
      setLinkEmail('');
      loadData();
    }
  };

  const handleSetTimeLimit = async () => {
    if (!selectedChild) return;
    const { error } = await setTimeLimit(
      selectedChild.id,
      timeLimitData.dailyLimit,
      timeLimitData.startHour,
      timeLimitData.endHour
    );
    if (!error) {
      setShowTimeLimit(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Phụ huynh</h1>
                <p className="text-white/80 text-sm">{userProfile?.name}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-white/20 rounded-xl text-sm hover:bg-white/30"
            >
              Đăng xuất
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{children.length}</p>
              <p className="text-sm opacity-80">Con em</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{progress?.total_lessons || 0}</p>
              <p className="text-sm opacity-80">Bài đã học</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{progress?.avg_score || 0}</p>
              <p className="text-sm opacity-80">Điểm TB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {children.length === 0 ? (
          /* No children */
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Chưa liên kết con em
            </h3>
            <p className="text-gray-500 mb-6">
              Liên kết tài khoản con em để theo dõi tiến độ học tập
            </p>
            <button
              onClick={() => setShowLinkChild(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Liên kết con em
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Children list */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800">Con em của tôi</h2>
                  <button
                    onClick={() => setShowLinkChild(true)}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => handleSelectChild(child)}
                      className={`w-full p-4 text-left hover:bg-gray-50 flex items-center gap-3 ${
                        selectedChild?.id === child.id ? 'bg-green-50' : ''
                      }`}
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                        {child.avatar || '👦'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{child.name}</p>
                        <p className="text-sm text-gray-500">{child.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Child details */}
            <div className="lg:w-2/3">
              {selectedChild && (
                <div className="space-y-6">
                  {/* Child header */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">
                        {selectedChild.avatar || '👦'}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800">{selectedChild.name}</h2>
                        <p className="text-gray-500">{selectedChild.email}</p>
                      </div>
                      <button
                        onClick={() => setShowTimeLimit(true)}
                        className="px-4 py-2 bg-gray-100 rounded-xl text-sm hover:bg-gray-200 flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        Giới hạn thời gian
                      </button>
                    </div>

                    {/* Progress overview */}
                    {progress && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                          <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                          <p className="text-2xl font-bold text-blue-600">{progress.total_lessons}</p>
                          <p className="text-xs text-gray-600">Bài đã học</p>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-4 text-center">
                          <Star className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                          <p className="text-2xl font-bold text-amber-600">{progress.avg_score}</p>
                          <p className="text-xs text-gray-600">Điểm trung bình</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                          <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
                          <p className="text-2xl font-bold text-green-600">{progress.total_score}</p>
                          <p className="text-xs text-gray-600">Tổng điểm</p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4 text-center">
                          <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                          <p className="text-2xl font-bold text-purple-600">{progress.total_time_minutes}</p>
                          <p className="text-xs text-gray-600">Phút học</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress by subject */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Tiến độ theo môn học</h3>

                    {progress?.by_subject?.length > 0 ? (
                      <div className="space-y-4">
                        {progress.by_subject.map((subject, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              subject.subject === 'math' ? 'bg-blue-100' :
                              subject.subject === 'vietnamese' ? 'bg-red-100' :
                              subject.subject === 'english' ? 'bg-green-100' :
                              subject.subject === 'science' ? 'bg-purple-100' :
                              'bg-gray-100'
                            }`}>
                              <span className="text-xl">
                                {subject.subject === 'math' ? '🔢' :
                                 subject.subject === 'vietnamese' ? '📖' :
                                 subject.subject === 'english' ? '🇬🇧' :
                                 subject.subject === 'science' ? '🔬' :
                                 '📚'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-800">
                                  {subject.subject === 'math' ? 'Toán' :
                                   subject.subject === 'vietnamese' ? 'Tiếng Việt' :
                                   subject.subject === 'english' ? 'Tiếng Anh' :
                                   subject.subject === 'science' ? 'Khoa học' :
                                   subject.subject}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {subject.completed} bài · {subject.avg_score} điểm
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    subject.avg_score >= 80 ? 'bg-green-500' :
                                    subject.avg_score >= 60 ? 'bg-amber-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${subject.avg_score}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Chưa có dữ liệu học tập</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Link Child Modal */}
      <AnimatePresence>
        {showLinkChild && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowLinkChild(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Liên kết con em</h3>
                <button
                  onClick={() => setShowLinkChild(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-4">
                Nhập email tài khoản học sinh của con em để liên kết
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email học sinh
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={linkEmail}
                      onChange={e => setLinkEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>

                {linkError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{linkError}</span>
                  </div>
                )}

                <button
                  onClick={handleLinkChild}
                  disabled={!linkEmail}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-medium disabled:opacity-50"
                >
                  Liên kết
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Limit Modal */}
      <AnimatePresence>
        {showTimeLimit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTimeLimit(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Giới hạn thời gian</h3>
                <button
                  onClick={() => setShowTimeLimit(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian học mỗi ngày: {timeLimitData.dailyLimit} phút
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="180"
                    step="15"
                    value={timeLimitData.dailyLimit}
                    onChange={e => setTimeLimitData({ ...timeLimitData, dailyLimit: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>15 phút</span>
                    <span>3 giờ</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giờ bắt đầu
                    </label>
                    <select
                      value={timeLimitData.startHour}
                      onChange={e => setTimeLimitData({ ...timeLimitData, startHour: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>{i}:00</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giờ kết thúc
                    </label>
                    <select
                      value={timeLimitData.endHour}
                      onChange={e => setTimeLimitData({ ...timeLimitData, endHour: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>{i}:00</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSetTimeLimit}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-medium"
                >
                  Lưu cài đặt
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
