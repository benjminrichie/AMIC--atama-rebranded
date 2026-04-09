"use client"

import { Shirt, Music, Share2, Zap, Truck, Award } from 'lucide-react';
import { useState, useEffect } from 'react';

const Marketing = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultServices = [
    {
      icon: Shirt,
      title: "Fashion",
      description: "Contemporary fashion brands and innovative retail solutions",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: Music,
      title: "Music",
      description: "Music production, distribution and cultural promotion",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Share2,
      title: "Digital Marketing",
      description: "Strategic online marketing and social media management",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Truck,
      title: "Distribution",
      description: "Nationwide logistics and efficient supply chain networks",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: Award,
      title: "Brand Development",
      description: "Creating and scaling sustainable, impactful brands",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Zap,
      title: "Market Innovation",
      description: "Cutting-edge solutions for modern market challenges",
      color: "from-red-500 to-pink-600"
    }
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content/marketing');
      const data = await response.json();
      if (data.success && data.data) {
        setContent(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch marketing content:', error);
    } finally {
      setLoading(false);
    }
  };

  const services = content?.sections && content.sections.length > 0 
    ? content.sections.map((section, index) => ({
        ...defaultServices[index],
        title: section.title || defaultServices[index].title,
        description: section.description || defaultServices[index].description,
      }))
    : defaultServices;

  return (
    <div name="marketing" className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="max-w-screen-lg p-4 mx-auto flex flex-col justify-center w-full h-full">
        {/* Header */}
        <div className="pb-12">
          <h2 className="text-4xl font-bold inline border-b-4 border-blue-600 text-gray-900 pb-2">
            {content?.title || "Marketing & Distribution"}
          </h2>
          <p className="text-gray-600 text-lg mt-4">
            {content?.subtitle || "Comprehensive solutions for market growth and brand excellence"}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map(({ icon: Icon, title, description, color }, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Top gradient bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${color}`}></div>

              {/* Content */}
              <div className="p-8">
                <div className={`mb-4 inline-p-3 rounded-lg bg-gradient-to-br ${color}`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Hover effect bottom line */}
              <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${color} transition-all duration-300`}></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Scale Your Business?</h3>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Partner with us for comprehensive marketing solutions and distribution excellence
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors duration-300">
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default Marketing;