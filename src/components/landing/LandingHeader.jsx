// src/components/landing/LandingHeader.jsx
// Sticky Header for Landing Page
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Tính năng', href: '#features' },
  { label: 'Đối tượng', href: '#target-users' },
  { label: 'Bảng giá', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setIsMobileMenuOpen(false);

    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isScrolled
                ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <span className="text-xl">🎓</span>
            </div>
            <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              SchoolHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.href)}
                className={`font-medium transition-colors ${
                  isScrolled
                    ? 'text-gray-600 hover:text-blue-600'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                isScrolled
                  ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all active:scale-95 ${
                isScrolled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              Dùng thử miễn phí
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden w-10 h-10 rounded-xl flex items-center justify-center ${
              isScrolled ? 'bg-gray-100 text-gray-700' : 'bg-white/20 text-white'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-xl absolute top-full left-0 right-0 border-t">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.href)}
                className="block w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t mt-4 space-y-2">
              <Link
                to="/login"
                className="block w-full text-center px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="block w-full text-center px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dùng thử miễn phí
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
