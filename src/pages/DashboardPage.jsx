// src/pages/DashboardPage.jsx
// DASHBOARD PHỤ HUYNH - Tích hợp Supabase
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useMember } from '../contexts/MemberContext';

// Icons
const Icons = {
  back: '←',
  book: '📚',
  game: '🎮',
  trophy: '🏆',
  users: '👥',
  fire: '🔥',
  star: '⭐',
  send: '💌',
  settings: '⚙️',
  logout: '🚪',
  link: '🔗',
  bell: '🔔',
  chart: '📊',
  target: '🎯',
  clock: '⏱️',
};

// Format time
const formatTime = (mins) => {
  if (!mins) return '0 phút';
  if (mins < 60) return `${mins} phút`;
  return `${Math.floor(mins / 60)}h ${mins % 60}p`;
};

// Dashboard Page
export default function DashboardPage() {
  const navigate = useNavigate();
  const { members, getLevel } = useMember();
  
  // Auth state
  const [user, setUser] = useState(null);
  const [parentProfile, setParentProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  
  // Data state
  const [linkedChildren, setLinkedChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchParentProfile(session.user.id);
      }
    } catch (err) {
      console.log('Auth check error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchParentProfile = async (userId) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'parent')
        .single();
      
      if (data) {
        setParentProfile(data);
        await fetchLinkedChildren(data.id);
      }
    } catch (err) {
      console.log('No parent profile');
    }
  };

  const fetchLinkedChildren = async (parentId) => {
    try {
      const { data: links } = await supabase
        .from('parent_child_links')
        .select('child_id')
        .eq('parent_id', parentId)
        .eq('status', 'active');

      if (links && links.length > 0) {
        const childIds = links.map(l => l.child_id);
        const { data: children } = await supabase
          .from('profiles')
          .select('*')
          .in('id', childIds);
        
        if (children) {
          setLinkedChildren(children);
          if (children.length > 0) setSelectedChild(children[0]);
        }
      }
    } catch (err) {
      console.log('Fetch children error:', err);
    }
  };

  // Load activities khi chọn child
  useEffect(() => {
    if (selectedChild) {
      fetchActivities(selectedChild.id);
    }
  }, [selectedChild]);

  const fetchActivities = async (childId) => {
    try {
      const { data } = await supabase
        .from('learning_logs')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false })
        .limit(50);
      
      setActivities(data || []);
    } catch (err) {
      setActivities([]);
    }
  };

  // Stats từ activities
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayActs = activities.filter(a => a.date === today);
    
    return {
      lessonsToday: todayActs.filter(a => a.type === 'lesson').length,
      gamesPlayed: todayActs.filter(a => a.type === 'game').length,
      xpToday: todayActs.reduce((sum, a) => sum + (a.xp_earned || 0), 0),
      timeToday: todayActs.reduce((sum, a) => sum + (a.duration || 0), 0),
    };
  }, [activities]);

  // Tính tổng từ members local (nếu chưa đăng nhập)
  const localStats = useMemo(() => {
    return {
      totalLessons: members.reduce((sum, m) => sum + (m.stats?.totalLessons || 0), 0),
      totalGames: members.reduce((sum, m) => sum + (m.stats?.totalGamesPlayed || 0), 0),
      totalAchievements: members.reduce((sum, m) => sum + (m.achievements?.length || 0), 0),
      totalMembers: members.length,
    };
  }, [members]);

  // ============================================
  // AUTH FORMS
  // ============================================
  const LoginForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSubmitting(true);

      try {
        if (isLogin) {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) {
            setError(error.message.includes('Invalid') ? 'Email hoặc mật khẩu không đúng' : error.message);
          } else {
            setShowLogin(false);
            checkAuth();
          }
        } else {
          if (!name.trim()) { setError('Vui lòng nhập tên'); setSubmitting(false); return; }
          if (password.length < 6) { setError('Mật khẩu ít nhất 6 ký tự'); setSubmitting(false); return; }
          
          const { data, error } = await supabase.auth.signUp({
            email, password,
            options: { data: { name, role: 'parent' } }
          });
          
          if (error) {
            setError(error.message.includes('already') ? 'Email đã được đăng ký' : error.message);
          } else if (data?.user) {
            // Tạo profile
            await supabase.from('profiles').insert({
              user_id: data.user.id,
              role: 'parent',
              name: name,
              email: email,
              avatar: '👨‍👩‍👧',
              settings: { dailyWords: 10, dailyLessons: 3, dailyMinutes: 30 }
            });
            setShowLogin(false);
            checkAuth();
          }
        }
      } catch (err) {
        setError('Có lỗi xảy ra');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {isLogin ? '🔐 Đăng nhập Phụ huynh' : '📝 Đăng ký tài khoản'}
          </h3>
          
          <div className="flex mb-4 bg-gray-100 rounded-xl p-1">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 rounded-lg font-medium transition ${isLogin ? 'bg-white shadow' : ''}`}>
              Đăng nhập
            </button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 rounded-lg font-medium transition ${!isLogin ? 'bg-white shadow' : ''}`}>
              Đăng ký
            </button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Họ tên" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none" />
            )}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mật khẩu" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none" required />
            
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowLogin(false)} className="flex-1 py-3 border rounded-xl font-medium hover:bg-gray-50">
                Hủy
              </button>
              <button type="submit" disabled={submitting} className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium disabled:opacity-50">
                {submitting ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ============================================
  // LINK CHILD MODAL
  // ============================================
  const LinkChildModal = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [linking, setLinking] = useState(false);

    const handleLink = async () => {
      if (!code.trim()) return;
      setLinking(true);
      setError('');

      try {
        const { data, error } = await supabase.rpc('link_parent_to_child', {
          p_parent_user_id: user.id,
          p_link_code: code.trim().toUpperCase()
        });

        if (error) {
          setError(error.message);
        } else if (data?.success) {
          alert(`✅ Đã liên kết với ${data.child_name}!`);
          setShowLinkModal(false);
          fetchLinkedChildren(parentProfile.id);
        } else {
          setError(data?.error || 'Không thể liên kết');
        }
      } catch (err) {
        setError('Có lỗi xảy ra');
      } finally {
        setLinking(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{Icons.link} Liên kết tài khoản con</h3>
          <p className="text-gray-600 text-sm mb-4">Nhập mã liên kết từ màn hình "Thông tin" của con.</p>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">⚠️ {error}</div>}

          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="VD: CHILD-ABC123"
            className="w-full p-4 border-2 rounded-xl text-center text-xl font-mono tracking-widest mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            maxLength={12}
          />

          <div className="bg-blue-50 rounded-xl p-3 mb-4">
            <p className="text-sm text-blue-700">💡 Mở app của con → Trang cá nhân → Xem mã liên kết</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowLinkModal(false)} className="flex-1 py-3 border rounded-xl font-medium hover:bg-gray-50">Hủy</button>
            <button onClick={handleLink} disabled={!code.trim() || linking} className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium disabled:opacity-50">
              {linking ? 'Đang xử lý...' : 'Liên kết'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // SEND MESSAGE MODAL
  // ============================================
  const SendMessageModal = () => {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const quickMessages = ['Con giỏi lắm! 💪', 'Bố/Mẹ tự hào về con! 🌟', 'Cố gắng lên nhé! 🎯', 'Con làm tốt lắm! ❤️'];

    const handleSend = async () => {
      if (!message.trim() || !selectedChild) return;
      setSending(true);

      try {
        await supabase.from('encouragements').insert({
          parent_id: parentProfile.id,
          child_id: selectedChild.id,
          message: message.trim()
        });
        alert(`✅ Đã gửi lời động viên đến ${selectedChild.name}!`);
        setShowMessageModal(false);
        setMessage('');
      } catch (err) {
        alert('❌ Không thể gửi. Vui lòng thử lại.');
      } finally {
        setSending(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{Icons.send} Gửi động viên cho {selectedChild?.name}</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {quickMessages.map((msg, i) => (
              <button key={i} onClick={() => setMessage(msg)} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200">
                {msg}
              </button>
            ))}
          </div>

          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Hoặc viết lời nhắn của bạn..."
            className="w-full p-3 border rounded-xl h-24 resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />

          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowMessageModal(false)} className="flex-1 py-3 border rounded-xl font-medium hover:bg-gray-50">Hủy</button>
            <button onClick={handleSend} disabled={!message.trim() || sending} className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-medium disabled:opacity-50">
              {sending ? 'Đang gửi...' : 'Gửi 💌'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            {Icons.back}
          </button>
          <h1 className="text-xl font-bold">Dashboard Phụ Huynh</h1>
          <div className="flex gap-2">
            {user ? (
              <button onClick={() => supabase.auth.signOut().then(checkAuth)} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center" title="Đăng xuất">
                {Icons.logout}
              </button>
            ) : (
              <button onClick={() => setShowLogin(true)} className="px-4 py-2 rounded-full bg-white/20 font-medium">
                Đăng nhập
              </button>
            )}
          </div>
        </div>
        
        {user && parentProfile && (
          <p className="text-white/80 text-sm">
            👋 Xin chào, {parentProfile.name}
          </p>
        )}
      </div>

      {/* Stats Cards - Local members */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Icons.book, value: localStats.totalLessons, label: 'Bài học', color: 'text-blue-600' },
            { icon: Icons.game, value: localStats.totalGames, label: 'Lượt chơi', color: 'text-pink-600' },
            { icon: Icons.trophy, value: localStats.totalAchievements, label: 'Huy hiệu', color: 'text-yellow-600' },
            { icon: Icons.users, value: localStats.totalMembers, label: 'Thành viên', color: 'text-green-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className={`text-2xl mb-1 ${stat.color}`}>{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Members List */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800">{Icons.users} Các thành viên</h2>
          {user && parentProfile && (
            <button onClick={() => setShowLinkModal(true)} className="text-sm text-purple-600 font-medium">
              + Liên kết con
            </button>
          )}
        </div>

        {/* Local Members */}
        <div className="space-y-3">
          {members.map(member => {
            const levelInfo = getLevel(member.xp || 0);
            return (
              <div key={member.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.age} tuổi • Level {levelInfo.level}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-orange-500 font-bold">{Icons.fire} {member.stats?.streak || 0}</span>
                  </div>
                </div>
                
                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t">
                  <div className="text-center">
                    <div className="text-blue-600 font-bold">{member.stats?.totalLessons || 0}</div>
                    <div className="text-xs text-gray-500">Bài học</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-600 font-bold">{member.xp || 0}</div>
                    <div className="text-xs text-gray-500">Điểm XP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-pink-600 font-bold">{member.stats?.totalGamesPlayed || 0}</div>
                    <div className="text-xs text-gray-500">Games</div>
                  </div>
                </div>

                {/* Link code */}
                {member.linkCode && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-1">Mã liên kết:</p>
                    <div className="bg-gray-100 rounded-lg px-3 py-2 font-mono text-center text-purple-700 font-bold">
                      {member.linkCode}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {members.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="text-4xl mb-2">👶</div>
              <p className="text-gray-500">Chưa có thành viên nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Linked Children (if logged in) */}
      {user && parentProfile && linkedChildren.length > 0 && (
        <div className="p-4 pt-0">
          <h2 className="font-bold text-gray-800 mb-3">{Icons.link} Con đã liên kết</h2>
          
          {/* Child tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {linkedChildren.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`flex-shrink-0 px-4 py-2 rounded-full flex items-center gap-2 transition ${
                  selectedChild?.id === child.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-gray-700 border'
                }`}
              >
                <span>{child.avatar || '👦'}</span>
                <span className="font-medium">{child.name}</span>
              </button>
            ))}
          </div>

          {/* Selected child stats */}
          {selectedChild && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-3xl">
                    {selectedChild.avatar || '👦'}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-800">{selectedChild.name}</p>
                    <p className="text-sm text-gray-500">Level {selectedChild.level || 1} • {selectedChild.xp || 0} XP</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="px-4 py-2 bg-pink-500 text-white rounded-xl font-medium flex items-center gap-2"
                >
                  {Icons.send} Động viên
                </button>
              </div>

              {/* Today stats */}
              <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{stats.lessonsToday}</div>
                  <div className="text-xs text-gray-500">Bài học</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-pink-600">{stats.gamesPlayed}</div>
                  <div className="text-xs text-gray-500">Games</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{stats.xpToday}</div>
                  <div className="text-xs text-gray-500">XP</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{formatTime(stats.timeToday)}</div>
                  <div className="text-xs text-gray-500">Thời gian</div>
                </div>
              </div>

              {/* Recent activities */}
              {activities.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Hoạt động gần đây:</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {activities.slice(0, 5).map((act, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <span className="text-xl">
                          {act.type === 'lesson' ? Icons.book : act.type === 'game' ? Icons.game : Icons.star}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{act.title}</p>
                          <p className="text-xs text-gray-500">{act.date}</p>
                        </div>
                        <span className="text-sm text-purple-600 font-medium">+{act.xp_earned || 0} XP</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Login prompt if not logged in */}
      {!user && (
        <div className="p-4">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🔐</div>
            <h3 className="font-bold text-gray-800 mb-2">Đăng nhập để có thêm tính năng</h3>
            <p className="text-sm text-gray-600 mb-4">
              Theo dõi con từ xa, gửi lời động viên, đặt mục tiêu học tập...
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium"
            >
              Đăng nhập / Đăng ký
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showLogin && <LoginForm />}
      {showLinkModal && <LinkChildModal />}
      {showMessageModal && <SendMessageModal />}
    </div>
  );
}
