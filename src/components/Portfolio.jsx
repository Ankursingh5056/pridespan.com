import React, { useState, useEffect, useRef } from 'react'

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [activeVideo, setActiveVideo] = useState('')
  const [activeProject, setActiveProject] = useState(null)
  const modalRef = useRef(null)
  const closeVideo = () => {
    setIsVideoModalOpen(false)
    setActiveVideo('')
    setActiveProject(null)
  }
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeVideo()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])
  useEffect(() => {
    if (!isVideoModalOpen) return

    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeVideo()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isVideoModalOpen])

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'residential', name: 'Residential' },
    { id: 'commercial', name: 'Commercial' }
  ]

  const projects = [
    {
      id: 1,
      title: "CHD Avenue T10,1401",
      category: "residential",
      description: "Minimal yet refined interiors designed to maximize space, light, and effortless living",
      image: "/Portfolio1.png",
      video: "/video.mp4"
    },
    {
      id: 2,
      title: "Signature  T10,1805",
      category: "residential",
      description: "An affordable flat design focused on smart space planning, functional interiors, and a comfortable modern lifestyle.",
      image: "/portfoilio2.png",
      video: "/video.mp4"
    },
    {
      id: 3,
      title: "Sare Homes T16- 1601",
      category: "residential",
      description: "An elegant space crafted with modern materials, efficient zoning, and subtle luxury details.",
      image: "/portfolio3.png",
      video: "/video.mp4"
    },
    {
      id: 4,
      title: "CHD Avenue– T3,1002",
      category: "residential",
      description: "An elegant space crafted with modern materials, efficient zoning, and subtle luxury details.A",
      image: "/portfolio4.png",
      video: "/video.mp4"
    },
    {
      id: 5,
      title: "Vision Eraa Studios",
      category: "commercial",
      description: "Smart, stylish studio designs crafted to spark creativity and flow.",
      image: "/portfolio5.png",
      video: "/videos.mp4"
    },
    {
      id: 6,
      title: "Investment Square",
      category: "commercial",
      description: "Professional workspace designed for productivity and collaboration",
      image: "/portoilio6.png",
      video: "/videos/project6.mp4"
    }
  ]

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter(project => project.category === activeCategory)

  return (
    <section id="portfolio" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Portfolio
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our latest projects and see how we transform spaces into beautiful, functional environments.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm opacity-90">{project.description}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {project.description}
                </p>

                <button
                  onClick={() => {
                    setActiveVideo(project.video)
                    setActiveProject(project)
                    setIsVideoModalOpen(true)
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  View Project →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-16">
          <button
            onClick={() => setActiveCategory('all')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All Projects
          </button>
        </div>
      </div>

      {/* 🔹 VIDEO MODAL */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div
            ref={modalRef}
            className="bg-white rounded-xl w-full max-w-4xl mx-4 relative"
          >
            <button
              onClick={closeVideo}
              aria-label="Close video"
              className="absolute -top-4 -right-4 z-50 w-10 h-10 flex items-center justify-center
             rounded-full bg-black text-white text-xl font-bold
             hover:bg-black-600 transition-colors duration-200 shadow-lg"
            >
              ✕
            </button>


            <video
              src={activeVideo}
              controls
              autoPlay
              className="w-full h-[420px] object-cover rounded-t-xl"
            />

            {activeProject && (
              <div className="p-4">
                <h3 className="text-lg font-semibold">
                  {activeProject.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {activeProject.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default Portfolio
