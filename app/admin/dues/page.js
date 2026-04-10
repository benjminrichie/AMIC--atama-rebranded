'use client';

import { useState, useEffect } from 'react';
import { Menu, Plus, Trash2, Edit2, Printer, Download, X } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { AdminSidebar } from '@/lib/components/AdminSidebar';
import toast from 'react-hot-toast';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MonthlyDuesPage() {
  const { admin, token } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [allDuesData, setAllDuesData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [cardholderName, setCardholderName] = useState('');
  const [coverPageData, setCoverPageData] = useState({
    title: 'Monthly Dues Card',
    organizationName: 'ATAMA Investment Company',
    year: new Date().getFullYear(),
    subtitle: 'Annual Payment Schedule',
    footerText: '',
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
  });
  const [editingIndex, setEditingIndex] = useState(null);

  // Generate years from 2025 to current year
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: currentYear - 2025 + 1 }, (_, i) => 2025 + i);

  useEffect(() => {
    fetchAllDues();
    // Update cover page year when selected year changes
    setCoverPageData(prev => ({ ...prev, year: selectedYear }));
  }, [selectedYear, token]);

  const fetchAllDues = async () => {
    try {
      setLoading(true);
      const data = {};

      // Fetch dues for all 12 months
      for (let month = 1; month <= 12; month++) {
        const response = await fetch(`/api/dues/${month}/${selectedYear}`);
        const result = await response.json();
        if (result.success) {
          data[month] = result.data || { month, year: selectedYear, dues: [] };
        }
      }

      setAllDuesData(data);
    } catch (error) {
      console.error('Error fetching dues:', error);
      toast.error('Failed to load dues');
    } finally {
      setLoading(false);
    }
  };

  const getDayDues = (month, day) => {
    const monthData = allDuesData[month];
    if (!monthData) return [];
    const dayDue = monthData.dues?.find((d) => d.day === day);
    return dayDue?.items || [];
  };

  const handleAddDue = async () => {
    if (!formData.title || !selectedDay || !selectedMonth) {
      toast.error('Please fill in required fields');
      return;
    }

    setSaving(true);
    try {
      const monthData = allDuesData[selectedMonth] || { month: selectedMonth, year: selectedYear, dues: [] };
      const updatedDues = [...(monthData.dues || [])];
      const dayIndex = updatedDues.findIndex((d) => d.day === selectedDay);

      if (dayIndex >= 0) {
        if (editingIndex !== null) {
          updatedDues[dayIndex].items[editingIndex] = formData;
        } else {
          updatedDues[dayIndex].items.push(formData);
        }
      } else {
        updatedDues.push({
          day: selectedDay,
          items: [formData],
        });
      }

      const response = await fetch(`/api/dues/${selectedMonth}/${selectedYear}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dues: updatedDues }),
      });

      const result = await response.json();

      if (result.success) {
        setAllDuesData({ ...allDuesData, [selectedMonth]: result.data });
        setShowModal(false);
        setFormData({ title: '', description: '', priority: 'medium', category: '' });
        setEditingIndex(null);
        toast.success(editingIndex !== null ? 'Due updated successfully' : 'Due added successfully');
      } else {
        toast.error(result.error || 'Failed to save due');
      }
    } catch (error) {
      toast.error('Error saving due');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDue = async (month, day, index) => {
    if (!confirm('Are you sure you want to delete this due?')) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/dues/${month}/${selectedYear}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ day, itemIndex: index }),
      });

      const result = await response.json();

      if (result.success) {
        setAllDuesData({ ...allDuesData, [month]: result.data });
        toast.success('Due deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete due');
      }
    } catch (error) {
      toast.error('Error deleting due');
    } finally {
      setSaving(false);
    }
  };

  const handleEditDue = (month, day, index) => {
    const dayDues = getDayDues(month, day);
    setSelectedMonth(month);
    setSelectedDay(day);
    setFormData(dayDues[index]);
    setEditingIndex(index);
    setShowModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const openAddModal = (month, day) => {
    setSelectedMonth(month);
    setSelectedDay(day);
    setFormData({ title: '', description: '', priority: 'medium', category: '' });
    setEditingIndex(null);
    setShowModal(true);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden print:bg-white">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} className="print:hidden" />

      <div className="md:ml-64 flex-1 flex flex-col transition-all duration-300 overflow-hidden print:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm print:hidden">
          <div className="px-4 md:px-8 py-3 md:py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={24} className="text-gray-900" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Monthly Dues Card</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {admin?.name}</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 print:p-2 print:overflow-visible">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 print:rounded-none print:shadow-none print:p-2">
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 print:hidden">
              <div className="flex items-center gap-4">
                <label className="font-semibold text-gray-700 text-sm md:text-base whitespace-nowrap">
                  Year:
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    const newYear = parseInt(e.target.value);
                    setSelectedYear(newYear);
                    setCoverPageData(prev => ({ ...prev, year: newYear }));
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black bg-white"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 flex-1 md:flex-initial px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors print:hidden"
                >
                  <Printer size={18} />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div id="print-area" className="print:p-0">
              {/* Cover Page - Only Shows on Print */}
              <div className="hidden print:flex flex-col items-center justify-center h-screen print:page-break-after print:pb-12">
                <div className="text-center px-4">
                  {/* Organization Logo/Icon */}
                  <div className="text-6xl mb-8">📋</div>

                  {/* Organization Name */}
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{coverPageData.organizationName}</h1>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-blue-900 mb-6">{coverPageData.title}</h2>

                  {/* Member Info */}
                  <div className="mb-8 text-lg">
                    <p className="text-gray-700 mb-2">Member Name:</p>
                    <p className="text-xl font-semibold text-gray-900 border-b-2 border-gray-400 pb-2 min-w-64">
                      {cardholderName || '___________________________'}
                    </p>
                  </div>

                  {/* Year */}
                  <p className="text-lg text-gray-600 mb-8">Year: <span className="font-bold text-gray-900">{selectedYear}</span></p>

                  {/* Subtitle */}
                  <p className="text-lg text-gray-700 mb-16 italic">{coverPageData.subtitle}</p>

                  {/* Footer */}
                  {coverPageData.footerText && (
                    <div className="mt-16 pt-8 border-t-2 border-gray-400">
                      <p className="text-sm text-gray-600">{coverPageData.footerText}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Table Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center print:text-lg print:mb-2 print:page-break-before">
                Monthly Dues Card - {selectedYear}
              </h2>

              {/* Cardholder Name Section */}
              <div className="mb-6 flex items-center gap-4 print:mb-2 print:gap-2">
                <label className="font-semibold text-gray-700 text-sm md:text-base whitespace-nowrap print:text-xs print:font-bold">
                  Cardholder Name:
                </label>
                <div className="flex-1 border-b-2 border-gray-400 print:border-b print:border-black">
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="Enter name to print on card"
                    className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white text-black text-sm md:text-base print:focus:ring-0 print:bg-transparent print:text-xs print:p-0 print:border-0 print:placeholder-transparent"
                  />
                </div>
              </div>

              {/* Cover Page Customization Section */}
              <div className="mb-8 bg-blue-50 p-4 md:p-6 rounded-lg border-2 border-blue-200 print:hidden">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📄</span>
                  Customize Cover Page
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={coverPageData.title}
                      onChange={(e) => setCoverPageData({ ...coverPageData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                    <input
                      type="text"
                      value={coverPageData.organizationName}
                      onChange={(e) => setCoverPageData({ ...coverPageData, organizationName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={coverPageData.subtitle}
                      onChange={(e) => setCoverPageData({ ...coverPageData, subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
                    <input
                      type="text"
                      value={coverPageData.footerText}
                      onChange={(e) => setCoverPageData({ ...coverPageData, footerText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black"
                      placeholder="e.g., Please keep this card safe"
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white rounded border border-blue-300">
                  <p className="text-xs text-gray-600">
                    <strong>Preview:</strong> Above text will appear on the cover page when you print the card.
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="overflow-x-auto print:overflow-visible print:flex print:justify-center">
                  <table className="w-full border-collapse text-xs print:text-[10px] print:w-auto">
                    {/* Header Row - Days 1-31 */}
                    <thead>
                      <tr>
                        <th className="border-2 border-gray-400 bg-blue-900 text-white p-2 font-bold w-20 print:p-1 print:text-[9px]">Month</th>
                        {Array.from({ length: 31 }, (_, i) => (
                          <th
                            key={i + 1}
                            className="border-2 border-gray-400 bg-blue-900 text-white p-1 font-bold text-center w-12 print:p-0.5 print:text-[8px]"
                          >
                            {i + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    {/* Month Rows */}
                    <tbody>
                      {monthNames.map((monthName, monthIndex) => {
                        const month = monthIndex + 1;

                        return (
                          <tr key={month}>
                            {/* Month Name */}
                            <td className="border-2 border-gray-400 bg-gray-100 p-2 font-bold text-gray-900 w-20 print:bg-white print:p-1 print:text-[9px]">
                              {monthName}
                            </td>

                            {/* Days 1-31 - All Blank */}
                            {Array.from({ length: 31 }, (_, dayIndex) => {
                              const day = dayIndex + 1;

                              return (
                                <td
                                  key={day}
                                  className="border-2 border-gray-400 p-1 h-12 align-top bg-white w-12 print:h-6 print:p-0.5"
                                ></td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Due Modal - Hidden for Print */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:hidden">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingIndex !== null ? 'Edit Due' : 'Add New Due'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {monthNames[selectedMonth - 1]} <strong>{selectedDay}</strong>, {selectedYear}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black"
                  placeholder="Enter due title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black"
                  placeholder="Enter due description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black"
                    placeholder="e.g., Meeting"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDue}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? 'Saving...' : editingIndex !== null ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media print {
          @page {
            size: landscape;
            margin: 0.25in;
          }

          @page :first {
            size: portrait;
            margin: 0.5in;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
          }

          .print\\:hidden {
            display: none !important;
          }

          .hidden.print\\:flex {
            display: flex !important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            min-height: 100vh;
            page-break-after: always;
          }

          .print\\:ml-0 {
            margin-left: 0 !important;
          }

          .print\\:mb-2 {
            margin-bottom: 0.5rem !important;
          }

          .print\\:gap-2 {
            gap: 0.5rem !important;
          }

          .print\\:p-0 {
            padding: 0 !important;
          }

          .print\\:p-2 {
            padding: 0.5rem !important;
          }

          .print\\:bg-white {
            background-color: white !important;
          }

          .print\\:text-xs {
            font-size: 0.75rem !important;
          }

          .print\\:text-\\[10px\\] {
            font-size: 10px !important;
          }

          .print\\:text-\\[9px\\] {
            font-size: 9px !important;
          }

          .print\\:text-\\[8px\\] {
            font-size: 8px !important;
          }

          .print\\:text-lg {
            font-size: 1.125rem !important;
          }

          .print\\:font-bold {
            font-weight: 700 !important;
          }

          .print\\:rounded-none {
            border-radius: 0 !important;
          }

          .print\\:shadow-none {
            box-shadow: none !important;
          }

          .print\\:overflow-visible {
            overflow: visible !important;
          }

          .print\\:h-6 {
            height: 1.5rem !important;
          }

          .print\\:p-1 {
            padding: 0.25rem !important;
          }

          .print\\:p-0\\.5 {
            padding: 0.125rem !important;
          }

          .print\\:focus\\:ring-0:focus {
            box-shadow: none !important;
          }

          .print\\:bg-transparent {
            background-color: transparent !important;
          }

          .print\\:border-0 {
            border: 0 !important;
          }

          .print\\:placeholder-transparent::placeholder {
            color: transparent !important;
          }

          .print\\:border-b {
            border-bottom: 1px solid !important;
          }

          .print\\:border-black {
            border-color: black !important;
          }

          .print\\:page-break-after {
            page-break-after: always !important;
          }

          .print\\:page-break-before {
            page-break-before: always !important;
          }

          .print\\:pb-12 {
            padding-bottom: 3rem !important;
          }

          .print\\:table-container {
            display: flex;
            justify-content: center;
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
          }

          .print\\:flex {
            display: flex !important;
          }

          .print\\:justify-center {
            justify-content: center !important;
          }

          .print\\:w-auto {
            width: auto !important;
          }

          table {
            width: auto;
            border-collapse: collapse;
            margin: 0 auto !important;
            page-break-inside: avoid;
            page-break-after: auto;
          }

          th,
          td {
            border: 1px solid black;
            padding: 2px 3px;
          }

          th {
            background-color: #003d99;
            color: white;
            font-weight: bold;
          }

          tr {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
