// src/components/landing/FAQSection.jsx
// FAQ Section for Landing Page
import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    question: 'SchoolHub phù hợp với độ tuổi nào?',
    answer: 'SchoolHub được thiết kế cho học sinh từ Mầm non đến lớp 5 (3-11 tuổi). Nội dung được biên soạn theo chương trình giáo dục Việt Nam, phù hợp với từng độ tuổi và cấp học.',
  },
  {
    question: 'Có thể dùng thử miễn phí không?',
    answer: 'Có! Bạn có thể dùng thử miễn phí 30 ngày với đầy đủ tính năng Premium. Không cần nhập thông tin thẻ, tự động hủy sau 30 ngày nếu không nâng cấp. Ngoài ra, gói Miễn phí cũng cho phép học 3 bài/môn vĩnh viễn.',
  },
  {
    question: 'Làm sao để đăng ký cho con?',
    answer: 'Rất đơn giản! Bạn chỉ cần nhấn "Dùng thử miễn phí", điền thông tin cơ bản (email, tên phụ huynh, tên con), và tài khoản sẽ được tạo ngay lập tức. Con có thể bắt đầu học trong vòng 2 phút!',
  },
  {
    question: 'Giáo viên có thể tạo bài giảng riêng không?',
    answer: 'Có! Với gói Giáo viên Pro, bạn có thể tạo bài giảng đa phương tiện (text, hình ảnh, video, audio), tạo bài kiểm tra online, giao bài tập cho học sinh, và theo dõi tiến độ từng em.',
  },
  {
    question: 'Trường học triển khai SchoolHub như thế nào?',
    answer: 'Chúng tôi có đội ngũ hỗ trợ triển khai riêng cho các trường học. Quy trình bao gồm: Tư vấn nhu cầu → Thiết lập hệ thống → Đào tạo giáo viên → Hỗ trợ vận hành. Liên hệ để được tư vấn miễn phí!',
  },
  {
    question: 'Dữ liệu của con tôi có được bảo mật không?',
    answer: 'Tuyệt đối! SchoolHub tuân thủ tiêu chuẩn bảo mật cao nhất. Dữ liệu được mã hóa SSL/TLS, lưu trữ trên server bảo mật. Chúng tôi không bao giờ chia sẻ hoặc bán dữ liệu cá nhân cho bên thứ ba. Đọc thêm tại Chính sách bảo mật.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Câu hỏi <span className="text-blue-600">thường gặp</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Những thắc mắc phổ biến về SchoolHub
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'border-blue-200 shadow-lg' : 'border-gray-200 hover:border-blue-100'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    openIndex === index ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <HelpCircle className={`w-5 h-5 ${openIndex === index ? 'text-blue-600' : 'text-gray-500'}`} />
                  </div>
                  <span className={`font-semibold ${openIndex === index ? 'text-blue-600' : 'text-gray-900'}`}>
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-20">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy câu trả lời bạn cần?</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Liên hệ hỗ trợ
          </Link>
        </div>
      </div>
    </section>
  );
}
