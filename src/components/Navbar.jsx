import React, { useEffect, useState } from "react";

// Simple Icons for the Navbar
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);

function Navbar({ activeSection, setActiveSection, user, onLoginClick, onLogout, onDashboardClick }) {
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
          <div className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => {
              return (
                <a
                  href={link.href}
                  key={link.id}
                  onClick={()=> setActiveSection(link.id)}
                  className={`px-3 py-2 mx-1 text-sm font-medium transition-all duration-300 relative group ${activeSection === link.id ? scrolled ? "text-red-600": "text-white" : scrolled ? "text-gray-700 hover:text-red-600" : "text-gray-200 hover:text-white"}`}
                >
                  {link.name}
                  <span className={`absolute left-0 -bottom-0 w-full h-0.5 bg-red-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-all duration-300 ${activeSection === link.id ? "scale-x-100": ""}`}></span>
                </a>
              )
            })}
                
            {/* --- DESKTOP USER SECTION --- */}
            {user ? (
              <div className="flex items-center ml-4 gap-3 pl-4 border-l border-gray-300/30">
                 {/* Dashboard Button (Pill Style) */}
                 <button 
                  onClick={onDashboardClick} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-xs uppercase tracking-wider transition-all transform hover:-translate-y-0.5 ${scrolled ? "bg-gray-100 text-gray-900 hover:bg-gray-200" : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"}`}
                 >
                    <DashboardIcon />
                    Dashboard
                 </button>
                 
                 {/* Logout Button */}
                 <button
                   onClick={onLogout}
                   className={`px-4 py-2 rounded-full font-medium text-xs uppercase tracking-wider transition-all duration-300 border-2 ${scrolled ? "border-red-600 text-red-600 hover:bg-red-600 hover:text-white" : "border-white text-white hover:bg-white hover:text-red-600"}`}
                 >
                   Logout
                 </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className={
                  `ml-3 px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 transform hover:translate-y-[-2px] ${scrolled ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg" : "bg-white text-red-600 hover:bg-gray-100"}`
                }
              >
                Login
              </button>
            )}

          </div>

          {/* Mobile menus toggle */}
          <div className="xl:hidden flex items-center">
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
                {isOpen ? (
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  ) : (
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                  )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU (FIXED) --- */}
      {/* Changed max-h-[600px] to max-h-[90vh] and added overflow-y-auto so you can scroll to see the logout button on small screens */}
      <div className={`xl:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[90vh] opacity-100 overflow-y-auto" : "max-h-0 opacity-0 overflow-hidden"} shadow-xl bg-white/95 backdrop-blur-md`}>
        {/* Added pb-10 to ensure the bottom button isn't cut off */}
        <div className="px-4 pt-2 pb-10 space-y-1 border-t border-gray-100">
          
          {navLinks.map((link) => (
            <a
              href={link.href}
              key={link.id}
              onClick={() => setIsOpen(false)} // Close menu on click
              className={
                "block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 text-gray-600 hover:text-red-600 hover:bg-gray-50"
              }
            >
              {link.name}
            </a>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-200">
            {/* --- MOBILE USER LOGIC --- */}
            {user ? (
                <div className="space-y-3">
                    {/* Mobile User Profile Header */}
                    <div className="flex items-center px-4 mb-4">
                        {/* Only try to charAt if name exists, just a safety check */}
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-lg mr-3">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Signed in as</p>
                            <p className="font-bold text-gray-900">{user.name}</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => { onDashboardClick(); setIsOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm bg-gray-900 text-white hover:bg-gray-800 transition-all"
                    >
                        <DashboardIcon />
                        GO TO DASHBOARD
                    </button>

                    <button 
                        onClick={() => { onLogout(); setIsOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm text-red-600 border border-red-200 hover:bg-red-50 transition-all"
                    >
                        <LogoutIcon />
                        Log Out
                    </button>
                </div>
            ) : (
                <button 
                    onClick={() => { onLoginClick(); setIsOpen(false); }}
                    className="w-full ml-0 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg"
                >
                    Login
                </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;