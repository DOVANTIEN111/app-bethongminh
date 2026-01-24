// src/pages/SchoolDashboard.jsx
// School Admin Dashboard
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Building2, LogOut } from 'lucide-react';

export default function SchoolDashboard() {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Dashboard Nha Truong</h1>
              <p className="text-sm text-gray-500">{profile?.full_name || 'School Admin'}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            Dang xuat
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Thong tin truong</h2>
          <div className="space-y-2 text-gray-600">
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>Role:</strong> {profile?.role}</p>
            <p><strong>School ID:</strong> {profile?.school_id || 'Chua gan truong'}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
