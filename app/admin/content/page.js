'use client';

import { useState, useEffect } from 'react';
import { Save, X, Trash2, Edit2, Plus } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { AdminSidebar } from '@/lib/components/AdminSidebar';
import toast from 'react-hot-toast';

export default function ContentManagement() {
  const { admin, token } = useAuth();
  const [activeTab, setActiveTab] = useState('health');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', icon: '' });

  const sections = [
    { id: 'health', label: 'Health', icon: '🏥' },
    { id: 'agriculture', label: 'Agriculture', icon: '🌾' },
    { id: 'marketing', label: 'Marketing', icon: '📱' },
  ];

  useEffect(() => {
    loadContent();
  }, [activeTab]);

  const loadContent = async () => {
    setLoading(true);
    setEditingId(null);
    setShowAddForm(false);
    try {
      const response = await fetch(`/api/content/${activeTab}`);
      const data = await response.json();

      if (data.success && data.data) {
        setItems(data.data.sections || []);
      } else {
        setItems([]);
      }
    } catch (error) {
      toast.error('Failed to load content');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all fields');
      return;
    }

    setSaving(true);
    try {
      const newItems = [...items, formData];
      const response = await fetch(`/api/content/${activeTab}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: activeTab.charAt(0).toUpperCase() + activeTab.slice(1),
          description: `${activeTab} content`,
          sections: newItems,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setItems(newItems);
        setFormData({ title: '', description: '', icon: '' });
        setShowAddForm(false);
        toast.success('Content added successfully');
      } else {
        toast.error(data.error || 'Failed to add content');
      }
    } catch (error) {
      toast.error('Error adding content');
    } finally {
      setSaving(false);
    }
  };

  const handleEditItem = (item, index) => {
    setEditingId(index);
    setFormData(item);
    setShowAddForm(false);
  };

  const handleSaveEdit = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all fields');
      return;
    }

    setSaving(true);
    try {
      const newItems = [...items];
      newItems[editingId] = formData;
      
      const response = await fetch(`/api/content/${activeTab}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: activeTab.charAt(0).toUpperCase() + activeTab.slice(1),
          description: `${activeTab} content`,
          sections: newItems,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setItems(newItems);
        setEditingId(null);
        setFormData({ title: '', description: '', icon: '' });
        toast.success('Content updated successfully');
      } else {
        toast.error(data.error || 'Failed to update content');
      }
    } catch (error) {
      toast.error('Error updating content');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (index) => {
    setSaving(true);
    try {
      const newItems = items.filter((_, i) => i !== index);
      
      const response = await fetch(`/api/content/${activeTab}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: activeTab.charAt(0).toUpperCase() + activeTab.slice(1),
          description: `${activeTab} content`,
          sections: newItems,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setItems(newItems);
        setShowDeleteConfirm(null);
        toast.success('Content deleted successfully');
      } else {
        toast.error(data.error || 'Failed to delete content');
      }
    } catch (error) {
      toast.error('Error deleting content');
    } finally {
      setSaving(false);
    }
  };

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col transition-all duration-300">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {admin?.name}</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="bg-white rounded-lg shadow-lg">
            {/* Tabs */}
            <div className="flex border-b overflow-x-auto">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === section.id
                      ? 'border-b-2 border-blue-900 text-blue-900 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="p-8 space-y-6">
                {/* Edit/Add Form */}
                {editingId !== null || showAddForm ? (
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">
                      {editingId !== null ? `Edit: ${formData.title}` : 'Add New Content'}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black"
                          placeholder="Enter content title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black"
                          placeholder="Enter content description"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                        <input
                          type="text"
                          value={formData.icon}
                          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black"
                          placeholder="Enter icon (emoji or name)"
                        />
                      </div>
                      <div className="flex gap-3 justify-end pt-4">
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setShowAddForm(false);
                            setFormData({ title: '', description: '', icon: '' });
                          }}
                          className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={editingId !== null ? handleSaveEdit : handleAddItem}
                          disabled={saving}
                          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Save size={18} />
                          {saving ? 'Saving...' : editingId !== null ? 'Update' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                    >
                      <Plus size={20} />
                      Add New Content
                    </button>
                  </div>
                )}

                {/* Content List */}
                {items.length > 0 ? (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <span className="text-4xl flex-shrink-0">{item.icon || '📄'}</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-lg break-words">
                                {item.title}
                              </h4>
                              <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleEditItem(item, index)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={20} />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-6">No content items yet</p>
                    {!showAddForm && (
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                      >
                        <Plus size={20} />
                        Create First Item
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Content?</h3>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete <span className="font-bold">"{items[showDeleteConfirm]?.title}"</span>?
            </p>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteItem(showDeleteConfirm)}
                disabled={saving}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
