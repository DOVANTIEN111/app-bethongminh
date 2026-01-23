// src/pages/ParentPage.jsx
// KHU VỰC PHỤ HUYNH - Xem tiến độ, quản lý thiết bị, subscription
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Icons
const Icons = {
  back: '←', child: '👦', chart: '📊', device: '📱', crown: '👑',
  settings: '⚙️', bell: '🔔', fire: '🔥', star: '⭐', book: '📚',
  game: '🎮', time: '⏱️', send: '💌', trash: '🗑️', edit: '✏️',
  lock: '🔒', phone: '📱', tablet: '📟', desktop: '💻', report: '📋',
  math: '🔢', vietnamese: '📖', english: '🌍', science: '🔬', lifeskills: '🌱',
  up: '📈', down: '📉', medal: '🏅', trophy: '🏆', target: '🎯',
};

const formatTime = (mins) => {
  if (!mins) return '0 phút';
  if (mins < 60) return `${mins} phút`;
  return `${Math.floor(mins / 60)}h ${mins % 60}p`;
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN');
};

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

export default function ParentPage() {
  const navigate = useNavigate();
  const {
    account, children, subscription, devices, planInfo,
    updateAccount, upgradePlan, removeDevice, renameDevice,
    changeParentPin, signOut,
  } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChild, setSelectedChild] = useState(null);
  const [childStats, setChildStats] = useState(null);
  const [childActivities, setChildActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showMessage, setShowMessage] = useState(false);
  const [showPinChange, setShowPinChange] = useState(false);
  const [showRenameDevice, setShowRenameDevice] = useState(null);
  const [showDeleteDevice, setShowDeleteDevice] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0]);
    }
  }, [children]);

  useEffect(() => {
    if (selectedChild) loadChildData(selectedChild.id);
  }, [selectedChild]);

  const loadChildData = async (childId) => {
    setLoading(true);
    try {
      const { data: stats } = await supabase.rpc('get_child_stats', { p_child_id: childId, p_days: 7 });
      setChildStats(stats);

      const { data: activities } = await supabase
        .from('learning_logs')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false })
        .limit(20);
      setChildActivities(activities || []);
    } catch (err) {
      console.error('Load error:', err);
    }
    setLoading(false);
  };

  // =====================================================
  // TAB: OVERVIEW
  // =====================================================
  const renderOverview = () => (
    <div className="space-y-4">
      {children.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child)}
              className={`flex-shrink-0 px-4 py-2 rounded-full flex items-center gap-2 transition ${
                selectedChild?.id === child.id ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700 border'
              }`}
            >
              <span>{child.avatar}</span>
              <span className="font-medium">{child.name}</span>
            </button>
          ))}
        </div>
      )}

      {selectedChild && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-3xl">
              {selectedChild.avatar}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{selectedChild.name}</h3>
              <p className="text-gray-500">{selectedChild.age ? `${selectedChild.age} tuổi • ` : ''}Level {selectedChild.level || 1}</p>
            </div>
            <button onClick={() => setShowMessage(true)} className="px-4 py-2 bg-pink-500 text-white rounded-xl font-medium">
              {Icons.send} Động viên
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Icons.star, value: selectedChild.xp || 0, label: 'XP', color: 'text-yellow-500' },
              { icon: Icons.fire, value: selectedChild.streak || 0, label: 'Streak', color: 'text-orange-500' },
              { icon: Icons.book, value: selectedChild.total_lessons || 0, label: 'Bài học', color: 'text-blue-500' },
              { icon: Icons.game, value: selectedChild.total_games || 0, label: 'Games', color: 'text-pink-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className={`text-xl ${stat.color}`}>{stat.icon}</div>
                <div className="text-lg font-bold text-gray-800">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {childStats && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 mb-3">{Icons.chart} Thống kê 7 ngày</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-blue-600">{childStats.total_lessons || 0}</div>
              <div className="text-sm text-blue-600/70">Bài học</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-green-600">{formatTime(childStats.total_time || 0)}</div>
              <div className="text-sm text-green-600/70">Thời gian</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-purple-600">{childStats.total_xp || 0}</div>
              <div className="text-sm text-purple-600/70">XP kiếm được</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-orange-600">{childStats.days_active || 0}</div>
              <div className="text-sm text-orange-600/70">Ngày học</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h4 className="font-semibold text-gray-700 mb-3">{Icons.time} Hoạt động gần đây</h4>
        {childActivities.length === 0 ? (
          <p className="text-center text-gray-400 py-4">Chưa có hoạt động</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {childActivities.map((act) => (
              <div key={act.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  act.type === 'lesson' ? 'bg-blue-100 text-blue-600' :
                  act.type === 'game' ? 'bg-pink-100 text-pink-600' : 'bg-green-100 text-green-600'
                }`}>
                  {act.type === 'lesson' ? Icons.book : act.type === 'game' ? Icons.game : Icons.star}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{act.title}</p>
                  <p className="text-xs text-gray-500">{formatDate(act.created_at)}</p>
                </div>
                <span className="text-sm text-indigo-600 font-medium">+{act.xp_earned || 0} XP</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // =====================================================
  // TAB: REPORT - Báo cáo chi tiết
  // =====================================================
  const renderReport = () => {
    // Lấy progress của bé từ selectedChild
    const progress = selectedChild?.progress || {};

    // Định nghĩa các môn học
    const subjects = [
      { id: 'math', name: 'Toán học', icon: Icons.math, color: 'bg-blue-500', total: 50 },
      { id: 'vietnamese', name: 'Tiếng Việt', icon: Icons.vietnamese, color: 'bg-green-500', total: 50 },
      { id: 'english', name: 'Tiếng Anh', icon: Icons.english, color: 'bg-red-500', total: 20 },
      { id: 'science', name: 'Khoa học', icon: Icons.science, color: 'bg-purple-500', total: 28 },
      { id: 'lifeskills', name: 'Kỹ năng sống', icon: Icons.lifeskills, color: 'bg-teal-500', total: 24 },
    ];

    // Tính toán thống kê cho từng môn
    const subjectStats = subjects.map(subject => {
      const subjectProgress = progress[subject.id] || { completed: [], scores: {} };
      const completedCount = subjectProgress.completed?.length || 0;
      const scores = Object.values(subjectProgress.scores || {});
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const percentComplete = Math.round((completedCount / subject.total) * 100);

      return {
        ...subject,
        completed: completedCount,
        avgScore,
        percentComplete,
      };
    });

    // Tính điểm tổng hợp
    const totalCompleted = subjectStats.reduce((a, b) => a + b.completed, 0);
    const totalLessons = subjectStats.reduce((a, b) => a + b.total, 0);
    const overallPercent = Math.round((totalCompleted / totalLessons) * 100);
    const avgAllScores = subjectStats.filter(s => s.avgScore > 0).length > 0
      ? Math.round(subjectStats.filter(s => s.avgScore > 0).reduce((a, b) => a + b.avgScore, 0) / subjectStats.filter(s => s.avgScore > 0).length)
      : 0;

    // Nhận xét tự động
    const getRecommendation = () => {
      if (overallPercent < 20) return { text: 'Con đang bắt đầu hành trình học tập. Hãy khuyến khích con học đều đặn mỗi ngày nhé!', emoji: '🌱', color: 'bg-blue-50 text-blue-700' };
      if (overallPercent < 50) return { text: 'Con đang tiến bộ tốt! Tiếp tục duy trì thói quen học tập đều đặn nhé!', emoji: '📈', color: 'bg-green-50 text-green-700' };
      if (overallPercent < 80) return { text: 'Xuất sắc! Con đang học rất tốt. Hãy thử thách với các bài học khó hơn!', emoji: '🌟', color: 'bg-yellow-50 text-yellow-700' };
      return { text: 'Tuyệt vời! Con đã hoàn thành gần hết chương trình. Hãy tiếp tục ôn tập để ghi nhớ!', emoji: '🏆', color: 'bg-purple-50 text-purple-700' };
    };

    // Xác định môn cần cải thiện
    const getWeakSubjects = () => {
      return subjectStats
        .filter(s => s.completed > 0 && s.avgScore < 70)
        .sort((a, b) => a.avgScore - b.avgScore)
        .slice(0, 2);
    };

    // Xác định môn học giỏi
    const getStrongSubjects = () => {
      return subjectStats
        .filter(s => s.avgScore >= 80)
        .sort((a, b) => b.avgScore - a.avgScore)
        .slice(0, 2);
    };

    const recommendation = getRecommendation();
    const weakSubjects = getWeakSubjects();
    const strongSubjects = getStrongSubjects();

    return (
      <div className="space-y-4">
        {/* Chọn bé */}
        {children.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`flex-shrink-0 px-4 py-2 rounded-full flex items-center gap-2 transition ${
                  selectedChild?.id === child.id ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700 border'
                }`}
              >
                <span>{child.avatar}</span>
                <span className="font-medium">{child.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tổng quan */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
              {selectedChild?.avatar || '👦'}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{selectedChild?.name || 'Bé'}</h3>
              <p className="text-white/80">Báo cáo học tập</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{totalCompleted}</div>
              <div className="text-xs text-white/70">Bài hoàn thành</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{overallPercent}%</div>
              <div className="text-xs text-white/70">Tiến độ</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{avgAllScores || '-'}</div>
              <div className="text-xs text-white/70">Điểm TB</div>
            </div>
          </div>
        </div>

        {/* Nhận xét */}
        <div className={`${recommendation.color} rounded-2xl p-4`}>
          <div className="flex items-start gap-3">
            <span className="text-3xl">{recommendation.emoji}</span>
            <div>
              <h4 className="font-semibold mb-1">Nhận xét</h4>
              <p className="text-sm">{recommendation.text}</p>
            </div>
          </div>
        </div>

        {/* Chi tiết từng môn */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h4 className="font-semibold text-gray-700 mb-4">{Icons.chart} Chi tiết theo môn học</h4>
          <div className="space-y-4">
            {subjectStats.map((subject) => (
              <div key={subject.id} className="border rounded-xl p-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-full ${subject.color} flex items-center justify-center text-xl`}>
                    {subject.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{subject.name}</span>
                      <span className="text-sm text-gray-500">{subject.completed}/{subject.total} bài</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`${subject.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${subject.percentComplete}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm pl-13">
                  <span className="text-gray-500">Tiến độ: {subject.percentComplete}%</span>
                  <span className={`font-medium ${
                    subject.avgScore >= 80 ? 'text-green-600' :
                    subject.avgScore >= 60 ? 'text-yellow-600' :
                    subject.avgScore > 0 ? 'text-red-600' : 'text-gray-400'
                  }`}>
                    Điểm TB: {subject.avgScore > 0 ? subject.avgScore : '-'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Điểm mạnh */}
        {strongSubjects.length > 0 && (
          <div className="bg-green-50 rounded-2xl p-4">
            <h4 className="font-semibold text-green-700 mb-3">{Icons.trophy} Môn học giỏi</h4>
            <div className="space-y-2">
              {strongSubjects.map((subject) => (
                <div key={subject.id} className="flex items-center gap-3 bg-white rounded-xl p-3">
                  <span className="text-2xl">{subject.icon}</span>
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">{subject.name}</span>
                    <p className="text-sm text-gray-500">Điểm trung bình: {subject.avgScore}</p>
                  </div>
                  <span className="text-green-500 text-xl">{Icons.medal}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cần cải thiện */}
        {weakSubjects.length > 0 && (
          <div className="bg-orange-50 rounded-2xl p-4">
            <h4 className="font-semibold text-orange-700 mb-3">{Icons.target} Cần luyện tập thêm</h4>
            <div className="space-y-2">
              {weakSubjects.map((subject) => (
                <div key={subject.id} className="flex items-center gap-3 bg-white rounded-xl p-3">
                  <span className="text-2xl">{subject.icon}</span>
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">{subject.name}</span>
                    <p className="text-sm text-gray-500">Điểm TB: {subject.avgScore} - Cần ôn tập</p>
                  </div>
                  <span className="text-orange-500">{Icons.up}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-orange-600 mt-3">
              💡 Gợi ý: Hãy khuyến khích con học lại các bài có điểm thấp để củng cố kiến thức.
            </p>
          </div>
        )}

        {/* Thời gian học tuần này */}
        {childStats && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-3">{Icons.time} Hoạt động 7 ngày qua</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-indigo-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-indigo-600">{childStats.days_active || 0}/7</div>
                <div className="text-sm text-indigo-600/70">Ngày học</div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-green-600">{formatTime(childStats.total_time || 0)}</div>
                <div className="text-sm text-green-600/70">Tổng thời gian</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">{childStats.total_lessons || 0}</div>
                <div className="text-sm text-purple-600/70">Bài học</div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-yellow-600">+{childStats.total_xp || 0}</div>
                <div className="text-sm text-yellow-600/70">XP kiếm được</div>
              </div>
            </div>
          </div>
        )}

        {/* Gợi ý hành động */}
        <div className="bg-blue-50 rounded-2xl p-4">
          <h4 className="font-semibold text-blue-700 mb-2">{Icons.bell} Gợi ý cho phụ huynh</h4>
          <ul className="text-sm text-blue-600 space-y-2">
            <li>• Đặt mục tiêu học 15-30 phút mỗi ngày</li>
            <li>• Khen ngợi khi con hoàn thành bài học</li>
            <li>• Cùng con ôn lại các bài có điểm thấp</li>
            <li>• Tạo thói quen học tập đều đặn</li>
          </ul>
        </div>
      </div>
    );
  };

  // =====================================================
  // TAB: DEVICES
  // =====================================================
  const renderDevices = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-700">{Icons.device} Thiết bị đang dùng</h4>
          <span className="text-sm text-gray-500">{devices.length}/{subscription?.max_devices || 1}</span>
        </div>

        <div className="space-y-3">
          {devices.map((device) => (
            <div key={device.id} className={`flex items-center gap-3 p-3 rounded-xl ${device.is_current ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${device.is_current ? 'bg-green-100' : 'bg-indigo-100'}`}>
                {device.device_type === 'phone' ? Icons.phone : device.device_type === 'tablet' ? Icons.tablet : Icons.desktop}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800">{device.device_name || 'Thiết bị'}</p>
                  {device.is_current && <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">Đang dùng</span>}
                </div>
                <p className="text-xs text-gray-500">{device.os} • {device.browser}</p>
              </div>
              <button onClick={() => setShowRenameDevice(device)} className="p-2 text-gray-400 hover:text-gray-600">{Icons.edit}</button>
              {!device.is_current && (
                <button onClick={() => setShowDeleteDevice(device)} className="p-2 text-red-400 hover:text-red-600">{Icons.trash}</button>
              )}
            </div>
          ))}
          {devices.length === 0 && <p className="text-center text-gray-400 py-4">Chưa có thiết bị nào</p>}
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-4">
        <p className="text-sm text-blue-700"><strong>💡 Mẹo:</strong> Xóa thiết bị cũ để thêm thiết bị mới. Gói {planInfo?.name} cho phép {planInfo?.maxDevices} thiết bị.</p>
      </div>
    </div>
  );

  // =====================================================
  // TAB: SUBSCRIPTION
  // =====================================================
  const renderSubscription = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">{Icons.crown}</div>
          <div>
            <p className="text-white/70 text-sm">Gói hiện tại</p>
            <p className="text-xl font-bold">{planInfo?.name}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <div className="text-lg font-bold">{subscription?.max_devices || 1}</div>
            <div className="text-xs text-white/70">Thiết bị</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <div className="text-lg font-bold">{subscription?.max_children || 1}</div>
            <div className="text-xs text-white/70">Bé</div>
          </div>
        </div>
      </div>

      <h4 className="font-semibold text-gray-700">Nâng cấp gói</h4>
      
      {[
        { plan: 'plus', name: 'Plus', price: 49000, devices: 3, children: 3, popular: true },
        { plan: 'family', name: 'Gia đình', price: 79000, devices: 5, children: 5, popular: false },
      ].map((p) => (
        <div key={p.plan} className={`bg-white rounded-2xl p-4 shadow-sm border-2 ${p.popular ? 'border-indigo-500' : 'border-transparent'}`}>
          {p.popular && <span className="inline-block px-2 py-1 bg-indigo-500 text-white text-xs font-medium rounded-full mb-2">Phổ biến</span>}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h5 className="text-lg font-bold text-gray-800">{p.name}</h5>
              <p className="text-2xl font-bold text-indigo-600">{formatPrice(p.price)}<span className="text-sm text-gray-500">/tháng</span></p>
            </div>
            <button
              onClick={() => upgradePlan(p.plan)}
              disabled={subscription?.plan === p.plan}
              className={`px-4 py-2 rounded-xl font-medium ${subscription?.plan === p.plan ? 'bg-gray-100 text-gray-400' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
            >
              {subscription?.plan === p.plan ? 'Đang dùng' : 'Nâng cấp'}
            </button>
          </div>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>{Icons.device} {p.devices} thiết bị</span>
            <span>{Icons.child} {p.children} bé</span>
          </div>
        </div>
      ))}
    </div>
  );

  // =====================================================
  // TAB: SETTINGS
  // =====================================================
  const renderSettings = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h4 className="font-semibold text-gray-700 mb-3">Thông tin tài khoản</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-600">Email</span>
            <span className="font-medium text-gray-800">{account?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-600">Tên</span>
            <span className="font-medium text-gray-800">{account?.parent_name}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">Ngày tạo</span>
            <span className="font-medium text-gray-800">{formatDate(account?.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h4 className="font-semibold text-gray-700 mb-3">{Icons.lock} Bảo mật</h4>
        <button onClick={() => setShowPinChange(true)} className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
          <div className="flex items-center gap-3">
            <span className="text-xl">{Icons.lock}</span>
            <span className="font-medium text-gray-700">Đổi mã PIN</span>
          </div>
          <span className="text-gray-400">›</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h4 className="font-semibold text-red-500 mb-3">⚠️ Vùng nguy hiểm</h4>
        <button onClick={() => { if (confirm('Bạn có chắc muốn đăng xuất?')) { signOut(); navigate('/auth'); } }} className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100">
          🚪 Đăng xuất
        </button>
      </div>
    </div>
  );

  // =====================================================
  // MODALS
  // =====================================================
  const MessageModal = () => {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const quickMsgs = ['Con giỏi lắm! 💪', 'Bố/Mẹ tự hào về con! 🌟', 'Cố lên nhé! 🎯', 'Yêu con! ❤️'];

    const handleSend = async () => {
      if (!message.trim() || !selectedChild) return;
      setSending(true);
      try {
        await supabase.from('encouragements').insert({ account_id: account.id, child_id: selectedChild.id, message: message.trim() });
        alert(`✅ Đã gửi đến ${selectedChild.name}!`);
        setShowMessage(false);
        setMessage('');
      } catch (err) { alert('❌ Không thể gửi'); }
      setSending(false);
    };

    if (!showMessage) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{Icons.send} Gửi động viên cho {selectedChild?.name}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {quickMsgs.map((msg, i) => (<button key={i} onClick={() => setMessage(msg)} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm hover:bg-pink-200">{msg}</button>))}
          </div>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Viết lời nhắn..." className="w-full p-3 border rounded-xl h-24 resize-none focus:ring-2 focus:ring-pink-500 focus:outline-none" />
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowMessage(false)} className="flex-1 py-3 border rounded-xl font-medium text-gray-600 hover:bg-gray-50">Hủy</button>
            <button onClick={handleSend} disabled={!message.trim() || sending} className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-medium disabled:opacity-50">{sending ? 'Đang gửi...' : 'Gửi 💌'}</button>
          </div>
        </div>
      </div>
    );
  };

  const PinChangeModal = () => {
    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const handleChange = async () => {
      setError('');
      if (currentPin !== account?.parent_pin) { setError('Mã PIN hiện tại không đúng'); return; }
      if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) { setError('Mã PIN mới phải là 4 chữ số'); return; }
      if (newPin !== confirmPin) { setError('Mã PIN xác nhận không khớp'); return; }
      setSaving(true);
      const result = await changeParentPin(newPin);
      if (result.error) setError(result.error);
      else { alert('✅ Đã đổi mã PIN!'); setShowPinChange(false); }
      setSaving(false);
    };

    if (!showPinChange) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{Icons.lock} Đổi mã PIN</h3>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">⚠️ {error}</div>}
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">PIN hiện tại</label><input type="password" value={currentPin} onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="••••" maxLength={4} className="w-full px-4 py-3 border rounded-xl text-center text-xl tracking-widest" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">PIN mới</label><input type="password" value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="••••" maxLength={4} className="w-full px-4 py-3 border rounded-xl text-center text-xl tracking-widest" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận PIN mới</label><input type="password" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="••••" maxLength={4} className="w-full px-4 py-3 border rounded-xl text-center text-xl tracking-widest" /></div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setShowPinChange(false)} className="flex-1 py-3 border rounded-xl font-medium text-gray-600 hover:bg-gray-50">Hủy</button>
            <button onClick={handleChange} disabled={saving} className="flex-1 py-3 bg-indigo-500 text-white rounded-xl font-medium disabled:opacity-50">{saving ? 'Đang lưu...' : 'Đổi PIN'}</button>
          </div>
        </div>
      </div>
    );
  };

  const RenameDeviceModal = () => {
    const [name, setName] = useState(showRenameDevice?.device_name || '');
    const [saving, setSaving] = useState(false);
    const handleRename = async () => { if (!name.trim()) return; setSaving(true); await renameDevice(showRenameDevice.id, name.trim()); setShowRenameDevice(null); setSaving(false); };
    if (!showRenameDevice) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{Icons.edit} Đổi tên thiết bị</h3>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: iPhone của Mẹ" className="w-full px-4 py-3 border rounded-xl" />
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowRenameDevice(null)} className="flex-1 py-3 border rounded-xl font-medium text-gray-600 hover:bg-gray-50">Hủy</button>
            <button onClick={handleRename} disabled={!name.trim() || saving} className="flex-1 py-3 bg-indigo-500 text-white rounded-xl font-medium disabled:opacity-50">{saving ? 'Đang lưu...' : 'Lưu'}</button>
          </div>
        </div>
      </div>
    );
  };

  const DeleteDeviceModal = () => {
    const [error, setError] = useState('');

    const handleDelete = async () => {
      if (!showDeleteDevice) return;
      setDeleteLoading(true);
      setError('');

      try {
        const result = await removeDevice(showDeleteDevice.id);
        if (result?.error) {
          setError(result.error);
        } else {
          setShowDeleteDevice(null);
        }
      } catch (err) {
        setError('Không thể xóa thiết bị. Vui lòng thử lại.');
      }
      setDeleteLoading(false);
    };

    if (!showDeleteDevice) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center text-3xl mb-3">
              {showDeleteDevice.device_type === 'phone' ? Icons.phone : showDeleteDevice.device_type === 'tablet' ? Icons.tablet : Icons.desktop}
            </div>
            <h3 className="text-xl font-bold text-gray-800">Xóa thiết bị?</h3>
            <p className="text-gray-500 mt-2">
              Bạn có chắc muốn xóa <strong>{showDeleteDevice.device_name || 'thiết bị này'}</strong>?
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {showDeleteDevice.os} • {showDeleteDevice.browser}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
              ⚠️ {error}
            </div>
          )}

          <div className="bg-amber-50 rounded-xl p-3 mb-4">
            <p className="text-sm text-amber-700">
              <strong>⚠️ Lưu ý:</strong> Thiết bị này sẽ bị đăng xuất và cần đăng nhập lại nếu muốn sử dụng tiếp.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setShowDeleteDevice(null); setError(''); }}
              className="flex-1 py-3 border rounded-xl font-medium text-gray-600 hover:bg-gray-50"
              disabled={deleteLoading}
            >
              Hủy
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-red-600"
            >
              {deleteLoading ? 'Đang xóa...' : '🗑️ Xóa thiết bị'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // =====================================================
  // MAIN RENDER
  // =====================================================
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 pb-20">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/select-role')} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">{Icons.back}</button>
          <h1 className="text-xl font-bold">Khu vực Phụ huynh</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-4 -mt-14">
        <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-1 overflow-x-auto">
          {[
            { id: 'overview', icon: Icons.chart, label: 'Tổng quan' },
            { id: 'report', icon: Icons.report, label: 'Báo cáo' },
            { id: 'devices', icon: Icons.device, label: 'Thiết bị' },
            { id: 'subscription', icon: Icons.crown, label: 'Gói' },
            { id: 'settings', icon: Icons.settings, label: 'Cài đặt' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl font-medium text-sm transition flex flex-col items-center gap-1 ${activeTab === tab.id ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <span>{tab.icon}</span><span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 pt-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'report' && renderReport()}
        {activeTab === 'devices' && renderDevices()}
        {activeTab === 'subscription' && renderSubscription()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      <MessageModal />
      <PinChangeModal />
      <RenameDeviceModal />
      <DeleteDeviceModal />
    </div>
  );
}
