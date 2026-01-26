// src/components/landing/Footer.jsx
// Footer for Landing Page
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Youtube, MessageCircle } from 'lucide-react';

const FOOTER_LINKS = {
  product: {
    title: 'Sản phẩm',
    links: [
      { label: 'Tính năng', href: '/#features' },
      { label: 'Bảng giá', href: '/#pricing' },
      { label: 'Cho Nhà trường', href: '/register/school' },
      { label: 'Cho Giáo viên', href: '/register/teacher' },
      { label: 'Cho Phụ huynh', href: '/register' },
    ],
  },
  company: {
    title: 'Công ty',
    links: [
      { label: 'Về chúng tôi', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Tuyển dụng', href: '/careers' },
      { label: 'Liên hệ', href: '/contact' },
    ],
  },
  legal: {
    title: 'Pháp lý',
    links: [
      { label: 'Điều khoản sử dụng', href: '/terms-of-service.html' },
      { label: 'Chính sách bảo mật', href: '/privacy-policy.html' },
      { label: 'Chính sách hoàn tiền', href: '/refund-policy' },
    ],
  },
  support: {
    title: 'Hỗ trợ',
    links: [
      { label: 'Trung tâm trợ giúp', href: '/help' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Hướng dẫn sử dụng', href: '/guide' },
    ],
  },
};

const SOCIAL_LINKS = [
  { icon: Facebook, href: 'https://facebook.com/schoolhub', label: 'Facebook' },
  { icon: Youtube, href: 'https://youtube.com/@schoolhub', label: 'Youtube' },
  { icon: MessageCircle, href: 'https://zalo.me/schoolhub', label: 'Zalo' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">🎓</span>
              </div>
              <span className="text-xl font-bold">SchoolHub</span>
            </div>

            <p className="text-gray-400 mb-6 max-w-sm">
              Nền tảng học tập thông minh #1 Việt Nam. Giải pháp giáo dục toàn diện cho Nhà trường, Giáo viên, Phụ huynh và Học sinh.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-gray-400 text-sm">
              <a href="mailto:support@schoolhub.vn" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                support@schoolhub.vn
              </a>
              <a href="tel:1900xxxx" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                1900 xxxx (8:00 - 22:00)
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Tầng 10, Tòa nhà ABC, Quận 1, TP. Hồ Chí Minh
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {SOCIAL_LINKS.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    {link.href.startsWith('http') || link.href.endsWith('.html') ? (
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 SchoolHub. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="/terms-of-service.html" className="hover:text-white transition-colors">
                Điều khoản
              </Link>
              <Link to="/privacy-policy.html" className="hover:text-white transition-colors">
                Bảo mật
              </Link>
              <span className="hidden sm:inline">🇻🇳 Made with ❤️ in Vietnam</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
