"use client"

import { Mail, Phone, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const Footer = () => {
  const router = useRouter();
  const [settings, setSettings] = useState({
    siteName: 'ATAMA',
    footerDescription: 'Building sustainable futures through strategic investments in healthcare, agriculture, and market solutions.',
    footerEmail: 'info@atama.com',
    footerPhone: '+234 XXX XXX XXXX',
    footerLocation: 'Nigeria',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        if (data.success && data.settings) {
          setSettings({
            siteName: data.settings.siteName || 'ATAMA',
            footerDescription: data.settings.footerDescription || settings.footerDescription,
            footerEmail: data.settings.footerEmail || 'info@atama.com',
            footerPhone: data.settings.footerPhone || '+234 XXX XXX XXXX',
            footerLocation: data.settings.footerLocation || 'Nigeria',
          });
        }
      } catch (error) {
        console.log('Using default footer settings');
      }
    };
    
    loadSettings();
  }, []);

  const currentYear = new Date().getFullYear();

  const links = [
    { title: "About", href: "#" },
    { title: "Services", href: "#" },
    { title: "Partners", href: "#" },
    { title: "Contact", href: "#" },
  ];

  const socialLinks = [
    { href: "#", label: "Facebook" },
    { href: "#", label: "Twitter" },
    { href: "#", label: "Instagram" },
    { href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="w-full bg-gradient-to-b from-gray-900 to-black text-white py-12">
      <div className="max-w-screen-lg mx-auto px-4">
        {/* Top Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">{settings.siteName}</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {settings.footerDescription}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Mail size={16} />
                <span>{settings.footerEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Phone size={16} />
                <span>{settings.footerPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <MapPin size={16} />
                <span>{settings.footerLocation}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4">Services</h4>
            <ul className="space-y-2">
              {["Healthcare", "Agriculture", "Marketing", "Admin Portal"].map((service, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {currentYear} Atama Investment Multipurpose Company. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="text-gray-400 hover:text-blue-400 transition-colors text-sm font-medium"
              >
                {social.label}
              </a>
            ))}
          </div>

          {/* Admin Link */}
          <button
            onClick={() => router.push('/admin/login')}
            className="text-gray-400 hover:text-blue-400 transition-colors text-sm font-medium"
          >
            Admin
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
