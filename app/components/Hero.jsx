"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Building Sustainable Futures",
      subtitle: "Healthcare, Agriculture & Market Solutions",
      description: "Investing in tomorrow's prosperity through strategic development",
      image: "/health.jpeg",
      gradient: "from-blue-900 via-blue-800 to-blue-700"
    },
    {
      title: "Healthcare Excellence",
      subtitle: "Modern Medical Infrastructure",
      description: "Supporting communities with quality healthcare services",
      image: "/health2.jpeg",
      gradient: "from-red-600 via-red-700 to-red-800"
    },
    {
      title: "Agricultural Growth",
      subtitle: "Sustainable Food Production",
      description: "Empowering farmers and strengthening food security",
      image: "/agriculture.jpeg",
      gradient: "from-green-600 via-green-700 to-green-800"
    },
    {
      title: "Market Innovation",
      subtitle: "Strategic Marketing Solutions",
      description: "Creating effective networks and distribution channels",
      image: "/health.jpeg",
      gradient: "from-purple-600 via-purple-700 to-purple-800"
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div name="home" className="w-full h-screen relative overflow-hidden pt-20">
      {/* Slide Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}></div>

            {/* Image Overlay */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content */}
            <div className="relative flex flex-col justify-center items-center h-full text-center px-4 md:px-8">
              <div className="max-w-3xl animate-fade-in">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <TrendingUp className="text-yellow-300" size={24} />
                  <span className="text-yellow-300 font-semibold">Next Generation Investment</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                  {slide.title}
                </h1>

                <h2 className="text-2xl md:text-4xl text-blue-100 mb-6 drop-shadow-md">
                  {slide.subtitle}
                </h2>

                <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow-md">
                  {slide.description}
                </p>

                <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronRight size={28} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 w-3 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
        <div className="text-white/60 text-center">
          <p className="text-sm mb-2">Scroll to explore</p>
          <div className="flex justify-center">
            <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
