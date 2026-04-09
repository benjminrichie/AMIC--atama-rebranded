'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { AdminSidebar } from '@/lib/components/AdminSidebar';

export default function AdminDashboard() {
  const router = useRouter();
  const { admin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content */}
      <div className="md:ml-64 flex-1 flex flex-col transition-all duration-300">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 md:px-8 py-3 md:py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={24} className="text-gray-900" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {admin?.name}</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm font-medium">Total Content</div>
              <div className="text-3xl font-bold text-blue-900 mt-2">3</div>
              <div className="text-gray-500 text-xs mt-2">Health, Agriculture, Marketing</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm font-medium">Total Users</div>
              <div className="text-3xl font-bold text-blue-900 mt-2">1</div>
              <div className="text-gray-500 text-xs mt-2">Admin users</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm font-medium">Last Updated</div>
              <div className="text-3xl font-bold text-blue-900 mt-2">Today</div>
              <div className="text-gray-500 text-xs mt-2">Content management</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm font-medium">Status</div>
              <div className="text-3xl font-bold text-green-600 mt-2">Active</div>
              <div className="text-gray-500 text-xs mt-2">System running</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => router.push('/admin/content')}
                className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="text-2xl mb-2">📝</div>
                <div className="font-medium text-gray-900">Manage Content</div>
              </button>

              <button
                onClick={() => router.push('/admin/users')}
                className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="text-2xl mb-2">👥</div>
                <div className="font-medium text-gray-900">Manage Users</div>
              </button>

              <button
                onClick={() => router.push('/admin/settings')}
                className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="text-2xl mb-2">⚙️</div>
                <div className="font-medium text-gray-900">Settings</div>
              </button>

              <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                <div className="text-2xl mb-2">ℹ️</div>
                <div className="font-medium text-gray-900">Help & Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

