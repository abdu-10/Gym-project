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

// --- CUSTOM GYM LOADER ---
const LoadingFallback = () => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
    
    {/* 1. Blurry Gym Background */}
    <div 
      className="absolute inset-0 z-0 transform scale-110" 
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(12px) brightness(0.3)' 
      }}
    />

    {/* 2. Content */}
    <div className="relative z-10 flex flex-col items-center">
      {/* Animated Dumbbell Icon */}
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-20 h-20 text-red-600 animate-curl drop-shadow-2xl"
        >
          <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.035-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.035.84-1.875 1.875-1.875h.75c1.035 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.035.84-1.875 1.875-1.875h.75c1.035 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
        </svg>
      </div>

      {/* Loading Text */}
      <h2 className="text-3xl font-black italic text-white tracking-tighter mb-2">
        LOADING <span className="text-red-600">GAINS</span>
      </h2>
      
      {/* Progress Bar */}
      <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-red-600 animate-loading-bar"></div>
      </div>
    </div>

    {/* Custom Animations Styles */}
    <style>{`
      @keyframes curl {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(-10deg); }
      }
      .animate-curl {
        animation: curl 1.5s ease-in-out infinite;
      }
      @keyframes loading-bar {
        0% { width: 0%; }
        50% { width: 70%; }
        100% { width: 100%; }
      }
      .animate-loading-bar {
        animation: loading-bar 2s ease-in-out infinite;
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