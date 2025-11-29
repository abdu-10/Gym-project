import React, { useEffect, useState } from 'react'; 
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import Classes from './components/Classes';
import Pricing from './components/Pricing';
import Trainers from './components/Trainers';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Checkout from './components/Checkout';
import Login from './components/Login'; 
import MemberDashboard from './components/MemberDashboard';
import StaffScanner from './components/StaffScanner';
import InstallPrompt from './components/InstallPrompt';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const STRIPE_PUBLISHABLE_KEY = "pk_test_51SToBtAWbNWeBtveVOfzLPPnsKwEjU5ydkF0a2hp5tB4xJdGqiC3WZICbuIzMKtbCxEnlDjkU5MI3Lc0XY5HHObD00hREI3a2i";
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// PayPal Client ID - Replace with your actual PayPal sandbox/production client ID
const PAYPAL_CLIENT_ID = "AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R";

const SECTIONS = ["home", "features", "about", "classes", "pricing", "trainers", "testimonials", "contact"];

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewScanner, setViewScanner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewDashboard, setViewDashboard] = useState(false);
  const [user, setUser] = useState(null); 

  // --- NEW: Centralized Logout Function ---
  // We need this because Admins log out from the Scanner, Members from Navbar
  const handleLogout = () => {
    fetch('http://localhost:3000/logout', { method: 'DELETE', credentials: 'include' })
      .then(() => {
        setUser(null);
        setViewDashboard(false);
        setViewScanner(false);
        setSelectedPlan(null);
      });
  };

  useEffect(() => {
    fetch('http://localhost:3000/me', { 
      credentials: 'include' 
    })
    .then(r => {
      if (r.ok) return r.json();
      throw new Error('Not logged in');
    })
    .then(data => {
      setUser(data.user);
    })
    .catch(() => {
      setUser(null); 
    });
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
    // If it's a member, show dashboard. If Admin, the check below handles it.
    setViewDashboard(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll(".reveal");
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const revealTop = reveals[i].getBoundingClientRect().top;
        const revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
          reveals[i].classList.add("active");
        } else {
          reveals[i].classList.remove("active");
        }
      }

      const ScrollPosition = window.scrollY;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const section = document.getElementById(SECTIONS[i]);
        if (section && ScrollPosition >= section.offsetTop - 100) {
          setActiveSection(SECTIONS[i]);
          break;
        }
      }
    };

    if (!selectedPlan) {
      window.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [selectedPlan]); 
 
  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
    <Elements stripe={stripePromise}>
      <div className='min-h-screen flex flex-col bg-gray-50'>

        <InstallPrompt /> {/* PWA Install Prompt Component */}

        {showLogin && (
          <Login 
            onLogin={handleLogin} 
            onClose={() => setShowLogin(false)} 
          />
        )}

        {/* --- ROUTING LOGIC --- */}
        {/* PRIORITY 1: If Manual Scanner is ON -OR- User is ADMIN */}
        {viewScanner || (user && user.role === 'admin') ? (
          
          <StaffScanner onGoHome={() => {
             // Smart Exit: If Admin, Logout. If Manual View, just close.
             if (user && user.role === 'admin') {
                 handleLogout();
             } else {
                 setViewScanner(false);
             }
          }} />

        ) : (
          /* PRIORITY 2: If Dashboard is active & User is logged in -> SHOW DASHBOARD */
          viewDashboard && user ? (

            <MemberDashboard 
               user={user} 
               // Note: Members just close dashboard to see site, not logout
               onGoHome={() => setViewDashboard(false)} 
            />

          ) : !selectedPlan ? (

            // PRIORITY 3: If No Plan Selected -> SHOW HOME PAGE
            <>
              <Navbar 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                user={user}
                onLoginClick={() => setShowLogin(true)}
                onLogout={handleLogout} // Use the new function here
                onDashboardClick={() => setViewDashboard(true)}
              />
              <main>
                <Hero />
                <Features />
                <About />
                <Classes />
                <Pricing onSelectPlan={setSelectedPlan} />
                <Trainers />
                <Testimonials />
                <Contact />
              </main>
              <Footer onOpenScanner={() => setViewScanner(true)} />
              <ScrollToTop />
            </>

          ) : (

            // PRIORITY 4: If Plan Selected -> SHOW CHECKOUT
            <Checkout 
              plan={selectedPlan} 
              onGoBack={() => setSelectedPlan(null)} 
            />
            
          )
        )}
      </div>
    </Elements>
    </PayPalScriptProvider>
  );
}

export default App;
