'use client';

import { useState, useEffect } from 'react';
import { Save, Menu } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { AdminSidebar } from '@/lib/components/AdminSidebar';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { admin, token } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'ATAMA',
    navbarSubtitle: 'Investment Group',
    footerDescription: 'Building sustainable futures through strategic investments in healthcare, agriculture, and market solutions.',
    footerEmail: 'info@atama.com',
    footerPhone: '+234 XXX XXX XXXX',
    footerLocation: 'Nigeria',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Settings saved successfully');
      } else {
        toast.error(data.error || 'Failed to save settings');
      }
    } catch (error) {
      toast.error('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (!admin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="ml-64 flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Settings</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {admin?.name}</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="space-y-6">
            {/* General Settings */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">General Settings</h2>

              <div className="space-y-4">
                {/* Site Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black"
                    placeholder="Enter site name"
                  />
                </div>
              </div>
            </div>

            {/* Navbar Settings */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Navbar Settings</h2>

              <div className="space-y-4">
                {/* Navbar Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Navbar Subtitle</label>
                  <input
                    type="text"
                    value={settings.navbarSubtitle}
                    onChange={(e) => handleChange('navbarSubtitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black"
                    placeholder="Enter navbar subtitle (e.g., Investment Group)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Appears next to the site name in the navbar</p>
                </div>
              </div>
            </div>

            {/* Footer Settings */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Footer Settings</h2>

              <div className="space-y-4">
                {/* Footer Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Footer Description</label>
                  <textarea
                    value={settings.footerDescription}
                    onChange={(e) => handleChange('footerDescription', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black"
                    placeholder="Enter footer description"
                  />
                </div>

                {/* Footer Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Footer Email</label>
                  <input
                    type="email"
                    value={settings.footerEmail}
                    onChange={(e) => handleChange('footerEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black"
                    placeholder="Enter footer email"
                  />
                </div>

                {/* Footer Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Footer Phone</label>
                  <input
                    type="tel"
                    value={settings.footerPhone}
                    onChange={(e) => handleChange('footerPhone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black"
                    placeholder="Enter footer phone number"
                  />
                </div>

                {/* Footer Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Footer Location</label>
                  <input
                    type="text"
                    value={settings.footerLocation}
                    onChange={(e) => handleChange('footerLocation', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black"
                    placeholder="Enter footer location"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                <Save size={20} />
                {saving ? 'Saving...' : 'Save All Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
