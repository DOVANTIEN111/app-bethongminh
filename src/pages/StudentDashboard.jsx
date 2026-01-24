// src/pages/StudentDashboard.jsx
// Student Dashboard - Redirects to learning page
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, LogOut } from 'lucide-react';

export default function StudentDashboard() {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Trang Hoc Tap</h1>
              <p className="text-sm text-gray-500">{profile?.full_name || 'Student'}</p>
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
          <h2 className="text-lg font-semibold mb-4">Chao mung den trang hoc tap!</h2>
          <div className="space-y-2 text-gray-600">
            <p><strong>Ho ten:</strong> {profile?.full_name}</p>
            <p><strong>Email:</strong> {profile?.email}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
