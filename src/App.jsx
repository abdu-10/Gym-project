import React, { useEffect } from 'react'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import About from './components/About'
import Classes from './components/Classes'
import Pricing from './components/Pricing'
import Trainers from './components/Trainers'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

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
  const [activeSection, setActiveSection] = useState('home')

  

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

  window.addEventListener("scroll", handleScroll);
  // run once to set initial state
  handleScroll();

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection}  />
      <main>
        <Hero />
        <Features />
        <About />
        <Classes />
        <Pricing />
        <Trainers />
        <Testimonials />
        <Contact />
        </main>

       <Footer />
       <ScrollToTop />
      
    </div>
  )
}

export default App
