// src/components/mobile/MobileHeader.jsx
// Header cho mobile voi safe area va menu

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, Bell, ArrowLeft, Search, MoreVertical } from 'lucide-react';

const MobileHeader = ({
  title,
  showBack = false,
  showMenu = false,
  showNotification = false,
  showSearch = false,
  rightAction = null,
  transparent = false,
  onSearch = null,
  menuContent = null,
  className = ''
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all ${
          transparent
            ? 'bg-transparent'
            : 'bg-white shadow-sm'
        } ${className}`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left */}
          <div className="flex items-center gap-1 min-w-[60px]">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Quay lai"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            {showMenu && (
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors md:hidden"
                aria-label="Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Center */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex-1 mx-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tim kiem..."
                className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </form>
          ) : (
            <h1 className="text-lg font-bold truncate flex-1 text-center">
              {title}
            </h1>
          )}

          {/* Right */}
          <div className="flex items-center gap-1 min-w-[60px] justify-end">
            {showSearch && (
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label={searchOpen ? 'Dong tim kiem' : 'Tim kiem'}
              >
                {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
            )}
            {showNotification && (
              <Link
                to="/notifications"
                className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors relative"
                aria-label="Thong bao"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Link>
            )}
            {rightAction}
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div
        className="h-14"
        style={{ marginTop: 'env(safe-area-inset-top)' }}
      />

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 animate-fade-in"
            onClick={() => setMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl animate-slide-in"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
                aria-label="Dong menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="p-4 overflow-y-auto" style={{
              maxHeight: 'calc(100vh - 60px - env(safe-area-inset-top) - env(safe-area-inset-bottom))'
            }}>
              {menuContent || (
                <p className="text-gray-500 text-sm">Menu content</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileHeader;
