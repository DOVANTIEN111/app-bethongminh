// src/components/UpgradePopup.jsx
// Popup hiển thị khi user click vào bài học bị khóa

import React from 'react';
import { X, Crown, Star, Sparkles, Check, Lock } from 'lucide-react';

export default function UpgradePopup({ isOpen, onClose, lessonTitle }) {
  if (!isOpen) return null;

  const premiumFeatures = [
    'Mở khóa tất cả bài học',
    'Không giới hạn lượt chơi',
    'Tải xuống học offline',
    'Không có quảng cáo',
    'Hỗ trợ ưu tiên 24/7',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full z-10 hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 px-6 py-8 text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Nâng cấp Premium</h2>
          <p className="text-white/90 text-sm">Mở khóa tất cả bài học ngay!</p>
        </div>

        {/* Locked lesson info */}
        {lessonTitle && (
          <div className="px-6 py-3 bg-orange-50 border-b border-orange-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-orange-500" />
            <p className="text-sm text-orange-700 flex-1 truncate">
              <span className="font-medium">{lessonTitle}</span> đang bị khóa
            </p>
          </div>
        )}

        {/* Features list */}
        <div className="p-6 space-y-3">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Quyền lợi Premium
          </h3>
          <ul className="space-y-2">
            {premiumFeatures.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-gray-700">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing */}
        <div className="px-6 pb-2">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Gói tháng</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-800">99.000</span>
                <span className="text-gray-500 text-sm">đ/tháng</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Gói năm</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-500 line-through">1.188.000đ</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-green-600">799.000</span>
                  <span className="text-gray-500 text-sm">đ/năm</span>
                </div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                Tiết kiệm 33% với gói năm!
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-6 pt-4 space-y-3">
          <button
            onClick={() => {
              // TODO: Navigate to payment page
              alert('Tính năng thanh toán sẽ sớm ra mắt!');
            }}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Crown className="w-5 h-5" />
            Nâng cấp ngay
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
          >
            Để sau
          </button>
        </div>

        {/* Decorative stars */}
        <div className="absolute top-2 left-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
        </div>
        <div className="absolute top-16 right-16">
          <Star className="w-3 h-3 text-yellow-300 fill-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </div>
  );
}
