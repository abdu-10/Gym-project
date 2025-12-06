import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

// --- COMPONENT IMPORTS ---
import Home from './Home.jsx'; 
import InstallPrompt from './components/InstallPrompt.jsx';
import Login from './components/Login.jsx'; 
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';

// --- LAZY LOADS ---
const AdminDashboard = lazy(() => import('./components/AdminDashboard.jsx'));
const MemberDashboard = lazy(() => import('./components/MemberDashboard.jsx'));
const StaffScanner = lazy(() => import('./components/StaffScanner.jsx'));

// --- PAYMENT PROVIDERS ---
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// --- ELITE GYM LOADER ---
const LoadingFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
    
    {/* Animated Grid Background */}
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-scroll 20s linear infinite'
        }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.3
            }}
          />
        ))}
      </div>
    </div>

    {/* Main Content */}
    <div className="relative z-10 flex flex-col items-center px-4">
      
      {/* Hexagonal Container with Glow */}
      <div className="relative mb-8">
        {/* Outer Rotating Hexagon */}
        <div className="absolute inset-0 -m-4">
          <svg className="w-40 h-40 animate-spin-slow" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#dc2626" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <polygon 
              points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" 
              fill="none" 
              stroke="url(#hexGrad)" 
              strokeWidth="1"
              className="animate-pulse"
            />
          </svg>
        </div>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-red-600 blur-3xl opacity-30 animate-pulse"></div>
        
        {/* Central Icon - Barbell */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none"
            className="w-20 h-20 text-red-600 drop-shadow-2xl"
          >
            {/* Left Weight */}
            <rect x="2" y="8" width="3" height="8" fill="currentColor" className="animate-lift-left" />
            <rect x="5" y="7" width="1.5" height="10" fill="currentColor" opacity="0.8" />
            
            {/* Bar */}
            <rect x="6.5" y="11" width="11" height="2" fill="currentColor" className="animate-bar-pulse" />
            
            {/* Right Weight */}
            <rect x="17.5" y="7" width="1.5" height="10" fill="currentColor" opacity="0.8" />
            <rect x="19" y="8" width="3" height="8" fill="currentColor" className="animate-lift-right" />
          </svg>
        </div>
      </div>

      {/* Title with Glitch Effect */}
      <div className="relative mb-6">
        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-1 relative">
          <span className="relative inline-block">
            <span className="absolute top-0 left-0 text-red-600 opacity-70 animate-glitch-1">ELITE</span>
            <span className="absolute top-0 left-0 text-cyan-400 opacity-70 animate-glitch-2">ELITE</span>
            <span className="relative z-10">ELITE</span>
          </span>
          {' '}
          <span className="text-red-600 animate-pulse">FITNESS</span>
        </h2>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-600 to-transparent animate-shimmer"></div>
      </div>

      {/* Loading Text */}
      <p className="text-gray-400 text-sm tracking-[0.3em] mb-6 animate-pulse">
        PREPARING YOUR WORKOUT
      </p>

      {/* Advanced Progress Bar */}
      <div className="w-64 md:w-80 relative">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-progress"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
        </div>
        
        {/* Stats */}
        <div className="flex justify-between mt-3 text-xs text-gray-500">
          <span className="animate-pulse">LOADING</span>
          <span className="text-red-600 font-mono animate-pulse">● LIVE</span>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="mt-8 flex gap-1">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="w-2 h-2 bg-red-600 rounded-full"
            style={{
              animation: `bounce-dot 1.4s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>

    {/* Elite Animations */}
    <style>{`
      @keyframes grid-scroll {
        0% { transform: translateY(0); }
        100% { transform: translateY(50px); }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); }
        50% { transform: translateY(-20px) translateX(10px); }
      }
      
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-spin-slow {
        animation: spin-slow 8s linear infinite;
      }
      
      @keyframes lift-left {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      .animate-lift-left {
        animation: lift-left 1.5s ease-in-out infinite;
      }
      
      @keyframes lift-right {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      .animate-lift-right {
        animation: lift-right 1.5s ease-in-out infinite;
        animation-delay: 0.75s;
      }
      
      @keyframes bar-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      .animate-bar-pulse {
        animation: bar-pulse 1.5s ease-in-out infinite;
      }
      
      @keyframes glitch-1 {
        0%, 100% { transform: translate(0, 0); }
        33% { transform: translate(-2px, 2px); }
        66% { transform: translate(2px, -2px); }
      }
      .animate-glitch-1 {
        animation: glitch-1 0.3s ease-in-out infinite;
      }
      
      @keyframes glitch-2 {
        0%, 100% { transform: translate(0, 0); }
        33% { transform: translate(2px, -2px); }
        66% { transform: translate(-2px, 2px); }
      }
      .animate-glitch-2 {
        animation: glitch-2 0.3s ease-in-out infinite;
        animation-delay: 0.15s;
      }
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .animate-shimmer {
        animation: shimmer 2s ease-in-out infinite;
      }
      
      @keyframes progress {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .animate-progress {
        animation: progress 1.5s ease-in-out infinite;
      }
      
      @keyframes bounce-dot {
        0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
        40% { transform: scale(1); opacity: 1; }
      }
    `}</style>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function MainApp() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const location = useLocation();
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch('http://localhost:3000/me', { credentials: 'include' })
      .then(r => {
        if (r.ok) return r.json();
        throw new Error('Not logged in');
      })
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, []);

  const handleLogout = () => {
    fetch('http://localhost:3000/logout', { method: 'DELETE', credentials: 'include' })
      .then(() => {
        setUser(null);
        window.location.href = '/';
      });
  };

  if (loadingUser) return <LoadingFallback />;

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <InstallPrompt />
      
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          
          <Route path="/" element={<Home user={user} onLogout={handleLogout} onLogin={setUser} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route path="/login" element={
            user ? <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} /> : 
            <Login onLogin={(u) => { setUser(u); }} onClose={() => window.location.href='/'} />
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute user={user} allowedRoles={['admin']}>
              <AdminDashboard 
                user={user} 
                onLogout={handleLogout} 
                onOpenScanner={() => navigate('/admin/scanner')} 
              />
            </ProtectedRoute>
          } />

          <Route path="/admin/scanner" element={
            <ProtectedRoute user={user} allowedRoles={['admin']}>
              <StaffScanner onGoHome={() => navigate('/admin')} />
            </ProtectedRoute>
          } />

          {/* Member Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute user={user} allowedRoles={['member', 'admin']}>
              <MemberDashboard 
                user={user} 
                onLogout={handleLogout} 
                onGoHome={() => navigate('/')} 
              />
            </ProtectedRoute>
          } />

          <Route path="/staff-scanner" element={
            <StaffScanner onGoHome={() => navigate('/')} />
          } />

        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <Router>
      <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
        <Elements stripe={stripePromise}>
          <MainApp />
        </Elements>
      </PayPalScriptProvider>
    </Router>
  );
}

export default App;