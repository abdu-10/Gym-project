import React from 'react'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import About from './components/About'
function App() {
  const [activeSection , setActiveSection] = useState('home')
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Navbar activeSection={activeSection}  />
      <main>
        <Hero />
        <Features />
        <About />
      </main>
    </div>
  )
}

export default App
