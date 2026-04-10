'use client';

import { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import toast from 'react-hot-toast';

export function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { id: 'content', label: 'Content Management', icon: '📝', path: '/admin/content' },
    { id: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
    { id: 'dues', label: 'Monthly Dues', icon: '📅', path: '/admin/dues' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  const isActive = (path) => pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-900 text-white transition-all duration-300 flex flex-col fixed h-full z-50 hidden md:flex`}>
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

    {/* Mobile Sidebar Drawer */}
    <div className={`fixed inset-y-0 left-0 w-64 bg-blue-900 text-white transform transition-transform duration-300 z-50 md:hidden ${
      mobileOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-blue-800 flex items-center justify-between">
        <h2 className="text-xl font-bold">ATAMA</h2>
        <button
          onClick={() => setMobileOpen(false)}
          className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
        >
          <span className="text-xl">✕</span>
        </button>
      </div>

      {/* Sidebar Items */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              router.push(item.path);
              setMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-blue-800 text-white'
                : 'text-blue-100 hover:bg-blue-800'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
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
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
    </>
  );
}
