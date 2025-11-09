import React, { useEffect } from "react";
import { useState } from "react";

function Navbar({ activeSection, setActiveSection }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }
useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "#home", id: "home" },
    { name: "Features", href: "#features", id: "features" },
    { name: "About", href: "#about", id: "about" },
    { name: "Classes", href: "#classes", id: "classes" },
    { name: "Pricing", href: "#pricing", id: "pricing" },
    { name: "Trainers", href: "#trainers", id: "trainers" },
    { name: "Testimonials", href: "#testimonials", id: "testimonials" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a 
                href="#home" 
                className={`flex items-center group hover:opacity-80 transition-opacity duration-300`}
              >
                <span className={`text-2xl font-extrabold ${scrolled ? "text-gray-900" : "text-white"}`}>
                  FIT<span className="text-red-500">ELITE</span>
                </span>
                <div className={`ml-2 w-2 h-2 rounded-full animate-pulse ${scrolled ? "bg-red-600" : "bg-white"}`}></div>
              </a>
            </div>
          </div>
          {/* Desktop menus */}
          <div className="hidden lg:flex items-center space-x-1">
           {navLinks.map((link) => {
              return (
                <a
                href={link.href}
                key={link.id}
                onClick={()=> setActiveSection(link.id)}
                className={`px-3 py-2 mx-1 text-sm font-medium transition-all duration-300 relative group ${activeSection === link.id ? scrolled ? "text-red-600": "text-white" : scrolled ? "text-gray-700 hover:text-red-600" : "text-gray-200 hover:text-white"

                 }`}
>
                  {link.name}
                  <span className={`absolute left-0 -bottom-0 w-full h-0.5 bg-red-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-all duration-300 ${activeSection === link.id ? "scale-x-100": ""}`}></span>
                </a>
              )
            })}
                
            <a
              href="#join"
              className={
                `ml-3 px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 transform hover:translate-y-[-2px] ${scrolled ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg" : "bg-white text-red-600 hover:bg-gray-100"}`
              }
            >
              Join Now
            </a>
          </div>
          {/* Mobile menus */}
          <div className="lg:hidden flex items-center">
            <button
              className={
                `p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 ${scrolled ? "text-gray-800" : "text-white"}`
              } onClick={toggleMenu}
            >
              <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {/* conditional rendering for open/close icon */}
                {isOpen ? (
                                <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M6 18L18 6M6 6l12 12'
                                />
                            ) : (
                                <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M4 6h16M4 12h16M4 18h16'
                                />
                            )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* mobile menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"} overflow-hidden`}>
        <div className="px-3 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md shadow-lg border-gray-100">
         {navLinks.map((link) => (
            <a
              href={link.href}
              key={link.id}
              className={
                "block px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-300"
              }
            >
              {link.name}
            </a>
         ))}
          <div className="pt-2 pb-1">
            <a
              href="#join"
              className={
                `ml-3 px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 transform hover:translate-y-[-2px] ${scrolled ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg" : "bg-white text-red-600 hover:bg-gray-100"}`
              }
            >
              Join Now
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
