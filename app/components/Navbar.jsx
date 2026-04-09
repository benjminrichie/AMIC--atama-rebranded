"use client"

import { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'ATAMA',
    navbarSubtitle: 'Investment Group',
  });
  const router = useRouter();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        if (data.success && data.settings) {
          setSettings({
            siteName: data.settings.siteName || 'ATAMA',
            navbarSubtitle: data.settings.navbarSubtitle || 'Investment Group',
          });
        }
      } catch (error) {
        console.log('Using default navbar settings');
      }
    };
    
    loadSettings();
  }, []);

  const links = [
    { id: 1, link: 'home', label: 'Home' },
    { id: 2, link: 'health', label: 'Health' },
    { id: 3, link: 'agriculture', label: 'Agriculture' },
    { id: 4, link: 'marketing', label: 'Marketing' },
  ];

  return (
    <nav className="flex justify-between items-center w-full h-20 px-4 md:px-8 text-black shadow-lg fixed z-50 bg-white">
      <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
        <h1 className="text-3xl font-bold text-black tracking-wider">{settings.siteName}</h1>
        <span className="ml-2 text-sm font-light text-gray-600">{settings.navbarSubtitle}</span>
      </div>

      <ul className="hidden md:flex items-center gap-8">
        {links.map(({ id, link, label }) => (
          <li key={id} className="relative cursor-pointer capitalize font-medium group">
            <Link to={link} smooth duration={500} className="text-black transition-colors duration-300 group-hover:text-blue-600">
              {label}
            </Link>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 group-hover:w-full transition-all duration-300"></span>
          </li>
        ))}
        <li>
          <button
            onClick={() => router.push('/admin/login')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors duration-300"
          >
            Admin
          </button>
        </li>
      </ul>

      <div onClick={() => setNav(!nav)} className="cursor-pointer pr-4 z-10 md:hidden">
        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>

      {nav && (
        <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-blue-900 to-blue-800">
          {links.map(({ id, link, label }) => (
            <li key={id} className="px-4 cursor-pointer capitalize py-6 text-2xl font-medium text-white">
              <Link onClick={() => setNav(!nav)} to={link} smooth duration={500}>{label}</Link>
            </li>
          ))}
          <li className="py-6">
            <button
              onClick={() => {
                setNav(false);
                router.push('/admin/login');
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-lg transition-colors duration-300"
            >
              Admin
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;