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

const SECTIONS = [
  "home",
  "features",
  "about",
  "classes",
  "pricing",
  "trainers",
  "testimonials",
  "contact",
];

function App() {
  const [activeSection, setActiveSection] = useState('home');

  //  This state will control which page we see ---
  // If it's 'null', we see the main landing page.
  // If it has a plan, we see the checkout page.
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      // reveal on scroll
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

      // update active section based on scroll position
      const ScrollPosition = window.scrollY;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const section = document.getElementById(SECTIONS[i]);
        if (section && ScrollPosition >= section.offsetTop - 100) {
          setActiveSection(SECTIONS[i]);
          break;
        }
      }
    };

    // --- We only run this scroll logic IF we are on the main page ---
    // If a plan is selected, the sections (like #home) don't exist,
    // so we skip adding the event listener.
    if (!selectedPlan) {
      window.addEventListener("scroll", handleScroll);
      // run once to set initial state
      handleScroll();

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [selectedPlan]); 

  
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>

      {/* This is the "magic" ternary operator.
        It says: "Is 'selectedPlan' empty (null)?"
        
        IF YES: Show the entire original landing page.
        IF NO:  Show only the Checkout page.
      */}

      {!selectedPlan ? (
        
        <>
          <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
          <main>
            <Hero />
            <Features />
            <About />
            <Classes />

            {/* --- NEW: We pass the 'onSelectPlan' prop to Pricing --- */}
            <Pricing onSelectPlan={setSelectedPlan} />

            <Trainers />
            <Testimonials />
            <Contact />
          </main>
          <Footer />
          <ScrollToTop />
        </>

      ) : (

        <Checkout 
          plan={selectedPlan} // Pass the plan *in*
          onGoBack={() => setSelectedPlan(null)} // Pass a function to go *back*
        />
        
      )}
    </div>
  );
}

export default App;