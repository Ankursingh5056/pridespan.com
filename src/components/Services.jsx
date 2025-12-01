import React, { useState } from 'react'
import ClientInformation from './ClientInformation'

const Services = () => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState('')

  const services = [
    {
      image: "Services3.png",
      title: "End-to-End Home Interior Services",
      description: "Transform your home with our complete residential interior solutions —from smart planning to flawless execution. We handle everything end-to-end.",
      features: ["Space Planning & Design", "Full Civil & Plumbing Work", "Custom Furniture & False Ceiling", "Lighting, Electricals & Finish Work"]
    },
    {
      image: "/Service1.png",
      title: "3D Visualization & Rendering",
      description: "Bring your ideas to life with photorealistic 3D renders that help you visualize every detail before execution",
      features: ["High-Quality 3D Interior Rendering", "Material, Color & Lighting Simulation", "Exterior & Architectural Visualization","Walkthroughs & Concept Presentations"]
    },
    {
      image: "/Services2.png",
      title: "Commercial Interior Solutions",
      description: "Designing high-performance commercial spaces that elevate your brand and create seamless experiences for customers and teams.",
      features: ["Space Planning & Layout Optimization", "Civil Work, Electrical & Plumbing Execution", "Custom Furniture, Partitions & Storage Systemsn", "Lighting Design & Complete Site Management"]
    },
    // {
    //   image: "/Services3.png",
    //   title: "Renovation & Remodeling",
    //   description: "Breathe new life into existing spaces with our comprehensive renovation and remodeling services.",
    //   features: ["Kitchen Remodeling", "Bathroom Design", "Basement Finishing", "Whole House Renovation"]
    // },
    
    {
      image: "Service4.png",
      title: "Movers & Packers",
      description: "Make your move stress-free with safe, organized shifting services designed to handle your belongings with care and precision.",
      features: ["Home & Office Relocation" ,"Professional Packing & Unpacking", "Loading, Transport & Delivery",  "Furniture Dismantling & Reassembly"]
    },
    {
      image: "Service5.png",
      title: "Home Loan Services",
      description: "Get expert guidance to secure the right home loan with smooth processing, quick approvals, and trusted support.",
      features: ["Home Loan Consultation & Eligibility Check", "Assistance with Documentation & Filing", "Comparison of Bank Offers & Interest Rates", "End-to-End Support Until Loan Disbursement"]
    },
    {
      image: "Services6.png",
      title: "Vastu Consultation",
      description: "Create balanced, harmonious spaces with Vastu-guided design that enhances positivity, well-being, and overall flow in your home.",
      features: ["Home & Site Vastu Analysis", "Layout & Room Placement Guidance", "Remedies Without Structural Changes", "Vastu for New Construction & Renovation"]
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
