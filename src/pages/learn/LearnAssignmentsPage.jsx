// src/pages/learn/LearnAssignmentsPage.jsx
// Student Assignments Page - Kid-friendly design
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, Clock, CheckCircle, AlertCircle, Play,
  Star, Calendar, Trophy, ChevronRight, X
} from 'lucide-react';

const MOCK_ASSIGNMENTS = [
  {
    id: 1,
    title: 'Học từ vựng về động vật',
    subject: 'Tiếng Anh',
    icon: '🐻',
    teacher: 'Cô Mai',
    deadline: '2025-01-25',
    status: 'pending',
    totalQuestions: 10,
  },
  {
    id: 2,
    title: 'Phép cộng trong phạm vi 20',
    subject: 'Toán',
    icon: '➕',
    teacher: 'Thầy Hùng',
    deadline: '2025-01-24',
    status: 'pending',
    totalQuestions: 15,
  },
  {
    id: 3,
    title: 'Đọc bài "Con mèo nhà tôi"',
    subject: 'Tiếng Việt',
    icon: '📖',
    teacher: 'Cô Lan',
    deadline: '2025-01-26',
    status: 'pending',
    totalQuestions: 8,
  },
  {
    id: 4,
    title: 'Màu sắc cơ bản',
    subject: 'Tiếng Anh',
    icon: '🌈',
    teacher: 'Cô Mai',
    deadline: '2025-01-22',
    status: 'completed',
    score: 90,
    totalQuestions: 10,
    correctAnswers: 9,
  },
  {
    id: 5,
    title: 'Đếm số từ 1-10',
    subject: 'Toán',
    icon: '🔢',
    teacher: 'Thầy Hùng',
    deadline: '2025-01-20',
    status: 'completed',
    score: 100,
    totalQuestions: 10,
    correctAnswers: 10,
  },
];

export default function LearnAssignmentsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const pendingAssignments = MOCK_ASSIGNMENTS.filter(a => a.status === 'pending');
  const completedAssignments = MOCK_ASSIGNMENTS.filter(a => a.status === 'completed');

  const getDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDeadline = (deadline) => {
    const daysLeft = getDaysLeft(deadline);
    if (daysLeft < 0) return { text: 'Quá hạn', color: 'text-red-500', bg: 'bg-red-100' };
    if (daysLeft === 0) return { text: 'Hôm nay', color: 'text-orange-500', bg: 'bg-orange-100' };
    if (daysLeft === 1) return { text: 'Ngày mai', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    return { text: `Còn ${daysLeft} ngày`, color: 'text-green-500', bg: 'bg-green-100' };
  };

  const handleStartAssignment = (assignment) => {
    // Navigate to assignment quiz
    // In real app, this would go to a quiz page
    alert(`Bắt đầu làm bài: ${assignment.title}`);
  };

  const handleViewResult = (assignment) => {
    setSelectedAssignment(assignment);
    setShowResultModal(true);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <ClipboardList className="w-7 h-7 text-orange-500" />
          Bài tập của bạn
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-1">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-white text-orange-600 shadow'
              : 'text-gray-500'
          }`}
        >
          <AlertCircle className="w-5 h-5" />
          Chưa làm ({pendingAssignments.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'completed'
              ? 'bg-white text-green-600 shadow'
              : 'text-gray-500'
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          Đã làm ({completedAssignments.length})
        </button>
      </div>

      {/* Assignments List */}
      {activeTab === 'pending' && (
        <div className="space-y-3">
          {pendingAssignments.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-lg font-bold text-gray-800">Tuyệt vời!</h3>
              <p className="text-gray-500">Bạn đã làm hết bài tập rồi!</p>
            </div>
          ) : (
            pendingAssignments.map((assignment) => {
              const deadline = formatDeadline(assignment.deadline);
              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-2xl p-4 shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                      {assignment.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-800">{assignment.title}</h3>
                          <p className="text-sm text-gray-500">
                            {assignment.subject} • {assignment.teacher}
                          </p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${deadline.bg} ${deadline.color}`}>
                          {deadline.text}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Hạn: {new Date(assignment.deadline).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          📝 {assignment.totalQuestions} câu hỏi
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleStartAssignment(assignment)}
                    className="w-full mt-4 bg-gradient-to-r from-orange-400 to-yellow-400 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow hover:shadow-lg transition-all active:scale-[0.98]"
                  >
                    <Play className="w-5 h-5" />
                    Làm bài ngay!
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="space-y-3">
          {completedAssignments.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-bold text-gray-800">Chưa có bài nào</h3>
              <p className="text-gray-500">Hãy hoàn thành bài tập đầu tiên nhé!</p>
            </div>
          ) : (
            completedAssignments.map((assignment) => (
              <button
                key={assignment.id}
                onClick={() => handleViewResult(assignment)}
                className="w-full bg-white rounded-2xl p-4 shadow-lg text-left hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner relative">
                    {assignment.icon}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{assignment.title}</h3>
                    <p className="text-sm text-gray-500">
                      {assignment.subject} • {assignment.teacher}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(assignment.score / 20)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-green-600">
                        {assignment.score} điểm
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <p className="text-white/80 text-sm">Tổng điểm bài tập</p>
            <p className="text-3xl font-bold">
              {completedAssignments.reduce((sum, a) => sum + a.score, 0)} điểm
            </p>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResultModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-6 text-white text-center relative">
              <button
                onClick={() => setShowResultModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-6xl mb-3">
                {selectedAssignment.score >= 80 ? '🎉' : selectedAssignment.score >= 60 ? '👍' : '💪'}
              </div>
              <h2 className="text-2xl font-bold">
                {selectedAssignment.score >= 80 ? 'Xuất sắc!' : selectedAssignment.score >= 60 ? 'Tốt lắm!' : 'Cố gắng thêm!'}
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-gray-800 text-center">{selectedAssignment.title}</h3>

              {/* Score Circle */}
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-600">{selectedAssignment.score}</p>
                    <p className="text-sm text-green-500">điểm</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedAssignment.correctAnswers}</p>
                  <p className="text-xs text-blue-500">Câu đúng</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-gray-600">{selectedAssignment.totalQuestions}</p>
                  <p className="text-xs text-gray-500">Tổng câu</p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-8 h-8 ${
                      i < Math.floor(selectedAssignment.score / 20)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setShowResultModal(false)}
                className="w-full py-3 bg-gray-100 rounded-xl font-medium text-gray-600 hover:bg-gray-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
