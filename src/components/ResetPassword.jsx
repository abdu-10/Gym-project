import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONS ---
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmation) {
      setError("Passwords do not match");
      return;
    }
    
    setStatus('loading');

    fetch('http://localhost:3000/password_resets/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password, password_confirmation: confirmation }),
    })
      .then(async (r) => {
        const data = await r.json();
        if (r.ok) {
          // Aesthetic delay
          setTimeout(() => {
            setStatus('success');
            setTimeout(() => navigate('/login'), 3000);
          }, 1500);
        } else {
          setStatus('error');
          setError(data.error || data.errors?.[0] || "Failed to reset password");
        }
      })
      .catch(() => {
        setStatus('error');
        setError("Network error. Please try again.");
      });
  };

  // Invalid Token State
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400 font-sans">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Invalid Link</h2>
          <p className="mb-6 text-sm">This password reset link is missing required information.</p>
          <Link to="/forgot-password" className="text-red-500 hover:text-red-400 font-bold text-sm uppercase tracking-wide">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-900 font-sans selection:bg-red-500/30">
      
      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1540496987146-17172dd92932?q=80&w=1470&auto=format&fit=crop" 
          alt="Gym Background" 
          className="w-full h-full object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80"></div>
      </div>

      {/* --- Ambient Glows --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* --- HEADER --- */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
            SECURE<span className="text-red-600">ACCESS</span>
          </h1>
          <h2 className="mt-2 text-sm font-medium text-gray-400 uppercase tracking-widest">Set New Credentials</h2>
        </div>

        {/* --- GLASS CARD --- */}
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          <div className="p-8">
            
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                // SUCCESS STATE
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4"
                >
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Password Updated</h3>
                  <p className="text-sm text-gray-400 mb-6">Your account is secure. Redirecting to login...</p>
                  
                  <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3 }}
                      className="h-full bg-green-500"
                    />
                  </div>
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
                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">New Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                        <LockIcon />
                      </div>
                      <input 
                        type="password" 
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-lg bg-zinc-800/50 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all sm:text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-red-500 transition-colors">
                        <LockIcon />
                      </div>
                      <input 
                        type="password" 
                        required
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-lg bg-zinc-800/50 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all sm:text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-red-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        UPDATING...
                      </span>
                    ) : 'RESET PASSWORD'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-500 font-mono">
          SECURE CONNECTION // ENCRYPTED
        </p>

      </motion.div>
    </div>
  );
}

export default ResetPassword;