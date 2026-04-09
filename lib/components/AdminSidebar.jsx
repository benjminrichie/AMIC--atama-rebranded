'use client';

import { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import toast from 'react-hot-toast';

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { id: 'content', label: 'Content Management', icon: '📝', path: '/admin/content' },
    { id: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  const isActive = (path) => pathname === path;

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-900 text-white transition-all duration-300 flex flex-col fixed h-full z-50`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-blue-800 flex items-center justify-between">
        {sidebarOpen && <h2 className="text-xl font-bold">ATAMA</h2>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar Items */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => router.push(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-blue-800 text-white'
                : 'text-blue-100 hover:bg-blue-800'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {sidebarOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-600/20 transition-colors"
        >
          <LogOut size={18} />
          {sidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
