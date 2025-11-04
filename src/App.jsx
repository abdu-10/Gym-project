import React from 'react'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import About from './components/About'
import Classes from './components/Classes'
import Pricing from './components/Pricing'
import Trainers from './components/Trainers'
import Testimonials from './components/Testimonials'
function App() {
  const [activeSection , setActiveSection] = useState('home')
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Navbar activeSection={activeSection}  />
      <main>
        <Hero />
        <Features />
        <About />
        <Classes />
        <Pricing />
        <Trainers />
        <Testimonials />
      </main>
    </div>
  )
}

export default App
