import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Admin from './components/Admin'
import WhatsAppButton from './components/WhatsAppButton'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Services />
              <Portfolio />
              <About />
              <Contact />
            </>
          } />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer onAdminClick={() => setIsAdminOpen(true)} />
        <Admin isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
        <WhatsAppButton />
      </div>
    </Router>
  )
}

export default App
