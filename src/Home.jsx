import React, { useEffect, useState } from 'react';
// These imports now point correctly to the components folder
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

const SECTIONS = ["home", "features", "about", "classes", "pricing", "trainers", "testimonials", "contact"];

function Home({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll(".reveal");
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const revealTop = reveals[i].getBoundingClientRect().top;
        if (revealTop < windowHeight - 150) {
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
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [selectedPlan]);

  return (
    <>
      {showLogin && (
        <Login 
          onLogin={() => {
             setShowLogin(false);
             window.location.reload(); 
          }} 
          onClose={() => setShowLogin(false)} 
        />
      )}

      {!selectedPlan ? (
        <>
          <Navbar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
            user={user}
            onLoginClick={() => setShowLogin(true)}
            onLogout={onLogout}
            onDashboardClick={() => {
               if(user && user.role === 'admin') window.location.href = '/admin';
               else window.location.href = '/dashboard';
            }}
          />
          <main>
            <Hero />
            <Features />
            <About />
            <Classes user={user} // <-- PASS USER PROP
               onLoginClick={() => setShowLogin(true)}/>
            <Pricing onSelectPlan={setSelectedPlan} />
            <Trainers />
            <Testimonials />
            <Contact />
          </main>
          <Footer onOpenScanner={() => window.location.href = '/staff-scanner'} />
          <ScrollToTop />
        </>
      ) : (
        <Checkout 
          plan={selectedPlan} 
          onGoBack={() => setSelectedPlan(null)} 
        />
      )}
    </>
  );
}

export default Home;