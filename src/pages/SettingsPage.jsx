import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../contexts/AudioContext';
import { ArrowLeft, Volume2, VolumeX, Download, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { soundEnabled, toggleSound } = useAudio();
  
  const handleExport = () => {
    const data = localStorage.getItem('gdtm_data') || '{}';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gdtm_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleClear = () => {
    if (window.confirm('Xóa TẤT CẢ dữ liệu? Không thể hoàn tác!')) {
      localStorage.clear();
      window.location.reload();
    }
  };
  
  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Cài Đặt</h1>
      </div>
      
      {/* Sound */}
      <div className="bg-white rounded-2xl p-4 shadow mb-4">
        <h3 className="font-bold text-gray-800 mb-4">Âm thanh</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {soundEnabled ? <Volume2 className="w-6 h-6 text-indigo-500" /> : <VolumeX className="w-6 h-6 text-gray-400" />}
            <div>
              <p className="font-medium">Hiệu ứng âm thanh</p>
              <p className="text-sm text-gray-500">{soundEnabled ? 'Đang bật' : 'Đang tắt'}</p>
            </div>
          </div>
          <button
            onClick={toggleSound}
            className={`w-14 h-8 rounded-full transition-colors ${soundEnabled ? 'bg-indigo-500' : 'bg-gray-300'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${soundEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
      
      {/* Data */}
      <div className="bg-white rounded-2xl p-4 shadow mb-4">
        <h3 className="font-bold text-gray-800 mb-4">Dữ liệu</h3>
        <div className="space-y-3">
          <button onClick={handleExport} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50">
            <Download className="w-6 h-6 text-green-500" />
            <div className="text-left">
              <p className="font-medium">Xuất dữ liệu</p>
              <p className="text-sm text-gray-500">Tải file backup</p>
            </div>
          </button>
          <button onClick={handleClear} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50">
            <Trash2 className="w-6 h-6 text-red-500" />
            <div className="text-left">
              <p className="font-medium text-red-600">Xóa tất cả</p>
              <p className="text-sm text-red-400">Không thể hoàn tác</p>
            </div>
          </button>
        </div>
      </div>
      
      {/* Info */}
      <div className="bg-white rounded-2xl p-4 shadow">
        <h3 className="font-bold text-gray-800 mb-4">Thông tin</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Phiên bản</span>
            <span className="font-medium">2.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Build</span>
            <span className="font-medium">React + Vite</span>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          🎓 Gia Đình Thông Minh
        </p>
      </div>
    </div>
  );
}
