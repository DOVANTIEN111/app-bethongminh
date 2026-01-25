// src/components/ParentPinModal.jsx
// Modal nhập PIN để vào chế độ Phụ huynh
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Key, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function ParentPinModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [newPin, setNewPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [step, setStep] = useState(1); // 1: nhập PIN mới, 2: xác nhận PIN
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const newPinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const confirmPinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (isOpen) {
      // Reset state
      setPin(['', '', '', '']);
      setNewPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      setError('');
      setStep(1);

      // Kiểm tra xem đã có PIN chưa
      checkHasPin();
    }
  }, [isOpen, profile]);

  const checkHasPin = async () => {
    if (!profile?.id) return;

    try {
      const { data } = await supabase
        .from('profiles')
        .select('parent_pin')
        .eq('id', profile.id)
        .single();

      setIsSettingPin(!data?.parent_pin);

      // Focus vào ô đầu tiên
      setTimeout(() => {
        if (!data?.parent_pin) {
          newPinRefs[0]?.current?.focus();
        } else {
          inputRefs[0]?.current?.focus();
        }
      }, 100);
    } catch (err) {
      console.error('Check PIN error:', err);
    }
  };

  const handlePinChange = (index, value, pinArray, setPinArray, refs) => {
    if (!/^\d*$/.test(value)) return; // Chỉ cho phép số

    const newPinArray = [...pinArray];
    newPinArray[index] = value.slice(-1); // Chỉ lấy ký tự cuối
    setPinArray(newPinArray);
    setError('');

    // Auto focus sang ô tiếp theo
    if (value && index < 3) {
      refs[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (index, e, pinArray, setPinArray, refs) => {
    if (e.key === 'Backspace' && !pinArray[index] && index > 0) {
      refs[index - 1]?.current?.focus();
    }
  };

  const verifyPin = async () => {
    const enteredPin = pin.join('');
    if (enteredPin.length !== 4) {
      setError('Vui lòng nhập đủ 4 số');
      return;
    }

    setLoading(true);
    try {
      // Hash PIN để so sánh
      const hashedPin = btoa(enteredPin + '_schoolhub_salt');

      const { data } = await supabase
        .from('profiles')
        .select('parent_pin')
        .eq('id', profile.id)
        .single();

      if (data?.parent_pin === hashedPin) {
        // PIN đúng - chuyển sang chế độ phụ huynh
        sessionStorage.setItem('parentModeVerified', 'true');
        sessionStorage.setItem('parentModeTime', Date.now().toString());
        onClose();
        navigate('/learn/parent');
      } else {
        setError('Mã PIN không đúng');
        setPin(['', '', '', '']);
        inputRefs[0]?.current?.focus();
      }
    } catch (err) {
      console.error('Verify PIN error:', err);
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPin = async () => {
    if (step === 1) {
      const newPinValue = newPin.join('');
      if (newPinValue.length !== 4) {
        setError('Vui lòng nhập đủ 4 số');
        return;
      }
      setStep(2);
      setError('');
      setTimeout(() => {
        confirmPinRefs[0]?.current?.focus();
      }, 100);
      return;
    }

    // Step 2: Xác nhận PIN
    const newPinValue = newPin.join('');
    const confirmPinValue = confirmPin.join('');

    if (confirmPinValue.length !== 4) {
      setError('Vui lòng nhập đủ 4 số');
      return;
    }

    if (newPinValue !== confirmPinValue) {
      setError('Mã PIN không khớp');
      setConfirmPin(['', '', '', '']);
      confirmPinRefs[0]?.current?.focus();
      return;
    }

    setLoading(true);
    try {
      // Hash và lưu PIN
      const hashedPin = btoa(newPinValue + '_schoolhub_salt');

      const { error } = await supabase
        .from('profiles')
        .update({ parent_pin: hashedPin })
        .eq('id', profile.id);

      if (error) throw error;

      // Chuyển sang chế độ phụ huynh
      sessionStorage.setItem('parentModeVerified', 'true');
      sessionStorage.setItem('parentModeTime', Date.now().toString());
      onClose();
      navigate('/learn/parent');
    } catch (err) {
      console.error('Set PIN error:', err);
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderPinInputs = (pinArray, setPinArray, refs) => (
    <div className="flex justify-center gap-3">
      {pinArray.map((digit, index) => (
        <input
          key={index}
          ref={refs[index]}
          type={showPin ? 'text' : 'password'}
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handlePinChange(index, e.target.value, pinArray, setPinArray, refs)}
          onKeyDown={(e) => handleKeyDown(index, e, pinArray, setPinArray, refs)}
          className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
          disabled={loading}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Khu vực Phụ huynh</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {isSettingPin ? (
          // Form đặt PIN lần đầu
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-amber-600" />
              </div>
              <p className="text-gray-600">
                {step === 1
                  ? 'Đặt mã PIN 4 số để bảo vệ khu vực Phụ huynh'
                  : 'Nhập lại mã PIN để xác nhận'
                }
              </p>
            </div>

            {step === 1 ? (
              renderPinInputs(newPin, setNewPin, newPinRefs)
            ) : (
              renderPinInputs(confirmPin, setConfirmPin, confirmPinRefs)
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-600 mt-4 justify-center">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="flex items-center justify-center mt-4">
              <button
                onClick={() => setShowPin(!showPin)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPin ? 'Ẩn PIN' : 'Hiện PIN'}
              </button>
            </div>

            <div className="flex gap-3 mt-6">
              {step === 2 && (
                <button
                  onClick={() => {
                    setStep(1);
                    setConfirmPin(['', '', '', '']);
                    setError('');
                  }}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Quay lại
                </button>
              )}
              <button
                onClick={handleSetNewPin}
                disabled={loading || (step === 1 ? newPin.join('').length !== 4 : confirmPin.join('').length !== 4)}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-medium"
              >
                {loading ? 'Đang xử lý...' : step === 1 ? 'Tiếp tục' : 'Xác nhận'}
              </button>
            </div>
          </>
        ) : (
          // Form nhập PIN
          <>
            <div className="text-center mb-6">
              <p className="text-gray-600">Nhập mã PIN 4 số để truy cập</p>
            </div>

            {renderPinInputs(pin, setPin, inputRefs)}

            {error && (
              <div className="flex items-center gap-2 text-red-600 mt-4 justify-center">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="flex items-center justify-center mt-4">
              <button
                onClick={() => setShowPin(!showPin)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPin ? 'Ẩn PIN' : 'Hiện PIN'}
              </button>
            </div>

            <button
              onClick={verifyPin}
              disabled={loading || pin.join('').length !== 4}
              className="w-full mt-6 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Đang xác nhận...' : 'Xác nhận'}
            </button>
          </>
        )}

        <p className="text-xs text-gray-400 text-center mt-4">
          Chỉ phụ huynh mới nên biết mã PIN này
        </p>
      </div>
    </div>
  );
}
