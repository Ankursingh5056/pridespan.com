import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Admin from './components/Admin'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <Hero />
      <Services />
      <Portfolio />
      <About />
      <Contact />
      <Footer onAdminClick={() => setIsAdminOpen(true)} />
      <Admin isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  )
}

export default App
