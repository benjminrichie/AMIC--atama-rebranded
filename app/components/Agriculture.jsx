"use client"

import { Sprout, Droplets, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

const Agriculture = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultFeatures = [
    {
      icon: Sprout,
      title: "Crop Development",
      description: "Supporting sustainable farming practices and crop development programs",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Droplets,
      title: "Irrigation Systems",
      description: "Investing in modern irrigation technology for improved water management",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Zap,
      title: "Farm Innovation",
      description: "Empowering farmers with technology and knowledge for productivity",
      color: "from-yellow-500 to-orange-600"
    }
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content/agriculture');
      const data = await response.json();
      if (data.success && data.data) {
        setContent(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch agriculture content:', error);
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
    <div name="agriculture" className="w-full min-h-screen bg-white py-20">
      <div className="max-w-screen-lg p-4 mx-auto flex flex-col justify-center w-full h-full">
        {/* Header */}
        <div className="pb-12">
          <h2 className="text-4xl font-bold inline border-b-4 border-green-500 text-gray-900 pb-2">
            {content?.title || "Agricultural Development"}
          </h2>
          <p className="text-gray-600 text-lg mt-4">
            {content?.subtitle || "Strengthening agriculture and supporting food security"}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description, color }, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Icon */}
              <div className={`mb-4 inline-p-3 rounded-lg bg-gradient-to-br ${color}`}>
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
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

        {/* Stats Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {[
            { number: "500+", label: "Farmers Supported" },
            { number: "50,000", label: "Acres Developed" },
            { number: "40%", label: "Yield Increase" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agriculture;