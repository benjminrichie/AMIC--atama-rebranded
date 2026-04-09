"use client"

import { Heart, Pill, Hospital, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

const Health = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultFeatures = [
    {
      icon: Hospital,
      title: "Medical Facilities",
      description: "Investment in modern healthcare facilities and state-of-the-art equipment",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: Pill,
      title: "Healthcare Technology",
      description: "Supporting innovative healthcare tech solutions and digital transformation",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Heart,
      title: "Pharmaceutical",
      description: "Investment in pharmaceutical research and development initiatives",
      color: "from-purple-500 to-pink-600"
    }
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content/health');
      const data = await response.json();
      if (data.success && data.data) {
        setContent(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch health content:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = content?.sections && content.sections.length > 0 
    ? content.sections.map((section, index) => ({
        ...defaultFeatures[index],
        title: section.title || defaultFeatures[index].title,
        description: section.description || defaultFeatures[index].description,
      }))
    : defaultFeatures;

  return (
    <div name="health" className="w-full min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-screen-lg p-4 mx-auto flex flex-col justify-center w-full h-full">
        {/* Header */}
        <div className="pb-12">
          <h2 className="text-4xl font-bold inline border-b-4 border-red-500 text-gray-900 pb-2">
            {content?.title || "Healthcare Investment"}
          </h2>
          <p className="text-gray-600 text-lg mt-4">
            {content?.subtitle || "Building healthier communities through strategic medical investments"}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description, color }, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${color} rounded-xl transition-opacity duration-300`}></div>

              {/* Icon */}
              <div className={`mb-4 inline-p-3 rounded-lg bg-gradient-to-br ${color}`}>
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                {title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {description}
              </p>

              {/* Bottom accent */}
              <div className={`mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r ${color} transition-all duration-300`}></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between flex-col md:flex-row gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Growing Healthcare Impact</h3>
              <p className="text-red-100">Join us in revolutionizing healthcare delivery across regions</p>
            </div>
            <button className="px-8 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors duration-300 whitespace-nowrap">
              Get Involved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Health;