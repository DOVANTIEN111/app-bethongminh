// src/pages/SelectRolePage.jsx
// TRANG CHỌN VAI TRÒ: BÉ HỌC / PHỤ HUYNH
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SelectRolePage() {
  const navigate = useNavigate();
  const { 
    account, 
    children, 
    currentChild, 
    selectChild, 
    addChild,
    verifyParentPin,
    subscription,
    planInfo,
    signOut,
    canAddChild,
    deviceAllowed,
    deviceError,
  } = useAuth();

  const [showAddChild, setShowAddChild] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  // New child form
  const [newChildName, setNewChildName] = useState('');
  const [newChildAvatar, setNewChildAvatar] = useState('👦');
  const [newChildAge, setNewChildAge] = useState('');
  const [newChildGender, setNewChildGender] = useState('boy');
  const [addingChild, setAddingChild] = useState(false);
  const [addError, setAddError] = useState('');

  const avatars = ['👦', '👧', '🧒', '👶', '🐱', '🐶', '🦁', '🐰', '🐼', '🦊', '🐸', '🦄'];

  // Redirect if not authenticated
  useEffect(() => {
    if (!account) {
      navigate('/auth');
    }
  }, [account, navigate]);

  // Handle device limit
  if (!deviceAllowed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Giới hạn thiết bị</h2>
          <p className="text-gray-600 mb-6">{deviceError}</p>
          <p className="text-sm text-gray-500 mb-4">
            Gói hiện tại: <strong>{planInfo?.name}</strong> ({planInfo?.maxDevices} thiết bị)
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/settings/devices')}
              className="w-full py-3 bg-indigo-500 text-white rounded-xl font-medium"
            >
              Quản lý thiết bị
            </button>
            <button
              onClick={() => navigate('/settings/subscription')}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium"
            >
              Nâng cấp gói
            </button>
            <button
              onClick={signOut}
              className="w-full py-3 border border-gray-300 rounded-xl font-medium text-gray-600"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle select child
  const handleSelectChild = (child) => {
    selectChild(child);
    navigate('/');
  };

  // Handle add child
  const handleAddChild = async () => {
    if (!newChildName.trim()) {
      setAddError('Vui lòng nhập tên bé');
      return;
    }

    setAddingChild(true);
    setAddError('');

    const result = await addChild(
      newChildName.trim(),
      newChildAvatar,
      newChildAge ? parseInt(newChildAge) : null,
      newChildGender
    );

    if (result.error) {
      setAddError(result.error);
    } else {
      setShowAddChild(false);
      setNewChildName('');
      setNewChildAge('');
    }

    setAddingChild(false);
  };

  // Handle parent access
  const handleParentAccess = () => {
    setShowPinModal(true);
    setPin('');
    setPinError('');
  };

  const verifyPin = () => {
    if (verifyParentPin(pin)) {
      setShowPinModal(false);
      navigate('/parent');
    } else {
      setPinError('Mã PIN không đúng');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      {/* Header */}
      <div className="text-center pt-8 pb-6">
        <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center text-4xl shadow-xl mb-4">
          🎓
        </div>
        <h1 className="text-2xl font-bold text-white">Gia Đình Thông Minh</h1>
        <p className="text-white/70 mt-1">Xin chào, {account?.parent_name}!</p>
      </div>

      {/* Chọn bé để học */}
      <div className="mb-6">
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
          <span className="text-xl">👦</span> Chọn bé để bắt đầu học
        </h2>

        <div className="space-y-3">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => handleSelectChild(child)}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition shadow-lg"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl">
                {child.avatar}
              </div>
              <div className="flex-1 text-left">
                <p className="text-lg font-bold text-gray-800">{child.name}</p>
                <p className="text-sm text-gray-500">
                  {child.age ? `${child.age} tuổi • ` : ''}
                  Level {child.level || 1} • {child.xp || 0} XP
                </p>
              </div>
              <div className="text-right">
                <div className="text-orange-500 font-bold flex items-center gap-1">
                  🔥 {child.streak || 0}
                </div>
                <div className="text-xs text-gray-400">ngày</div>
              </div>
              <span className="text-2xl text-gray-300">›</span>
            </button>
          ))}

          {/* Thêm bé mới */}
          {canAddChild ? (
            <button
              onClick={() => setShowAddChild(true)}
              className="w-full border-2 border-dashed border-white/40 rounded-2xl p-4 flex items-center justify-center gap-2 text-white/80 hover:bg-white/10 transition"
            >
              <span className="text-2xl">➕</span>
              <span className="font-medium">Thêm bé mới</span>
            </button>
          ) : (
            <div className="text-center text-white/60 text-sm py-2">
              Đã đạt giới hạn {planInfo?.maxChildren} bé.{' '}
              <button
                onClick={() => navigate('/settings/subscription')}
                className="underline text-yellow-300"
              >
                Nâng cấp
              </button>
            </div>
          )}

          {children.length === 0 && (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">👶</div>
              <p className="text-white/80">Chưa có bé nào</p>
              <p className="text-white/60 text-sm">Thêm bé để bắt đầu học!</p>
            </div>
          )}
        </div>
      </div>

      {/* Vào khu vực phụ huynh */}
      <div className="mb-6">
        <button
          onClick={handleParentAccess}
          className="w-full bg-white/10 backdrop-blur rounded-2xl p-4 flex items-center gap-4 hover:bg-white/20 transition border border-white/20"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
            👨‍👩‍👧
          </div>
          <div className="flex-1 text-left">
            <p className="text-lg font-bold text-white">Khu vực Phụ huynh</p>
            <p className="text-sm text-white/70">Xem tiến độ, cài đặt, quản lý</p>
          </div>
          <span className="text-2xl text-white/50">🔒</span>
        </button>
      </div>

      {/* Đăng xuất */}
      <div className="text-center">
        <button
          onClick={signOut}
          className="text-white/60 text-sm hover:text-white/80 transition"
        >
          🚪 Đăng xuất
        </button>
      </div>

      {/* =====================================================
          MODAL: THÊM BÉ MỚI
          ===================================================== */}
      {showAddChild && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">➕ Thêm bé mới</h3>

            {addError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                ⚠️ {addError}
              </div>
            )}

            <div className="space-y-4">
              {/* Tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên bé *
                </label>
                <input
                  type="text"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="VD: Bom"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Tuổi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tuổi
                </label>
                <input
                  type="number"
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(e.target.value)}
                  placeholder="VD: 5"
                  min="1"
                  max="15"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Giới tính */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <div className="flex gap-3">
                  {[
                    { value: 'boy', label: '👦 Con trai' },
                    { value: 'girl', label: '👧 Con gái' },
                  ].map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => {
                        setNewChildGender(g.value);
                        setNewChildAvatar(g.value === 'boy' ? '👦' : '👧');
                      }}
                      className={`flex-1 py-3 rounded-xl font-medium transition ${
                        newChildGender === g.value
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn avatar
                </label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {avatars.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setNewChildAvatar(av)}
                      className={`w-12 h-12 rounded-full text-2xl flex items-center justify-center transition ${
                        newChildAvatar === av
                          ? 'bg-indigo-500 ring-4 ring-indigo-300 scale-110'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddChild(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-600 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleAddChild}
                disabled={addingChild}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium disabled:opacity-50"
              >
                {addingChild ? 'Đang thêm...' : 'Thêm bé'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MODAL: NHẬP PIN PHỤ HUYNH
          ===================================================== */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl mb-3">
                🔒
              </div>
              <h3 className="text-xl font-bold text-gray-800">Nhập mã PIN</h3>
              <p className="text-gray-500 text-sm mt-1">Mã PIN 4 số để vào khu vực phụ huynh</p>
            </div>

            {pinError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
                ⚠️ {pinError}
              </div>
            )}

            {/* PIN Input */}
            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold ${
                    pin[i] ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  }`}
                >
                  {pin[i] ? '•' : ''}
                </div>
              ))}
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((num, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (num === '⌫') {
                      setPin(pin.slice(0, -1));
                      setPinError('');
                    } else if (num !== '' && pin.length < 4) {
                      const newPin = pin + num;
                      setPin(newPin);
                      setPinError('');
                      if (newPin.length === 4) {
                        setTimeout(() => {
                          if (verifyParentPin(newPin)) {
                            setShowPinModal(false);
                            navigate('/parent');
                          } else {
                            setPinError('Mã PIN không đúng');
                            setPin('');
                          }
                        }, 100);
                      }
                    }
                  }}
                  disabled={num === ''}
                  className={`h-14 rounded-xl text-xl font-semibold transition ${
                    num === ''
                      ? 'invisible'
                      : num === '⌫'
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-indigo-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowPinModal(false)}
              className="w-full py-3 text-gray-500 font-medium hover:text-gray-700"
            >
              Hủy
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              PIN mặc định: 0000
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
