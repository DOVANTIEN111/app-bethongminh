// src/components/landing/GuaranteeSection.jsx
// Section cam kết hoàn tiền 100%
import React from 'react';
import { Shield, CheckCircle, Clock, Headphones, Award } from 'lucide-react';

const GUARANTEES = [
  {
    icon: Clock,
    title: 'Dùng thử 30 ngày miễn phí',
    desc: 'Trải nghiệm đầy đủ tính năng Premium trong 30 ngày, không cần thẻ tín dụng',
  },
  {
    icon: Shield,
    title: 'Hoàn tiền 100% trong 7 ngày',
    desc: 'Không hài lòng? Chúng tôi hoàn tiền 100% trong 7 ngày đầu, không hỏi lý do',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ 24/7',
    desc: 'Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc của bạn',
  },
  {
    icon: Award,
    title: 'Cam kết chất lượng',
    desc: 'Nội dung được biên soạn bởi đội ngũ giáo viên giàu kinh nghiệm',
  },
];

export default function GuaranteeSection() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-green-50 to-emerald-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Guarantee Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-100 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />

          <div className="relative p-8 sm:p-12 text-center">
            {/* Shield Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Cam kết{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Hoàn tiền 100%
              </span>
            </h2>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Chúng tôi tin tưởng vào chất lượng sản phẩm. Nếu con bạn không thích học
              trên SchoolHub, chúng tôi sẽ <strong>hoàn lại 100% chi phí</strong> trong 7 ngày
              đầu tiên - không hỏi lý do!
            </p>

            {/* Guarantee Badge */}
            <div className="inline-flex items-center gap-3 bg-green-100 text-green-700 px-6 py-3 rounded-full font-semibold mb-8">
              <CheckCircle className="w-6 h-6" />
              <span>Đảm bảo hài lòng 100%</span>
            </div>

            {/* Guarantee Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {GUARANTEES.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-4"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                    <item.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Text */}
        <p className="text-center text-gray-500 text-sm mt-8">
          * Điều khoản áp dụng. Xem chi tiết tại{' '}
          <a href="/refund-policy" className="text-green-600 underline">
            Chính sách hoàn tiền
          </a>
        </p>
      </div>
    </section>
  );
}
