// src/components/EncouragementBanner.jsx
// Hiển thị tin nhắn động viên từ phụ huynh
import React, { useState, useEffect } from 'react';
import { useMember } from '../contexts/MemberContext';

export default function EncouragementBanner() {
  const { getEncouragements, markEncouragementRead, currentMember } = useMember();
  const [messages, setMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (currentMember) {
      loadMessages();
    }
  }, [currentMember]);

  const loadMessages = async () => {
    const data = await getEncouragements();
    setMessages(data || []);
  };

  const handleDismiss = async () => {
    if (messages[currentIndex]) {
      await markEncouragementRead(messages[currentIndex].id);
      
      if (currentIndex < messages.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsVisible(false);
      }
    }
  };

  if (!isVisible || messages.length === 0) return null;

  const currentMsg = messages[currentIndex];

  return (
    <div className="mx-4 mb-4 animate-fadeIn">
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4 border-2 border-pink-200 shadow-lg">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-2xl flex-shrink-0 animate-bounce">
            💌
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-pink-600 mb-1">
              Tin nhắn từ Ba/Mẹ! ❤️
            </p>
            <p className="text-gray-700 text-lg">
              {currentMsg.message}
            </p>
            
            {/* Actions */}
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={handleDismiss}
                className="text-sm text-pink-600 font-medium hover:text-pink-800"
              >
                ✓ Đã đọc
              </button>
              
              {messages.length > 1 && (
                <span className="text-xs text-gray-400">
                  {currentIndex + 1}/{messages.length} tin nhắn
                </span>
              )}
            </div>
          </div>
          
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
