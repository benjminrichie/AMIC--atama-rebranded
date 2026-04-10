"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Health from "./components/Health";
import Agriculture from "./components/Agriculture";
import Marketing from "./components/Marketing";
import CustomSection from "./components/CustomSection";
import Footer from "./components/Footer";

export default function Home() {
  const [customSections, setCustomSections] = useState([]);

  useEffect(() => {
    // Load custom sections from localStorage
    const saved = localStorage.getItem('customSections');
    if (saved) {
      setCustomSections(JSON.parse(saved));
    }

    // Listen for storage changes (when custom sections are added from admin panel)
    const handleStorageChange = () => {
      const updated = localStorage.getItem('customSections');
      if (updated) {
        setCustomSections(JSON.parse(updated));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="w-full">
      <Navbar />
      <div className="pt- flex flex-col flex-1 items-center justify-center bg-white font-sans">
        <Hero />
        <Health />
        <Agriculture />
        <Marketing />
        
        {/* Custom Sections */}
        {customSections.map((section) => (
          <CustomSection
            key={section.id}
            sectionId={section.id}
            sectionLabel={section.label}
            sectionIcon={section.icon}
          />
        ))}
        
        <Footer />
      </div>
    </div>
  );
}
