import React, { useState } from 'react'
import ClientInformation from './ClientInformation'

const Services = () => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState('')

  const services = [
    {
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      title: "Residential Design",
      description: "Transform your home into a beautiful, functional space that reflects your lifestyle and personality.",
      features: ["Space Planning", "Color Consultation", "Furniture Selection", "Lighting Design"]
    },
    {
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      title: "Commercial Design",
      description: "Create inspiring work environments that boost productivity and impress clients and employees.",
      features: ["Office Design", "Retail Spaces", "Restaurant Design", "Brand Integration"]
    },
    {
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      title: "Renovation & Remodeling",
      description: "Breathe new life into existing spaces with our comprehensive renovation and remodeling services.",
      features: ["Kitchen Remodeling", "Bathroom Design", "Basement Finishing", "Whole House Renovation"]
    },
    {
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      title: "Lighting Design",
      description: "Illuminate your space with strategic lighting that enhances ambiance and functionality.",
      features: ["Ambient Lighting", "Task Lighting", "Accent Lighting", "Smart Home Integration"]
    },
    {
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      title: "Furniture & Decor",
      description: "Curate the perfect furniture and decor pieces to complete your interior design vision.",
      features: ["Custom Furniture", "Art Selection", "Accessories", "Window Treatments"]
    },
    {
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      title: "Design Consultation",
      description: "Get expert advice and guidance to make informed decisions about your interior design project.",
      features: ["Initial Consultation", "Design Review", "Project Management", "Ongoing Support"]
    }
  ]

  const handleServiceClick = (serviceTitle) => {
    setSelectedService(serviceTitle)
    setIsClientModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsClientModalOpen(false)
    setSelectedService('')
  }

  return (
    <>
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive interior design services to transform your space into something extraordinary.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                onClick={() => handleServiceClick(service.title)}
              >
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-6 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Click indicator */}
                <div className="mt-6 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span>Click to get started</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              View All Services
            </button>
          </div>
        </div>
      </section>

      {/* Client Information Modal */}
      <ClientInformation
        isOpen={isClientModalOpen}
        onClose={handleCloseModal}
        serviceName={selectedService}
      />
    </>
  )
}

export default Services
