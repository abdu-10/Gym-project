import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Added Import

// --- SVG Icons ---
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

function Login({ onLogin, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate login for now (replace with real fetch later)
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
    })
    .then(res => {
        if(!res.ok) throw new Error("Login failed");
        return res.json();
    })
    .then(data => {
        onLogin(data.user);
    })
    .catch(err => {
        setError(err.message);
    })
    .finally(() => {
        setIsLoading(false);
    });
  };

  return (
    // --- CHANGE HERE: The Glassmorphism Effect ---
    // 1. z-[100]: Keeps it on top of everything (including Navbar)
    // 2. backdrop-blur-md: This creates the cool blurry effect on the background
    // 3. bg-black/30: A light tint so the white modal pops, but you can still see through
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-md p-4 transition-all duration-300">
      
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fadeIn border border-gray-100">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100 p-1 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              FIT<span className="text-red-600">ELITE</span>
            </h2>
            <p className="text-sm text-gray-600 mt-2">Welcome back, member.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              
              {/* --- ADDED: Forgot Password Link --- */}
              <div className="flex justify-end mt-2">
                <Link 
                  to="/forgot-password" 
                  className="text-xs font-medium text-red-600 hover:text-red-500 hover:underline transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center border border-red-100">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Not a member yet?{' '}
            {/* Updated Link to close modal and go to pricing */}
            <a 
              href="#pricing" 
              onClick={onClose} 
              className="font-medium text-red-600 hover:text-red-500 hover:underline transition-colors"
            >
              View Plans
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;