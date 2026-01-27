// src/components/landing/SocialProofRealtime.jsx
// Section thống kê realtime với animation
import React, { useState, useEffect } from 'react';

// Counter animation hook
function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;

    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, started]);

  return { count, start: () => setStarted(true) };
}

// Toast notification messages
const NOTIFICATIONS = [
  { icon: '🎉', text: 'Bé Minh Anh (6 tuổi) vừa đạt 100 điểm bài Toán!' },
  { icon: '🏆', text: 'Mẹ bé Bống vừa đăng ký thành công!' },
  { icon: '⭐', text: 'Bé Nam đã hoàn thành 10 bài học hôm nay!' },
  { icon: '🎮', text: 'Bé Linh vừa nhận huy hiệu "Siêu sao Tiếng Anh"!' },
  { icon: '📚', text: 'Anh Tuấn vừa đăng ký gói Premium cho bé!' },
  { icon: '✨', text: 'Bé Hoa đạt top 1 bảng xếp hạng tuần!' },
];

export default function SocialProofRealtime() {
  const [currentNotif, setCurrentNotif] = useState(0);
  const [showNotif, setShowNotif] = useState(true);

  const stats = [
    { icon: '🟢', label: 'bé đang học ngay lúc này', value: 2847, suffix: '' },
    { icon: '📚', label: 'bài học đã hoàn thành', value: 156432, suffix: '' },
    { icon: '⭐', label: 'đánh giá từ phụ huynh', value: 4.9, suffix: '/5', isDecimal: true },
    { icon: '🏆', label: 'app giáo dục trẻ em', value: 1, suffix: '', prefix: 'Top ' },
  ];

  const counter1 = useCountUp(2847, 2000);
  const counter2 = useCountUp(156432, 2500);

  useEffect(() => {
    // Start counters when component mounts
    const timer = setTimeout(() => {
      counter1.start();
      counter2.start();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Rotate notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setShowNotif(false);
      setTimeout(() => {
        setCurrentNotif((prev) => (prev + 1) % NOTIFICATIONS.length);
        setShowNotif(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-purple-50 py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
            <span className="text-3xl mb-2 block">🟢</span>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">
              {counter1.count.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">bé đang học ngay lúc này</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
            <span className="text-3xl mb-2 block">📚</span>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">
              {counter2.count.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">bài học đã hoàn thành</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
            <span className="text-3xl mb-2 block">⭐</span>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">
              4.9<span className="text-xl text-gray-500">/5</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">đánh giá từ phụ huynh</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
            <span className="text-3xl mb-2 block">🏆</span>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">
              <span className="text-purple-600">Top 1</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">app giáo dục trẻ em</p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div
        className={`fixed bottom-24 left-4 z-40 max-w-xs transition-all duration-500 ${
          showNotif ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 flex items-center gap-3">
          <span className="text-2xl">{NOTIFICATIONS[currentNotif].icon}</span>
          <p className="text-sm text-gray-700">{NOTIFICATIONS[currentNotif].text}</p>
        </div>
      </div>
    </section>
  );
}
