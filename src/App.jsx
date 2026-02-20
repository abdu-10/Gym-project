import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';

// --- COMPONENT IMPORTS ---
import Home from './Home.jsx'; 
import InstallPrompt from './components/InstallPrompt.jsx';
import Login from './components/Login.jsx'; 
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import animationData from './assets/animation.json';

// --- LAZY LOADS ---
const AdminDashboard = lazy(() => import('./components/AdminDashboard.jsx'));
const MemberDashboard = lazy(() => import('./components/MemberDashboard.jsx'));
const TrainerDashboard = lazy(() => import('./components/TrainerDashboard.jsx'));
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
      
      {/* Lottie Animation */}
      <div className="relative mb-8 w-32 h-32">
        <Lottie 
          animationData={animationData} 
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    fetch('http://localhost:3000/me', { 
      credentials: 'include',
      signal: controller.signal 
    })
      .then(r => {
        if (r.ok) return r.json();
        throw new Error('Not logged in');
      })
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => {
        clearTimeout(timeoutId);
        setLoadingUser(false);
      });
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
            user ? <Navigate to="/dashboard" /> : 
            <Login onLogin={(u) => { setUser(u); }} onClose={() => window.location.href='/'} />
          } />

          {/* Universal Dashboard Route - Shows different dashboard based on role */}
          <Route path="/dashboard" element={
            <ProtectedRoute user={user} allowedRoles={['admin', 'member', 'trainer']}>
              {user?.role === 'admin' ? (
                <AdminDashboard 
                  user={user} 
                  onLogout={handleLogout} 
                  onOpenScanner={() => navigate('/scanner')} 
                />
              ) : user?.role === 'trainer' ? (
                <TrainerDashboard 
                  user={user} 
                  onGoHome={() => navigate('/')} 
                />
              ) : (
                <MemberDashboard 
                  user={user} 
                  onLogout={handleLogout} 
                  onGoHome={() => navigate('/')} 
                />
              )}
            </ProtectedRoute>
          } />

          <Route path="/scanner" element={
            <ProtectedRoute user={user} allowedRoles={['admin']}>
              <StaffScanner onGoHome={() => navigate('/dashboard')} />
            </ProtectedRoute>
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