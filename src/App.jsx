import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

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

// --- FITELITE ELITE LOADER ---
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
    
    {/* Subtle Background */}
    <div className="absolute inset-0 z-0">
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
    </div>

    {/* Main Content */}
    <div className="relative z-10 flex flex-col items-center px-4">
      
      {/* Simple Icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none"
            className="w-20 h-20 text-red-500"
          >
            <rect x="2" y="8" width="3" height="8" fill="currentColor" className="animate-lift-left" />
            <rect x="5" y="7" width="1.5" height="10" fill="currentColor" opacity="0.7" />
            <rect x="6.5" y="11" width="11" height="2" fill="currentColor" />
            <rect x="17.5" y="7" width="1.5" height="10" fill="currentColor" opacity="0.7" />
            <rect x="19" y="8" width="3" height="8" fill="currentColor" className="animate-lift-right" />
          </svg>
        </div>
      </div>

      {/* FITELITE Branding */}
      <div className="mb-6">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight flex items-center gap-3">
          <span className="text-white">FIT</span>
          <span className="text-red-500">ELITE</span>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </h1>
      </div>

      {/* Simple Loading Text */}
      <p className="text-slate-400 text-sm tracking-widest uppercase mb-6">
        Loading...
      </p>

      {/* Simple Progress Bar */}
      <div className="w-64 relative">
        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-red-500 animate-progress-simple"></div>
        </div>
      </div>
    </div>

    {/* Simple Animations */}
    <style>{`
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
      
      @keyframes progress-simple {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .animate-progress-simple {
        animation: progress-simple 1.5s ease-in-out infinite;
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