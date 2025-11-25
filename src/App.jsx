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

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const STRIPE_PUBLISHABLE_KEY = "pk_test_51SToBtAWbNWeBtveVOfzLPPnsKwEjU5ydkF0a2hp5tB4xJdGqiC3WZICbuIzMKtbCxEnlDjkU5MI3Lc0XY5HHObD00hREI3a2i";
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const SECTIONS = ["home", "features", "about", "classes", "pricing", "trainers", "testimonials", "contact"];

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewScanner, setViewScanner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewDashboard, setViewDashboard] = useState(false);
  const [user, setUser] = useState(null); 

  // --- NEW: Check Session Cookie on Load ---
  // This replaces the old localStorage check.
  // We ask the server "Who am I?" using the httpOnly cookie.
  useEffect(() => {
    fetch('http://localhost:3000/me', { 
      credentials: 'include' // <--- CRITICAL: Sends the cookie to the server
    })
    .then(r => {
      if (r.ok) return r.json();
      throw new Error('Not logged in');
    })
    .then(data => {
      setUser(data.user); // If the cookie is valid, log them in!
    })
    .catch(() => {
      setUser(null); // If no cookie or invalid, stay logged out
    });
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
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
    <Elements stripe={stripePromise}>
      <div className='min-h-screen flex flex-col bg-gray-50'>

        {showLogin && (
          <Login 
            onLogin={handleLogin} 
            onClose={() => setShowLogin(false)} 
          />
        )}

        {/* If staff scanner view is active show it */}
        {viewScanner ? (
          <StaffScanner onGoHome={() => setViewScanner(false)} />
        ) : (
          /* 1. IF Dashboard is active & User is logged in -> SHOW DASHBOARD */
          viewDashboard && user ? (

            <MemberDashboard 
               user={user} 
               onGoHome={() => setViewDashboard(false)} 
            />

          ) : !selectedPlan ? (

            // 2. IF No Plan Selected -> SHOW HOME PAGE
            <>
              <Navbar 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                user={user}
                onLoginClick={() => setShowLogin(true)}
                
                // --- UPDATED LOGOUT: Tell server to delete cookie ---
                onLogout={() => { 
                  fetch('http://localhost:3000/logout', { method: 'DELETE', credentials: 'include' })
                  .then(() => {
                    setUser(null);
                    setViewDashboard(false);
                  });
                }}
                
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

            // 3. IF Plan Selected -> SHOW CHECKOUT
            <Checkout 
              plan={selectedPlan} 
              onGoBack={() => setSelectedPlan(null)} 
            />
            
          )
        )}
      </div>
    </Elements>
  );
}

export default App;