"use client"

import { useState, useEffect } from 'react';

const CustomSection = ({ sectionId, sectionLabel, sectionIcon }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customContent, setCustomContent] = useState([]);

  useEffect(() => {
    fetchContent();
  }, [sectionId]);

  const fetchContent = async () => {
    try {
      // First try to load from API (for default sections)
      const isDefaultSection = ['health', 'agriculture', 'marketing'].includes(sectionId);
      
      if (isDefaultSection) {
        const response = await fetch(`/api/content/${sectionId}`);
        const data = await response.json();
        if (data.success && data.data) {
          setContent(data.data);
        }
      } else {
        // For custom sections, load from localStorage
        const saved = localStorage.getItem('customTabContent');
        if (saved) {
          const tabContent = JSON.parse(saved);
          setCustomContent(tabContent[sectionId] || []);
        }
      }
    } catch (error) {
      console.error(`Failed to fetch ${sectionId} content:`, error);
    } finally {
      setLoading(false);
    }
  };

  const features = content?.sections && content.sections.length > 0
    ? content.sections
    : customContent;

  if (features.length === 0 && loading === false) {
    return null;
  }

  return (
    <div name={sectionId} className="w-full min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-screen-lg p-4 mx-auto flex flex-col justify-center w-full h-full">
        {/* Header */}
        <div className="pb-12">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{sectionIcon}</span>
            <h2 className="text-4xl font-bold inline border-b-4 border-blue-500 text-gray-900 pb-2">
              {content?.title || sectionLabel}
            </h2>
          </div>
          <p className="text-gray-600 text-lg mt-4">
            {content?.subtitle || `Explore our ${sectionLabel.toLowerCase()} offerings`}
          </p>
        </div>

        {/* Features Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : features.length > 0 ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Icon/Emoji */}
                <div className="mb-4 text-4xl">
                  {item.icon || sectionIcon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No content available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSection;
