import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONS (Matching your system style) ---
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');

    fetch('http://localhost:3000/password_resets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then((r) => r.json())
      .then((data) => {
        // Aesthetic delay so users see the loading state
        setTimeout(() => {
            setStatus('success');
            setMessage(data.message);
        }, 1000);
      })
      .catch(() => {
        setStatus('error');
        setMessage("Unable to connect. Please check your internet.");
      });
  };

  return (
    // Background image with a dark overlay for a "gymmy" feel
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-900">
      
      {/* --- Gym Background Image with Overlay --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Gym Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* --- Ambient Background Elements (Subtle Brand Touches) --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-gray-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* --- BRAND HEADER --- */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block group">
            <span className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              FIT<span className="text-red-600 group-hover:text-red-500 transition-colors">ELITE</span>
            </span>
          </Link>
          <h2 className="mt-4 text-lg font-medium text-gray-300 drop-shadow">Account Recovery</h2>
        </div>

        {/* --- MAIN CARD --- */}
        <div className="bg-zinc-900/80 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/50 border border-white/10 overflow-hidden">
          <div className="p-8 sm:p-10">
            
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                // SUCCESS STATE
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-900/30 border border-green-500/30 mb-6">
                    <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
                  <p className="text-sm text-gray-400 mb-8">{message}</p>
                  
                  <Link 
                    to="/login"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                  >
                    Return to Login
                  </Link>
                </motion.div>
              ) : (
                // FORM STATE
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-400">
                      Enter the email address associated with your membership, and we'll send you a secure link to reset your password.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 ml-1">
                      Email Address
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <MailIcon />
                      </div>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all sm:text-sm"
                        placeholder="member@example.com"
                      />
                    </div>
                  </div>

                  {status === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="rounded-lg bg-red-900/20 p-4 border border-red-500/30"
                    >
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-red-300">{message}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Link...
                      </div>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* --- FOOTER LINK --- */}
          <div className="bg-zinc-900/50 px-8 py-4 border-t border-white/5">
            <div className="flex justify-center">
              <Link 
                to="/login" 
                className="flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors group"
              >
                <span className="mr-2 group-hover:-translate-x-1 transition-transform duration-200">
                  <ArrowLeftIcon />
                </span>
                Back to Login
              </Link>
            </div>
          </div>
        </div>
        
        {/* Simple Footer */}
        <p className="mt-8 text-center text-xs text-gray-500 drop-shadow">
          &copy; {new Date().getFullYear()} FitElite. Secure System.
        </p>

      </motion.div>
    </div>
  );
}

export default ForgotPassword;