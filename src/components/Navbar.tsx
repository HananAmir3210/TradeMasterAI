
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '#features', label: 'Features' },
    { href: '#demo', label: 'Demo' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect">
<<<<<<< HEAD
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-semibold text-white tracking-tight">TradeMaster AI</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
=======
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-lg sm:text-xl font-semibold text-white tracking-tight">TradeMaster AI</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-6 xl:ml-10 flex items-center space-x-4 xl:space-x-8">
>>>>>>> 74acc0a (Initial commit of my project)
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
<<<<<<< HEAD
                  className="text-white/60 hover:text-white transition-colors duration-300 text-sm font-normal"
=======
                  className="text-white/60 hover:text-white transition-colors duration-300 text-sm font-normal px-2 py-1 rounded-md hover:bg-white/10"
>>>>>>> 74acc0a (Initial commit of my project)
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* CTA Button */}
<<<<<<< HEAD
          <div className="hidden md:block">
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="professional-button px-6 py-2 text-sm rounded-full"
=======
          <div className="hidden lg:block">
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="professional-button px-4 sm:px-6 py-2 text-sm rounded-full"
>>>>>>> 74acc0a (Initial commit of my project)
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
<<<<<<< HEAD
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white/60 hover:text-white transition-colors duration-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
=======
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white/60 hover:text-white transition-colors duration-300 p-2 rounded-md hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
>>>>>>> 74acc0a (Initial commit of my project)
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
<<<<<<< HEAD
          <div className="md:hidden">
            <div className="px-6 pt-4 pb-6 space-y-3 glass-effect rounded-xl mt-4">
=======
          <div className="lg:hidden">
            <div className="px-4 sm:px-6 pt-4 pb-6 space-y-2 glass-effect rounded-xl mt-4 mx-4">
>>>>>>> 74acc0a (Initial commit of my project)
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
<<<<<<< HEAD
                  className="text-white/60 hover:text-white block px-4 py-3 text-base font-normal transition-colors duration-300"
=======
                  className="text-white/60 hover:text-white block px-4 py-3 text-base font-normal transition-colors duration-300 rounded-md hover:bg-white/10"
>>>>>>> 74acc0a (Initial commit of my project)
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4">
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
<<<<<<< HEAD
                  className="w-full professional-button py-3 rounded-full"
=======
                  className="w-full professional-button py-3 rounded-full text-sm"
>>>>>>> 74acc0a (Initial commit of my project)
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
